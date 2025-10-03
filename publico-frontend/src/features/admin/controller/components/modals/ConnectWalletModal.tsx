import { Button } from "@admin/view/ui/blocks";

const WalletIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
    <line x1="1" y1="10" x2="23" y2="10" />
  </svg>
);

const KeyIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
  </svg>
);

interface ConnectWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnectMetaMask: () => void;
  onConnectPrivateKey: () => void;
}

export default function ConnectWalletModal({
  isOpen,
  onClose,
  onConnectMetaMask,
  onConnectPrivateKey,
}: ConnectWalletModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center gap-2">
          <WalletIcon />
          <h2 className="text-lg font-semibold text-slate-800">Connect Wallet</h2>
        </div>

        <p className="mb-6 text-sm text-slate-600">
          Choose how you want to connect your wallet:
        </p>

        <div className="space-y-3">
          <button
            onClick={onConnectMetaMask}
            className="flex w-full items-center justify-start gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition-all hover:bg-slate-50"
          >
            <WalletIcon />
            Connect with MetaMask
          </button>

          <button
            onClick={onConnectPrivateKey}
            className="flex w-full items-center justify-start gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition-all hover:bg-slate-50"
          >
            <KeyIcon />
            Connect with Private Key
          </button>

          <button
            onClick={onClose}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition-all hover:bg-slate-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

