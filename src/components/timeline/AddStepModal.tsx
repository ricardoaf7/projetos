import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Loader2 } from 'lucide-react';

interface AddStepModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (stepData: {
    title: string;
    status: 'pending' | 'in-progress' | 'completed';
    topAnnotation?: string;
    bottomAnnotation?: string;
    responsibleAgency?: string;
    responsibleSector?: string;
    startDate?: string;
    completionForecast?: string;
  }) => Promise<boolean>;
}

export const AddStepModal: React.FC<AddStepModalProps> = ({ isOpen, onClose, onSave }) => {
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState<'pending' | 'in-progress' | 'completed'>('pending');
  const [topAnnotation, setTopAnnotation] = useState('');
  const [bottomAnnotation, setBottomAnnotation] = useState('');
  
  // New Fields State
  const [responsibleAgency, setResponsibleAgency] = useState('');
  const [customAgency, setCustomAgency] = useState('');
  const [responsibleSector, setResponsibleSector] = useState('');
  const [customSector, setCustomSector] = useState('');
  const [startDate, setStartDate] = useState('');
  const [completionForecast, setCompletionForecast] = useState('');

  // Dropdown Options
  const agencies = ['Prefeitura', 'Estado', 'Governo Federal', 'Empresa Privada', 'Outro'];
  const sectors = ['Obras', 'Planejamento', 'Finanças', 'Jurídico', 'Meio Ambiente', 'Outro'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation: Completion date cannot be before start date
    if (startDate && completionForecast && new Date(completionForecast) < new Date(startDate)) {
      alert('A previsão de conclusão não pode ser anterior à data de início.');
      return;
    }

    setLoading(true);
    
    const finalAgency = responsibleAgency === 'Outro' ? customAgency : responsibleAgency;
    const finalSector = responsibleSector === 'Outro' ? customSector : responsibleSector;

    const success = await onSave({
      title,
      status,
      topAnnotation: topAnnotation || undefined,
      bottomAnnotation: bottomAnnotation || undefined,
      responsibleAgency: finalAgency,
      responsibleSector: finalSector,
      startDate,
      completionForecast
    });

    setLoading(false);
    if (success) {
      // Reset form
      setTitle('');
      setStatus('pending');
      setTopAnnotation('');
      setBottomAnnotation('');
      setResponsibleAgency('');
      setCustomAgency('');
      setResponsibleSector('');
      setCustomSector('');
      setStartDate('');
      setCompletionForecast('');
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden pointer-events-auto border border-slate-100">
              {/* Header */}
              <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="text-xl font-bold text-slate-800">Nova Etapa</h3>
                <button 
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Título da Etapa</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                    placeholder="Ex: Licitação"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Status Inicial</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all bg-white"
                  >
                    <option value="pending">Pendente (Futuro)</option>
                    <option value="in-progress">Em Andamento (Atual)</option>
                    <option value="completed">Concluído</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Órgão Responsável</label>
                    <select
                      value={responsibleAgency}
                      onChange={(e) => setResponsibleAgency(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all bg-white"
                    >
                      <option value="">Selecione...</option>
                      {agencies.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                    {responsibleAgency === 'Outro' && (
                      <input
                        type="text"
                        value={customAgency}
                        onChange={(e) => setCustomAgency(e.target.value)}
                        className="mt-2 w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                        placeholder="Especifique o órgão"
                      />
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Setor Responsável</label>
                    <select
                      value={responsibleSector}
                      onChange={(e) => setResponsibleSector(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all bg-white"
                    >
                      <option value="">Selecione...</option>
                      {sectors.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                    {responsibleSector === 'Outro' && (
                      <input
                        type="text"
                        value={customSector}
                        onChange={(e) => setCustomSector(e.target.value)}
                        className="mt-2 w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                        placeholder="Especifique o setor"
                      />
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Data de Início</label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Previsão de Conclusão</label>
                    <input
                      type="date"
                      value={completionForecast}
                      onChange={(e) => setCompletionForecast(e.target.value)}
                      min={startDate}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Nota Superior (Opcional)</label>
                    <input
                      type="text"
                      value={topAnnotation}
                      onChange={(e) => setTopAnnotation(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm"
                      placeholder="Ex: Aprovação IPPUL"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Nota Inferior (Opcional)</label>
                    <input
                      type="text"
                      value={bottomAnnotation}
                      onChange={(e) => setBottomAnnotation(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm"
                      placeholder="Ex: Prazo 30 dias"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-6 py-3 rounded-xl text-slate-600 font-medium hover:bg-slate-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-emerald-200 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Salvando...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Adicionar
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
