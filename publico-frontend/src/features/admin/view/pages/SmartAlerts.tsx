import { Card, Badge, Button, Select } from "../ui/blocks"
import useContractAlerts from "../../controller/hooks/useContractAlerts"
import type { ContractAlert } from "../../model/types/contractAlerts"
import { formatAlertTimestamp, formatAlertType, formatSeverity } from "@/utils/serializers"
import { CheckCircle, AlertTriangle, XCircle, Info } from "lucide-react"

const bar = (s: ContractAlert["severity"]) =>
  s === "High"
    ? "border-rose-200 bg-rose-50"
    : s === "Medium"
      ? "border-amber-200 bg-amber-50"
      : "border-emerald-200 bg-emerald-50"

const tone = (s: ContractAlert["severity"]) => (s === "High" ? "red" : s === "Medium" ? "yellow" : "green")

const IconForSeverity = ({ severity }: { severity: string }) => {
  switch (severity) {
    case "High":
      return <XCircle className="text-red-500" size={24} />
    case "Medium":
      return <AlertTriangle className="text-amber-500" size={24} />
    case "Low":
      return <CheckCircle className="text-emerald-500" size={24} />
    default:
      return <Info className="text-slate-500" size={24} />
  }
}

export default function SmartAlerts() {
  const { alerts, loading, error } = useContractAlerts()

  const handleExport = () => {
    const csvHeaders = ['Alert Type', 'Severity', 'Description', 'Timestamp', 'Resolved'];
    const csvRows = alerts.map(alert => [
      formatAlertType(alert.alertType),
      formatSeverity(alert.severity),
      alert.description,
      formatAlertTimestamp(alert.timestamp),
      alert.resolved ? 'Yes' : 'No'
    ]);

    const csvContent = [
      csvHeaders.join(','),
      ...csvRows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `smart_contract_alerts_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">Smart Contract Alerts</h1>
        <Button 
          onClick={handleExport}
          disabled={alerts.length === 0}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-4 h-4 mr-2 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export Alerts
        </Button>
      </div>
      <div className="flex items-center gap-2">
        <Select defaultValue="All">
          <option>All Alert Types</option>
        </Select>
        <Button className="ml-auto" disabled={loading}>
          Mark All as Read
        </Button>
      </div>

      {loading && <div className="text-slate-500">Loading alerts...</div>}
      {error && <div className="text-red-500">Failed to load alerts: {error}</div>}

      {!loading && !error && alerts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <CheckCircle className="text-emerald-500 mb-3" size={48} />
          <h3 className="text-lg font-medium text-slate-700">No Smart Contract Alerts</h3>
          <p className="text-sm text-slate-500 mt-1">
            All systems are operating normally. No alerts to display at this time.
          </p>
        </div>
      )}

      <div className="space-y-3">
        {alerts.map((a, index) =>
          a.resolved === false ? (
            <Card key={index} className={`${bar(formatSeverity(a.severity))} border`}>
              <div className="flex items-start gap-3">
                <IconForSeverity severity={formatSeverity(a.severity)} />

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{formatAlertType(a.alertType)}</div>
                    <div className="text-xs text-slate-500">{formatAlertTimestamp(a.timestamp)}</div>
                  </div>

                  <div className="mt-1 text-sm text-slate-600">{a.description}</div>

                  <div className="mt-2 flex gap-2">
                    <Badge tone={tone(formatSeverity(a.severity))}>{formatSeverity(a.severity)}</Badge>
                  </div>
                </div>
              </div>
            </Card>
          ) : null,
        )}
      </div>
    </div>
  )
}
