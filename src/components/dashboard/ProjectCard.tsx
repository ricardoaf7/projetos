import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Activity } from 'lucide-react';
import { Project } from '../../types';

interface ProjectCardProps {
  project: Project;
  onClick: (id: string) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick }) => {
  return (
    <motion.div
      layoutId={`card-${project.id}`}
      onClick={() => onClick(project.id)}
      className="group relative overflow-hidden rounded-3xl bg-white/30 backdrop-blur-md border border-white/20 shadow-xl cursor-pointer"
      whileHover={{ scale: 1.02, y: -5 }}
      transition={{ duration: 0.3 }}
    >
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={project.imageUrl} 
          alt={project.title} 
          className="w-full h-full object-cover opacity-10 group-hover:opacity-20 transition-opacity duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-white/10 backdrop-blur-[2px]" />
      </div>

      <div className="relative z-10 p-8 flex flex-col h-full">
        <div className="flex justify-between items-start mb-6">
          <div className="p-3 bg-white/50 rounded-2xl shadow-sm backdrop-blur-sm">
            <Activity className="w-6 h-6 text-slate-700" />
          </div>
          <div className="px-4 py-1.5 bg-white/60 rounded-full border border-white/40 shadow-sm backdrop-blur-md">
            <span className="text-sm font-semibold text-slate-700">{project.progress}% Completo</span>
          </div>
        </div>

        <h3 className="text-2xl font-bold text-slate-800 mb-2 leading-tight">
          {project.title}
        </h3>
        
        <p className="text-slate-600 mb-8 line-clamp-2">
          {project.description}
        </p>

        <div className="mt-auto">
          {/* Progress Bar */}
          <div className="w-full h-2 bg-slate-200/50 rounded-full overflow-hidden mb-6">
            <motion.div 
              className="h-full bg-gradient-to-r from-emerald-400 to-teal-500"
              initial={{ width: 0 }}
              animate={{ width: `${project.progress}%` }}
              transition={{ duration: 1.5, delay: 0.2 }}
            />
          </div>

          <div className="flex items-center text-slate-700 font-medium group-hover:text-emerald-600 transition-colors">
            Ver Detalhes
            <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};
