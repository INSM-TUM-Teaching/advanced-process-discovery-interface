import React, { createContext, useContext, useState } from 'react';
import type { ProjectData, ProjectContextType } from '@/types/project-types';

const ProjectContext = createContext<ProjectContextType | null>(null);

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [project, setProjectState] = useState<ProjectData | null>(null);

  const setProject = (data: ProjectData) => setProjectState(data);

  const updateProject = (partial: Partial<ProjectData>) => {
    setProjectState((prev) =>
      prev ? { ...prev, ...partial } : { ...(partial as ProjectData) }
    );
  };

  return (
    <ProjectContext.Provider value={{ project, setProject, updateProject }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjectStore = () => {
  const ctx = useContext(ProjectContext);
  if (!ctx) throw new Error('useProjectStore must be used within ProjectProvider');
  return ctx;
};