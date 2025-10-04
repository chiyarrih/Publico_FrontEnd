import { Card, Button, Ghost } from "features/view/admin/ui/blocks";
import useAdminWallet from "features/controller/admin/components/hooks/useAdminWallet";
import ConnectWalletModal from "@admin/controller/components/modals/ConnectWalletModal";
import PrivateKeyModal from "@admin/controller/components/modals/PrivateKeyModal";

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

const CopyIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

const ExternalLinkIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

export default function BlockchainWalletCard() {
  const {
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
  } = useAdminWallet();

  return (
    <>
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
            <Button onClick={() => setShowConnectModal(true)} className="w-full">
              Connect MetaMask Wallet
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Connected Status */}
            <div className="flex items-center justify-between rounded-lg border border-emerald-200 bg-emerald-50 p-3">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                <span className="text-sm font-medium text-emerald-700">Wallet Connected</span>
              </div>
              <button
                onClick={handleDisconnect}
                className="rounded-lg border border-rose-200 bg-transparent px-3 py-1 text-xs font-medium text-rose-600 transition-all hover:bg-rose-50"
              >
                Disconnect
              </button>
            </div>

            {/* Wallet Address */}
            <div>
              <div className="mb-1 text-xs text-slate-500">Wallet Address</div>
              <div className="flex items-center gap-2">
                <code className="flex-1 truncate rounded-lg bg-slate-100 px-3 py-2 text-sm text-slate-700">
                  {walletData.address}
                </code>
                <button
                  onClick={handleCopyAddress}
                  className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 transition-all hover:bg-slate-50"
                >
                  <CopyIcon />
                </button>
                <button className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 transition-all hover:bg-slate-50">
                  <ExternalLinkIcon />
                </button>
              </div>
            </div>

            {/* Balance Display */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-slate-200 bg-white p-3">
                <div className="text-xs text-slate-500">ETH Balance</div>
                <div className="mt-1 text-lg font-semibold text-slate-900">
                  {parseFloat(walletData.balanceEth).toFixed(4)} ETH
                </div>
              </div>
              <div className="rounded-lg border border-slate-200 bg-white p-3">
                <div className="text-xs text-slate-500">PHP Equivalent</div>
                <div className="mt-1 text-lg font-semibold text-slate-900">
                  ₱{parseFloat(walletData.balancePhp).toLocaleString()}
                </div>
              </div>
            </div>

            {/* Transaction History Link */}
            <button className="flex items-center gap-1 text-sm text-sky-600 hover:text-sky-700">
              <ExternalLinkIcon />
              <span>View Transaction History</span>
            </button>
          </div>
        )}
      </Card>

      {/* Modals */}
      <ConnectWalletModal
        isOpen={showConnectModal}
        onClose={() => setShowConnectModal(false)}
        onConnectMetaMask={handleConnectMetaMask}
        onConnectPrivateKey={() => {
          setShowConnectModal(false);
          setShowPrivateKeyModal(true);
        }}
      />

      <PrivateKeyModal
        isOpen={showPrivateKeyModal}
        onClose={() => setShowPrivateKeyModal(false)}
        onConnect={handleConnectPrivateKey}
        privateKey={privateKey}
        setPrivateKey={setPrivateKey}
      />
    </>
  );
}

