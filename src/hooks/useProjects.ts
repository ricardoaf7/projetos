import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Project } from '../types';
import { useAudit } from './useAudit';

export const useProjects = (statusFilter: 'active' | 'archived' = 'active') => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { logAction } = useAudit();

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select('*')
        .eq('status', statusFilter)
        .order('created_at', { ascending: false });

      if (projectsError) throw projectsError;

      if (!projectsData || projectsData.length === 0) {
        setProjects([]);
        return;
      }

      const projectIds = projectsData.map(p => p.id);
      const { data: stepsData, error: stepsError } = await supabase
        .from('project_steps')
        .select('*')
        .in('project_id', projectIds)
        .order('order_index', { ascending: true });

      if (stepsError) throw stepsError;

      const formattedProjects: Project[] = projectsData.map(p => {
        const projectSteps = stepsData
          ?.filter(s => s.project_id === p.id)
          .map(s => ({
            id: s.id,
            title: s.title,
            status: s.status,
            isCurrent: s.is_current,
            topAnnotation: s.top_annotation || undefined,
            bottomAnnotation: s.bottom_annotation || undefined,
            responsibleAgency: s.responsible_agency || undefined,
            responsibleSector: s.responsible_sector || undefined,
            startDate: s.start_date || undefined,
            completionForecast: s.completion_forecast || undefined,
          })) || [];

        return {
          id: p.id,
          title: p.title,
          description: p.description,
          progress: p.progress,
          imageUrl: p.image_url || undefined,
          steps: projectSteps,
          currentStepDetails: p.current_responsible ? {
            responsible: p.current_responsible,
            deadline: p.current_deadline,
            notes: p.current_notes
          } : undefined
        };
      });

      setProjects(formattedProjects);
    } catch (err: any) {
      console.error('Error fetching projects:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [statusFilter]);

  const archiveProject = async (projectId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('projects')
        .update({ status: 'archived' })
        .eq('id', projectId);

      if (error) throw error;
      
      await logAction('ARCHIVE', 'PROJECT', projectId);
      fetchProjects();
      return true;
    } catch (err: any) {
      console.error('Error archiving project:', err);
      setError(err.message);
      return false;
    }
  };

  const deleteProject = async (projectId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);

      if (error) throw error;
      
      await logAction('DELETE', 'PROJECT', projectId);
      fetchProjects();
      return true;
    } catch (err: any) {
      console.error('Error deleting project:', err);
      setError(err.message);
      return false;
    }
  };

  const restoreProject = async (projectId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('projects')
        .update({ status: 'active' })
        .eq('id', projectId);

      if (error) throw error;
      
      await logAction('UPDATE', 'PROJECT', projectId, { action: 'RESTORE' });
      fetchProjects();
      return true;
    } catch (err: any) {
      console.error('Error restoring project:', err);
      setError(err.message);
      return false;
    }
  };

  return { projects, loading, error, refetch: fetchProjects, archiveProject, deleteProject, restoreProject };
};

export const useProject = (id: string | undefined) => {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProject = async () => {
    try {
      if (!id) return;
      
      setLoading(true);
      setError(null);

      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();

      if (projectError) throw projectError;

      const { data: stepsData, error: stepsError } = await supabase
        .from('project_steps')
        .select('*')
        .eq('project_id', id)
        .order('order_index', { ascending: true });

      if (stepsError) throw stepsError;

      const formattedProject: Project = {
          id: projectData.id,
          title: projectData.title,
          description: projectData.description,
          progress: projectData.progress,
          imageUrl: projectData.image_url || undefined,
          steps: stepsData.map(s => ({
            id: s.id,
            title: s.title,
            status: s.status,
            isCurrent: s.is_current,
            topAnnotation: s.top_annotation || undefined,
            bottomAnnotation: s.bottom_annotation || undefined,
            responsibleAgency: s.responsible_agency || undefined,
            responsibleSector: s.responsible_sector || undefined,
            startDate: s.start_date || undefined,
            completionForecast: s.completion_forecast || undefined,
          })),
          currentStepDetails: projectData.current_responsible ? {
          responsible: projectData.current_responsible,
          deadline: projectData.current_deadline,
          notes: projectData.current_notes
        } : undefined
      };

      setProject(formattedProject);
    } catch (err: any) {
      console.error('Error fetching project:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!id) return;
    fetchProject();
  }, [id]);

  const addStep = async (stepData: {
    title: string;
    status: 'pending' | 'in-progress' | 'completed';
    topAnnotation?: string;
    bottomAnnotation?: string;
    responsibleAgency?: string;
    responsibleSector?: string;
    startDate?: string;
    completionForecast?: string;
  }): Promise<boolean> => {
    if (!id || !project) return false;

    try {
      // Calculate next order index
      const maxOrder = project.steps.length > 0 
        ? Math.max(...project.steps.map((_, i) => i + 1)) 
        : 0;
      
      const { error } = await supabase
        .from('project_steps')
        .insert([{
          project_id: id,
          title: stepData.title,
          status: stepData.status,
          top_annotation: stepData.topAnnotation,
          bottom_annotation: stepData.bottomAnnotation,
          responsible_agency: stepData.responsibleAgency,
          responsible_sector: stepData.responsibleSector,
          start_date: stepData.startDate,
          completion_forecast: stepData.completionForecast,
          order_index: maxOrder + 1,
          is_current: false // Default to false
        }]);

      if (error) throw error;
      
      // Refresh project data
      fetchProject();
      return true;
    } catch (err: any) {
      console.error('Error adding step:', err);
      setError(err.message);
      return false;
    }
  };

  const updateStep = async (stepId: string, updates: {
    title?: string;
    status?: 'pending' | 'in-progress' | 'completed';
    topAnnotation?: string;
    bottomAnnotation?: string;
    responsibleAgency?: string;
    responsibleSector?: string;
    startDate?: string;
    completionForecast?: string;
  }): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('project_steps')
        .update({
          title: updates.title,
          status: updates.status,
          top_annotation: updates.topAnnotation,
          bottom_annotation: updates.bottomAnnotation,
          responsible_agency: updates.responsibleAgency,
          responsible_sector: updates.responsibleSector,
          start_date: updates.startDate,
          completion_forecast: updates.completionForecast
        })
        .eq('id', stepId);

      if (error) throw error;
      fetchProject();
      return true;
    } catch (err: any) {
      console.error('Error updating step:', err);
      setError(err.message);
      return false;
    }
  };

  const deleteStep = async (stepId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('project_steps')
        .delete()
        .eq('id', stepId);

      if (error) throw error;
      fetchProject();
      return true;
    } catch (err: any) {
      console.error('Error deleting step:', err);
      setError(err.message);
      return false;
    }
  };

  const reorderSteps = async (orderedStepIds: string[]): Promise<boolean> => {
    try {
      // Use Promise.all to update each step individually to avoid NOT NULL constraints on other columns
      // when using upsert with incomplete data
      const updates = orderedStepIds.map((id, index) => 
        supabase
          .from('project_steps')
          .update({ order_index: index + 1 })
          .eq('id', id)
      );

      const results = await Promise.all(updates);
      
      // Check for errors
      const error = results.find(r => r.error)?.error;
      if (error) throw error;
      
      fetchProject();
      return true;
    } catch (err: any) {
      console.error('Error reordering steps:', err);
      setError(err.message);
      return false;
    }
  };

  return { project, loading, error, addStep, updateStep, deleteStep, reorderSteps };
};
