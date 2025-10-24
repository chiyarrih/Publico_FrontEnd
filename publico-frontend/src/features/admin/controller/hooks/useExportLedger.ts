import { useState } from 'react';

export const useExportLedger = () => {
  const [isExporting, setIsExporting] = useState(false);

  const exportToCSV = async (fetchAllLedgers: () => Promise<any[]>) => {
    setIsExporting(true);
    
    try {
      // Fetch all ledgers (all pages)
      const allLedgers = await fetchAllLedgers();

      if (!allLedgers || allLedgers.length === 0) {
        alert('No data available to export.');
        return;
      }

      // Define CSV headers
      const headers = [
        'Transaction ID',
        'Agency ID',
        'Date',
        'Department',
        'Project',
        'Amount',
        'Status',
        'Blockchain Hash'
      ];

      // Convert ledgers to CSV rows with safe property access
      const csvRows = allLedgers.map(ledger => {
        // Extract agency ID - try name/email first, then the ID itself
        const agencyId = ledger.agencyId?.name || 
                        ledger.agencyId?.email || 
                        (typeof ledger.agencyId === 'string' ? ledger.agencyId : ledger.agencyId?._id || 'N/A');

        return [
          ledger.txId || ledger._id || '',
          agencyId,
          ledger.createdAt ? new Date(ledger.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }) : '',
          ledger.department || '',
          ledger.projectName || '',
          (ledger.amount || ledger.amountRequested || 0).toString(),
          ledger.status || '',
          ledger.blockchainTxHash || 'N/A'
        ];
      });

      // Combine headers and rows
      const csvContent = [
        headers.join(','),
        ...csvRows.map(row => row.map(cell => `"${cell}"`).join(','))
      ].join('\n');

      // Create blob and download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', `transaction_ledger_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting CSV:', error);
      alert('Failed to export ledger. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return { exportToCSV, isExporting };
};
