import useConnectWallet from "@agency/controller/hooks/useConnectWallet";
import { Alert, AlertDescription } from "@citizen/components/ui/alert";
import { Button } from "@citizen/components/ui/button";
import { CardHeader, CardTitle, CardContent } from "@citizen/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@citizen/components/ui/dialog";
import { Input } from "@citizen/components/ui/input";
import { Card } from "@shared/ui";
import { Wallet, Copy, ExternalLink, Key, AlertTriangle } from "lucide-react";
import { Label } from "recharts";

export default function BlockchainWalletCard(){
    const {
    isEditing,
    setIsEditing,
    walletConnected,
    walletData,
    profile,
    setProfile,
    privateKey,
    setPrivateKey,
    showConnectModal,
    setShowConnectModal,
    showPrivateKeyModal,
    setShowPrivateKeyModal,
    handleSave,
    handleConnectMetaMask,
    handleConnectPrivateKey,
    handleDisconnect,
  }= useConnectWallet()
    return (
        <div>
        {/* Blockchain Wallet Card */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <Wallet className="w-5 h-5" />
              Blockchain Wallet
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {walletData.connected ? (
              <>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-green-700 font-medium">Wallet Connected</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 border-red-200 hover:bg-red-50 bg-transparent"
                    onClick={handleDisconnect}
                  >
                    Disconnect
                  </Button>
                </div>

                <div>
                  <Label className="text-muted-foreground">Wallet Address</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <code className="text-sm bg-muted px-2 py-1 rounded flex-1 truncate">{walletData.address}</code>
                    <Button variant="ghost" size="sm">
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
                    <p className="text-lg font-semibold">{walletData.balanceEth} ETH</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">PHP Equivalent</Label>
                    <p className="text-lg font-semibold">{walletData.balancePhp} PHP</p>
                  </div>
                </div>

                <Button variant="link" className="p-0 h-auto text-blue-600">
                  <ExternalLink className="w-4 h-4 mr-1" />
                  View Transaction History
                </Button>
              </>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-lg bg-muted flex items-center justify-center">
                  <Wallet className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground mb-4 text-balance">
                  Connect your MetaMask wallet to approve budget requests and send funds
                </p>
                <Button onClick={() => setShowConnectModal(true)} className="w-full">
                  Connect MetaMask Wallet
                </Button>
              </div>
            )}
          </CardContent>
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

            <Button onClick={handleConnectMetaMask} className="w-full justify-start gap-3">
              <Wallet className="w-5 h-5" />
              Connect with MetaMask
            </Button>

            <Button
              variant="outline"
              onClick={() => {
                setShowConnectModal(false)
                setShowPrivateKeyModal(true)
              }}
              className="w-full justify-start gap-3"
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

            <Alert className="bg-yellow-50 border-yellow-200">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
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
        </Card>
        
      </div>
    )
}