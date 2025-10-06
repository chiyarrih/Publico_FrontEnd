import { useEffect, useState, useCallback, useRef } from "react";
import { web3 } from "../config/web3";
import { 
  isMetaMaskInstalled, 
  requestMetaMaskAccounts, 
  getCurrentMetaMaskAddress,
  fetchBalance, 
  signMessage, 
  saveWalletState, 
  clearWalletState, 
  attemptWalletReconnection,
  getWalletState,
  setupMetaMaskListeners,
  disconnectWalletFromBackend
} from "../../utils/walletUtils";

// Role-specific services
import { updateAdminToConnected, connectWalletToBackend, decryptPrivateKey } from "../../features/admin/services/walletService";
import { updateToConnected } from "../../features/agency/services/agencyService";

export type UserRole = 'Admin' | 'Agency' | 'Citizen';

export interface WalletData {
  connected: boolean;
  address: string;
  balanceEth: string;
  balancePhp: string;
}

export interface UseWalletOptions {
  role: UserRole;
  onProfileUpdate?: (profile: any) => void;
  onFetchedData?: (data: any) => void;
}

export default function useWallet(options: UseWalletOptions) {
  const { role, onProfileUpdate, onFetchedData } = options;
  
  const [walletConnected, setWalletConnected] = useState(false);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [showPrivateKeyModal, setShowPrivateKeyModal] = useState(false);
  const [privateKey, setPrivateKey] = useState("");
  const [currentAddress, setCurrentAddress] = useState<string | null>(null);
  const [balanceEth, setBalanceEth] = useState("0");
  const [balancePhp, setBalancePhp] = useState("0");
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const hasFetchedProfile = useRef(false);

  const walletData: WalletData = {
    connected: walletConnected,
    address: currentAddress ?? "0x0",
    balanceEth,
    balancePhp,
  };

  const fetchBalanceForAddress = async (address: string) => {
    try {
      const { balanceEth: eth, balancePhp: php } = await fetchBalance(address);
      setBalanceEth(eth);
      setBalancePhp(php);
    } catch (err) {
      console.error("Error fetching balance:", err);
    }
  };

  const handleConnectMetaMask = async () => {
    try {
      if (!isMetaMaskInstalled()) {
        alert("MetaMask not installed");
        return;
      }

      const accounts = await requestMetaMaskAccounts();
      const address = accounts[0];

      // Save wallet state immediately
      saveWalletState(address, true);
      setCurrentAddress(address);
      setWalletConnected(true);

      // Fetch balance
      await fetchBalanceForAddress(address);

      // Update backend connection status based on role (don't wait for this)
      try {
        switch (role) {
          case 'Admin':
            await updateAdminToConnected();
            break;
          case 'Agency':
            await updateToConnected();
            break;
          case 'Citizen':
            // Citizens don't have backend connection status
            break;
        }
      } catch (backendError) {
        console.warn("Backend connection update failed, but wallet is still connected:", backendError);
        // Don't fail the connection if backend update fails
      }

      // Sign message and connect to backend (except for citizens)
      if (role !== 'Citizen') {
        try {
          const message = `Login to Publico ${role}`;
          const signature = await signMessage(message, address);

          if (role === 'Admin') {
            await connectWalletToBackend(address, signature, message);
          } else if (role === 'Agency') {
            const response = await fetch("http://localhost:5000/api/wallet/connect", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ address, signature, message }),
            });
            console.log("Wallet connection response:", response);
          }
        } catch (signError) {
          console.warn("Backend wallet connection failed, but wallet is still connected:", signError);
          // Don't fail the connection if backend signing fails
        }
      }

      setShowConnectModal(false);
    } catch (err) {
      console.error("Error connecting MetaMask:", err);
      alert("Failed to connect MetaMask");
    }
  };

  const handleConnectPrivateKey = async () => {
    try {
      let decrypted;
      
      if (role === 'Admin') {
        decrypted = await decryptPrivateKey(privateKey);
      } else {
        // For Agency and Citizen, use the backend decrypt endpoint
        const response = await fetch("http://localhost:5000/api/decrypt/private", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ privateKey })
        });
        
        const json = await response.json();
        if (!response.ok) {
          console.error("Private key decryption failed:", json);
          alert("Failed to decrypt private key");
          return;
        }
        
        decrypted = json.decryptedKey;
      }

      if (decrypted) {
        const account = web3.eth.accounts.privateKeyToAccount(decrypted);
        web3.eth.accounts.wallet.add(account);
        
        // Save wallet state immediately
        saveWalletState(account.address, true);
        setCurrentAddress(account.address);
        setWalletConnected(true);

        // Update backend connection status based on role (don't wait for this)
        try {
          switch (role) {
            case 'Admin':
              await updateAdminToConnected();
              break;
            case 'Agency':
              await updateToConnected();
              break;
            case 'Citizen':
              // Citizens don't have backend connection status
              break;
          }
        } catch (backendError) {
          console.warn("Backend connection update failed, but wallet is still connected:", backendError);
          // Don't fail the connection if backend update fails
        }

        setShowPrivateKeyModal(false);
        setPrivateKey("");

        await fetchBalanceForAddress(account.address);
      }
    } catch (err) {
      console.error("Error connecting with private key:", err);
      alert("Failed to connect with private key");
    }
  };

  const handleDisconnect = async () => {
    try {
      // Disconnect from backend first
      await disconnectWalletFromBackend();
      
      // Then clear local state
      setWalletConnected(false);
      setCurrentAddress(null);
      setBalanceEth("0");
      setBalancePhp("0");
      clearWalletState();
    } catch (error) {
      console.error("Error disconnecting wallet:", error);
      // Still clear local state even if backend call fails
      setWalletConnected(false);
      setCurrentAddress(null);
      setBalanceEth("0");
      setBalancePhp("0");
      clearWalletState();
    }
  };

  const handleCopyAddress = () => {
    if (currentAddress) {
      navigator.clipboard.writeText(currentAddress);
      alert("Address copied to clipboard!");
    }
  };

  const resetProfileFetch = useCallback(() => {
    hasFetchedProfile.current = false;
    setIsLoadingProfile(false);
  }, []);

  // Memoize the profile fetch function to prevent infinite loops
  const fetchProfileData = useCallback(async () => {
    if (isLoadingProfile || hasFetchedProfile.current || role !== 'Agency' || !onProfileUpdate || !onFetchedData) {
      return;
    }

    setIsLoadingProfile(true);
    hasFetchedProfile.current = true;

    try {
      const { fetchUsers } = await import("../../features/agency/services/agencyService");
      const profileData = await fetchUsers();
      if (profileData) {
        // Handle both array and single object responses
        const userData = Array.isArray(profileData) ? profileData[0] : profileData;
        if (userData) {
          onFetchedData(userData);
          onProfileUpdate({
            name: userData.agency_name ?? `${userData.first_name || ''} ${userData.last_name || ''}`.trim(),
            email: userData.email,
            phone: userData.contact_phone,
            address: userData.address
          });
        }
      }
    } catch (err) {
      console.error("Error fetching profile data:", err);
      hasFetchedProfile.current = false; // Reset on error to allow retry
    } finally {
      setIsLoadingProfile(false);
    }
  }, [role, onProfileUpdate, onFetchedData, isLoadingProfile]);

  useEffect(() => {
    const handleFetch = async () => {
      try {
        // Fetch profile data for Agency role (only once)
        await fetchProfileData();

        // Attempt to reconnect wallet
        const reconnectionResult = await attemptWalletReconnection();
        if (reconnectionResult.success && reconnectionResult.address) {
          setWalletConnected(true);
          setCurrentAddress(reconnectionResult.address);
          await fetchBalanceForAddress(reconnectionResult.address);
        } else {
          // If reconnection failed, check if we have stored state but it's invalid
          const storedState = getWalletState();
          if (storedState.isConnected && storedState.address) {
            // Clear invalid state
            clearWalletState();
          }
        }
      } catch (err) {
        console.error("Error fetching wallet data:", err);
      }
    };

    handleFetch();

    // Set up MetaMask event listeners
    const cleanup = setupMetaMaskListeners(
      async (newAddress) => {
        if (newAddress) {
          // User switched accounts
          saveWalletState(newAddress, true);
          setCurrentAddress(newAddress);
          setWalletConnected(true);
          await fetchBalanceForAddress(newAddress);
        } else {
          // User disconnected
          handleDisconnect();
        }
      },
      () => {
        // User disconnected
        handleDisconnect();
      }
    );

    return cleanup;
  }, [role, fetchProfileData]);

  return {
    walletConnected,
    walletData,
    showConnectModal,
    setShowConnectModal,
    showPrivateKeyModal,
    setShowPrivateKeyModal,
    privateKey,
    setPrivateKey,
    handleConnectMetaMask,
    handleConnectPrivateKey,
    handleDisconnect,
    handleCopyAddress,
    currentAddress,
    balanceEth,
    balancePhp,
    isLoadingProfile,
    resetProfileFetch,
    fetchProfileData,
  };
}
