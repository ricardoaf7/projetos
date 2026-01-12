import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

export const NewProject: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    responsible: '',
    deadline: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Create Project
      const { data: project, error: projectError } = await supabase
        .from('projects')
        .insert([{
          title: formData.title,
          description: formData.description,
          image_url: formData.imageUrl || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1000',
          progress: 0,
          current_responsible: formData.responsible,
          current_deadline: formData.deadline,
          current_notes: 'Projeto iniciado'
        }])
        .select()
        .single();

      if (projectError) throw projectError;

      // 2. Create Default Steps
      const defaultSteps = [
        { title: 'Demanda', status: 'completed', is_current: false, order: 1 },
        { title: 'Instrução', status: 'in-progress', is_current: true, order: 2 },
        { title: 'Execução', status: 'pending', is_current: false, order: 3 },
        { title: 'Conclusão', status: 'pending', is_current: false, order: 4 },
      ];

      const stepsToInsert = defaultSteps.map(step => ({
        project_id: project.id,
        title: step.title,
        status: step.status,
        is_current: step.is_current,
        order_index: step.order
      }));

      const { error: stepsError } = await supabase
        .from('project_steps')
        .insert(stepsToInsert);

      if (stepsError) throw stepsError;

      navigate('/');
    } catch (error: any) {
      console.error('Error creating project:', error);
      alert('Erro ao criar projeto: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-6 h-20 flex items-center justify-between">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center text-slate-600 hover:text-slate-900 transition-colors group"
          >
            <div className="p-2 rounded-full group-hover:bg-slate-100 transition-colors mr-2">
              <ArrowLeft className="w-5 h-5" />
            </div>
            <span className="font-medium">Cancelar</span>
          </button>
          <div className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
            Novo Projeto
          </div>
        </div>
      </nav>

      <main className="pt-32 pb-20 px-4 max-w-4xl mx-auto">
        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/60 border border-slate-100 p-8 md:p-12">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Cadastrar Novo Projeto</h1>
            <p className="text-slate-500">Preencha as informações iniciais para criar o card do projeto.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Título do Projeto</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                placeholder="Ex: Revitalização da Praça Central"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Descrição Curta</label>
              <textarea
                required
                rows={3}
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                placeholder="Ex: Reforma completa do calçamento e paisagismo..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Responsável Inicial</label>
                <input
                  type="text"
                  value={formData.responsible}
                  onChange={e => setFormData({...formData, responsible: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  placeholder="Ex: Eng. Maria"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Prazo Estimado</label>
                <input
                  type="text"
                  value={formData.deadline}
                  onChange={e => setFormData({...formData, deadline: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  placeholder="Ex: 30/12/2024"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">URL da Imagem de Capa (Opcional)</label>
              <input
                type="url"
                value={formData.imageUrl}
                onChange={e => setFormData({...formData, imageUrl: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                placeholder="https://..."
              />
            </div>

            <div className="pt-6 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg shadow-emerald-200 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Criar Projeto
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};
