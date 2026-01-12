import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit2, Save, X, Loader2, AlertTriangle, Settings } from 'lucide-react';
import { useSettings, Agency, Sector } from '../hooks/useSettings';
import { Header } from '../components/layout/Header';

export const SettingsPage: React.FC = () => {
  const { 
    agencies, 
    sectors, 
    loading, 
    addAgency, 
    deleteAgency, 
    updateAgency,
    addSector, 
    deleteSector, 
    updateSector 
  } = useSettings();

  const [activeTab, setActiveTab] = useState<'agencies' | 'sectors'>('agencies');
  const [newItemName, setNewItemName] = useState('');
  const [editingItem, setEditingItem] = useState<{ id: string, name: string } | null>(null);
  const [deletingItem, setDeletingItem] = useState<{ id: string, name: string, type: 'agency' | 'sector' } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    setIsSubmitting(true);
    let success = false;
    
    if (activeTab === 'agencies') {
      success = await addAgency(newItemName);
    } else {
      success = await addSector(newItemName);
    }

    setIsSubmitting(false);
    if (success) {
      setNewItemName('');
    }
  };

  const handleUpdate = async () => {
    if (!editingItem || !editingItem.name.trim()) return;

    setIsSubmitting(true);
    let success = false;

    if (activeTab === 'agencies') {
      success = await updateAgency(editingItem.id, editingItem.name);
    } else {
      success = await updateSector(editingItem.id, editingItem.name);
    }

    setIsSubmitting(false);
    if (success) {
      setEditingItem(null);
    }
  };

  const handleDelete = async () => {
    if (!deletingItem) return;

    setIsSubmitting(true);
    let success = false;

    if (deletingItem.type === 'agency') {
      success = await deleteAgency(deletingItem.id);
    } else {
      success = await deleteSector(deletingItem.id);
    }

    setIsSubmitting(false);
    if (success) {
      setDeletingItem(null);
    }
  };

  const items = activeTab === 'agencies' ? agencies : sectors;

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8 flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Configurações</h1>
            <p className="text-slate-500">Gerencie os cadastros auxiliares do sistema</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-slate-200">
            <button
              onClick={() => setActiveTab('agencies')}
              className={`flex-1 py-4 text-sm font-bold uppercase tracking-wide transition-colors ${
                activeTab === 'agencies'
                  ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                  : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              Órgãos Responsáveis
            </button>
            <button
              onClick={() => setActiveTab('sectors')}
              className={`flex-1 py-4 text-sm font-bold uppercase tracking-wide transition-colors ${
                activeTab === 'sectors'
                  ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                  : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              Setores Responsáveis
            </button>
          </div>

          <div className="p-8">
            {/* Add New Form */}
            <form onSubmit={handleAdd} className="flex gap-3 mb-8">
              <input
                type="text"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                placeholder={`Nome do novo ${activeTab === 'agencies' ? 'órgão' : 'setor'}...`}
                className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
              <button
                type="submit"
                disabled={isSubmitting || !newItemName.trim()}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all disabled:opacity-50 flex items-center gap-2"
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                Adicionar
              </button>
            </form>

            {/* List */}
            {loading ? (
              <div className="py-12 flex justify-center text-slate-400">
                <Loader2 className="w-8 h-8 animate-spin" />
              </div>
            ) : items.length === 0 ? (
              <div className="py-12 text-center text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                Nenhum registro encontrado.
              </div>
            ) : (
              <div className="space-y-2">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-xl hover:border-blue-200 hover:shadow-sm transition-all group"
                  >
                    {editingItem?.id === item.id ? (
                      <div className="flex-1 flex gap-2 mr-4">
                        <input
                          type="text"
                          value={editingItem.name}
                          onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                          className="flex-1 px-3 py-2 rounded-lg border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                          autoFocus
                        />
                        <button
                          onClick={handleUpdate}
                          disabled={isSubmitting}
                          className="p-2 bg-emerald-100 text-emerald-600 rounded-lg hover:bg-emerald-200 transition-colors"
                        >
                          <Save className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setEditingItem(null)}
                          className="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <span className="font-medium text-slate-700">{item.name}</span>
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => setEditingItem({ id: item.id, name: item.name })}
                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeletingItem({ id: item.id, name: item.name, type: activeTab })}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deletingItem && (
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
              <h3 className="text-lg font-bold text-slate-800 mb-2">Excluir Registro?</h3>
              <p className="text-slate-500 mb-6">
                Tem certeza que deseja excluir <strong>"{deletingItem.name}"</strong>? Essa ação não pode ser desfeita.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeletingItem(null)}
                  className="flex-1 py-2.5 bg-slate-100 text-slate-700 font-medium rounded-xl hover:bg-slate-200 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDelete}
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Excluir'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
