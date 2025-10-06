import useWallet from "../../../../shared/hooks/useWallet";

export default function useCitizenWallet() {
  return useWallet({ role: 'Citizen' });
}
