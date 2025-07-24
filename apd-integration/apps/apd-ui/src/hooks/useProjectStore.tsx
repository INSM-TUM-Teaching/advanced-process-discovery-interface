import React, { createContext, useContext, useEffect, useState } from 'react';
import type { ProjectData, ProjectContextType } from '@/types/project-types';

const ProjectContext = createContext<ProjectContextType | null>(null);
const STORAGE_KEY = 'currentProject';

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [project, setProjectState] = useState<ProjectData | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setProjectState(JSON.parse(stored));
    }
  }, []);

  const setProject = (data: ProjectData) => {
    setProjectState(data);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  };

  const updateProject = (partial: Partial<ProjectData>) => {
    setProjectState((prev) => {
      const updated = prev ? { ...prev, ...partial } : { ...(partial as ProjectData) };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const clearProject = () => {
    setProjectState(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <ProjectContext.Provider value={{ project, setProject, updateProject, clearProject }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjectStore = () => {
  const ctx = useContext(ProjectContext);
  if (!ctx) throw new Error('useProjectStore must be used within ProjectProvider');
  return ctx;
};
