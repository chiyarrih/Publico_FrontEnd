// ============================================================================
// CITIZEN ALERTS PAGE
// ============================================================================
// This page displays government alerts and notifications for citizens, including:
// - Smart contract alerts
// - Budget allocation notifications
// - Project milestone updates
// - System maintenance notices
// - Public announcements
// ============================================================================

import React, { useEffect, useState } from "react";
import { getDashboardAlerts } from "../../controller/data/dashboardService";
import toast from "react-hot-toast";

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface Alert {
  id: string;
  type: "info" | "warning" | "success" | "error";
  title: string;
  message: string;
  date: string;
  category: "budget" | "project" | "system" | "announcement";
  priority: "low" | "medium" | "high" | "urgent";
  isRead: boolean;
  actionUrl?: string;
  actionText?: string;
}

// ============================================================================
// UI COMPONENTS
// ============================================================================

const AlertCard: React.FC<{ 
  alert: Alert; 
  onMarkAsRead: (id: string) => void;
  onAction?: (alert: Alert) => void;
}> = ({ alert, onMarkAsRead, onAction }) => {
  const getAlertStyles = (type: Alert["type"]) => {
    const styles = {
      info: "bg-blue-50 border-blue-200 text-blue-800",
      warning: "bg-amber-50 border-amber-200 text-amber-800", 
      success: "bg-green-50 border-green-200 text-green-800",
      error: "bg-red-50 border-red-200 text-red-800"
    };
    return styles[type];
  };

  const getPriorityStyles = (priority: Alert["priority"]) => {
    const styles = {
      low: "bg-gray-100 text-gray-600",
      medium: "bg-blue-100 text-blue-700",
      high: "bg-orange-100 text-orange-700", 
      urgent: "bg-red-100 text-red-700"
    };
    return styles[priority];
  };

  const getCategoryIcon = (category: Alert["category"]) => {
    const icons = {
      budget: "💰",
      project: "📋",
      system: "⚙️",
      announcement: "📢"
    };
    return icons[category];
  };

  const getTypeIcon = (type: Alert["type"]) => {
    const icons = {
      info: "ℹ️",
      warning: "⚠️",
      success: "✅",
      error: "❌"
    };
    return icons[type];
  };

  return (
    <div className={`rounded-lg border p-4 transition-all duration-200 hover:shadow-md ${
      alert.isRead ? 'opacity-60' : 'bg-white'
    } ${getAlertStyles(alert.type)}`}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 text-2xl">
          {getTypeIcon(alert.type)}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-gray-900 truncate">
                {alert.title}
              </h3>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityStyles(alert.priority)}`}>
                {alert.priority}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">{getCategoryIcon(alert.category)}</span>
              <span className="text-xs text-gray-500">{alert.date}</span>
            </div>
          </div>
          
          <p className="text-sm text-gray-700 mb-3 leading-relaxed">
            {alert.message}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {!alert.isRead && (
                <button
                  onClick={() => onMarkAsRead(alert.id)}
                  className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                >
                  Mark as Read
                </button>
              )}
              {alert.actionUrl && alert.actionText && (
                <button
                  onClick={() => onAction?.(alert)}
                  className="text-xs text-green-600 hover:text-green-800 font-medium"
                >
                  {alert.actionText} →
                </button>
              )}
            </div>
            {alert.isRead && (
              <span className="text-xs text-gray-400">Read</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const FilterTabs: React.FC<{
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  unreadCount: number;
}> = ({ activeFilter, onFilterChange, unreadCount }) => {
  const filters = [
    { key: "all", label: "All Alerts", count: null },
    { key: "unread", label: "Unread", count: unreadCount },
    { key: "budget", label: "Budget", count: null },
    { key: "project", label: "Projects", count: null },
    { key: "system", label: "System", count: null },
    { key: "announcement", label: "Announcements", count: null }
  ];

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {filters.map((filter) => (
        <button
          key={filter.key}
          onClick={() => onFilterChange(filter.key)}
          className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeFilter === filter.key
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          {filter.label}
          {filter.count !== null && filter.count > 0 && (
            <span className="ml-1 px-1.5 py-0.5 bg-red-500 text-white text-xs rounded-full">
              {filter.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function Alerts() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Load alerts on component mount
  useEffect(() => {
    loadAlerts();
  }, []);

  const loadAlerts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Try to fetch from backend first
      try {
        const backendAlerts = await getDashboardAlerts();
        if (backendAlerts && Array.isArray(backendAlerts)) {
          const transformedAlerts = backendAlerts.map((alert: any, index: number) => ({
            id: alert.id || `alert-${index}`,
            type: alert.type || "info",
            title: alert.title || alert.message || "Government Alert",
            message: alert.description || alert.message || "No additional details available.",
            date: alert.date ? new Date(alert.date).toLocaleDateString() : new Date().toLocaleDateString(),
            category: alert.category || "announcement",
            priority: alert.priority || "medium",
            isRead: false,
            actionUrl: alert.actionUrl,
            actionText: alert.actionText
          }));
          setAlerts(transformedAlerts);
          return;
        }
      } catch (backendError) {
        console.warn("Backend alerts not available, using mock data:", backendError);
      }

      // Fallback to mock data
      const mockAlerts: Alert[] = [
        {
          id: "alert-1",
          type: "success",
          title: "Budget Allocation Completed",
          message: "The Q4 budget allocation for infrastructure projects has been successfully processed and verified on the blockchain.",
          date: new Date().toLocaleDateString(),
          category: "budget",
          priority: "high",
          isRead: false,
          actionUrl: "/citizen/ledger",
          actionText: "View Transactions"
        },
        {
          id: "alert-2", 
          type: "warning",
          title: "Project Milestone Delay",
          message: "The Road Rehabilitation Project Phase 2 is experiencing delays due to weather conditions. Expected completion date has been extended by 2 weeks.",
          date: new Date(Date.now() - 86400000).toLocaleDateString(),
          category: "project",
          priority: "medium",
          isRead: false,
          actionUrl: "/citizen/milestones",
          actionText: "View Project"
        },
        {
          id: "alert-3",
          type: "info",
          title: "System Maintenance Scheduled",
          message: "Scheduled maintenance will occur on Sunday, 2:00 AM - 4:00 AM. The transparency portal may be temporarily unavailable during this time.",
          date: new Date(Date.now() - 172800000).toLocaleDateString(),
          category: "system",
          priority: "low",
          isRead: true
        },
        {
          id: "alert-4",
          type: "success",
          title: "New Transparency Features Available",
          message: "We've added new features to help you track government spending more effectively. Check out the enhanced budget explorer and project analytics.",
          date: new Date(Date.now() - 259200000).toLocaleDateString(),
          category: "announcement",
          priority: "medium",
          isRead: false,
          actionUrl: "/citizen/transparency",
          actionText: "Explore Features"
        },
        {
          id: "alert-5",
          type: "error",
          title: "Data Sync Issue Resolved",
          message: "The temporary data synchronization issue has been resolved. All transaction records are now up to date and verified on the blockchain.",
          date: new Date(Date.now() - 345600000).toLocaleDateString(),
          category: "system",
          priority: "high",
          isRead: true
        }
      ];

      setAlerts(mockAlerts);
    } catch (err: any) {
      setError(err?.message || "Failed to load alerts");
      toast.error("Failed to load alerts");
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = (id: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === id ? { ...alert, isRead: true } : alert
    ));
    toast.success("Alert marked as read");
  };

  const handleAlertAction = (alert: Alert) => {
    if (alert.actionUrl) {
      window.location.href = alert.actionUrl;
    }
  };

  const markAllAsRead = () => {
    setAlerts(prev => prev.map(alert => ({ ...alert, isRead: true })));
    toast.success("All alerts marked as read");
  };

  // Filter alerts based on active filter and search query
  const filteredAlerts = alerts.filter(alert => {
    const matchesFilter = activeFilter === "all" || 
                         (activeFilter === "unread" && !alert.isRead) ||
                         alert.category === activeFilter;
    
    const matchesSearch = !searchQuery || 
                         alert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         alert.message.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const unreadCount = alerts.filter(alert => !alert.isRead).length;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading alerts...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <div className="text-red-600 text-lg font-medium mb-2">⚠️ Failed to Load Alerts</div>
          <p className="text-red-700 mb-4">{error}</p>
          <button
            onClick={loadAlerts}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Government Alerts</h1>
          <p className="text-gray-600 mt-1">Stay informed about budget updates, project milestones, and system announcements</p>
        </div>
        
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            Mark All as Read ({unreadCount})
          </button>
        )}
      </div>

      {/* Search */}
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search alerts..."
          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <svg className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      {/* Filter Tabs */}
      <FilterTabs 
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        unreadCount={unreadCount}
      />

      {/* Alerts List */}
      <div className="space-y-4">
        {filteredAlerts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📭</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No alerts found</h3>
            <p className="text-gray-600">
              {searchQuery ? "Try adjusting your search terms" : "You're all caught up! No new alerts at this time."}
            </p>
          </div>
        ) : (
          filteredAlerts.map((alert) => (
            <AlertCard
              key={alert.id}
              alert={alert}
              onMarkAsRead={markAsRead}
              onAction={handleAlertAction}
            />
          ))
        )}
      </div>

      {/* Summary Stats */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-gray-900">{alerts.length}</div>
            <div className="text-sm text-gray-600">Total Alerts</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600">{unreadCount}</div>
            <div className="text-sm text-gray-600">Unread</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">
              {alerts.filter(a => a.category === "project").length}
            </div>
            <div className="text-sm text-gray-600">Project Updates</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">
              {alerts.filter(a => a.category === "budget").length}
            </div>
            <div className="text-sm text-gray-600">Budget Alerts</div>
          </div>
        </div>
      </div>
    </div>
  );
}
