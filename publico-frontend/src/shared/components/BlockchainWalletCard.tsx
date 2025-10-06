import React from "react";
import { Wallet, Copy, ExternalLink, Key, AlertTriangle } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Alert, AlertDescription } from "../ui/alert";
import { Label } from "../ui/label";
import useWallet, { UserRole, WalletData } from "../hooks/useWallet";

interface BlockchainWalletCardProps {
  role: UserRole;
  onProfileUpdate?: (profile: any) => void;
  onFetchedData?: (data: any) => void;
  className?: string;
}

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

export default function BlockchainWalletCard({ 
  role, 
  onProfileUpdate, 
  onFetchedData, 
  className = "" 
}: BlockchainWalletCardProps) {
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
  } = useWallet({ role, onProfileUpdate, onFetchedData });

  const getRoleSpecificMessage = () => {
    switch (role) {
      case 'Admin':
        return "Connect your MetaMask wallet to approve budget requests and send funds";
      case 'Agency':
        return "Connect your MetaMask wallet to manage project milestones and receive funds";
      case 'Citizen':
        return "Connect your MetaMask wallet to track project progress and participate in governance";
      default:
        return "Connect your MetaMask wallet to interact with the platform";
    }
  };

  return (
    <div className={className}>
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2">
            <Wallet className="w-5 h-5" />
            Blockchain Wallet
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!walletConnected ? (
            <div className="py-8 text-center">
              <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-lg bg-muted">
                <WalletIconLarge />
              </div>
              <p className="mb-4 text-muted-foreground text-balance">
                {getRoleSpecificMessage()}
              </p>
              <Button onClick={() => setShowConnectModal(true)} className="w-full">
                Connect MetaMask Wallet
              </Button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between p-3 border border-green-200 rounded-lg bg-green-50">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="font-medium text-green-700">Wallet Connected</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 bg-transparent border-red-200 hover:bg-red-50"
                  onClick={handleDisconnect}
                >
                  Disconnect
                </Button>
              </div>

              <div>
                <Label className="text-muted-foreground">Wallet Address</Label>
                <div className="flex items-center gap-2 mt-1">
                  <code className="flex-1 px-2 py-1 text-sm truncate rounded bg-muted">{walletData.address}</code>
                  <Button variant="ghost" size="sm" onClick={handleCopyAddress}>
                    <Copy className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">ETH Balance</Label>
                  <p className="text-lg font-semibold">{parseFloat(walletData.balanceEth).toFixed(4)} ETH</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">PHP Equivalent</Label>
                  <p className="text-lg font-semibold">₱{parseFloat(walletData.balancePhp).toLocaleString()}</p>
                </div>
              </div>

              <Button variant="link" className="h-auto p-0 text-blue-600">
                <ExternalLink className="w-4 h-4 mr-1" />
                View Transaction History
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      {/* Connect Wallet Modal */}
      <Dialog open={showConnectModal} onOpenChange={setShowConnectModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Wallet className="w-5 h-5" />
              Connect Wallet
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-muted-foreground">Choose how you want to connect your wallet:</p>

            <Button onClick={handleConnectMetaMask} className="justify-start w-full gap-3">
              <Wallet className="w-5 h-5" />
              Connect with MetaMask
            </Button>

            <Button
              variant="outline"
              onClick={() => {
                setShowConnectModal(false);
                setShowPrivateKeyModal(true);
              }}
              className="justify-start w-full gap-3"
            >
              <Key className="w-5 h-5" />
              Connect with Private Key
            </Button>

            <Button variant="ghost" onClick={() => setShowConnectModal(false)} className="w-full">
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Private Key Modal */}
      <Dialog open={showPrivateKeyModal} onOpenChange={setShowPrivateKeyModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Wallet className="w-5 h-5" />
              Connect Wallet
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-muted-foreground">Connect your wallet via private key</p>

            <div>
              <Input
                placeholder="Enter your private key"
                type="text"
                value={privateKey}
                onChange={(e) => setPrivateKey(e.target.value)}
              />
            </div>

            <Alert className="border-yellow-200 bg-yellow-50">
              <AlertTriangle className="w-4 h-4 text-yellow-600" />
              <AlertDescription className="text-yellow-800">
                <strong>Security Warning</strong>
                <br />
                Never share your private key with anyone. This connection method is for read-only access and advanced
                users only.
              </AlertDescription>
            </Alert>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowPrivateKeyModal(false)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleConnectPrivateKey} className="flex-1">
                Connect
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
