
import React, { useState, useEffect } from 'react';
import { Playbook, PlaybookVariable, PlaybookOutputMode } from '../types';
import Button from './Button';
import { 
  XIcon, 
  SparklesIcon, 
  TrashIcon, 
  PlusIcon, 
  ChevronDownIcon, 
  MaximizeIcon, 
  MinimizeIcon,
  PlayIcon,
  ShieldIcon,
  CodeIcon,
  SaveIcon,
  // Fix: Remove non-existent BoxIcon import
  AlertTriangleIcon
} from './Icons';

// Proxy for Box icon
const BoxIconProxy: React.FC<any> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={props.size || 20}
    height={props.size || 20}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
    <path d="m3.3 7 8.7 5 8.7-5" />
    <path d="M12 22V12" />
  </svg>
);

interface PlaybookEditorProps {
  playbook: Playbook | null;
  onClose: () => void;
  onSave: (playbook: Playbook) => void;
}

const PlaybookEditor: React.FC<PlaybookEditorProps> = ({ playbook, onClose, onSave }) => {
  const [formData, setFormData] = useState<Playbook | null>(null);
  const [isMaximized, setIsMaximized] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (playbook) {
      setFormData({ ...playbook });
    } else {
      setFormData({
        id: `pb-${Date.now()}`,
        title: '',
        description: '',
        icon: '📄',
        trigger: '/',
        promptTemplate: '',
        variables: [],
        outputMode: 'chat',
        model: 'gemini-3-pro-preview',
        tags: [],
        author: 'Alex Dev',
        updatedAt: 'Just now'
      });
    }
  }, [playbook]);

  if (!formData) return null;

  const handleAddVariable = () => {
    const newVar: PlaybookVariable = {
      id: `v-${Date.now()}`,
      name: '',
      description: '',
      required: true
    };
    setFormData({ ...formData, variables: [...formData.variables, newVar] });
  };

  const handleRemoveVariable = (id: string) => {
    setFormData({ ...formData, variables: formData.variables.filter(v => v.id !== id) });
  };

  const updateVariable = (id: string, field: keyof PlaybookVariable, value: any) => {
    setFormData({
      ...formData,
      variables: formData.variables.map(v => v.id === id ? { ...v, [field]: value } : v)
    });
  };

  const validateTemplate = () => {
    const regex = /{{(.*?)}}/g;
    let match;
    const foundVars = new Set<string>();
    while ((match = regex.exec(formData.promptTemplate)) !== null) {
      foundVars.add(match[1].trim());
    }

    const definedVars = new Set(formData.variables.map(v => v.name.trim()));
    const missing = [...foundVars].filter(v => !definedVars.has(v));

    if (missing.length > 0) {
      setValidationError(`Variables used in template but not defined: ${missing.join(', ')}`);
      return false;
    }
    setValidationError(null);
    return true;
  };

  const handleSubmit = () => {
    if (validateTemplate()) {
      onSave(formData);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end font-sans pointer-events-none" role="dialog" aria-modal="true">
       <div 
         className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm animate-in fade-in duration-300 pointer-events-auto"
         onClick={onClose}
       />

       <div 
         className={`relative h-full bg-[#0f172a] shadow-2xl border-l border-slate-800 transition-all duration-300 ease-in-out pointer-events-auto flex flex-col animate-in slide-in-from-right-full ${
           isMaximized ? 'w-full' : 'w-[800px]'
         }`}
       >
          <header className="h-[60px] flex items-center justify-between px-6 border-b border-slate-800 bg-[#0f172a] shrink-0 z-20">
             <div className="flex items-center space-x-4">
                <div className="flex items-center text-slate-500 text-xs font-mono">
                   <SparklesIcon size={14} className="mr-2 text-indigo-400" />
                   <span>PLAYBOOK EDITOR</span>
                </div>
                {formData.isSystem && (
                   <span className="bg-slate-800 text-slate-500 text-[10px] font-bold px-1.5 py-0.5 rounded border border-slate-700">READ ONLY SYSTEM</span>
                )}
             </div>

             <div className="flex items-center space-x-2">
                <button 
                  onClick={() => setIsMaximized(!isMaximized)}
                  className="p-2 text-slate-500 hover:text-slate-200 rounded hover:bg-slate-800 transition-colors"
                >
                   {isMaximized ? <MinimizeIcon size={18} /> : <MaximizeIcon size={18} />}
                </button>
                <button 
                   onClick={onClose}
                   className="p-2 text-slate-500 hover:text-red-400 rounded hover:bg-red-500/10 transition-colors"
                >
                   <XIcon size={22} />
                </button>
             </div>
          </header>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-8 bg-[#0f172a]">
             <div className="max-w-3xl mx-auto space-y-10">
                
                {/* Basic Info */}
                <section className="space-y-6">
                   <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-3xl shadow-inner">
                         {formData.icon}
                      </div>
                      <div className="flex-1">
                         <input 
                            type="text" 
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                            placeholder="Playbook Title (e.g. Write Unit Tests)"
                            className="w-full bg-transparent text-3xl font-bold text-white placeholder-slate-700 outline-none focus:ring-0"
                         />
                         <input 
                            type="text" 
                            value={formData.trigger}
                            onChange={e => setFormData({ ...formData, trigger: e.target.value })}
                            placeholder="/trigger_command"
                            className="w-full bg-transparent text-sm font-mono text-indigo-400 placeholder-slate-700 outline-none focus:ring-0 mt-1"
                         />
                      </div>
                   </div>

                   <textarea 
                      value={formData.description}
                      onChange={e => setFormData({ ...formData, description: e.target.value })}
                      placeholder="What does this playbook do? Explain it to your team..."
                      className="w-full bg-transparent text-slate-300 text-sm leading-relaxed outline-none focus:ring-0 resize-none"
                      rows={2}
                   />
                </section>

                {/* Variables Section */}
                <section className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
                   <div className="flex items-center justify-between mb-4">
                      <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Template Variables</h3>
                      <button 
                        onClick={handleAddVariable}
                        className="text-[10px] text-indigo-400 hover:text-indigo-300 flex items-center font-bold"
                      >
                         <PlusIcon size={12} className="mr-1" /> ADD VARIABLE
                      </button>
                   </div>
                   
                   <div className="space-y-3">
                      {formData.variables.map((v) => (
                         <div key={v.id} className="flex items-start space-x-3 p-3 bg-slate-800/50 rounded-lg border border-slate-700 group">
                            <div className="flex-1 space-y-2">
                               <input 
                                  value={v.name}
                                  onChange={e => updateVariable(v.id, 'name', e.target.value)}
                                  placeholder="variableName"
                                  className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs font-mono text-emerald-400 outline-none focus:border-emerald-500"
                               />
                               <input 
                                  value={v.description}
                                  onChange={e => updateVariable(v.id, 'description', e.target.value)}
                                  placeholder="Variable description for the prompt UI"
                                  className="w-full bg-transparent text-[11px] text-slate-500 outline-none"
                               />
                            </div>
                            <button 
                              onClick={() => handleRemoveVariable(v.id)}
                              className="p-1 text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                               <TrashIcon size={14} />
                            </button>
                         </div>
                      ))}
                      {formData.variables.length === 0 && (
                         // Fix: Wrap double curly braces in text nodes to avoid shorthand property scope errors
                         <div className="text-center py-4 text-xs text-slate-600 italic">No custom variables defined. Use context variables like {'{{selectedCode}}'} by default.</div>
                      )}
                   </div>
                </section>

                {/* Prompt Template Section */}
                <section className="space-y-4">
                   <div className="flex items-center justify-between">
                      <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center">
                         <CodeIcon size={14} className="mr-2" />
                         Prompt Template
                      </h3>
                      {/* Fix: Wrap double curly braces in text nodes to avoid shorthand property scope errors */}
                      <span className="text-[9px] text-slate-600 font-mono">Use {'{{variableName}}'} for placeholders</span>
                   </div>
                   
                   <div className="relative group">
                      <div className="absolute -inset-1 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-xl blur-sm opacity-50"></div>
                      <textarea 
                         value={formData.promptTemplate}
                         onChange={e => setFormData({ ...formData, promptTemplate: e.target.value })}
                         className="relative w-full min-h-[300px] bg-slate-950 border border-slate-700 rounded-xl p-6 text-sm font-mono leading-relaxed text-slate-300 focus:outline-none focus:border-indigo-500 transition-all custom-scrollbar"
                         placeholder="You are an expert... Take the code: {{selectedCode}} and refactor it..."
                      />
                   </div>

                   {validationError && (
                      <div className="flex items-start p-3 bg-red-900/20 border border-red-500/30 rounded-lg text-red-400 text-xs animate-in slide-in-from-top-2">
                         <AlertTriangleIcon size={14} className="mr-2 mt-0.5 shrink-0" />
                         <span>{validationError}</span>
                      </div>
                   )}
                </section>

                {/* Configuration Row */}
                <section className="grid grid-cols-2 gap-8 pt-6 border-t border-slate-800">
                   <div className="space-y-3">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Output Mode</label>
                      <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-800">
                         {(['chat', 'edit', 'new_file'] as PlaybookOutputMode[]).map(mode => (
                            <button
                               key={mode}
                               onClick={() => setFormData({ ...formData, outputMode: mode })}
                               className={`flex-1 py-1.5 text-[10px] font-bold uppercase rounded transition-all ${
                                  formData.outputMode === mode 
                                  ? 'bg-indigo-600 text-white shadow-lg' 
                                  : 'text-slate-500 hover:text-slate-300'
                               }`}
                            >
                               {mode.replace('_', ' ')}
                            </button>
                         ))}
                      </div>
                   </div>

                   <div className="space-y-3">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Model Target</label>
                      <select 
                         value={formData.model}
                         onChange={e => setFormData({ ...formData, model: e.target.value })}
                         className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-xs text-slate-300 outline-none focus:border-indigo-500 appearance-none"
                      >
                         <option value="gemini-3-pro-preview">Gemini 3 Pro (Recommended)</option>
                         <option value="gemini-3-flash-preview">Gemini 3 Flash (Fast)</option>
                         <option value="gpt-4o">GPT-4o (Legacy)</option>
                      </select>
                   </div>
                </section>

             </div>
          </div>

          <footer className="h-[70px] border-t border-slate-800 bg-[#0f172a] px-8 flex items-center justify-between shrink-0">
             <div className="flex items-center text-[10px] text-slate-600 font-mono">
                <span>LAST SAVED: {formData.updatedAt}</span>
             </div>
             
             <div className="flex items-center space-x-3">
                <Button variant="ghost" onClick={onClose}>Discard</Button>
                <Button 
                   variant="primary" 
                   onClick={handleSubmit}
                   icon={<SaveIcon size={16} />}
                   className="shadow-[0_0_20px_rgba(79,70,229,0.3)]"
                >
                   Save Playbook
                </Button>
             </div>
          </footer>
       </div>
    </div>
  );
};

export default PlaybookEditor;
