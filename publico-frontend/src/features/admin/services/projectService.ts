// This service is deprecated - use milestoneService instead
// Keeping for backward compatibility but should be removed
export const ProjectService = {
  getAll: async (): Promise<any[]> => {
    console.warn('ProjectService.getAll is deprecated. Use milestoneService.getMilestones instead.');
    return [];
  },
  getOne: async (id: string): Promise<any | undefined> => {
    console.warn('ProjectService.getOne is deprecated. Use milestoneService.getMilestoneById instead.');
    return undefined;
  },
};
