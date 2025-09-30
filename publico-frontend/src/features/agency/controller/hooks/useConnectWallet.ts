import { useState } from "react";
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
    name: "Dia Mate",
    email: "agency@gmail.com",
    phone: "+63 912 345 6789",
    address: "Barangay Poblacion, Dagupan City",
  });
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
      setWalletConnected(true);
      setCurrentAddress(address);

      await fetchBalance(address);

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
    if (privateKey.trim()) {
      const account = web3.eth.accounts.privateKeyToAccount(privateKey);
      web3.eth.accounts.wallet.add(account);
      setCurrentAddress(account.address);
      setWalletConnected(true);
      setShowPrivateKeyModal(false);
      setPrivateKey("");
      await fetchBalance(account.address);
    }
  }

  const handleDisconnect = () => {
    setWalletConnected(false);
    setCurrentAddress(null);
    setBalanceEth("0");
    setBalancePhp("0");
  };

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
    handleSave,
    handleConnectMetaMask,
    handleConnectPrivateKey,
    handleDisconnect,
  };
}
