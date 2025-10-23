import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { fetchLedger } from "@agency/services/agencyService";

export default function useLedger() {
  const [ledgers, setLedgers] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [typeFilter, setTypeFilter] = useState<string>("All"); // optional filter (like department)
  const [dateRange, setDateRange] = useState<{ start: string; end: string } | null>(null);
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const limit = 5;
  const socketRef = useRef<Socket | null>(null);

  const token = localStorage.getItem("publico_auth_token");
  const storage = localStorage.getItem("publico_user_data");
  const agencyId = storage ? JSON.parse(storage).user.user_id : null;

  const loadLedgers = async (
    currentPage: number,
    status: string,
    search: string = "",
    department: string = "All",
    dateFilter: { start: string; end: string } | null = null
  ) => {
    if (!agencyId) return;
    setLoading(true);

    try {
      // When searching, date filtering, or status filtering — fetch all pages and paginate client-side
      if (search.trim() || dateFilter || status !== "All") {
        await loadAllLedgersForSearch(status, search, department, dateFilter, currentPage);
      } else {
        const data = await fetchLedger(currentPage, limit);
        let filtered = data.data || [];
        

        // Optional type filter (like department)
        if (department !== "All") {
          filtered = filtered.filter((item: any) => item.department === department);
        }

        setLedgers(filtered);
        setTotalPages(data.pagination?.totalPages || 1);
      }
    } catch (err) {
      console.error("Failed to fetch ledgers:", err);
      setLedgers([]);
    } finally {
      setLoading(false);
    }
  };

  const loadAllLedgersForSearch = async (
    status: string,
    search: string,
    type: string,
    dateFilter: { start: string; end: string } | null = null,
    currentPage: number = 1
  ) => {
    try {
      let allLedgers: any[] = [];
      let page = 1;
      let hasMore = true;

      while (hasMore) {
        const data = await fetchLedger(page, limit);
        if (data.data && data.data.length > 0) {
          allLedgers = [...allLedgers, ...data.data];
          page++;
          hasMore = page <= (data.pagination?.totalPages || 1);
        } else {
          hasMore = false;
        }
      }

      // Apply filters
      let filtered = allLedgers;

      if (search.trim()) {
        filtered = filtered.filter((ledger) => {
          const text = [
            ledger.id,
            ledger.projectName,
            ledger.amount,
            ledger.department,
          ]
            .join(" ")
            .toLowerCase();
          return text.includes(search.toLowerCase());
        });
      }

      if (status !== "All") {
        filtered = filtered.filter((ledger) => 
          ledger.status?.toLowerCase() === status.toLowerCase()
        );
      }

      if (type !== "All") {
        filtered = filtered.filter((ledger) => ledger.type === type);
      }

      if (dateFilter) {
        filtered = filtered.filter((ledger) => {
          const ledgerDate = new Date(ledger.createdAt);
          const startDate = new Date(dateFilter.start);
          const endDate = new Date(dateFilter.end);
          startDate.setHours(0, 0, 0, 0);
          endDate.setHours(23, 59, 59, 999);
          return ledgerDate >= startDate && ledgerDate <= endDate;
        });
      }

      // Calculate pagination
      const totalFilteredItems = filtered.length;
      const totalPages = Math.ceil(totalFilteredItems / limit);
      const startIndex = (currentPage - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedLedgers = filtered.slice(startIndex, endIndex);

      setLedgers(paginatedLedgers);
      setTotalPages(totalPages);
    } catch (err) {
      console.error("Failed to load all ledgers for search:", err);
      setLedgers([]);
    }
  };

  useEffect(() => {
    loadLedgers(page, statusFilter, searchQuery, typeFilter, dateRange);
  }, [page, statusFilter, searchQuery, typeFilter, dateRange]);

  useEffect(() => {
    if (!agencyId) return;

    const socket = io("http://localhost:3001", {
      auth: { token },
    });

    socketRef.current = socket;

    socket.on("ledgers", (newLedger: any) => {
      console.log("📥 New ledger received:", newLedger);

      if (page === 1 && statusFilter === "All") {
        setLedgers((prev) => [newLedger, ...prev.slice(0, limit - 1)]);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [agencyId, token, page, statusFilter]);

  // --- Utility handlers ---
  const handleStatusChange = (newStatus: string) => {
    setStatusFilter(newStatus);
    setPage(1);
  };

  const handleSearchChange = (newSearch: string) => {
    setSearchQuery(newSearch);
    setPage(1);
  };

  const handleTypeChange = (newType: string) => {
    setTypeFilter(newType);
    setPage(1);
  };

  const handleDateRangeChange = (start: string, end: string) => {
    setDateRange({ start, end });
    setPage(1);
  };

  const clearDateRange = () => {
    setDateRange(null);
    setPage(1);
  };

  const toggleDatePicker = () => {
    setShowDatePicker(!showDatePicker);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const refreshLedgers = () => {
    loadLedgers(page, statusFilter, searchQuery, typeFilter, dateRange);
  };

  const fetchAllLedgersForExport = async (): Promise<any[]> => {
    if (!agencyId) return [];
    
    try {
      let allLedgers: any[] = [];
      let currentPage = 1;
      let hasMore = true;

      while (hasMore) {
        const data = await fetchLedger(currentPage, limit);
        if (data.data && data.data.length > 0) {
          allLedgers = [...allLedgers, ...data.data];
          currentPage++;
          hasMore = currentPage <= (data.pagination?.totalPages || 1);
        } else {
          hasMore = false;
        }
      }

      // Apply current filters to all data
      let filtered = allLedgers;

      if (searchQuery.trim()) {
        filtered = filtered.filter((ledger) => {
          const text = [
            ledger.txId,
            ledger.id,
            ledger.projectName,
            ledger.amount,
            ledger.department,
            ledger.agencyId?.name,
            ledger.agencyId?.email,
          ]
            .join(" ")
            .toLowerCase();
          return text.includes(searchQuery.toLowerCase());
        });
      }

      if (statusFilter !== "All") {
        filtered = filtered.filter((ledger) => 
          ledger.status?.toLowerCase() === statusFilter.toLowerCase()
        );
      }

      if (typeFilter !== "All") {
        filtered = filtered.filter((ledger) => ledger.department === typeFilter);
      }

      if (dateRange) {
        filtered = filtered.filter((ledger) => {
          const ledgerDate = new Date(ledger.createdAt);
          const startDate = new Date(dateRange.start);
          const endDate = new Date(dateRange.end);
          startDate.setHours(0, 0, 0, 0);
          endDate.setHours(23, 59, 59, 999);
          return ledgerDate >= startDate && ledgerDate <= endDate;
        });
      }

      return filtered;
    } catch (err) {
      console.error("Failed to fetch all ledgers for export:", err);
      return [];
    }
  };

  return {
    ledgers,
    page,
    totalPages,
    loading,
    statusFilter,
    searchQuery,
    typeFilter,
    dateRange,
    showDatePicker,
    handleStatusChange,
    handleSearchChange,
    handleTypeChange,
    handleDateRangeChange,
    clearDateRange,
    toggleDatePicker,
    handlePageChange,
    refreshLedgers,
    fetchAllLedgersForExport,
    setPage
  };
}
