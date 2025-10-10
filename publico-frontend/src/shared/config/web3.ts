import { Web3 } from "web3";

// Use MetaMask provider when available, fallback to public RPC
const getWeb3Provider = () => {
  if (typeof window !== 'undefined' && (window as any).ethereum) {
    return (window as any).ethereum;
  }
  // Fallback to a public RPC that doesn't violate CSP
  return "https://sepolia.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161";
};

// Centralized Web3 configuration
export const web3 = new Web3(getWeb3Provider());

// Web3 configuration constants
export const WEB3_CONFIG = {
  RPC_URL: "https://sepolia.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161",
  CHAIN_ID: 11155111, // Sepolia testnet
  CURRENCY_SYMBOL: "ETH",
  CURRENCY_NAME: "Ethereum",
  NETWORK_NAME: "Sepolia Testnet"
} as const;

// Helper function to get current network info
export const getCurrentNetwork = async () => {
  try {
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      const chainId = await (window as any).ethereum.request({ method: 'eth_chainId' });
      return {
        chainId: parseInt(chainId, 16),
        isSupported: parseInt(chainId, 16) === WEB3_CONFIG.CHAIN_ID
      };
    }
    return { chainId: null, isSupported: false };
  } catch (error) {
    console.error('Error getting network info:', error);
    return { chainId: null, isSupported: false };
  }
};
