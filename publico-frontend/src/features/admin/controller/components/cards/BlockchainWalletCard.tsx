import { Card, Button, Ghost } from "@admin/view/ui/blocks";

const WalletIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-sky-600">
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
    <line x1="1" y1="10" x2="23" y2="10" />
  </svg>
);

const WalletIconLarge = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-400">
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
    <line x1="1" y1="10" x2="23" y2="10" />
  </svg>
);

interface BlockchainWalletCardProps {
  walletConnected: boolean;
  onConnect: () => void;
  onDisconnect?: () => void;
}

export default function BlockchainWalletCard({ 
  walletConnected, 
  onConnect, 
  onDisconnect 
}: BlockchainWalletCardProps) {
  return (
    <Card>
      <div className="mb-4 flex items-center gap-2">
        <WalletIcon />
        <h3 className="text-base font-semibold text-slate-800">Blockchain Wallet</h3>
      </div>

      {!walletConnected ? (
        <div className="py-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
            <WalletIconLarge />
          </div>
          <p className="mb-6 text-sm text-slate-600">
            Connect your MetaMask wallet to approve budget requests and send funds
          </p>
          <Button onClick={onConnect} className="w-full">
            Connect MetaMask Wallet
          </Button>
        </div>
      ) : (
        <div>
          <div className="rounded-lg bg-slate-50 p-3 text-sm">
            <div className="text-xs text-slate-500">Connected Wallet</div>
            <div className="mt-1 font-mono text-slate-700">0x742d...5e9A</div>
          </div>
          <Ghost onClick={onDisconnect} className="mt-3 w-full">
            Disconnect
          </Ghost>
        </div>
      )}
    </Card>
  );
}

