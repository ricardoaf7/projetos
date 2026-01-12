import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ProjectCard } from '../components/dashboard/ProjectCard';
import { useProjects } from '../hooks/useProjects';
import { LayoutDashboard, Bell, Search, Plus } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { projects, loading, error } = useProjects();

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-blue-50/50 to-transparent pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-teal-100/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-48 -left-24 w-72 h-72 bg-blue-100/30 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 px-8 py-8 flex justify-between items-center max-w-7xl mx-auto">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-white rounded-2xl shadow-lg shadow-slate-200/50">
            <LayoutDashboard className="w-6 h-6 text-slate-700" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Painel Executivo</h1>
            <p className="text-slate-500 text-sm">Visão Geral dos Projetos Estratégicos</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
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
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl font-bold text-slate-800 mb-4 tracking-tight">Projetos em Destaque</h2>
            <p className="text-slate-600 max-w-2xl text-lg">
              Acompanhe o progresso das principais obras e iniciativas de desenvolvimento urbano da cidade.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input 
                type="text" 
                placeholder="Buscar projeto..." 
                className="pl-12 pr-6 py-3 bg-white rounded-full border border-slate-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 w-64 transition-all"
              />
            </div>
            <button 
              onClick={() => navigate('/new-project')}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-full font-medium transition-colors shadow-lg shadow-emerald-200"
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
            <p className="text-slate-600 text-lg mb-4">Nenhum projeto encontrado.</p>
            <button 
              onClick={() => navigate('/new-project')}
              className="text-emerald-600 font-medium hover:underline"
            >
              Crie o primeiro projeto agora
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <ProjectCard 
                  project={project} 
                  onClick={(id) => navigate(`/project/${id}`)} 
                />
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
