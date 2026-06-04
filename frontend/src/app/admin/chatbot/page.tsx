'use client';

import { useState, useEffect } from 'react';
import { chatbotApi, ChatbotNode, ChatbotOption } from '../../../lib/chatbotApi';
import { Loader2, Plus, Edit2, Trash2, Save, X, MessageSquare, ArrowRight, Activity } from 'lucide-react';
import Link from 'next/link';

export default function ChatbotManager() {
  const [nodes, setNodes] = useState<ChatbotNode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [editingNode, setEditingNode] = useState<Partial<ChatbotNode> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchNodes();
  }, []);

  const fetchNodes = async () => {
    try {
      const data = await chatbotApi.getNodes();
      setNodes(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const openModal = (node?: ChatbotNode) => {
    if (node) {
      setEditingNode({ ...node });
    } else {
      setEditingNode({ id: '', from: 'bot', message: '', options: [] });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setEditingNode(null);
    setIsModalOpen(false);
  };

  const handleSave = async () => {
    if (!editingNode || !editingNode.id || !editingNode.message) return;
    setIsSaving(true);
    try {
      const isNew = !nodes.find(n => n.id === editingNode.id);
      if (isNew) {
        await chatbotApi.createNode(editingNode);
      } else {
        await chatbotApi.updateNode(editingNode.id, editingNode);
      }
      await fetchNodes();
      closeModal();
    } catch (err) {
      alert("Failed to save node. Make sure ID is unique.");
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm(`Are you sure you want to delete node "${id}"? This might break the flow if other nodes link to it.`)) {
      try {
        await chatbotApi.deleteNode(id);
        setNodes(nodes.filter(n => n.id !== id));
      } catch (err) {
        alert("Failed to delete node.");
      }
    }
  };

  const addOption = () => {
    setEditingNode(prev => {
      if (!prev) return prev;
      const opts = Array.isArray(prev.options) ? [...prev.options] : [];
      opts.push({ label: '', next: '' });
      return { ...prev, options: opts };
    });
  };

  const updateOption = (index: number, field: keyof ChatbotOption, value: string) => {
    setEditingNode(prev => {
      if (!prev || !Array.isArray(prev.options)) return prev;
      const opts = [...prev.options];
      opts[index] = { ...opts[index], [field]: value };
      return { ...prev, options: opts };
    });
  };

  const removeOption = (index: number) => {
    setEditingNode(prev => {
      if (!prev || !Array.isArray(prev.options)) return prev;
      const opts = prev.options.filter((_, i) => i !== index);
      return { ...prev, options: opts };
    });
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-50">
        <Loader2 className="w-8 h-8 text-[#1a84ff] animate-spin" />
      </div>
    );
  }

  const getCategory = (id: string) => {
    if (['start', 'restart'].includes(id)) return 'Core Flow';
    if (id.startsWith('sl_') || id === 'sriLanka') return 'Sri Lanka Tours';
    if (id.startsWith('mv_') || id === 'maldives') return 'Maldives Resorts';
    if (id.startsWith('combo_') || id === 'combo') return 'Combo Packages';
    if (['contact', 'email'].includes(id)) return 'Contact Options';
    if (id.startsWith('wa_')) return 'WhatsApp Redirects';
    return 'Other Nodes';
  };

  const groupedNodes = nodes.reduce((acc, node) => {
    const cat = getCategory(node.id);
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(node);
    return acc;
  }, {} as Record<string, ChatbotNode[]>);

  // Define desired order of categories
  const categoryOrder = [
    'Core Flow',
    'Sri Lanka Tours',
    'Maldives Resorts',
    'Combo Packages',
    'Contact Options',
    'WhatsApp Redirects',
    'Other Nodes'
  ];

  const sortedCategories = Object.keys(groupedNodes).sort(
    (a, b) => {
      const idxA = categoryOrder.indexOf(a);
      const idxB = categoryOrder.indexOf(b);
      return (idxA !== -1 ? idxA : 999) - (idxB !== -1 ? idxB : 999);
    }
  );

  return (
    <div className="flex-1 bg-[#f8fafc] p-8 md:p-12 overflow-y-auto min-h-screen">
      <div className="max-w-[1200px] mx-auto space-y-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-[28px] font-black text-[#041d3c] ">Chatbot Manager</h1>
            <p className="text-gray-500 font-medium mt-1">Configure automated conversational flows, messages, and routing.</p>
          </div>
          <button
            onClick={() => openModal()}
            className="flex items-center gap-2 bg-[#1a84ff] text-white px-5 py-2.5 rounded-[12px] font-bold text-[13px] uppercase tracking-wider hover:bg-[#041d3c] transition-all shadow-[0_8px_20px_rgba(26,132,255,0.25)] hover:shadow-none hover:-translate-y-0.5"
          >
            <Plus className="w-4 h-4" />
            New Node
          </button>
        </div>

        {/* Nodes Grouped */}
        <div className="space-y-12">
          {sortedCategories.map(category => (
            <div key={category} className="space-y-5">
              <div className="flex items-center gap-3 border-b border-slate-200 pb-3">
                <h2 className="text-[18px] font-black text-[#041d3c]">{category}</h2>
                <span className="bg-slate-200/60 text-slate-500 text-[11px] font-bold px-2.5 py-1 rounded-full">
                  {groupedNodes[category].length}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {groupedNodes[category].map(node => (
            <div key={node.id} className="bg-white rounded-[20px] p-6 shadow-[0_4px_24px_rgba(4,29,60,0.03)] border border-slate-100 flex flex-col group transition-all hover:shadow-[0_12px_40px_rgba(4,29,60,0.08)]">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className={`w-8 h-8 rounded-[10px] flex items-center justify-center ${node.from === 'bot' ? 'bg-[#1a84ff]/10 text-[#1a84ff]' : 'bg-gray-100 text-gray-500'}`}>
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#041d3c] text-[15px]">{node.id}</h3>
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">{node.from}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openModal(node)} className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(node.id)} className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
              
              <div className="flex-1 bg-[#f8fafc] rounded-[12px] p-3 text-[13px] text-[#041d3c] font-medium leading-[1.6] whitespace-pre-wrap border border-slate-100">
                {node.message}
              </div>

              {Array.isArray(node.options) && node.options.length > 0 && (
                <div className="mt-4 space-y-2">
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Options</div>
                  {node.options.map((opt, i) => (
                    <div key={i} className="flex items-center justify-between bg-white border border-slate-200 rounded-[8px] px-3 py-2 text-[12px]">
                      <span className="font-semibold text-[#041d3c]">{opt.label}</span>
                      <div className="flex items-center gap-1 text-gray-400 font-medium">
                        <ArrowRight className="w-3 h-3" />
                        <span className="text-blue-500">{opt.next}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {node.action === 'whatsapp' && (
                <div className="mt-4 flex items-center gap-2 bg-green-50 text-green-700 px-3 py-2 rounded-[8px] text-[12px] font-bold">
                  <Activity className="w-3.5 h-3.5" />
                  WhatsApp Redirect
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>

      </div>

      {/* Editor Modal */}
      {isModalOpen && editingNode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#041d3c]/40 backdrop-blur-sm">
          <div className="bg-white rounded-[24px] w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <h2 className="text-[20px] font-black text-[#041d3c]">
                {nodes.find(n => n.id === editingNode.id) ? 'Edit Node' : 'Create Node'}
              </h2>
              <button onClick={closeModal} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors text-slate-500">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6 flex-1">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Node ID (Unique key)</label>
                  <input
                    type="text"
                    value={editingNode.id || ''}
                    onChange={(e) => setEditingNode({ ...editingNode, id: e.target.value })}
                    disabled={!!nodes.find(n => n.id === editingNode.id)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-[12px] px-4 py-3 outline-none focus:border-[#1a84ff] focus:ring-2 focus:ring-[#1a84ff]/20 transition-all font-semibold text-[#041d3c] disabled:opacity-60"
                    placeholder="e.g., start, greeting"
                  />
                </div>
                {/* Hidden From field, defaulted to bot */}
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Message Text</label>
                <textarea
                  value={editingNode.message || ''}
                  onChange={(e) => setEditingNode({ ...editingNode, message: e.target.value })}
                  rows={4}
                  className="w-full bg-slate-50 border border-slate-200 rounded-[12px] px-4 py-3 outline-none focus:border-[#1a84ff] focus:ring-2 focus:ring-[#1a84ff]/20 transition-all font-semibold text-[#041d3c]"
                  placeholder="The message to display..."
                />
              </div>

              <div className="border-t border-slate-100 pt-6">
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">Interactive Options</label>
                  <button onClick={addOption} className="text-[#1a84ff] text-[12px] font-bold hover:underline">
                    + Add Option
                  </button>
                </div>
                
                <div className="space-y-3">
                  {(!Array.isArray(editingNode.options) || editingNode.options.length === 0) && (
                    <p className="text-[13px] text-gray-400 font-medium">No options added. Bot will wait for action or end flow.</p>
                  )}
                  {Array.isArray(editingNode.options) && editingNode.options.map((opt, i) => (
                    <div key={i} className="flex gap-3 items-start bg-slate-50 p-3 rounded-[12px] border border-slate-200">
                      <div className="flex-1 space-y-3">
                        <input
                          type="text"
                          value={opt.label}
                          onChange={(e) => updateOption(i, 'label', e.target.value)}
                          placeholder="Button Label (e.g. Yes, please!)"
                          className="w-full bg-white border border-slate-200 rounded-[8px] px-3 py-2 text-[13px] font-semibold text-[#041d3c]"
                        />
                        <input
                          type="text"
                          value={opt.next}
                          onChange={(e) => updateOption(i, 'next', e.target.value)}
                          placeholder="Next Node ID (e.g. main_menu)"
                          className="w-full bg-white border border-slate-200 rounded-[8px] px-3 py-2 text-[13px] font-semibold text-[#041d3c]"
                        />
                      </div>
                      <button onClick={() => removeOption(i)} className="text-rose-500 p-2 hover:bg-rose-50 rounded-lg">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-slate-100 pt-6 space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Action</label>
                  <select
                    value={editingNode.action || ''}
                    onChange={(e) => setEditingNode({ ...editingNode, action: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-[12px] px-4 py-3 outline-none focus:border-[#1a84ff] font-semibold text-[#041d3c]"
                  >
                    <option value="">None</option>
                    <option value="whatsapp">Redirect to WhatsApp</option>
                    <option value="restart">Restart Flow</option>
                  </select>
                </div>
                
                {editingNode.action === 'whatsapp' && (
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">WhatsApp Pre-filled Text</label>
                    <textarea
                      value={editingNode.whatsappText || ''}
                      onChange={(e) => setEditingNode({ ...editingNode, whatsappText: e.target.value })}
                      rows={2}
                      className="w-full bg-slate-50 border border-slate-200 rounded-[12px] px-4 py-3 outline-none focus:border-[#1a84ff] font-semibold text-[#041d3c]"
                      placeholder="Hi! I want to..."
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 rounded-b-[24px]">
              <button onClick={closeModal} className="px-5 py-2.5 text-gray-500 font-bold text-[13px] hover:bg-gray-200 rounded-[10px] transition-colors">
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving || !editingNode.id || !editingNode.message}
                className="flex items-center gap-2 bg-[#1a84ff] text-white px-6 py-2.5 rounded-[10px] font-bold text-[13px] uppercase tracking-wider hover:bg-[#041d3c] transition-all disabled:opacity-50"
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {isSaving ? 'Saving...' : 'Save Node'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
