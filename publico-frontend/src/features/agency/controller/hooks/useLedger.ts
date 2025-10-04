import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { fetchLedger } from "@agency/services/agencyService";

export default function useLedger(limit = 5) {
  const socketRef = useRef<Socket | null>(null);
  const [ledgers, setLedgers] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("publico_auth_token");
  const storage = localStorage.getItem("publico_user_data");
  const agencyId = storage ? JSON.parse(storage).user.user_id : null;

  const loadLedgers = async () => {
    if (!agencyId) return;
    setLoading(true);
    try {
      const data = await fetchLedger(page, limit);
      setLedgers(data.data || []);
      setTotalPages(data.pagination?.totalPages || 1);
    } catch (err) {
      console.error("Failed to fetch ledger:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!agencyId) return;

    const socket = io("http://localhost:3001", { auth: { token } });
    socketRef.current = socket;
    socket.on('ledgers', (newLedger: any) => {
    console.log("📥 New ledger received:", newLedger);

      if (page === 1) {
        setLedgers(prev => [newLedger, ...prev.slice(0, limit - 1)]);
      }

      setTotalPages(prev => prev + 1);
    });

    return () => {
      socket.disconnect();
    };
  }, [agencyId, limit, page, token]);

  useEffect(() => {
    loadLedgers();
  }, [page]);

  return {
    ledgers,
    page,
    totalPages,
    setPage,
    isLoading: loading,
  };
}
