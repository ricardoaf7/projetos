import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, User, FileText, Plus } from 'lucide-react';
import { Timeline } from '../components/timeline/Timeline';
import { AddStepModal } from '../components/timeline/AddStepModal';
import { EditStepModal } from '../components/timeline/EditStepModal';
import { useProject } from '../hooks/useProjects';
import { TimelineStep } from '../types';

export const ProjectDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isAddStepModalOpen, setIsAddStepModalOpen] = useState(false);
  const [editingStep, setEditingStep] = useState<TimelineStep | null>(null);
  
  const { project, loading, error, addStep, updateStep, deleteStep, reorderSteps } = useProject(id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">Projeto não encontrado</h2>
        <p className="text-slate-500 mb-8">{error || 'O projeto solicitado não existe.'}</p>
        <button 
          onClick={() => navigate('/')}
          className="px-6 py-3 bg-emerald-600 text-white rounded-full font-medium hover:bg-emerald-700 transition-colors"
        >
          Voltar ao Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center text-slate-600 hover:text-slate-900 transition-colors group"
          >
            <div className="p-2 rounded-full group-hover:bg-slate-100 transition-colors mr-2">
              <ArrowLeft className="w-5 h-5" />
            </div>
            <span className="font-medium">Voltar ao Dashboard</span>
          </button>
          <div className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
            Detalhes do Projeto
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-20 px-4 md:px-8 max-w-[1600px] mx-auto">
        {/* Header Section */}
        <div className="mb-16 text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full text-sm font-semibold mb-6 border border-emerald-100"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
            {project.progress}% Concluído
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight"
          >
            {project.title}
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-500 leading-relaxed"
          >
            {project.description}
          </motion.p>
        </div>

        {/* Timeline Section */}
        <section className="mb-20 bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 via-teal-500 to-slate-700"></div>
          
          <div className="p-8 md:p-12 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
             <div>
               <h3 className="text-2xl font-bold text-slate-800 mb-2">Linha do Tempo</h3>
               <p className="text-slate-500">Acompanhamento detalhado das etapas de execução</p>
             </div>
             <button
               onClick={() => setIsAddStepModalOpen(true)}
               className="flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-full font-medium transition-colors text-sm shadow-lg shadow-slate-200"
             >
               <Plus className="w-4 h-4" />
               Adicionar Etapa
             </button>
          </div>

          <div className="bg-slate-50/50">
            <Timeline 
              steps={project.steps} 
              onStepClick={setEditingStep}
              onReorder={reorderSteps}
            />
          </div>
        </section>

        <AddStepModal 
          isOpen={isAddStepModalOpen}
          onClose={() => setIsAddStepModalOpen(false)}
          onSave={addStep}
        />

        <EditStepModal
          isOpen={!!editingStep}
          step={editingStep}
          onClose={() => setEditingStep(null)}
          onSave={updateStep}
          onDelete={deleteStep}
        />

        {/* Current Step Details */}
        {project.currentStepDetails && (
          <motion.section 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-5xl mx-auto"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Responsible Card */}
              <div className="bg-white p-8 rounded-3xl shadow-lg border border-slate-100 flex flex-col items-center text-center hover:shadow-xl transition-shadow duration-300">
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 text-blue-600">
                  <User className="w-8 h-8" />
                </div>
                <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">Responsável Atual</h4>
                <p className="text-xl font-bold text-slate-800">{project.currentStepDetails.responsible}</p>
              </div>

              {/* Deadline Card */}
              <div className="bg-white p-8 rounded-3xl shadow-lg border border-slate-100 flex flex-col items-center text-center hover:shadow-xl transition-shadow duration-300">
                <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mb-6 text-orange-600">
                  <Calendar className="w-8 h-8" />
                </div>
                <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">Prazo Estimado</h4>
                <p className="text-xl font-bold text-slate-800">{project.currentStepDetails.deadline}</p>
              </div>

              {/* Status/Notes Card */}
              <div className="bg-white p-8 rounded-3xl shadow-lg border border-slate-100 flex flex-col items-center text-center hover:shadow-xl transition-shadow duration-300">
                <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center mb-6 text-purple-600">
                  <FileText className="w-8 h-8" />
                </div>
                <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">Observações</h4>
                <p className="text-lg font-medium text-slate-700">{project.currentStepDetails.notes}</p>
              </div>
            </div>
          </motion.section>
        )}
      </main>
    </div>
  );
};
