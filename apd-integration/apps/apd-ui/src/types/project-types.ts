import type { Matrix, Thresholds } from './matrix-types'

export  type EndpointPair = {
    activity: string;
    structure: string;
    declare: string;
  };

type EventLog = {
  log: File,
  name: string
}

export type ProjectData = {
    name: string;
    modelsCount: number;
    logs: EventLog[];
    endpoints: EndpointPair[];
    thresholds: Thresholds[];
    compare: boolean;
    matrix?: Matrix;
  };

export type ProjectContextType = {
  project: ProjectData | null;
  setProject: (data: ProjectData) => void;
  updateProject: (partial: Partial<ProjectData>) => void;
};

export type Step = 'matrix' | 'classification' | 'model';