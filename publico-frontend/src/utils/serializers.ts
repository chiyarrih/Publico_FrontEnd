export function formatAlertTimestamp(timestamp:number|string|null|undefined):string {
  if (!timestamp) return "Unknown time";
  
  const date = new Date(Number(timestamp) * 1000);
  
  return date.toLocaleString("en-PH", {
    dateStyle: "medium",
    timeStyle: "short"
  });
}

export function formatAlertType(type: string | number): string {
  const map: Record<number, string> = {
    0: "Budget Overrun",
    1: "Fund Delay",
    2: "Project Completed",
    3: "Request Expired",
    4: "Spending Anomaly",
    5: "Fund Sent",
    6: "Agency Budget Request",
  };
  return map[Number(type)] || "Unknown Alert";
}

export function formatSeverity(severity: string | number): "Low" | "Medium" | "High" {
  switch (Number(severity)) {
    case 0: return "Low";
    case 1: return "Medium";
    case 2: return "High";
    default: return "Low";
  }
}


