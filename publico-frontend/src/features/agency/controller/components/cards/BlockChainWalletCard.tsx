import BlockchainWalletCard from "../../../../../shared/components/BlockchainWalletCard";
import useConnectWallet from "@agency/controller/hooks/useConnectWallet";

export default function AgencyBlockchainWalletCard() {
  const { setProfile, fetchedData } = useConnectWallet();
  
  return (
    <BlockchainWalletCard 
      role="Agency" 
      onProfileUpdate={setProfile}
      onFetchedData={(data) => {/* handled by useConnectWallet */}}
    />
  );
}