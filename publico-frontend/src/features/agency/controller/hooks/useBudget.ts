import { fetchProjectsProposed, sendBudgetProposal } from '@agency/services/agencyService';
import { BudgetFormProps } from 'interfaces/budget';
import { useEffect, useRef, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { io, Socket } from 'socket.io-client';

export default function useBudget() {
  const [isLoading, setIsLoading] = useState(false);
  const [fetchedData, setFetchedData] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [limit] = useState(10);

  const socketRef = useRef<Socket | null>(null);
  const token = localStorage.getItem('publico_auth_token');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BudgetFormProps>({
    defaultValues: {
      projectName: '',
      department: '',
      category: '',
      amountRequested: '',
      endDate: '',
      startDate: '',
    },
  });

  const onSubmit: SubmitHandler<BudgetFormProps> = async (data) => {
    try {
      setIsLoading(true);
      await sendBudgetProposal(data);
      reset();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadData = async (currentPage: number) => {
    try {
      const result = await fetchProjectsProposed(currentPage, limit);

      setFetchedData((prev) =>
        currentPage === 1 ? result.data : [...prev, ...result.data]
      );

      setHasMore(currentPage < result.totalPages);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadData(page);
  }, [page]);

  useEffect(() => {
    const socket = io('http://localhost:3001', {
      auth: { token },
    });

    socketRef.current = socket;

    socket.on('new_submited', (newData) => {
      setFetchedData((prev) => [newData, ...prev]);
    });

    socket.on('data', () => {
      setPage(1);
    });

    return () => {
      socket.disconnect();
    };
  }, [token]);

  const loadMore = () => {
    if (hasMore && !isLoading) {
      setPage((prev) => prev + 1);
    }
  };

  return {
    register,
    handleSubmit,
    errors,
    onSubmit,
    isLoading,
    fetchedData,
    hasMore,
    loadMore,
    page,
  };
}
