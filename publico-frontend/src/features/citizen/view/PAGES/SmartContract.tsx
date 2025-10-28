import React from "react";
import { Card } from "../../../../shared/ui";

export default function SmartContract() {
  return (
    <div className="space-y-6">
      <Card title="Smart Contract Verification">
        <div className="space-y-4">
          <p className="text-gray-600">
            All transactions and budget allocations are secured on the blockchain for complete transparency and immutability.
          </p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-blue-900 mb-2">Blockchain Network</h3>
            <p className="text-sm text-blue-700">
              Network: Ethereum Testnet (Sepolia)<br />
              Smart Contract Address: <code className="text-xs">0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0</code>
            </p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-green-900 mb-2">✅ Verification Status</h3>
            <p className="text-sm text-green-700">
              All transactions are immutably recorded on the blockchain. You can verify any transaction hash on the public explorer.
            </p>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Recent Contract Events</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm border-b pb-2">
                <span className="text-gray-600">Budget Approval</span>
                <span className="text-xs font-mono text-gray-500">0x1a2b3c...</span>
              </div>
              <div className="flex items-center justify-between text-sm border-b pb-2">
                <span className="text-gray-600">Transaction Recorded</span>
                <span className="text-xs font-mono text-gray-500">0x4d5e6f...</span>
              </div>
              <div className="flex items-center justify-between text-sm border-b pb-2">
                <span className="text-gray-600">Milestone Verified</span>
                <span className="text-xs font-mono text-gray-500">0x7a8b9c...</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <a 
              href="https://sepolia.etherscan.io/address/0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              View Contract on Etherscan
            </a>
            
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download Contract ABI
            </button>
          </div>
        </div>
      </Card>

      <Card title="How Blockchain Ensures Transparency">
        <div className="space-y-4 text-sm text-gray-600">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
              <span className="text-green-600 text-xs">1</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Immutable Records</h4>
              <p>Every transaction is permanently recorded on the blockchain and cannot be altered or deleted.</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              <span className="text-blue-600 text-xs">2</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Public Verification</h4>
              <p>Anyone can verify the authenticity of transactions by checking the blockchain explorer.</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
              <span className="text-purple-600 text-xs">3</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Real-time Updates</h4>
              <p>Transaction signatures are generated automatically and cannot be forged.</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

