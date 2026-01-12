import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Building2, Calendar } from 'lucide-react';
import { Project } from '../../types';

interface ProjectCardProps {
  project: Project;
  onClick: (id: string) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick }) => {
  // Determine status color based on progress
  const getStatusColor = (progress: number) => {
    if (progress === 100) return 'bg-emerald-100 text-emerald-700';
    if (progress > 50) return 'bg-blue-100 text-blue-700';
    return 'bg-amber-100 text-amber-700';
  };

  const getStatusText = (progress: number) => {
    if (progress === 100) return 'Concluído';
    if (progress > 0) return 'Em Andamento';
    return 'Não Iniciado';
  };

  return (
    <motion.div
      layoutId={`card-${project.id}`}
      onClick={() => onClick(project.id)}
      className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md cursor-pointer transition-all duration-300 flex flex-col h-full overflow-hidden"
      whileHover={{ y: -4 }}
    >
      <div className="p-6 flex flex-col h-full">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="p-2.5 bg-slate-50 rounded-xl text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
            <Building2 className="w-6 h-6" />
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(project.progress)}`}>
            {getStatusText(project.progress)}
          </span>
        </div>

        {/* Content */}
        <div className="mb-6 flex-grow">
          <h3 className="text-lg font-bold text-slate-800 mb-2 leading-tight group-hover:text-blue-600 transition-colors">
            {project.title}
          </h3>
          <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed">
            {project.description}
          </p>
        </div>

        {/* Footer info */}
        <div className="mt-auto space-y-4">
          {/* Progress Bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-slate-500">Progresso</span>
              <span className="text-slate-700">{project.progress}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-blue-600 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${project.progress}%` }}
                transition={{ duration: 1, delay: 0.2 }}
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
            <div className="flex items-center text-xs text-slate-400 gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>Atualizado recentemente</span>
            </div>
            <div className="flex items-center text-blue-600 text-sm font-semibold opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all duration-300">
              Detalhes
              <ArrowRight className="w-4 h-4 ml-1" />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
