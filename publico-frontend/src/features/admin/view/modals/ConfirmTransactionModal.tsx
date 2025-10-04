import React from "react";
import { AlertTriangle, X } from "lucide-react";

interface ConfirmTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  amountEth: string;
  amountPhp: string;
  gasFee: string;
  total: string;
}

export default function ConfirmTransactionModal({
  isOpen,
  onClose,
  onConfirm,
  amountEth,
  amountPhp,
  gasFee,
  total,
}: ConfirmTransactionModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl mx-4">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">
            Confirm Transaction
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X size={20} className="text-slate-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <p className="text-slate-700">
            You are about to send funds to the agency for this project:
          </p>

          {/* Transaction Details */}
          <div className="space-y-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Amount:</span>
              <span className="font-semibold text-slate-900">
                {amountEth} ETH
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">PHP Equivalent:</span>
              <span className="font-semibold text-slate-900">
                ₱{amountPhp}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Gas Fee:</span>
              <span className="font-semibold text-slate-900">{gasFee} ETH</span>
            </div>
            <div className="flex justify-between text-base font-semibold pt-3 border-t border-slate-200">
              <span className="text-slate-900">Total:</span>
              <span className="text-slate-900">{total} ETH</span>
            </div>
          </div>

          {/* Warning */}
          <div className="flex gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <AlertTriangle size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-amber-900">
                Warning: This action cannot be reversed
              </p>
              <p className="text-xs text-amber-700 mt-1">
                This transaction cannot be reversed once confirmed. Please verify
                all details before proceeding.
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 px-6 py-4 bg-slate-50 border-t border-slate-200 rounded-b-2xl">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 text-slate-700 bg-white border border-slate-200 rounded-lg font-medium hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2.5 text-white bg-emerald-600 rounded-lg font-medium hover:bg-emerald-700 transition-colors"
          >
            Confirm & Send
          </button>
        </div>
      </div>
    </div>
  );
}

