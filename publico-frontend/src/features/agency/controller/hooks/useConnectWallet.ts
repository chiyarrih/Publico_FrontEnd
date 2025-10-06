import { fetchUsers, updateToConnected } from "@agency/services/agencyService";
import { UseData } from "interfaces/user";
import { HandHelping } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { connect, Socket } from "socket.io-client";
import { Web3 } from "web3";
const web3 = new Web3("HTTP://127.0.0.1:7545");

export default function useConnectWallet() {
  const [isEditing, setIsEditing] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [showPrivateKeyModal, setShowPrivateKeyModal] = useState(false);
  const [privateKey, setPrivateKey] = useState("");
  const [currentAddress, setCurrentAddress] = useState<string | null>(null);
  const [balanceEth, setBalanceEth] = useState("0");
  const [balancePhp, setBalancePhp] = useState("0");
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [fetchedData, setFetchedData] = useState<UseData>()
  const socketRef = useRef<Socket | null>(null);
  const token = localStorage.getItem('publico_auth_token');
  const walletData = {
    connected: walletConnected,
    address: currentAddress ?? "0x0",
    balanceEth,
    balancePhp,
  };

  const handleSave = () => {
    setIsEditing(false);
  };

  const fetchBalance = async (address: string) => {
    try {
      const balanceWei = await web3.eth.getBalance(address);
      const balanceInEth = web3.utils.fromWei(balanceWei, "ether");
      setBalanceEth(balanceInEth);
      const res = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=php");
      const data = await res.json();
      const rate = data.ethereum.php;
      setBalancePhp((parseFloat(balanceInEth) * rate).toFixed(2));
    } catch (err) {
      console.error("Error fetching balance:", err);
    }
  };

  const handleConnectMetaMask = async () => {
    const eth = (window as any).ethereum;
    if (eth) {
      const accounts = await eth.request({ method: "eth_requestAccounts" });
      const address = accounts[0];
      localStorage.setItem('web3_address', address)
      const connected = await updateToConnected()
      setWalletConnected(connected.isConnected)
      setCurrentAddress(address);

      await fetchBalance(address);
      await updateToConnected()
      const message = "Login to Publico";
      const signature = await eth.request({
        method: "personal_sign",
        params: [message, address],
      });
      const response = await fetch("http://localhost:5000/api/wallet/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address, signature, message }),
      });
      console.log(response);
    } else {
      alert("MetaMask not installed");
    }
  };
  const handleConnectPrivateKey = async () => {
    const response = await fetch("http://localhost:5000/api/decrypt/private", {
      method: "POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({privateKey})
    })
    const json = await response.json()
    if (!response.ok) {
      console.log(json);
      
    }
    const decrypted = await json.decryptedKey;
    if (decrypted) {
      const account = web3.eth.accounts.privateKeyToAccount(decrypted);
      web3.eth.accounts.wallet.add(account);
      setCurrentAddress(account.address);
      const connected = await updateToConnected()
      setWalletConnected(connected.isConnected)
      setShowPrivateKeyModal(false);
      setPrivateKey("");
      await fetchBalance(account.address);
      await updateToConnected()
    }
  }

  const handleDisconnect = () => {
    setWalletConnected(false);
    setCurrentAddress(null);
    setBalanceEth("0");
    setBalancePhp("0");
  };

  useEffect(() => {
    const handleFetch = async () => {
      try {
        // Always load profile data first
        const profileData = await fetchUsers();
        if (profileData) {
          const userData = profileData;
          setFetchedData(userData);
          setProfile({
            name: userData.agency_name ?? `${userData.first_name || ''} ${userData.last_name || ''}`.trim(),
            email: userData.email,
            phone: userData.contact_phone,
            address: userData.address
          });
        }

        // Then check for wallet connection
        const getAddress = localStorage.getItem('web3_address');
        if (getAddress) {
          setWalletConnected(true);
          setCurrentAddress(getAddress);
          await fetchBalance(getAddress);
        }
      } catch (err) {
        console.error("Error fetching profile data:", err);
      }
    };

    handleFetch();
  }, []);


  return {
    isEditing,
    setIsEditing,
    walletConnected,
    walletData,
    profile,
    setProfile,
    privateKey,
    setPrivateKey,
    showConnectModal,
    setShowConnectModal,
    showPrivateKeyModal,
    setShowPrivateKeyModal,
    balanceEth,
    balancePhp,
    fetchedData,
    handleSave,
    handleConnectMetaMask,
    handleConnectPrivateKey,
    handleDisconnect,
  };
}
