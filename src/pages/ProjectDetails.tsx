import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus, Edit2, Check, X } from 'lucide-react';
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
  
  // Project Editing State
  const [isEditingProject, setIsEditingProject] = useState(false);
  const [editForm, setEditForm] = useState({ title: '', description: '' });
  
  const { project, loading, error, addStep, updateStep, deleteStep, reorderSteps, updateProjectDetails } = useProject(id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (project) {
      setEditForm({ title: project.title, description: project.description });
    }
  }, [project]);

  const handleSaveProjectDetails = async () => {
    if (await updateProjectDetails(editForm)) {
      setIsEditingProject(false);
    }
  };

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
      <nav className="sticky top-0 w-full bg-white z-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <button 
            onClick={() => navigate('/')}
            className="p-2 hover:bg-slate-50 rounded-xl text-slate-400 hover:text-slate-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="text-sm font-bold text-slate-800">
            Detalhes do Projeto
          </div>
          <div className="w-9"></div> {/* Spacer for center alignment */}
        </div>
      </nav>

      <main className="py-8 px-4 md:px-8 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2"></span>
              {project.progress}% Concluído
            </motion.div>
            
            {!isEditingProject && (
              <button 
                onClick={() => setIsEditingProject(true)}
                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Editar Projeto"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            )}
          </div>
          
          {isEditingProject ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-4 max-w-3xl"
            >
              <input
                type="text"
                value={editForm.title}
                onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                className="w-full text-3xl font-bold text-slate-800 border-b-2 border-blue-500 focus:outline-none bg-transparent py-2"
                placeholder="Nome do Projeto"
              />
              <textarea
                value={editForm.description}
                onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                className="w-full text-lg text-slate-600 border border-slate-200 rounded-xl p-4 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 bg-white resize-none"
                rows={3}
                placeholder="Descrição do projeto"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSaveProjectDetails}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  <Check className="w-4 h-4" /> Salvar
                </button>
                <button
                  onClick={() => {
                    setIsEditingProject(false);
                    setEditForm({ title: project.title, description: project.description });
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-600 rounded-lg font-medium hover:bg-slate-200 transition-colors"
                >
                  <X className="w-4 h-4" /> Cancelar
                </button>
              </div>
            </motion.div>
          ) : (
            <div className="max-w-4xl">
              <motion.h1 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-3xl md:text-4xl font-bold text-slate-800 mb-4 leading-tight"
              >
                {project.title}
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-lg text-slate-500 leading-relaxed"
              >
                {project.description}
              </motion.p>
            </div>
          )}
        </div>

        {/* Timeline Section */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-8">
             <h3 className="text-xl font-bold text-slate-800">Linha do Tempo</h3>
             <button
               onClick={() => setIsAddStepModalOpen(true)}
               className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-medium transition-colors text-sm shadow-md hover:shadow-lg"
             >
               <Plus className="w-4 h-4" />
               Adicionar Etapa
             </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm">
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
