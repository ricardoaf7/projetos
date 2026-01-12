import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Trash2, Loader2, AlertTriangle } from 'lucide-react';
import { TimelineStep } from '../../types';

interface EditStepModalProps {
  isOpen: boolean;
  step: TimelineStep | null;
  onClose: () => void;
  onSave: (stepId: string, updates: {
    title?: string;
    status?: 'pending' | 'in-progress' | 'completed';
    topAnnotation?: string;
    bottomAnnotation?: string;
  }) => Promise<boolean>;
  onDelete: (stepId: string) => Promise<boolean>;
}

export const EditStepModal: React.FC<EditStepModalProps> = ({ isOpen, step, onClose, onSave, onDelete }) => {
  const [loading, setLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Form State
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

  // Confirmation Delete State
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (step) {
      setTitle(step.title);
      setStatus(step.status);
      setTopAnnotation(step.topAnnotation || '');
      setBottomAnnotation(step.bottomAnnotation || '');
      
      // Load new fields
      if (step.responsibleAgency && !agencies.includes(step.responsibleAgency)) {
        setResponsibleAgency('Outro');
        setCustomAgency(step.responsibleAgency);
      } else {
        setResponsibleAgency(step.responsibleAgency || '');
      }

      if (step.responsibleSector && !sectors.includes(step.responsibleSector)) {
        setResponsibleSector('Outro');
        setCustomSector(step.responsibleSector);
      } else {
        setResponsibleSector(step.responsibleSector || '');
      }

      setStartDate(step.startDate || '');
      setCompletionForecast(step.completionForecast || '');
    }
  }, [step]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!step) return;

    // Validation: Completion date cannot be before start date
    if (startDate && completionForecast && new Date(completionForecast) < new Date(startDate)) {
      alert('A previsão de conclusão não pode ser anterior à data de início.');
      return;
    }

    setLoading(true);
    
    const finalAgency = responsibleAgency === 'Outro' ? customAgency : responsibleAgency;
    const finalSector = responsibleSector === 'Outro' ? customSector : responsibleSector;

    const success = await onSave(step.id, {
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
      onClose();
    }
  };

  const handleDelete = async () => {
    if (!step) return;
    
    setIsDeleting(true);
    const success = await onDelete(step.id);
    setIsDeleting(false);
    
    if (success) {
      setShowDeleteConfirm(false);
      onClose();
    }
  };

  if (!step) return null;

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
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden pointer-events-auto border border-slate-100 relative">
              
              {/* Delete Confirmation Overlay */}
              <AnimatePresence>
                {showDeleteConfirm && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-white/95 z-10 flex flex-col items-center justify-center p-8 text-center"
                  >
                    <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4 text-red-500">
                      <AlertTriangle className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">Excluir Etapa?</h3>
                    <p className="text-slate-500 mb-8">
                      Tem certeza que deseja excluir a etapa <strong>"{step.title}"</strong>? Esta ação não pode ser desfeita.
                    </p>
                    <div className="flex gap-3 w-full">
                      <button
                        onClick={() => setShowDeleteConfirm(false)}
                        className="flex-1 px-4 py-3 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition-colors"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="flex-1 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-xl font-bold transition-all shadow-lg shadow-red-200 disabled:opacity-70"
                      >
                        {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                        Sim, Excluir
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Header */}
              <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h3 className="text-xl font-bold text-slate-800">Editar Etapa</h3>
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
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white"
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
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white"
                    >
                      <option value="">Selecione...</option>
                      {agencies.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                    {responsibleAgency === 'Outro' && (
                      <input
                        type="text"
                        value={customAgency}
                        onChange={(e) => setCustomAgency(e.target.value)}
                        className="mt-2 w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                        placeholder="Especifique o órgão"
                      />
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Setor Responsável</label>
                    <select
                      value={responsibleSector}
                      onChange={(e) => setResponsibleSector(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white"
                    >
                      <option value="">Selecione...</option>
                      {sectors.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                    {responsibleSector === 'Outro' && (
                      <input
                        type="text"
                        value={customSector}
                        onChange={(e) => setCustomSector(e.target.value)}
                        className="mt-2 w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
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
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Previsão de Conclusão</label>
                    <input
                      type="date"
                      value={completionForecast}
                      onChange={(e) => setCompletionForecast(e.target.value)}
                      min={startDate}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Nota Superior</label>
                    <input
                      type="text"
                      value={topAnnotation}
                      onChange={(e) => setTopAnnotation(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Nota Inferior</label>
                    <input
                      type="text"
                      value={bottomAnnotation}
                      onChange={(e) => setBottomAnnotation(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-between items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(true)}
                    className="px-4 py-3 rounded-xl text-red-500 font-medium hover:bg-red-50 transition-colors flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="hidden sm:inline">Excluir</span>
                  </button>

                  <div className="flex gap-3">
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
                      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-200 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Salvando...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          Salvar
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
