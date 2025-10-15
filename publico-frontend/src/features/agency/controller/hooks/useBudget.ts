import { fetchProjectsProposed, sendBudgetProposal } from '@agency/services/agencyService';
import { BudgetFormProps } from 'interfaces/budget';
import { Milestone } from 'interfaces/user';
import { useEffect, useRef, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import {toast} from 'react-hot-toast';
import { io, Socket } from 'socket.io-client';

export default function useBudget() {
  const [isLoading, setIsLoading] = useState(false);
  const [fetchedData, setFetchedData] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [limit] = useState(10);
  const [files, setFiles] = useState<File[]>([]);
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
      objectives: '',
    },
  });
  const [milestones, setMilestones] = useState<Milestone[]>([
    { id: "1", title: "", targetDate: "", budget: "", deliverables: "" },
  ])

  const addMilestone = () => {
    const newId = (milestones.length + 1).toString()
    setMilestones([...milestones, { id: newId, title: "", targetDate: "", budget: "", deliverables: "" }])
  }

  const removeMilestone = (id: string) => {
    if (milestones.length > 1) {
      setMilestones(milestones.filter((m) => m.id !== id))
    }
  }

  const updateMilestone = (id: string, field: keyof Milestone, value: string) => {
    setMilestones(milestones.map((m) => (m.id === id ? { ...m, [field]: value } : m)))
  }

  const handleDownload = async (url: string) => {
  try {
    const filename = url.split("/").pop() || "download";
    const response = await fetch(url, { mode: "cors" });
    const blob = await response.blob();
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (err) {
    console.error("Download failed:", err);
  }
};
const onSubmit: SubmitHandler<BudgetFormProps> = async (data) => {
  try {
    setIsLoading(true);
    // 👇 include milestones
    await sendBudgetProposal(data, files, milestones);
    reset();
    setFiles([]);
    toast.success("Budget proposed successfully.");
  } catch (error) {
    console.error(error);
    toast.error("Failed to submit budget proposal.");
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
    files,
    setFiles,
    handleDownload,
    addMilestone,
    removeMilestone,
    updateMilestone,
    milestones
  };
}
