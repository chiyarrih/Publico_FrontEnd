import useWallet from "../../../../shared/hooks/useWallet";

export default function useAdminWallet() {
  return useWallet({ role: 'Admin' });
}

