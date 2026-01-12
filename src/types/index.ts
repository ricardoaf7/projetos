export type ProjectStatus = 'completed' | 'in-progress' | 'pending';

export interface TimelineStep {
  id: string;
  title: string;
  status: ProjectStatus;
  topAnnotation?: string;
  bottomAnnotation?: string;
  isCurrent?: boolean;
  responsibleAgency?: string;
  responsibleSector?: string;
  startDate?: string;
  completionForecast?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  progress: number;
  imageUrl?: string;
  steps: TimelineStep[];
  currentStepDetails?: {
    responsible: string;
    deadline: string;
    notes: string;
  };
}
