import { Project, sampleProjects } from "../model/types/projectTypes";

export const ProjectService = {
  getAll: async (): Promise<Project[]> => sampleProjects,
  getOne: async (id:string): Promise<Project | undefined> =>
    sampleProjects.find(p => p.id === id),
};
