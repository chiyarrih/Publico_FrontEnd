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
import toast from "react-hot-toast";

// Wallet type handling
export type WalletType = 'metamask' | 'privateKey';

export const WALLET_STORAGE_KEYS = {
  ADDRESS: 'web3_address',
  CONNECTION_STATE: 'web3_connection_state',
  LAST_CONNECTED: 'web3_last_connected',
  WALLET_TYPE: 'web3_wallet_type'
};

export const saveWalletType = (type: WalletType) => {
  localStorage.setItem(WALLET_STORAGE_KEYS.WALLET_TYPE, type);
};

export const getWalletType = (): WalletType | null => {
  return (localStorage.getItem(WALLET_STORAGE_KEYS.WALLET_TYPE) as WalletType) ?? null;
};

// ------------------- useWallet hook -------------------

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
  const privatekey = localStorage.getItem('publico_user_data');
  if (!privatekey) throw new Error('Private key not found. Please log in again.');
  
  const toJson = JSON.parse(privatekey);
  const plainPrivateKey = toJson.user.agency_web3_account.privateKey;

  const walletData: WalletData = {
    connected: walletConnected,
    address: currentAddress ?? "0x0",
    balanceEth,
    balancePhp
  };

  // ------------------- Helper Functions -------------------

  const fetchBalanceForAddress = async (address: string) => {
    try {
      const { balanceEth: eth, balancePhp: php } = await fetchBalance(address);
      setBalanceEth(eth);
      setBalancePhp(php);
    } catch (err) {
      console.error("Error fetching balance:", err);
    }
  };

  const updateBackendConnection = async () => {
    try {
      switch (role) {
        case 'Admin':
          await updateAdminToConnected();
          break;
        case 'Agency':
          await updateToConnected();
          break;
        case 'Citizen':
          break; // no backend connection
      }
    } catch (backendError) {
      console.warn("Backend connection update failed:", backendError);
    }
  };

  // ------------------- Connect Wallets -------------------

  const handleConnectMetaMask = async () => {
    try {
      if (!isMetaMaskInstalled()) {
        alert("MetaMask not installed");
        return;
      }

      const accounts = await requestMetaMaskAccounts();
      const address = accounts[0];

      // Save state and type
      saveWalletState(address, true);
      saveWalletType('metamask');

      setCurrentAddress(address);
      setWalletConnected(true);
      await fetchBalanceForAddress(address);
      await updateBackendConnection();

      // Sign message and connect to backend if not citizen
      if (role !== 'Citizen') {
        try {
          const message = `Login to Publico ${role}`;
          const signature = await signMessage(message, address);

          if (role === 'Admin') {
            await connectWalletToBackend(address, signature, message);
          } else if (role === 'Agency') {
            await fetch("http://localhost:5000/api/wallet/connect", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ address, signature, message }),
            });
          }
        } catch (signError) {
          console.warn("Backend wallet connection failed:", signError);
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
        decrypted = await decryptPrivateKey(plainPrivateKey);
      } else {
        decrypted = await decryptPrivateKey(plainPrivateKey);
      }

      if (decrypted) {
        const account = web3.eth.accounts.privateKeyToAccount(decrypted);
        web3.eth.accounts.wallet.add(account);

        // Save state and type
        saveWalletState(account.address, true);
        saveWalletType('privateKey');

        setCurrentAddress(account.address);
        setWalletConnected(true);
        await updateBackendConnection();
        await fetchBalanceForAddress(account.address);

        setShowPrivateKeyModal(false);
        setPrivateKey("");
      }
    } catch (err) {
      console.error("Error connecting with private key:", err);
      alert("Failed to connect with private key");
    }
  };

  // ------------------- Disconnect -------------------

  const handleDisconnect = async () => {
    try {
      await disconnectWalletFromBackend();
    } catch (err) {
      console.error("Backend disconnect failed:", err);
    } finally {
      setWalletConnected(false);
      setCurrentAddress(null);
      setBalanceEth("0");
      setBalancePhp("0");
      clearWalletState();
      localStorage.removeItem(WALLET_STORAGE_KEYS.WALLET_TYPE);
    }
  };

  const handleCopyAddress = () => {
    if (currentAddress) {
      navigator.clipboard.writeText(currentAddress);
      alert("Address copied to clipboard!");
    }
  };

  // ------------------- Profile Data -------------------

  const resetProfileFetch = useCallback(() => {
    hasFetchedProfile.current = false;
    setIsLoadingProfile(false);
  }, []);

  const fetchProfileData = useCallback(async () => {
    if (isLoadingProfile || hasFetchedProfile.current || role !== 'Agency' || !onProfileUpdate || !onFetchedData) return;

    setIsLoadingProfile(true);
    hasFetchedProfile.current = true;

    try {
      const { fetchUsers } = await import("../../features/agency/services/agencyService");
      const profileData = await fetchUsers();
      if (profileData) {
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
      hasFetchedProfile.current = false;
    } finally {
      setIsLoadingProfile(false);
    }
  }, [role, onProfileUpdate, onFetchedData, isLoadingProfile]);

  // ------------------- Effect: Reconnection -------------------

  useEffect(() => {
    const handleReconnection = async () => {
      try {
        await fetchProfileData();

        const storedType = getWalletType();

        if (storedType === 'privateKey') {
          const storedState = getWalletState();
          if (storedState.isConnected && storedState.address) {
            setWalletConnected(true);
            setCurrentAddress(storedState.address);
            await fetchBalanceForAddress(storedState.address);
          }
        } else if (storedType === 'metamask') {
          const recon = await attemptWalletReconnection();
          if (recon.success && recon.address) {
            setWalletConnected(true);
            setCurrentAddress(recon.address);
            await fetchBalanceForAddress(recon.address);
          } else {
            const storedState = getWalletState();
            if (storedState.isConnected && storedState.address) {
              clearWalletState();
              localStorage.removeItem(WALLET_STORAGE_KEYS.WALLET_TYPE);
            }
          }
        }
      } catch (err) {
        console.error("Error fetching wallet data:", err);
      }
    };

    handleReconnection();

    const cleanup = setupMetaMaskListeners(
      async (newAddress) => {
        if (newAddress) {
          saveWalletState(newAddress, true);
          saveWalletType('metamask');
          setCurrentAddress(newAddress);
          setWalletConnected(true);
          await fetchBalanceForAddress(newAddress);
        } else {
          handleDisconnect();
        }
      },
      () => handleDisconnect()
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
    fetchProfileData
  };
}
