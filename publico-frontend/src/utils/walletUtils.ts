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

/**
 * Check if MetaMask is installed and available
 */
export const isMetaMaskInstalled = (): boolean => {
  return typeof window !== 'undefined' && typeof (window as any).ethereum !== 'undefined';
};

/**
 * Get current MetaMask accounts
 */
export const getMetaMaskAccounts = async (): Promise<string[]> => {
  if (!isMetaMaskInstalled()) {
    throw new Error('MetaMask not installed');
  }
  
  const eth = (window as any).ethereum;
  return await eth.request({ method: 'eth_accounts' });
};

/**
 * Request MetaMask accounts (triggers connection prompt)
 */
export const requestMetaMaskAccounts = async (): Promise<string[]> => {
  if (!isMetaMaskInstalled()) {
    throw new Error('MetaMask not installed');
  }
  
  const eth = (window as any).ethereum;
  return await eth.request({ method: 'eth_requestAccounts' });
};

/**
 * Check if user has previously connected to MetaMask
 */
export const isMetaMaskAuthorized = async (): Promise<boolean> => {
  try {
    const accounts = await getMetaMaskAccounts();
    return accounts.length > 0;
  } catch (error) {
    return false;
  }
};

/**
 * Get the currently connected address from MetaMask
 */
export const getCurrentMetaMaskAddress = async (): Promise<string | null> => {
  try {
    const accounts = await getMetaMaskAccounts();
    return accounts.length > 0 ? accounts[0] : null;
  } catch (error) {
    return null;
  }
};

/**
 * Fetch balance for an address
 */
export const fetchBalance = async (address: string): Promise<{ balanceEth: string; balancePhp: string }> => {
  try {
    // Use MetaMask provider directly for balance fetching
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      const eth = (window as any).ethereum;
      const balanceWei = await eth.request({
        method: 'eth_getBalance',
        params: [address, 'latest']
      });
      
      // Convert from wei to ether
      const balanceInEth = (parseInt(balanceWei, 16) / Math.pow(10, 18)).toFixed(6);
      
      // Fetch PHP conversion rate
      const res = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=php");
      const data = await res.json();
      const rate = data.ethereum?.php || 0;
      const balancePhp = (parseFloat(balanceInEth) * rate).toFixed(2);
      
      return {
        balanceEth: balanceInEth,
        balancePhp
      };
    } else {
      // Fallback: return zero balance if no provider
      return {
        balanceEth: "0",
        balancePhp: "0"
      };
    }
  } catch (err) {
    console.error("Error fetching balance:", err);
    return {
      balanceEth: "0",
      balancePhp: "0"
    };
  }
};

/**
 * Sign a message with MetaMask
 */
export const signMessage = async (message: string, address: string): Promise<string> => {
  if (!isMetaMaskInstalled()) {
    throw new Error('MetaMask not installed');
  }
  
  const eth = (window as any).ethereum;
  return await eth.request({
    method: "personal_sign",
    params: [message, address],
  });
};

/**
 * Save wallet connection state to localStorage
 */
export const saveWalletState = (address: string, isConnected: boolean = true): void => {
  localStorage.setItem(WALLET_STORAGE_KEYS.ADDRESS, address);
  localStorage.setItem(WALLET_STORAGE_KEYS.CONNECTION_STATE, JSON.stringify({ isConnected, address }));
  localStorage.setItem(WALLET_STORAGE_KEYS.LAST_CONNECTED, Date.now().toString());
};

/**
 * Get wallet connection state from localStorage
 */
export const getWalletState = (): { isConnected: boolean; address: string | null } => {
  const address = localStorage.getItem(WALLET_STORAGE_KEYS.ADDRESS);
  const stateStr = localStorage.getItem(WALLET_STORAGE_KEYS.CONNECTION_STATE);
  
  if (!address || !stateStr) {
    return { isConnected: false, address: null };
  }
  
  try {
    const state = JSON.parse(stateStr);
    return { isConnected: state.isConnected, address: state.address };
  } catch (error) {
    return { isConnected: false, address: address };
  }
};

/**
 * Clear wallet connection state from localStorage
 */
export const clearWalletState = (): void => {
  localStorage.removeItem(WALLET_STORAGE_KEYS.ADDRESS);
  localStorage.removeItem(WALLET_STORAGE_KEYS.CONNECTION_STATE);
  localStorage.removeItem(WALLET_STORAGE_KEYS.LAST_CONNECTED);
};

/**
 * Check if wallet connection is still valid by verifying with MetaMask and backend
 */
export const validateWalletConnection = async (): Promise<{ isValid: boolean; address: string | null }> => {
  try {
    const storedState = getWalletState();
    if (!storedState.isConnected || !storedState.address) {
      return { isValid: false, address: null };
    }

    // Check if MetaMask is still connected to the same address
    const currentAddress = await getCurrentMetaMaskAddress();
    const isValid = currentAddress === storedState.address;
    
    if (!isValid) {
      // Clear invalid state
      clearWalletState();
    }
    
    return { isValid, address: currentAddress };
  } catch (error) {
    console.error('Error validating wallet connection:', error);
    clearWalletState();
    return { isValid: false, address: null };
  }
};

/**
 * Validate wallet connection with backend
 */
export const validateWalletWithBackend = async (address: string): Promise<{ isValid: boolean; isConnected: boolean }> => {
  try {
    const token = localStorage.getItem('publico_auth_token');
    if (!token) {
      return { isValid: false, isConnected: false };
    }

    const response = await fetch("http://localhost:5000/api/wallet/validate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ address })
    });

    if (!response.ok) {
      return { isValid: false, isConnected: false };
    }

    const data = await response.json();
    return { isValid: true, isConnected: data.isConnected };
  } catch (error) {
    console.error('Error validating wallet with backend:', error);
    return { isValid: false, isConnected: false };
  }
};

/**
 * Disconnect wallet from backend
 */
export const disconnectWalletFromBackend = async (): Promise<boolean> => {
  try {
    const token = localStorage.getItem('publico_auth_token');
    if (!token) {
      return false;
    }

    const response = await fetch("http://localhost:5000/api/wallet/disconnect", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });

    return response.ok;
  } catch (error) {
    console.error('Error disconnecting wallet from backend:', error);
    return false;
  }
};

/**
 * Attempt to reconnect to MetaMask on page load
 */
export const attemptWalletReconnection = async (): Promise<{ success: boolean; address: string | null }> => {
  try {
    const storedState = getWalletState();
    if (!storedState.isConnected || !storedState.address) {
      return { success: false, address: null };
    }

    // Check if MetaMask is still connected
    const isAuthorized = await isMetaMaskAuthorized();
    if (!isAuthorized) {
      clearWalletState();
      return { success: false, address: null };
    }

    const currentAddress = await getCurrentMetaMaskAddress();
    if (currentAddress === storedState.address) {
      // Same address, just reconnect without backend validation
      // Backend validation can be done later when needed
      return { success: true, address: currentAddress };
    } else if (currentAddress) {
      // Address changed, update stored state
      saveWalletState(currentAddress, true);
      return { success: true, address: currentAddress };
    } else {
      return { success: false, address: null };
    }
  } catch (error) {
    console.error('Error attempting wallet reconnection:', error);
    clearWalletState();
    return { success: false, address: null };
  }
};

/**
 * Set up MetaMask event listeners for account changes and disconnections
 */
export const setupMetaMaskListeners = (onAccountChange: (address: string | null) => void, onDisconnect: () => void) => {
  if (!isMetaMaskInstalled()) {
    return () => {}; // Return empty cleanup function
  }

  const eth = (window as any).ethereum;

  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      // User disconnected
      onDisconnect();
    } else {
      // User switched accounts
      onAccountChange(accounts[0]);
    }
  };

  const handleDisconnect = () => {
    onDisconnect();
  };

  // Listen for account changes
  eth.on('accountsChanged', handleAccountsChanged);
  
  // Listen for disconnect events
  eth.on('disconnect', handleDisconnect);

  // Return cleanup function
  return () => {
    eth.removeListener('accountsChanged', handleAccountsChanged);
    eth.removeListener('disconnect', handleDisconnect);
  };
};
