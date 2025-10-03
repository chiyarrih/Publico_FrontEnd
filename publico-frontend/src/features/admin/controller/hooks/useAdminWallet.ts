import { useEffect, useState } from "react";
import { Web3 } from "web3";
import {
  updateAdminToConnected,
  fetchAdminUser,
  connectWalletToBackend,
  decryptPrivateKey,
} from "@admin/services/walletService";

const web3 = new Web3("HTTP://127.0.0.1:7545");

export default function useAdminWallet() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [showPrivateKeyModal, setShowPrivateKeyModal] = useState(false);
  const [privateKey, setPrivateKey] = useState("");
  const [currentAddress, setCurrentAddress] = useState<string | null>(null);
  const [balanceEth, setBalanceEth] = useState("0");
  const [balancePhp, setBalancePhp] = useState("0");

  const walletData = {
    connected: walletConnected,
    address: currentAddress ?? "0x0",
    balanceEth,
    balancePhp,
  };

  const fetchBalance = async (address: string) => {
    try {
      const balanceWei = await web3.eth.getBalance(address);
      const balanceInEth = web3.utils.fromWei(balanceWei, "ether");
      setBalanceEth(balanceInEth);

      const res = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=php"
      );
      const data = await res.json();
      const rate = data.ethereum.php;
      setBalancePhp((parseFloat(balanceInEth) * rate).toFixed(2));
    } catch (err) {
      console.error("Error fetching balance:", err);
    }
  };

  const handleConnectMetaMask = async () => {
    try {
      const eth = (window as any).ethereum;
      if (!eth) {
        alert("MetaMask not installed");
        return;
      }

      const accounts = await eth.request({ method: "eth_requestAccounts" });
      const address = accounts[0];

      localStorage.setItem("web3_address", address);
      setCurrentAddress(address);

      await fetchBalance(address);

      const connected = await updateAdminToConnected();
      setWalletConnected(connected.isConnected);

      const message = "Login to Publico Admin";
      const signature = await eth.request({
        method: "personal_sign",
        params: [message, address],
      });

      await connectWalletToBackend(address, signature, message);
      setShowConnectModal(false);
    } catch (err) {
      console.error("Error connecting MetaMask:", err);
      alert("Failed to connect MetaMask");
    }
  };

  const handleConnectPrivateKey = async () => {
    try {
      const decrypted = await decryptPrivateKey(privateKey);

      if (decrypted) {
        const account = web3.eth.accounts.privateKeyToAccount(decrypted);
        web3.eth.accounts.wallet.add(account);
        setCurrentAddress(account.address);

        const connected = await updateAdminToConnected();
        setWalletConnected(connected.isConnected);

        setShowPrivateKeyModal(false);
        setPrivateKey("");

        await fetchBalance(account.address);
      }
    } catch (err) {
      console.error("Error connecting with private key:", err);
      alert("Failed to connect with private key");
    }
  };

  const handleDisconnect = () => {
    setWalletConnected(false);
    setCurrentAddress(null);
    setBalanceEth("0");
    setBalancePhp("0");
    localStorage.removeItem("web3_address");
  };

  const handleCopyAddress = () => {
    if (currentAddress) {
      navigator.clipboard.writeText(currentAddress);
      alert("Address copied to clipboard!");
    }
  };

  useEffect(() => {
    const handleFetch = async () => {
      try {
        const getAddress = localStorage.getItem("web3_address");
        if (!getAddress) return;

        const userData = await fetchAdminUser();
        setWalletConnected(userData[0]?.isConnected || false);
        setCurrentAddress(getAddress);

        await fetchBalance(getAddress);
      } catch (err) {
        console.error("Error fetching wallet data:", err);
      }
    };

    handleFetch();
  }, []);

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
  };
}

