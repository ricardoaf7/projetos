import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Project } from '../types';

export const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select('*')
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
  }, []);

  return { projects, loading, error, refetch: fetchProjects };
};

export const useProject = (id: string | undefined) => {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchProject = async () => {
      try {
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

    fetchProject();
  }, [id]);

  return { project, loading, error };
};
