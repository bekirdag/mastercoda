
import React, { useState, useEffect } from 'react';
import { ExtensionStack, Extension } from '../types';
import { MOCK_STACKS, MOCK_EXTENSIONS } from '../constants';
import Button from './Button';
import Badge from './Badge';
import { 
  PackageIcon, 
  PlusIcon, 
  RefreshCwIcon, 
  ShareIcon, 
  CheckCircleIcon, 
  ChevronRightIcon, 
  MoreVerticalIcon, 
  TrashIcon, 
  Edit2Icon,
  RotateCwIcon,
  XIcon,
  SearchIcon,
  CloudIcon,
  ShieldIcon,
  AlertTriangleIcon
} from './Icons';

const ExtensionStacks: React.FC = () => {
  const [stacks, setStacks] = useState<ExtensionStack[]>(MOCK_STACKS);
  const [isRebooting, setIsRebooting] = useState(false);
  const [rebootMsg, setRebootMsg] = useState('');
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingStack, setEditingStack] = useState<ExtensionStack | null>(null);

  const activeStack = stacks.find(s => s.isActive);

  const handleActivate = async (stackId: string) => {
    const stack = stacks.find(s => s.id === stackId);
    if (!stack) return;

    setIsRebooting(true);
    setRebootMsg(`Preparing to switch to "${stack.name}"...`);
    
    // Unloading animation
    await new Promise(r => setTimeout(r, 1000));
    setRebootMsg("Unloading current environment agents...");
    
    await new Promise(r => setTimeout(r, 1500));
    setRebootMsg(`Activating ${stack.extensions.length} extensions...`);

    // Complete activation
    await new Promise(r => setTimeout(r, 1000));
    setStacks(prev => prev.map(s => ({
      ...s,
      isActive: s.id === stackId
    })));
    
    setIsRebooting(false);
  };

  const handleShare = (stack: ExtensionStack) => {
    const link = `mcoda://stack/import/${btoa(JSON.stringify({ id: stack.id, name: stack.name }))}`;
    navigator.clipboard.writeText(link);
    alert(`Share link copied to clipboard: ${link}`);
  };

  const handleEdit = (stack: ExtensionStack) => {
    setEditingStack(stack);
    setIsEditorOpen(true);
  };

  return (
    <div className="flex flex-col h-full bg-[#0f172a] text-slate-200 overflow-hidden font-sans relative">
      
      {/* Reboot Overlay */}
      {isRebooting && (
         <div className="absolute inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center animate-in fade-in duration-500">
            <div className="w-16 h-16 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin mb-6" />
            <h2 className="text-2xl font-bold text-white tracking-tight animate-pulse">{rebootMsg}</h2>
            <p className="text-slate-500 mt-2 font-mono text-xs uppercase tracking-widest">System reboot in progress</p>
         </div>
      )}

      {/* 1. Toolbar */}
      <header className="h-[64px] border-b border-slate-800 bg-slate-900/50 backdrop-blur shrink-0 flex items-center justify-between px-8 z-20">
         <div className="flex items-center space-x-6">
            <div>
               <h1 className="text-xl font-bold text-white tracking-tight flex items-center">
                  <PackageIcon className="mr-2 text-indigo-500" size={22} />
                  Extension Stacks
               </h1>
            </div>

            <div className="h-6 w-px bg-slate-800" />

            <div className="flex items-center text-xs space-x-2">
               <span className="text-slate-500 font-bold uppercase tracking-widest">Active Profile:</span>
               <span className="text-indigo-400 font-bold px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20">
                  {activeStack?.name || 'Default'}
               </span>
            </div>
         </div>

         <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" icon={<CloudIcon size={14} />}>Import .json</Button>
            <Button 
               variant="primary" 
               size="sm" 
               icon={<PlusIcon size={14} />}
               onClick={() => { setEditingStack(null); setIsEditorOpen(true); }}
            >
               Create New Stack
            </Button>
         </div>
      </header>

      {/* 2. Main Content */}
      <main className="flex-1 overflow-y-auto custom-scrollbar p-8">
         <div className="max-w-[900px] mx-auto space-y-10 animate-in fade-in duration-500">
            
            {/* Active Stack Hero Card */}
            {activeStack && (
               <section className="bg-slate-800 border-2 border-indigo-500/30 rounded-2xl shadow-2xl overflow-hidden relative group">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500" />
                  <div className="p-8">
                     <div className="flex items-start justify-between mb-8">
                        <div className="space-y-1">
                           <h2 className="text-3xl font-bold text-white tracking-tight flex items-center">
                              {activeStack.name}
                              <CheckCircleIcon size={20} className="text-emerald-500 ml-3" />
                           </h2>
                           <p className="text-slate-400 text-lg font-light leading-relaxed max-w-xl">
                              {activeStack.description}
                           </p>
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                           <Button variant="secondary" size="sm" icon={<ShareIcon size={14} />} onClick={() => handleShare(activeStack)}>Share Stack</Button>
                           {activeStack.syncedWith && (
                              <div className="flex items-center text-[10px] text-emerald-500 font-mono font-bold uppercase tracking-tighter">
                                 <RotateCwIcon size={10} className="mr-1.5" />
                                 Synced with {activeStack.syncedWith}
                              </div>
                           )}
                        </div>
                     </div>

                     <div className="flex items-end justify-between">
                        <div className="space-y-4">
                           <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Included Intelligence</h3>
                           <div className="flex -space-x-3">
                              {activeStack.extensions.map((extId, i) => {
                                 const ext = MOCK_EXTENSIONS.find(e => e.id === extId);
                                 return (
                                    <div 
                                       key={extId} 
                                       className="w-10 h-10 rounded-xl bg-slate-900 border-2 border-slate-800 flex items-center justify-center text-xl shadow-lg hover:z-10 hover:-translate-y-1 transition-all cursor-pointer"
                                       title={ext?.title}
                                    >
                                       {ext?.icon}
                                    </div>
                                 );
                              })}
                              <div className="w-10 h-10 rounded-xl bg-slate-700 border-2 border-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-400 shadow-lg">
                                 +12
                              </div>
                           </div>
                        </div>
                        <div className="text-right">
                           <div className="text-2xl font-bold text-white mb-1">15</div>
                           <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Enabled Extensions</div>
                        </div>
                     </div>
                  </div>
               </section>
            )}

            {/* Saved Stacks Grid */}
            <section className="space-y-6">
               <div className="flex items-center justify-between px-2">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center">
                     Available Stacks ({stacks.length})
                  </h3>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {stacks.map(stack => (
                     <StackCard 
                        key={stack.id} 
                        stack={stack} 
                        onActivate={() => handleActivate(stack.id)} 
                        onEdit={() => handleEdit(stack)}
                        onShare={() => handleShare(stack)}
                     />
                  ))}
               </div>
            </section>
         </div>
      </main>

      {/* Slide-over Editor */}
      {isEditorOpen && (
         <StackEditor 
            stack={editingStack} 
            onClose={() => setIsEditorOpen(false)}
            onSave={(newStack) => {
               if (editingStack) {
                  setStacks(stacks.map(s => s.id === newStack.id ? newStack : s));
               } else {
                  setStacks([...stacks, newStack]);
               }
               setIsEditorOpen(false);
            }}
         />
      )}

    </div>
  );
};

const StackCard: React.FC<{ stack: ExtensionStack; onActivate: () => void; onEdit: () => void; onShare: () => void }> = ({ stack, onActivate, onEdit, onShare }) => {
   return (
      <div className={`group relative flex flex-col h-full bg-slate-800/40 border rounded-xl p-6 transition-all duration-300 hover:bg-slate-800 shadow-sm hover:shadow-xl ${stack.isActive ? 'border-indigo-500/50 shadow-[0_0_20px_rgba(99,102,241,0.1)]' : 'border-slate-700/50 hover:border-slate-600'}`}>
         <div className="flex items-start justify-between mb-4">
            <div className="space-y-1 min-w-0 pr-4">
               <h4 className={`text-lg font-bold truncate transition-colors ${stack.isActive ? 'text-indigo-400' : 'text-white group-hover:text-indigo-200'}`}>
                  {stack.name}
               </h4>
               <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{stack.description}</p>
            </div>
            <button className="text-slate-600 hover:text-white transition-colors" onClick={(e) => { e.stopPropagation(); onEdit(); }}>
               <MoreVerticalIcon size={16} />
            </button>
         </div>

         <div className="flex-1 space-y-4">
            <div className="flex flex-wrap gap-1.5">
               {stack.extensions.slice(0, 3).map(extId => {
                  const ext = MOCK_EXTENSIONS.find(e => e.id === extId);
                  return (
                     <div key={extId} className="px-2 py-1 rounded bg-slate-900 border border-slate-700 text-[10px] text-slate-400 font-mono truncate max-w-[120px]">
                        {ext?.title}
                     </div>
                  );
               })}
               {stack.extensions.length > 3 && (
                  <div className="px-2 py-1 rounded bg-slate-900 border border-slate-700 text-[10px] text-slate-600 font-mono">
                     +{stack.extensions.length - 3} more
                  </div>
               )}
            </div>
         </div>

         <div className="mt-8 pt-4 border-t border-slate-700/50 flex items-center justify-between">
            <div className="flex items-center space-x-3 text-[10px] text-slate-500 font-mono uppercase">
               <span>{stack.updatedAt}</span>
               <span>•</span>
               <span>BY {stack.author.toUpperCase()}</span>
            </div>
            
            {stack.isActive ? (
               <div className="flex items-center text-xs font-bold text-emerald-500 animate-in zoom-in">
                  <CheckCircleIcon size={14} className="mr-1.5" />
                  ACTIVE
               </div>
            ) : (
               <button 
                  onClick={onActivate}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-bold uppercase tracking-widest transition-all shadow-lg shadow-indigo-900/20 active:scale-95"
               >
                  Activate
               </button>
            )}
         </div>

         {/* Hover Overlay Meta */}
         <div className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {stack.includeConfig && (
               <div className="bg-indigo-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded shadow-lg uppercase tracking-tighter">CONFIG_INCLUDED</div>
            )}
         </div>
      </div>
   );
};

const StackEditor: React.FC<{ stack: ExtensionStack | null; onClose: () => void; onSave: (s: ExtensionStack) => void }> = ({ stack, onClose, onSave }) => {
   const [name, setName] = useState(stack?.name || '');
   const [description, setDescription] = useState(stack?.description || '');
   const [selectedExtensions, setSelectedExtensions] = useState<Set<string>>(new Set(stack?.extensions || []));
   const [includeConfig, setIncludeConfig] = useState(stack?.includeConfig || false);

   const toggleExtension = (id: string) => {
      const next = new Set(selectedExtensions);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      setSelectedExtensions(next);
   };

   return (
      <div className="fixed inset-0 z-[60] flex items-center justify-end font-sans pointer-events-none" role="dialog" aria-modal="true">
         <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-300 pointer-events-auto" onClick={onClose} />
         <div className="relative h-full w-[500px] bg-[#0f172a] shadow-2xl border-l border-slate-800 transition-all duration-300 ease-in-out pointer-events-auto flex flex-col animate-in slide-in-from-right-full">
            
            <header className="h-16 border-b border-slate-800 px-6 flex items-center justify-between shrink-0">
               <h2 className="text-lg font-bold text-white flex items-center">
                  <PackageIcon size={20} className="mr-3 text-indigo-400" />
                  {stack ? 'Edit Stack' : 'New Stack'}
               </h2>
               <button onClick={onClose} className="p-2 text-slate-500 hover:text-white transition-colors">
                  <XIcon size={24} />
               </button>
            </header>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-8">
               <div className="space-y-4">
                  <div className="space-y-1.5">
                     <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Stack Name</label>
                     <input 
                        type="text" 
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="e.g. Frontend Core"
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                     />
                  </div>
                  <div className="space-y-1.5">
                     <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Description</label>
                     <textarea 
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        placeholder="Purpose of this bundle..."
                        className="w-full h-24 bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-slate-300 resize-none focus:outline-none focus:border-indigo-500"
                     />
                  </div>
               </div>

               <div className="space-y-4">
                  <div className="flex items-center justify-between">
                     <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Select Extensions</label>
                     <span className="text-[10px] text-indigo-400 font-mono">{selectedExtensions.size} Selected</span>
                  </div>
                  <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar border border-slate-800 rounded-xl p-2 bg-slate-900/50">
                     {MOCK_EXTENSIONS.map(ext => (
                        <div 
                           key={ext.id} 
                           onClick={() => toggleExtension(ext.id)}
                           className={`flex items-center p-3 rounded-lg border transition-all cursor-pointer ${selectedExtensions.has(ext.id) ? 'bg-indigo-500/10 border-indigo-500/50' : 'hover:bg-slate-800 border-transparent'}`}
                        >
                           <div className={`w-4 h-4 rounded border flex items-center justify-center mr-4 transition-colors ${selectedExtensions.has(ext.id) ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-600 bg-slate-950'}`}>
                              {selectedExtensions.has(ext.id) && <CheckCircleIcon size={12} />}
                           </div>
                           <div className="text-xl mr-3">{typeof ext.icon === 'string' ? ext.icon : '🔧'}</div>
                           <div className="min-w-0 flex-1">
                              <div className="text-xs font-bold text-slate-200 truncate">{ext.title}</div>
                              <div className="text-[10px] text-slate-500 truncate uppercase">{ext.author}</div>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>

               <div 
                  onClick={() => setIncludeConfig(!includeConfig)}
                  className="flex items-center p-4 bg-slate-800/50 rounded-xl border border-slate-700 cursor-pointer group hover:border-indigo-500/30 transition-all"
               >
                  <div className={`w-10 h-5 rounded-full p-1 transition-all duration-300 relative mr-4 ${includeConfig ? 'bg-indigo-600' : 'bg-slate-900'}`}>
                     <div className={`w-3 h-3 bg-white rounded-full shadow-sm transition-transform duration-300 ${includeConfig ? 'translate-x-5' : 'translate-x-0'}`} />
                  </div>
                  <div className="flex-1">
                     <p className="text-sm font-bold text-slate-200">Include Local Configuration</p>
                     <p className="text-[11px] text-slate-500 leading-relaxed">Save specific rules and environment variables with this stack.</p>
                  </div>
                  <ShieldIcon size={18} className={`transition-colors ${includeConfig ? 'text-indigo-400' : 'text-slate-700'}`} />
               </div>
            </div>

            <footer className="h-20 border-t border-slate-800 bg-slate-900 px-8 flex items-center justify-end space-x-3 shrink-0">
               <Button variant="ghost" onClick={onClose}>Discard</Button>
               <Button 
                  variant="primary" 
                  disabled={!name || selectedExtensions.size === 0}
                  onClick={() => onSave({
                     id: stack?.id || `stack-${Date.now()}`,
                     name,
                     description,
                     extensions: Array.from(selectedExtensions),
                     isActive: stack?.isActive || false,
                     author: 'Alex Dev',
                     updatedAt: 'Just now',
                     includeConfig
                  })}
               >
                  {stack ? 'Save Changes' : 'Create Stack'}
               </Button>
            </footer>

         </div>
      </div>
   );
};

export default ExtensionStacks;
