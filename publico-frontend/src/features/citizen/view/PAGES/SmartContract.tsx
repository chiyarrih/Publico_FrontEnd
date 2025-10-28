import React from "react";
import { Card } from "../../../../shared/ui";
import useContractAlerts from "@/features/admin/controller/hooks/useContractAlerts";
import { formatAlertType } from "@/utils/serializers";

export default function SmartContract() {
  const {alertsAll} = useContractAlerts()
  return (
    <div className="space-y-6">
      <Card title="Smart Contract Verification">
        <div className="space-y-4">
          <p className="text-gray-600">
            All transactions and budget allocations are secured on the blockchain for complete transparency and immutability.
          </p>
          
          <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
            <h3 className="mb-2 text-sm font-semibold text-blue-900">Blockchain Network</h3>
            <p className="text-sm text-blue-700">
              Network: Ethereum Testnet (Sepolia)<br />
              Smart Contract Address: <code className="text-xs">0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0</code>
            </p>
          </div>

          <div className="p-4 border border-green-200 rounded-lg bg-green-50">
            <h3 className="mb-2 text-sm font-semibold text-green-900">✅ Verification Status</h3>
            <p className="text-sm text-green-700">
              All transactions are immutably recorded on the blockchain. You can verify any transaction hash on the public explorer.
            </p>
          </div>

          <div className="p-4 border border-gray-200 rounded-lg">
            <h3 className="mb-3 text-sm font-semibold text-gray-900">Recent Contract Events</h3>
            <div className="space-y-2">
              {alertsAll.map((item, index)=><div key={index} className="flex items-center justify-between pb-2 text-sm border-b">
                <span className="text-gray-600">{formatAlertType(item.alertType)}</span>
                <span className="font-mono text-xs text-gray-500">{item.relatedAdmin}</span>
              </div>)}
            </div>
          </div>

          <div className="flex gap-3">
            <a 
              href="https://sepolia.etherscan.io/address/0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb0"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 text-white transition-colors bg-blue-600 rounded hover:bg-blue-700"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              View Contract on Etherscan
            </a>
            
            <button className="inline-flex items-center gap-2 px-4 py-2 text-gray-700 transition-colors bg-gray-100 rounded hover:bg-gray-200">
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
            <div className="flex items-center justify-center flex-shrink-0 w-6 h-6 bg-green-100 rounded-full">
              <span className="text-xs text-green-600">1</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Immutable Records</h4>
              <p>Every transaction is permanently recorded on the blockchain and cannot be altered or deleted.</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="flex items-center justify-center flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full">
              <span className="text-xs text-blue-600">2</span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Public Verification</h4>
              <p>Anyone can verify the authenticity of transactions by checking the blockchain explorer.</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="flex items-center justify-center flex-shrink-0 w-6 h-6 bg-purple-100 rounded-full">
              <span className="text-xs text-purple-600">3</span>
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

