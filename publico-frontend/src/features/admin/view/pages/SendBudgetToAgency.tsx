import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Wallet } from "lucide-react";
import type { BudgetProposal } from "@admin/model/types/admin";
import { Card, Button } from "../ui/blocks";
import useAdminWallet from "../../controller/hooks/useAdminWallet";
import ConnectWalletModal from "../../controller/components/modals/ConnectWalletModal";
import PrivateKeyModal from "../../controller/components/modals/PrivateKeyModal";
import ConfirmTransactionModal from "../modals/ConfirmTransactionModal";

export default function SendBudgetToAgency() {
  const location = useLocation();
  const navigate = useNavigate(); 
  const proposal = location.state?.proposal as BudgetProposal | undefined;

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

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [ethAmount, setEthAmount] = useState("0");
  const [gasFee, setGasFee] = useState("0.002");

  useEffect(() => {
    if (!proposal) {
      navigate("/admin/requests");
      return;
    }

    // Convert PHP to ETH (mock conversion rate - replace with real API)
    const ethRate = 345000; // 1 ETH = ₱345,000
    const amountInEth = (proposal.amountRequested / ethRate).toFixed(4);
    setEthAmount(amountInEth);
  }, [proposal, navigate]);

  if (!proposal) {
    return null;
  }

  const phpEquivalent = proposal.amountRequested.toLocaleString();
  const totalEth = (parseFloat(ethAmount) + parseFloat(gasFee)).toFixed(4);

  const handleSendFunds = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmTransaction = async () => {
    // TODO: Implement actual transaction logic
    console.log("Sending transaction...");
    setShowConfirmModal(false);
    // Navigate back to budget requests or show success message
    navigate("/admin/requests");
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/admin/requests")}
          className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <ArrowLeft size={20} className="text-slate-600" />
        </button>
        <h1 className="text-2xl font-semibold text-slate-800">
          Send Budget to Agency
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Project Information */}
        <Card>
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            Project Information
          </h2>

          <div className="space-y-4">
            <div>
              <label className="text-sm text-slate-500">Project Name</label>
              <p className="font-semibold text-slate-900 mt-1">
                {proposal.projectName}
              </p>
            </div>

            <div>
              <label className="text-sm text-slate-500">Project ID</label>
              <p className="font-semibold text-slate-900 mt-1">
                {proposal.projectId}
              </p>
            </div>

            <div>
              <label className="text-sm text-slate-500">Department</label>
              <p className="font-semibold text-slate-900 mt-1">
                {proposal.department}
              </p>
            </div>

            <div>
              <label className="text-sm text-slate-500">Submitted By</label>
              <p className="font-semibold text-slate-900 mt-1">
                {proposal.agencyId?.name || proposal.agencyId?.email || "Unknown"}
              </p>
            </div>

            <div>
              <label className="text-sm text-slate-500">Requested Amount</label>
              <p className="font-bold text-sky-600 text-xl mt-1">
                ₱{phpEquivalent}
              </p>
            </div>

            <div>
              <label className="text-sm text-slate-500">
                Converted Amount (ETH)
              </label>
              <p className="font-bold text-slate-900 text-lg mt-1">
                {ethAmount} ETH{" "}
                <span className="text-sm text-slate-500 font-normal">
                  (1 ETH = ₱ 345,000)
                </span>
              </p>
            </div>
          </div>
        </Card>

        {/* Right Column - Admin Wallet */}
        <Card>
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            Admin Wallet
          </h2>

          {!walletConnected ? (
            /* Not Connected State */
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                <Wallet size={36} className="text-slate-400" />
              </div>
              <p className="text-slate-600 text-center mb-6">
                Connect your MetaMask wallet to send funds
              </p>
              <Button
                onClick={() => setShowConnectModal(true)}
                className="px-6 py-3"
              >
                Connect MetaMask Wallet
              </Button>
            </div>
          ) : (
            /* Connected State */
            <div className="space-y-6">
              {/* Wallet Address */}
              <div>
                <label className="text-sm text-slate-500">Wallet Address</label>
                <div className="mt-1 p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <p className="text-xs font-mono text-slate-900 break-all">
                    {walletData.address}
                  </p>
                </div>
              </div>

              {/* Balance */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-slate-500">ETH Balance</label>
                  <p className="font-bold text-slate-900 text-xl mt-1">
                    {walletData.balanceEth} ETH
                  </p>
                </div>
                <div>
                  <label className="text-sm text-slate-500">
                    PHP Equivalent
                  </label>
                  <p className="font-bold text-slate-900 text-xl mt-1">
                    ₱{walletData.balancePhp}
                  </p>
                </div>
              </div>

              {/* Transaction Summary */}
              <div className="pt-4 border-t border-slate-200">
                <h3 className="text-sm font-semibold text-slate-900 mb-3">
                  Transaction Summary
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Amount to Send:</span>
                    <span className="font-semibold text-slate-900">
                      {ethAmount} ETH
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Estimated Gas Fee:</span>
                    <span className="font-semibold text-slate-900">
                      {gasFee} ETH
                    </span>
                  </div>
                  <div className="flex justify-between text-base font-semibold pt-2 border-t border-slate-200">
                    <span className="text-slate-900">Total:</span>
                    <span className="text-slate-900">{totalEth} ETH</span>
                  </div>
                </div>
              </div>

              {/* Send Button */}
              <Button
                onClick={handleSendFunds}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700"
              >
                <div className="flex items-center justify-center gap-2">
                  <Wallet size={20} />
                  <span>Send Funds</span>
                </div>
              </Button>
            </div>
          )}
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-4">
        <button
          onClick={() => navigate("/admin/requests")}
          className="px-6 py-2 text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
        >
          Back to Budget Requests
        </button>
        <button className="px-6 py-2 text-white bg-sky-600 rounded-lg hover:bg-sky-700 transition-colors">
          View Project Milestones
        </button>
      </div>

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
        privateKey={privateKey}
        onPrivateKeyChange={setPrivateKey}
        onConnect={handleConnectPrivateKey}
      />

      <ConfirmTransactionModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmTransaction}
        amountEth={ethAmount}
        amountPhp={phpEquivalent}
        gasFee={gasFee}
        total={totalEth}
      />
    </div>
  );
}

