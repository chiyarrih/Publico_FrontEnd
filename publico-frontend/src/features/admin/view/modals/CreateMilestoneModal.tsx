import React, { useState, useEffect } from 'react';
import { Panel, Pill } from '../ui/kit';
import { useProjectMilestones } from '../../controller/hooks/useProjectMilestones';
import { CreateMilestoneRequest } from '../../services/milestoneService';

interface Phase {
  phaseName: string;
  description: string;
  budget: number;
  startDate: string;
  endDate: string;
  requiredDocuments: Array<{
    documentType: string;
    description: string;
    isRequired: boolean;
  }>;
}

interface BudgetProject {
  _id: string;
  projectName: string;
  department: string;
  amountRequested: number;
  timeline: string;
  status: string;
}

interface CreateMilestoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  budgetProjects: BudgetProject[];
}

const CreateMilestoneModal: React.FC<CreateMilestoneModalProps> = ({
  isOpen,
  onClose,
  budgetProjects
}) => {
  const { createMilestone } = useProjectMilestones();
  const [selectedProject, setSelectedProject] = useState<BudgetProject | null>(null);
  const [phases, setPhases] = useState<Phase[]>([
    {
      phaseName: 'Planning',
      description: 'Project planning and preparation phase',
      budget: 0,
      startDate: '',
      endDate: '',
      requiredDocuments: [
        { documentType: 'Project Plan', description: 'Detailed project plan document', isRequired: true },
        { documentType: 'Budget Breakdown', description: 'Detailed budget allocation', isRequired: true }
      ]
    },
    {
      phaseName: 'Procurement',
      description: 'Materials and equipment procurement phase',
      budget: 0,
      startDate: '',
      endDate: '',
      requiredDocuments: [
        { documentType: 'Purchase Orders', description: 'Purchase orders for materials', isRequired: true },
        { documentType: 'Receipts', description: 'Receipts for all purchases', isRequired: true },
        { documentType: 'Contracts', description: 'Service contracts and agreements', isRequired: true }
      ]
    },
    {
      phaseName: 'Construction',
      description: 'Main construction and implementation phase',
      budget: 0,
      startDate: '',
      endDate: '',
      requiredDocuments: [
        { documentType: 'Progress Reports', description: 'Weekly progress reports', isRequired: true },
        { documentType: 'Quality Inspections', description: 'Quality inspection reports', isRequired: true },
        { documentType: 'Photos', description: 'Progress photos and documentation', isRequired: true }
      ]
    },
    {
      phaseName: 'Completion',
      description: 'Final completion and handover phase',
      budget: 0,
      startDate: '',
      endDate: '',
      requiredDocuments: [
        { documentType: 'Final Report', description: 'Project completion report', isRequired: true },
        { documentType: 'Handover Documents', description: 'Project handover documentation', isRequired: true },
        { documentType: 'Warranty', description: 'Warranty and maintenance documents', isRequired: true }
      ]
    }
  ]);
  const [proposedBy, setProposedBy] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const approvedProjects = budgetProjects.filter(p => p.status === 'Approved');

  const handleProjectSelect = (project: BudgetProject) => {
    setSelectedProject(project);
    
    // Auto-calculate phase budgets (can be adjusted)
    const totalBudget = project.amountRequested;
    const phaseBudgets = [
      totalBudget * 0.12, // Planning: 12%
      totalBudget * 0.32, // Procurement: 32%
      totalBudget * 0.48, // Construction: 48%
      totalBudget * 0.08  // Completion: 8%
    ];

    setPhases(prev => prev.map((phase, index) => ({
      ...phase,
      budget: Math.round(phaseBudgets[index])
    })));

    // Set timeline based on project timeline
    const startDate = new Date();
    const endDate = new Date(project.timeline);
    const phaseDuration = (endDate.getTime() - startDate.getTime()) / 4; // Divide into 4 phases

    setPhases(prev => prev.map((phase, index) => {
      const phaseStart = new Date(startDate.getTime() + (phaseDuration * index));
      const phaseEnd = new Date(startDate.getTime() + (phaseDuration * (index + 1)));
      
      return {
        ...phase,
        startDate: phaseStart.toISOString().split('T')[0],
        endDate: phaseEnd.toISOString().split('T')[0]
      };
    }));
  };

  const handlePhaseChange = (index: number, field: keyof Phase, value: any) => {
    setPhases(prev => prev.map((phase, i) => 
      i === index ? { ...phase, [field]: value } : phase
    ));
  };

  const handleDocumentChange = (phaseIndex: number, docIndex: number, field: string, value: any) => {
    setPhases(prev => prev.map((phase, i) => 
      i === phaseIndex 
        ? {
            ...phase,
            requiredDocuments: phase.requiredDocuments.map((doc, j) => 
              j === docIndex ? { ...doc, [field]: value } : doc
            )
          }
        : phase
    ));
  };

  const addDocument = (phaseIndex: number) => {
    setPhases(prev => prev.map((phase, i) => 
      i === phaseIndex 
        ? {
            ...phase,
            requiredDocuments: [
              ...phase.requiredDocuments,
              { documentType: '', description: '', isRequired: true }
            ]
          }
        : phase
    ));
  };

  const removeDocument = (phaseIndex: number, docIndex: number) => {
    setPhases(prev => prev.map((phase, i) => 
      i === phaseIndex 
        ? {
            ...phase,
            requiredDocuments: phase.requiredDocuments.filter((_, j) => j !== docIndex)
          }
        : phase
    ));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedProject) {
      setError('Please select a project');
      return;
    }

    if (phases.some(phase => !phase.phaseName || !phase.description || phase.budget <= 0)) {
      setError('Please fill in all phase details');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const request: CreateMilestoneRequest = {
        projectId: selectedProject._id,
        phases: phases.map(phase => ({
          phaseName: phase.phaseName,
          description: phase.description,
          budget: phase.budget,
          spent: 0,
          progress: 0,
          status: 'Pending' as const,
          startDate: phase.startDate,
          endDate: phase.endDate,
          requiredDocuments: phase.requiredDocuments
        })),
        proposedBy
      };

      await createMilestone(request);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create milestone');
    } finally {
      setLoading(false);
    }
  };

  const totalBudget = phases.reduce((sum, phase) => sum + phase.budget, 0);
  const budgetDifference = selectedProject ? selectedProject.amountRequested - totalBudget : 0;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Create Project Milestone</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Project Selection */}
            <Panel>
              <h3 className="text-lg font-medium mb-4">Select Project</h3>
              <div className="space-y-2">
                {approvedProjects.map(project => (
                  <div
                    key={project._id}
                    className={`p-3 border rounded cursor-pointer ${
                      selectedProject?._id === project._id 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleProjectSelect(project)}
                  >
                    <div className="font-medium">{project.projectName}</div>
                    <div className="text-sm text-gray-600">
                      {project.department} • ₱{project.amountRequested.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </Panel>

            {selectedProject && (
              <>
                {/* Proposed By */}
                <Panel>
                  <h3 className="text-lg font-medium mb-4">Project Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Proposed By
                      </label>
                      <input
                        type="text"
                        value={proposedBy}
                        onChange={(e) => setProposedBy(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                        placeholder="Enter name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Total Budget
                      </label>
                      <div className="px-3 py-2 bg-gray-50 rounded">
                        ₱{selectedProject.amountRequested.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </Panel>

                {/* Phases */}
                <Panel>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium">Project Phases</h3>
                    <div className="text-sm text-gray-600">
                      Total: ₱{totalBudget.toLocaleString()} 
                      {budgetDifference !== 0 && (
                        <span className={`ml-2 ${budgetDifference > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          ({budgetDifference > 0 ? '+' : ''}₱{budgetDifference.toLocaleString()})
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-6">
                    {phases.map((phase, phaseIndex) => (
                      <div key={phaseIndex} className="border rounded p-4">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-medium">Phase {phaseIndex + 1}: {phase.phaseName}</h4>
                          <Pill tone="blue">₱{phase.budget.toLocaleString()}</Pill>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Phase Name
                            </label>
                            <input
                              type="text"
                              value={phase.phaseName}
                              onChange={(e) => handlePhaseChange(phaseIndex, 'phaseName', e.target.value)}
                              className="w-full border rounded px-3 py-2"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Budget (₱)
                            </label>
                            <input
                              type="number"
                              value={phase.budget}
                              onChange={(e) => handlePhaseChange(phaseIndex, 'budget', parseInt(e.target.value) || 0)}
                              className="w-full border rounded px-3 py-2"
                              required
                            />
                          </div>
                        </div>

                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                          </label>
                          <textarea
                            value={phase.description}
                            onChange={(e) => handlePhaseChange(phaseIndex, 'description', e.target.value)}
                            className="w-full border rounded px-3 py-2"
                            rows={2}
                            required
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Start Date
                            </label>
                            <input
                              type="date"
                              value={phase.startDate}
                              onChange={(e) => handlePhaseChange(phaseIndex, 'startDate', e.target.value)}
                              className="w-full border rounded px-3 py-2"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              End Date
                            </label>
                            <input
                              type="date"
                              value={phase.endDate}
                              onChange={(e) => handlePhaseChange(phaseIndex, 'endDate', e.target.value)}
                              className="w-full border rounded px-3 py-2"
                              required
                            />
                          </div>
                        </div>

                        {/* Required Documents */}
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <label className="block text-sm font-medium text-gray-700">
                              Required Documents
                            </label>
                            <button
                              type="button"
                              onClick={() => addDocument(phaseIndex)}
                              className="text-blue-600 hover:text-blue-700 text-sm"
                            >
                              + Add Document
                            </button>
                          </div>
                          <div className="space-y-2">
                            {phase.requiredDocuments.map((doc, docIndex) => (
                              <div key={docIndex} className="flex gap-2">
                                <input
                                  type="text"
                                  value={doc.documentType}
                                  onChange={(e) => handleDocumentChange(phaseIndex, docIndex, 'documentType', e.target.value)}
                                  placeholder="Document type"
                                  className="flex-1 border rounded px-3 py-2 text-sm"
                                />
                                <input
                                  type="text"
                                  value={doc.description}
                                  onChange={(e) => handleDocumentChange(phaseIndex, docIndex, 'description', e.target.value)}
                                  placeholder="Description"
                                  className="flex-1 border rounded px-3 py-2 text-sm"
                                />
                                <label className="flex items-center gap-1 text-sm">
                                  <input
                                    type="checkbox"
                                    checked={doc.isRequired}
                                    onChange={(e) => handleDocumentChange(phaseIndex, docIndex, 'isRequired', e.target.checked)}
                                  />
                                  Required
                                </label>
                                <button
                                  type="button"
                                  onClick={() => removeDocument(phaseIndex, docIndex)}
                                  className="text-red-600 hover:text-red-700 px-2"
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Panel>
              </>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border rounded hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !selectedProject}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Milestone'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateMilestoneModal;
