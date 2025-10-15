import { useState, useEffect, useCallback } from 'react';
import { 
  milestoneService, 
  ProjectMilestone, 
  CreateMilestoneRequest, 
  StartPhaseRequest, 
  UploadProofRequest, 
  VerifyProofRequest, 
  UpdateProgressRequest,
  Alert 
} from '../../services/milestoneService';
import { AdminService } from '../../services/admin.api';
import { BudgetProposal } from '../../model/types/admin';

export const useProjectMilestones = (agencyId: string = 'all') => {
  const [milestones, setMilestones] = useState<ProjectMilestone[]>([]);
  const [budgetProjects, setBudgetProjects] = useState<BudgetProposal[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0
  });

  const fetchMilestones = useCallback(async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    department?: string;
  }) => {
    try {
      setLoading(true);
      setError(null);
      const response = await milestoneService.getMilestones(agencyId, params);
      setMilestones(response.data);
      setPagination({
        currentPage: response.currentPage,
        totalPages: response.totalPages,
        totalItems: response.totalItems
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch milestones');
    } finally {
      setLoading(false);
    }
  }, [agencyId]);

  const fetchBudgetProjects = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const projects = await AdminService.getBudgetProjects();
      setBudgetProjects(projects);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch budget projects');
    } finally {
      setLoading(false);
    }
  }, []);

  const createMilestone = useCallback(async (data: CreateMilestoneRequest) => {
    try {
      setLoading(true);
      setError(null);
      const newMilestone = await milestoneService.createMilestone(data);
      setMilestones(prev => [newMilestone, ...prev]);
      return newMilestone;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create milestone');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const startPhase = useCallback(async (data: StartPhaseRequest) => {
    try {
      setLoading(true);
      setError(null);
      const result = await milestoneService.startPhase(data);
      
      // Update the milestone in the list
      setMilestones(prev => prev.map(milestone => 
        milestone._id === data.milestoneId 
          ? {
              ...milestone,
              phases: milestone.phases.map(phase => 
                phase.phaseNumber === data.phaseNumber 
                  ? { ...phase, ...result.phase }
                  : phase
              )
            }
          : milestone
      ));
      
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start phase');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const uploadProof = useCallback(async (data: UploadProofRequest) => {
    try {
      setLoading(true);
      setError(null);
      const result = await milestoneService.uploadProof(data);
      
      // Update the milestone in the list
      setMilestones(prev => prev.map(milestone => 
        milestone._id === data.milestoneId 
          ? {
              ...milestone,
              phases: milestone.phases.map(phase => 
                phase.phaseNumber === data.phaseNumber 
                  ? {
                      ...phase,
                      proofOfWork: [...phase.proofOfWork, result.proofOfWork]
                    }
                  : phase
              )
            }
          : milestone
      ));
      
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload proof');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const verifyProof = useCallback(async (data: VerifyProofRequest) => {
    try {
      setLoading(true);
      setError(null);
      const result = await milestoneService.verifyProof(data);
      
      // Update the milestone in the list
      setMilestones(prev => prev.map(milestone => 
        milestone._id === data.milestoneId 
          ? {
              ...milestone,
              phases: milestone.phases.map(phase => 
                phase.phaseNumber === data.phaseNumber 
                  ? {
                      ...phase,
                      proofOfWork: phase.proofOfWork.map(proof => 
                        proof.documentId === data.documentId 
                          ? { ...proof, ...result.proofOfWork }
                          : proof
                      )
                    }
                  : phase
              )
            }
          : milestone
      ));
      
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to verify proof');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProgress = useCallback(async (data: UpdateProgressRequest) => {
    try {
      setLoading(true);
      setError(null);
      const result = await milestoneService.updateProgress(data);
      
      // Update the milestone in the list
      setMilestones(prev => prev.map(milestone => 
        milestone._id === data.milestoneId 
          ? {
              ...milestone,
              phases: milestone.phases.map(phase => 
                phase.phaseNumber === data.phaseNumber 
                  ? { ...phase, ...result.phase }
                  : phase
              )
            }
          : milestone
      ));
      
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update progress');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMilestones();
    fetchBudgetProjects();
  }, [fetchMilestones, fetchBudgetProjects]);

  return {
    milestones,
    budgetProjects,
    loading,
    error,
    pagination,
    fetchMilestones,
    fetchBudgetProjects,
    createMilestone,
    startPhase,
    uploadProof,
    verifyProof,
    updateProgress,
    refetch: () => fetchMilestones()
  };
};

export const useProjectMilestone = (milestoneId: string) => {
  const [milestone, setMilestone] = useState<ProjectMilestone | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const fetchMilestone = useCallback(async () => {
    if (!milestoneId) return;
    
    try {
      setLoading(true);
      setError(null);
      const [milestoneData, alertsData] = await Promise.all([
        milestoneService.getMilestoneById(milestoneId),
        milestoneService.getMilestoneAlerts(milestoneId)
      ]);
      setMilestone(milestoneData);
      setAlerts(alertsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch milestone');
    } finally {
      setLoading(false);
    }
  }, [milestoneId]);

  const markAlertAsRead = useCallback(async (alertIndex: number) => {
    try {
      await milestoneService.markAlertAsRead(milestoneId, alertIndex);
      setAlerts(prev => prev.map((alert, index) => 
        index === alertIndex ? { ...alert, isRead: true } : alert
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to mark alert as read');
    }
  }, [milestoneId]);

  useEffect(() => {
    fetchMilestone();
  }, [fetchMilestone]);

  return {
    milestone,
    alerts,
    loading,
    error,
    fetchMilestone,
    markAlertAsRead,
    refetch: fetchMilestone
  };
};
