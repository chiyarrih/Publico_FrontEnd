import { web3 } from "../shared/config/web3";

export interface WalletConnectionState {
  isConnected: boolean;
  address: string | null;
  balanceEth: string;
  balancePhp: string;
}

export const WALLET_STORAGE_KEYS = {
  ADDRESS: 'web3_address',
  CONNECTION_STATE: 'web3_connection_state',
  LAST_CONNECTED: 'web3_last_connected'
};

// --- MetaMask helpers ---
export const isMetaMaskInstalled = (): boolean =>
  typeof window !== 'undefined' && typeof (window as any).ethereum !== 'undefined';

export const getMetaMaskAccounts = async (): Promise<string[]> => {
  if (!isMetaMaskInstalled()) throw new Error('MetaMask not installed');
  const eth = (window as any).ethereum;
  return await eth.request({ method: 'eth_accounts' });
};

export const requestMetaMaskAccounts = async (): Promise<string[]> => {
  if (!isMetaMaskInstalled()) throw new Error('MetaMask not installed');
  const eth = (window as any).ethereum;
  return await eth.request({ method: 'eth_requestAccounts' });
};

export const isMetaMaskAuthorized = async (): Promise<boolean> => {
  try {
    const accounts = await getMetaMaskAccounts();
    return accounts.length > 0;
  } catch {
    return false;
  }
};

export const getCurrentMetaMaskAddress = async (): Promise<string | null> => {
  try {
    const accounts = await getMetaMaskAccounts();
    return accounts.length > 0 ? accounts[0] : null;
  } catch {
    return null;
  }
};

// --- Fetch balance ---
const getEthToPhpRate = async (): Promise<number> => {
  try {
    const resp = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=php"
    );
    if (!resp.ok) throw new Error("Failed to fetch rate");
    const data = await resp.json();
    return data.ethereum.php ?? 30000;
  } catch (err) {
    console.warn("Coingecko fetch failed, fallback rate used", err);
    return 30000;
  }
};

export const fetchBalance = async (address: string): Promise<{ balanceEth: string; balancePhp: string }> => {
  try {
    const token = localStorage.getItem('publico_auth_token');
    const resp = await fetch(`http://localhost:5000/balance/${address}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
    if (resp.ok) {
      const data = await resp.json();
      const balanceEth = data.ethBalance ?? data.balanceEth ?? "0";
      const ethToPhpRate = await getEthToPhpRate();
      const balancePhp = (parseFloat(balanceEth) * ethToPhpRate).toString();
      return { balanceEth, balancePhp };
    }
  } catch (e) {
    console.warn("Backend fetch failed, fallback to web3", e);
  }

  try {
    let balanceWei: string;
    if (typeof window !== "undefined" && (window as any).ethereum) {
      const eth = (window as any).ethereum;
      balanceWei = await eth.request({
        method: "eth_getBalance",
        params: [address, "latest"],
      });
    } else {
      balanceWei = (await web3.eth.getBalance(address)).toString();
    }
    const balanceEth = web3.utils.fromWei(balanceWei, "ether");
    const balancePhp = (parseFloat(balanceEth) * await getEthToPhpRate()).toString();
    return { balanceEth, balancePhp };
  } catch (err) {
    console.error("Web3 balance fetch failed:", err);
    return { balanceEth: "0", balancePhp: "0" };
  }
};

// --- Sign message ---
export const signMessage = async (message: string, address: string): Promise<string> => {
  if (!isMetaMaskInstalled()) throw new Error('MetaMask not installed');
  const eth = (window as any).ethereum;
  return await eth.request({ method: "personal_sign", params: [message, address] });
};

// --- Storage helpers ---
export const saveWalletState = (address: string, isConnected: boolean = true): void => {
  localStorage.setItem(WALLET_STORAGE_KEYS.ADDRESS, address);
  localStorage.setItem(WALLET_STORAGE_KEYS.CONNECTION_STATE, JSON.stringify({ isConnected, address }));
  localStorage.setItem(WALLET_STORAGE_KEYS.LAST_CONNECTED, Date.now().toString());
};

export const getWalletState = (): { isConnected: boolean; address: string | null } => {
  const address = localStorage.getItem(WALLET_STORAGE_KEYS.ADDRESS);
  const stateStr = localStorage.getItem(WALLET_STORAGE_KEYS.CONNECTION_STATE);
  if (!address || !stateStr) return { isConnected: false, address: null };
  try {
    const state = JSON.parse(stateStr);
    return { isConnected: state.isConnected, address: state.address };
  } catch {
    return { isConnected: false, address };
  }
};

export const clearWalletState = (): void => {
  localStorage.removeItem(WALLET_STORAGE_KEYS.ADDRESS);
  localStorage.removeItem(WALLET_STORAGE_KEYS.CONNECTION_STATE);
  localStorage.removeItem(WALLET_STORAGE_KEYS.LAST_CONNECTED);
};

// --- Backend validation & disconnect ---
export const validateWalletWithBackend = async (address: string): Promise<{ isValid: boolean; isConnected: boolean }> => {
  try {
    const token = localStorage.getItem('publico_auth_token');
    if (!token) return { isValid: false, isConnected: false };
    const resp = await fetch("http://localhost:5000/api/wallet/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
      body: JSON.stringify({ address })
    });
    if (!resp.ok) return { isValid: false, isConnected: false };
    const data = await resp.json();
    return { isValid: true, isConnected: data.isConnected };
  } catch (err) {
    console.error("Wallet backend validation failed:", err);
    return { isValid: false, isConnected: false };
  }
};

export const disconnectWalletFromBackend = async (): Promise<boolean> => {
  try {
    const token = localStorage.getItem('publico_auth_token');
    if (!token) return false;
    const resp = await fetch("http://localhost:5000/api/wallet/disconnect", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` }
    });
    return resp.ok;
  } catch (err) {
    console.error("Wallet backend disconnect failed:", err);
    return false;
  }
};

// --- Reconnection ---
export const attemptWalletReconnection = async (): Promise<{ success: boolean; address: string | null }> => {
  try {
    const stored = getWalletState();
    if (!stored.isConnected || !stored.address) return { success: false, address: null };
    const authorized = await isMetaMaskAuthorized();
    if (!authorized) { clearWalletState(); return { success: false, address: null }; }
    const currentAddress = await getCurrentMetaMaskAddress();
    if (currentAddress === stored.address) return { success: true, address: currentAddress };
    if (currentAddress) { saveWalletState(currentAddress, true); return { success: true, address: currentAddress }; }
    return { success: false, address: null };
  } catch (err) {
    console.error("Reconnection failed:", err);
    clearWalletState();
    return { success: false, address: null };
  }
};

// --- Event listeners ---
export const setupMetaMaskListeners = (onAccountChange: (address: string | null) => void, onDisconnect: () => void) => {
  if (!isMetaMaskInstalled()) return () => {};
  const eth = (window as any).ethereum;

  const handleAccountsChanged = (accounts: string[]) => accounts.length === 0 ? onDisconnect() : onAccountChange(accounts[0]);
  const handleDisconnect = () => onDisconnect();

  eth.on('accountsChanged', handleAccountsChanged);
  eth.on('disconnect', handleDisconnect);

  return () => {
    eth.removeListener('accountsChanged', handleAccountsChanged);
    eth.removeListener('disconnect', handleDisconnect);
  };
};
