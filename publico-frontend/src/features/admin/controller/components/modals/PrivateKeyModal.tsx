import { Button, Input } from "@admin/view/ui/blocks";

const WalletIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
    <line x1="1" y1="10" x2="23" y2="10" />
  </svg>
);

const AlertIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-yellow-600">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

interface PrivateKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: () => void;
  privateKey: string;
  setPrivateKey: (value: string) => void;
}

export default function PrivateKeyModal({
  isOpen,
  onClose,
  onConnect,
  privateKey,
  setPrivateKey,
}: PrivateKeyModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center gap-2">
          <WalletIcon />
          <h2 className="text-lg font-semibold text-slate-800">Connect with Private Key</h2>
        </div>

        <p className="mb-4 text-sm text-slate-600">
          Connect your wallet via private key
        </p>

        <div className="mb-4">
          <Input
            placeholder="Enter your private key"
            type="password"
            value={privateKey}
            onChange={(e) => setPrivateKey(e.target.value)}
          />
        </div>

        <div className="mb-6 flex gap-3 rounded-lg border border-yellow-200 bg-yellow-50 p-3">
          <AlertIcon />
          <div className="text-xs text-yellow-800">
            <strong>Security Warning</strong>
            <br />
            Never share your private key with anyone. This connection method is for
            read-only access and advanced users only.
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-all hover:bg-slate-50"
          >
            Cancel
          </button>
          <Button onClick={onConnect} className="flex-1">
            Connect
          </Button>
        </div>
      </div>
    </div>
  );
}

