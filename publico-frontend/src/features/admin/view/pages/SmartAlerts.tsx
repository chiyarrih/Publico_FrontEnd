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

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-semibold">Smart Contract Alerts</h1>
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
