import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ProjectCard } from '../components/dashboard/ProjectCard';
import { useProjects } from '../hooks/useProjects';
import { LayoutDashboard, Bell, Search, Plus, Archive, Trash2, AlertTriangle, Loader2 } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'active' | 'archived'>('active');
  const { projects, loading, error, archiveProject, deleteProject, restoreProject } = useProjects(activeTab);
  
  // Action States
  const [projectToDelete, setProjectToDelete] = useState<{id: string, title: string} | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDeleteConfirm = async () => {
    if (!projectToDelete) return;
    setIsProcessing(true);
    await deleteProject(projectToDelete.id);
    setIsProcessing(false);
    setProjectToDelete(null);
  };

  const handleArchive = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Tem certeza que deseja arquivar este projeto?')) {
      await archiveProject(id);
    }
  };

  const handleRestore = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await restoreProject(id);
  };

  const handleDeleteRequest = (id: string, title: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setProjectToDelete({ id, title });
  };

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-blue-50/50 to-transparent pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-teal-100/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-48 -left-24 w-72 h-72 bg-blue-100/30 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 px-8 py-8 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100">
            <LayoutDashboard className="w-6 h-6 text-slate-700" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Painel Executivo - Gestão 2026</h1>
            <p className="text-slate-500 text-sm">Visão Geral dos Projetos Estratégicos</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button 
            onClick={() => navigate('/settings')}
            className="p-3 bg-white hover:bg-slate-50 rounded-full shadow-sm border border-slate-100 transition-colors"
            title="Configurações"
          >
            <motion.div whileHover={{ rotate: 90 }} transition={{ duration: 0.2 }}>
              <LayoutDashboard className="w-5 h-5 text-slate-600" /> 
            </motion.div>
          </button>
          <button className="p-3 bg-white hover:bg-slate-50 rounded-full shadow-sm border border-slate-100 transition-colors relative">
            <Bell className="w-5 h-5 text-slate-600" />
            <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          <div className="flex items-center space-x-3 pl-4 border-l border-slate-200">
            <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden border-2 border-white shadow-sm">
              <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100" alt="User" />
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-semibold text-slate-700">Prefeito Municipal</p>
              <p className="text-xs text-slate-500">Gestão 2024-2028</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-8 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-6">
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-slate-800 mb-6 tracking-tight">Projetos em Destaque</h2>
            <div className="inline-flex bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => setActiveTab('active')}
                className={`px-6 py-2.5 text-sm font-semibold rounded-lg transition-all ${
                  activeTab === 'active'
                    ? 'bg-white text-slate-800 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Ativos
              </button>
              <button
                onClick={() => setActiveTab('archived')}
                className={`px-6 py-2.5 text-sm font-semibold rounded-lg transition-all ${
                  activeTab === 'archived'
                    ? 'bg-white text-slate-800 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Arquivados
              </button>
            </div>
          </div>
          
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:flex-none">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input 
                type="text" 
                placeholder="Buscar projeto..." 
                className="w-full md:w-64 pl-12 pr-6 py-3 bg-white rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
              />
            </div>
            <button 
              onClick={() => navigate('/new-project')}
              className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg shadow-slate-200 hover:shadow-xl hover:-translate-y-0.5"
            >
              <Plus className="w-5 h-5" />
              <span className="hidden md:inline">Novo Projeto</span>
            </button>
          </div>
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
          </div>
        ) : error ? (
          <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
            <p className="text-red-500 mb-2">Não foi possível carregar os projetos.</p>
            <p className="text-slate-500 text-sm">{error}</p>
            <p className="text-slate-400 text-xs mt-4">Verifique se você configurou o arquivo .env e rodou o script SQL no Supabase.</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
            <p className="text-slate-600 text-lg mb-4">Nenhum projeto {activeTab === 'active' ? 'ativo' : 'arquivado'} encontrado.</p>
            {activeTab === 'active' && (
              <button 
                onClick={() => navigate('/new-project')}
                className="text-emerald-600 font-medium hover:underline"
              >
                Crie o primeiro projeto agora
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative group"
              >
                <ProjectCard 
                  project={project} 
                  onClick={(id) => navigate(`/project/${id}`)} 
                />
                
                {/* Quick Actions Overlay */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                  {activeTab === 'active' ? (
                    <>
                      <button
                        onClick={(e) => handleArchive(project.id, e)}
                        className="p-2 bg-white/90 backdrop-blur-sm text-slate-500 hover:text-blue-600 rounded-lg shadow-sm hover:shadow-md transition-all"
                        title="Arquivar"
                      >
                        <Archive className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => handleDeleteRequest(project.id, project.title, e)}
                        className="p-2 bg-white/90 backdrop-blur-sm text-slate-500 hover:text-red-600 rounded-lg shadow-sm hover:shadow-md transition-all"
                        title="Excluir"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={(e) => handleRestore(project.id, e)}
                        className="p-2 bg-white/90 backdrop-blur-sm text-slate-500 hover:text-emerald-600 rounded-lg shadow-sm hover:shadow-md transition-all"
                        title="Restaurar"
                      >
                        <Plus className="w-4 h-4 rotate-45" /> {/* Using Plus rotated as Restore/Unarchive icon */}
                      </button>
                      <button
                        onClick={(e) => handleDeleteRequest(project.id, project.title, e)}
                        className="p-2 bg-white/90 backdrop-blur-sm text-slate-500 hover:text-red-600 rounded-lg shadow-sm hover:shadow-md transition-all"
                        title="Excluir Permanentemente"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {projectToDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 text-center"
            >
              <div className="w-12 h-12 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">Excluir Projeto?</h3>
              <p className="text-slate-500 mb-6">
                Tem certeza que deseja excluir o projeto <strong>"{projectToDelete.title}"</strong>? 
                <br/><span className="text-xs text-red-500 mt-2 block">Isso apagará todas as etapas e histórico permanentemente.</span>
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setProjectToDelete(null)}
                  className="flex-1 py-2.5 bg-slate-100 text-slate-700 font-medium rounded-xl hover:bg-slate-200 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  disabled={isProcessing}
                  className="flex-1 py-2.5 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                >
                  {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Excluir'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
