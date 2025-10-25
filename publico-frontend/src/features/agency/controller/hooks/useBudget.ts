import { BudgetFormProps } from '@/interfaces/budget';
import { Milestone } from '@/interfaces/user';
import { fetchProjectsProposed, sendBudgetProposal } from '@agency/services/agencyService';
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
    { id: "1", title: "", targetDate: "", budget: "", budgetPercentage: 0, deliverables: "" },
  ])
  const [totalBudget, setTotalBudget] = useState<number>(0)
  const [usePercentageMode, setUsePercentageMode] = useState<boolean>(true)

  const addMilestone = () => {
    const newId = (milestones.length + 1).toString()
    setMilestones([...milestones, { id: newId, title: "", targetDate: "", budget: "", budgetPercentage: 0, deliverables: "" }])
  }

  const removeMilestone = (id: string) => {
    if (milestones.length > 1) {
      setMilestones(milestones.filter((m) => m.id !== id))
    }
  }

  const updateMilestone = (id: string, field: keyof Milestone, value: string | number) => {
    setMilestones(milestones.map((m) => (m.id === id ? { ...m, [field]: value } : m)))
  }

  // Calculate total percentage
  const calculateTotalPercentage = () => {
    return milestones.reduce((sum, m) => sum + (m.budgetPercentage || 0), 0)
  }

  // Auto-distribute budget equally across milestones
  const autoDistributeEqually = () => {
    const percentage = milestones.length > 0 ? Math.floor(100 / milestones.length) : 0
    const remainder = 100 - (percentage * milestones.length)
    
    setMilestones(milestones.map((m, index) => ({
      ...m,
      budgetPercentage: index === 0 ? percentage + remainder : percentage,
      budget: totalBudget > 0 ? String(Math.round((totalBudget * (index === 0 ? percentage + remainder : percentage)) / 100)) : ""
    })))
  }

  // Update budget based on percentage
  const updateBudgetFromPercentage = (id: string, percentage: number) => {
    setMilestones(milestones.map((m) => {
      if (m.id === id) {
        const calculatedBudget = totalBudget > 0 ? Math.round((totalBudget * percentage) / 100) : 0
        return { ...m, budgetPercentage: percentage, budget: String(calculatedBudget) }
      }
      return m
    }))
  }

  // Update percentage based on budget
  const updatePercentageFromBudget = (id: string, budget: string) => {
    const budgetNum = parseFloat(budget) || 0
    const percentage = totalBudget > 0 ? Math.round((budgetNum / totalBudget) * 100) : 0
    
    setMilestones(milestones.map((m) => {
      if (m.id === id) {
        return { ...m, budget, budgetPercentage: percentage }
      }
      return m
    }))
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
    
    // Validate milestones
    if (milestones.length === 0) {
      toast.error("Please add at least one milestone/phase.");
      setIsLoading(false);
      return;
    }

    // Validate that total percentage equals 100%
    const totalPercentage = calculateTotalPercentage()
    if (Math.abs(totalPercentage - 100) > 0.1) { // Allow small rounding errors
      toast.error(`Total budget percentage must equal 100%. Currently: ${totalPercentage.toFixed(1)}%`);
      setIsLoading(false);
      return;
    }

    // Validate all milestones have required fields
    const invalidMilestones = milestones.filter(m => 
      !m.title || !m.targetDate || !m.budget || !m.deliverables
    )
    if (invalidMilestones.length > 0) {
      toast.error("Please fill in all milestone fields.");
      setIsLoading(false);
      return;
    }

    // 👇 include milestones with percentage data
    await sendBudgetProposal(data, files, milestones);
    reset();
    setFiles([]);
    setMilestones([{ id: "1", title: "", targetDate: "", budget: "", budgetPercentage: 0, deliverables: "" }]);
    setTotalBudget(0);

    toast.success("Budget proposed successfully with automatic phase distribution.");
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
    const socket = io('http://localhost:5000', {
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
    milestones,
    totalBudget,
    setTotalBudget,
    usePercentageMode,
    setUsePercentageMode,
    calculateTotalPercentage,
    autoDistributeEqually,
    updateBudgetFromPercentage,
    updatePercentageFromBudget
  };
}
