import React, { useState, useMemo, useEffect } from 'react';
import { Keybinding, KeymapProfile } from '../types';
import { MOCK_KEYBINDINGS, MOCK_KEYMAP_PROFILES } from '../constants';
import Button from './Button';
/* Fix: Added missing Badge import to resolve "Cannot find name 'Badge'" error on line 176. */
import Badge from './Badge';
import VisualKeyboard from './VisualKeyboard';
import { 
  SearchIcon, 
  PlusIcon, 
  RotateCwIcon, 
  SettingsIcon, 
  ChevronRightIcon, 
  AlertTriangleIcon,
  TrashIcon,
  Edit2Icon,
  FilterIcon,
  CodeIcon,
  ShieldIcon,
  ActivityIcon,
  CheckCircleIcon,
  XIcon
} from './Icons';

const KeymapManager: React.FC = () => {
  const [keybindings, setKeybindings] = useState<Keybinding[]>(MOCK_KEYBINDINGS);
  const [activeProfile, setActiveProfile] = useState<string>('def');
  const [searchQuery, setSearchQuery] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [highlightKey, setHighlightKey] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [viewJson, setViewJson] = useState(false);
  const [flashingRows, setFlashingRows] = useState<Set<string>>(new Set());

  const profiles = MOCK_KEYMAP_PROFILES;

  const filteredBindings = useMemo(() => {
    return keybindings.filter(kb => {
      const matchSearch = kb.commandLabel.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          kb.key.toLowerCase().includes(searchQuery.toLowerCase());
      const matchKey = !highlightKey || kb.key.toLowerCase().includes(highlightKey.toLowerCase());
      return matchSearch && matchKey;
    });
  }, [keybindings, searchQuery, highlightKey]);

  const stats = useMemo(() => ({
    total: keybindings.length,
    conflicts: keybindings.filter(k => k.hasConflict).length,
    custom: keybindings.filter(k => !k.isDefault).length
  }), [keybindings]);

  // Handle Recording Mode
  useEffect(() => {
    if (!isRecording) return;

    const handleKey = (e: KeyboardEvent) => {
      e.preventDefault();
      e.stopPropagation();
      
      const parts = [];
      if (e.metaKey || e.ctrlKey) parts.push('meta');
      if (e.shiftKey) parts.push('shift');
      if (e.altKey) parts.push('alt');
      
      const key = e.key.toLowerCase();
      if (!['meta', 'control', 'shift', 'alt'].includes(key)) {
        parts.push(key);
      }

      if (parts.length > 0) {
        const fullKey = parts.join('+');
        setSearchQuery(fullKey);
        setIsRecording(false);
      }
    };

    window.addEventListener('keydown', handleKey, true);
    return () => window.removeEventListener('keydown', handleKey, true);
  }, [isRecording]);

  const handleUnbind = (id: string) => {
    setKeybindings(prev => prev.map(kb => kb.id === id ? { ...kb, key: 'None', hasConflict: false } : kb));
  };

  const handleReset = (id: string) => {
    setKeybindings(prev => prev.map(kb => kb.id === id ? { ...kb, key: kb.isDefault ? MOCK_KEYBINDINGS.find(m => m.id === id)?.key || '' : kb.key, hasConflict: false } : kb));
  };

  const handleSaveBinding = (id: string, newKey: string) => {
     setKeybindings(prev => prev.map(kb => kb.id === id ? { ...kb, key: newKey, hasConflict: false, isDefault: false } : kb));
     setEditingId(null);
     
     // Trigger flash success animation
     setFlashingRows(prev => new Set(prev).add(id));
     setTimeout(() => {
        setFlashingRows(prev => {
            const next = new Set(prev);
            next.delete(id);
            return next;
        });
     }, 1000);
  };

  return (
    <div className="flex flex-col h-full bg-[#0f172a] text-slate-200 overflow-hidden font-sans">
      
      {/* 1. Global Keymap Toolbar */}
      <header className="h-[64px] border-b border-slate-800 bg-slate-900/50 backdrop-blur shrink-0 flex items-center justify-between px-8 z-30 sticky top-0 shadow-lg">
         <div className="flex items-center space-x-6">
            <div className="flex items-center">
               <div className="bg-indigo-600 p-1.5 rounded mr-3 shadow-lg shadow-indigo-900/20">
                  <div className="flex space-x-0.5"><div className="w-1 h-2 bg-white/40 rounded-sm"/><div className="w-1 h-2 bg-white/40 rounded-sm"/><div className="w-1 h-2 bg-white rounded-sm"/></div>
               </div>
               <h1 className="text-xl font-bold text-white tracking-tight">Keymap Manager</h1>
            </div>

            <div className="h-6 w-px bg-slate-800" />

            <div className="flex items-center space-x-4">
               {/* Search & Record */}
               <div className="flex items-center space-x-2">
                  <div className="relative group">
                     <SearchIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-all" />
                     <input 
                        type="text" 
                        placeholder={isRecording ? "Press key combination..." : "Search commands..."}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={`bg-slate-800/80 border border-slate-700 rounded-md py-1.5 pl-9 pr-3 text-xs text-slate-300 focus:outline-none focus:border-indigo-500 w-64 transition-all ${isRecording ? 'ring-2 ring-red-500/50 border-red-500/50 bg-red-950/10' : ''}`}
                     />
                  </div>
                  <button 
                    onClick={() => setIsRecording(!isRecording)}
                    className={`p-2 rounded border transition-all ${isRecording ? 'bg-red-500/20 border-red-500 text-red-500 animate-pulse' : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'}`}
                    title="Record Keys"
                  >
                     <div className="w-3 h-3 rounded-full bg-current" />
                  </button>
               </div>

               {/* Profile Select */}
               <div className="flex items-center space-x-4">
                  <div className="flex flex-col">
                     <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest leading-none mb-1">Keymap Profile</span>
                     <select 
                        className="bg-transparent border-none text-xs font-bold text-indigo-400 outline-none p-0 cursor-pointer"
                        value={activeProfile}
                        onChange={(e) => setActiveProfile(e.target.value)}
                     >
                        {profiles.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                     </select>
                  </div>
               </div>
            </div>
         </div>

         <div className="flex items-center space-x-3">
            <button 
              onClick={() => setViewJson(!viewJson)}
              className={`flex items-center px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-widest transition-all ${viewJson ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-white'}`}
            >
               <CodeIcon size={14} className="mr-2" />
               {viewJson ? 'View Table' : 'Open JSON'}
            </button>
            <div className="h-4 w-px bg-slate-800" />
            <Button variant="secondary" size="sm" icon={<RotateCwIcon size={14} />}>Reset All</Button>
            <Button variant="primary" size="sm" icon={<PlusIcon size={14} />}>Add Binding</Button>
         </div>
      </header>

      {/* 2. Main Split Area */}
      <div className="flex-1 flex overflow-hidden">
         
         {/* LEFT: Command List or JSON Editor */}
         <main className="flex-1 flex flex-col min-w-0 border-r border-slate-800 relative">
            {viewJson ? (
                <div className="flex-1 flex flex-col bg-slate-950 p-6 overflow-hidden">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-[10px] font-bold text-slate-500 uppercase font-mono">keybindings.json</span>
                        <Badge variant="warning">MANUAL_OVERRIDE_MODE</Badge>
                    </div>
                    <textarea 
                        className="flex-1 bg-slate-900/50 border border-slate-800 rounded-xl p-6 font-mono text-sm text-indigo-300 focus:outline-none focus:border-indigo-500 custom-scrollbar resize-none"
                        value={JSON.stringify(keybindings, null, 2)}
                        readOnly
                    />
                    <div className="mt-4 flex justify-end space-x-3">
                        <Button variant="ghost" size="sm" onClick={() => setViewJson(false)}>Close Editor</Button>
                        <Button variant="primary" size="sm">Download Config</Button>
                    </div>
                </div>
            ) : (
                <>
                    {/* Stats Row */}
                    <div className="h-10 bg-slate-900/50 border-b border-slate-800 px-6 flex items-center justify-between shrink-0">
                       <div className="flex items-center space-x-6 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                          <div className="flex items-center">
                             <ActivityIcon size={12} className="mr-2 text-indigo-400" />
                             {stats.total} Commands
                          </div>
                          {stats.conflicts > 0 && (
                             <div className="flex items-center text-red-400">
                                <AlertTriangleIcon size={12} className="mr-2" />
                                {stats.conflicts} Conflicts detected
                             </div>
                          )}
                          <div className="flex items-center">
                             <CheckCircleIcon size={12} className="mr-2 text-emerald-500" />
                             {stats.custom} User Overrides
                          </div>
                       </div>
                       <div className="flex items-center space-x-2 text-[10px] text-slate-600 font-mono">
                          <span>CONTEXT_ENGINE: V3_ACTIVE</span>
                       </div>
                    </div>

                    {/* List Body */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                       <table className="w-full text-left border-collapse">
                          <thead className="bg-slate-900 sticky top-0 z-20">
                             <tr className="text-[10px] font-bold text-slate-600 uppercase tracking-widest border-b border-slate-800">
                                <th className="px-6 py-3 w-[40%]">Command</th>
                                <th className="px-6 py-3">Keybinding</th>
                                <th className="px-6 py-3">When / Context</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                             </tr>
                          </thead>
                          <tbody>
                             {filteredBindings.map(kb => (
                                <tr 
                                   key={kb.id} 
                                   className={`group border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors ${kb.hasConflict ? 'bg-red-950/10' : ''} ${flashingRows.has(kb.id) ? 'animate-flash-green' : ''}`}
                                >
                                   <td className="px-6 py-4">
                                      <div className="flex items-center space-x-3">
                                         {kb.hasConflict && (
                                            <div className="p-1 rounded bg-red-500/20 text-red-500" title="Conflict with another binding">
                                               <AlertTriangleIcon size={12} />
                                            </div>
                                         )}
                                         <div className="min-w-0">
                                            <div className="text-sm font-medium text-slate-200 truncate group-hover:text-indigo-200 transition-colors">{kb.commandLabel}</div>
                                            <div className="text-[10px] font-mono text-slate-500 truncate flex items-center mt-0.5">
                                               {kb.source}
                                               {kb.source !== 'System' && <ChevronRightIcon size={8} className="mx-1" />}
                                               <span className="text-slate-600">{kb.commandId}</span>
                                            </div>
                                         </div>
                                      </div>
                                   </td>
                                   <td className="px-6 py-4">
                                      <div className="flex items-center space-x-1">
                                         {kb.key === 'None' ? (
                                            <span className="text-xs text-slate-600 italic">Not Bound</span>
                                         ) : (
                                            kb.key.split('+').map((key, i) => (
                                               <React.Fragment key={i}>
                                                  <kbd className="px-1.5 py-0.5 rounded bg-slate-700 border border-slate-600 text-[10px] font-bold text-slate-300 uppercase shadow-sm">
                                                     {key.replace('meta', '⌘').replace('shift', '⇧').replace('alt', '⌥')}
                                                  </kbd>
                                                  {i < kb.key.split('+').length - 1 && <span className="text-slate-600 text-[10px] mx-0.5">+</span>}
                                               </React.Fragment>
                                            ))
                                         )}
                                      </div>
                                   </td>
                                   <td className="px-6 py-4">
                                      <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/5 px-2 py-0.5 rounded border border-indigo-500/20">
                                         {kb.when}
                                      </span>
                                   </td>
                                   <td className="px-6 py-4">
                                      <div className="flex items-center justify-end space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                         <button 
                                           onClick={() => setEditingId(kb.id)}
                                           className="p-1.5 text-slate-500 hover:text-white hover:bg-slate-700 rounded transition-colors" title="Edit"
                                         >
                                            <Edit2Icon size={14} />
                                         </button>
                                         <button 
                                           onClick={() => handleReset(kb.id)}
                                           className="p-1.5 text-slate-500 hover:text-indigo-400 hover:bg-slate-700 rounded transition-colors" title="Reset to Default"
                                         >
                                            <RotateCwIcon size={14} />
                                         </button>
                                         <button 
                                           onClick={() => handleUnbind(kb.id)}
                                           className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-950/30 rounded transition-colors" title="Unbind"
                                         >
                                            <TrashIcon size={14} />
                                         </button>
                                      </div>
                                   </td>
                                </tr>
                             ))}
                          </tbody>
                       </table>
                    </div>
                </>
            )}
         </main>

         {/* RIGHT: Visual Keyboard & Inspector (350px) */}
         <aside className="w-[380px] bg-slate-900/30 flex flex-col shrink-0">
            <div className="p-6 border-b border-slate-800 bg-slate-900/50">
               <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-6">Visual Heatmap</h3>
               <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 shadow-inner">
                  <VisualKeyboard 
                     onKeyClick={setHighlightKey} 
                     activeKey={highlightKey}
                     heatmapData={keybindings}
                  />
               </div>
               <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                     <div className="w-2 h-2 rounded bg-slate-800" />
                     <span className="text-[9px] text-slate-600 font-bold uppercase">Unused</span>
                     <div className="w-2 h-2 rounded bg-indigo-500" />
                     <span className="text-[9px] text-slate-600 font-bold uppercase">Bound</span>
                  </div>
                  <button 
                    onClick={() => setHighlightKey(null)}
                    className="text-[9px] font-bold text-indigo-400 hover:text-indigo-300 uppercase underline"
                  >
                    Clear Filter
                  </button>
               </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
               
               {/* Selection Inspector */}
               <section className="space-y-4">
                  <div className="flex items-center justify-between">
                     <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Context Inspector</h3>
                     {highlightKey && <kbd className="px-1.5 py-0.5 rounded bg-indigo-600 text-white text-[10px] font-bold">{highlightKey.toUpperCase()}</kbd>}
                  </div>
                  
                  {highlightKey ? (
                     <div className="space-y-2">
                        {filteredBindings.map(kb => (
                           <div key={kb.id} className="p-3 bg-slate-800/40 border border-slate-700/50 rounded-xl hover:border-indigo-500/30 transition-all">
                              <div className="text-xs font-bold text-slate-200 mb-1">{kb.commandLabel}</div>
                              <div className="flex items-center justify-between">
                                 <span className="text-[9px] font-mono text-indigo-400">{kb.when}</span>
                                 <span className="text-[9px] font-mono text-slate-500 uppercase">{kb.source}</span>
                              </div>
                           </div>
                        ))}
                        {filteredBindings.length === 0 && (
                           <p className="text-xs text-slate-600 text-center py-4 italic">No specific bindings found for this key.</p>
                        )}
                     </div>
                  ) : (
                     <div className="py-8 flex flex-col items-center justify-center text-center space-y-3 opacity-30">
                        <ActivityIcon size={32} />
                        <p className="text-xs text-slate-400">Click a key on the virtual board to audit its context priority.</p>
                     </div>
                  )}
               </section>

               <div className="h-px bg-slate-800" />

               {/* Advanced Settings */}
               <section className="space-y-4">
                  <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Global Options</h3>
                  <div className="space-y-4">
                     <ToggleOption label="Intercept System Shortcuts" description="Allow Master Coda to override OS commands like Cmd+W" />
                     <ToggleOption label="Display Chord Hints" description="Show command hints in the status bar while typing chords" defaultChecked />
                  </div>
               </section>

               {/* Conflict Summary Box */}
               {stats.conflicts > 0 && (
                  <div className="bg-red-950/10 border border-red-500/20 rounded-xl p-4 space-y-3">
                     <div className="flex items-center text-red-400 text-[10px] font-bold uppercase tracking-widest">
                        <AlertTriangleIcon size={14} className="mr-2" />
                        Unresolved Collisions
                     </div>
                     <p className="text-[10px] text-red-300/70 leading-relaxed">
                        Multiple extensions are fighting for <code className="text-red-400 font-bold">Meta + K</code>. System default priority will be applied unless manually overridden.
                     </p>
                     <Button variant="destructive" size="sm" className="w-full text-[9px] h-7 uppercase font-bold tracking-widest">Auto-Resolve All</Button>
                  </div>
               )}

            </div>
         </aside>

      </div>

      {/* 3. Edit Dialog (Overlay) */}
      {editingId && (
         <BindingDialog 
            binding={keybindings.find(k => k.id === editingId)!} 
            existingBindings={keybindings}
            onClose={() => setEditingId(null)}
            onSave={(newKey) => handleSaveBinding(editingId, newKey)}
         />
      )}

    </div>
  );
};

const ToggleOption: React.FC<{ label: string; description: string; defaultChecked?: boolean }> = ({ label, description, defaultChecked = false }) => {
   const [checked, setChecked] = useState(defaultChecked);
   return (
      <div className="flex items-start justify-between group cursor-pointer" onClick={() => setChecked(!checked)}>
         <div className="flex-1 pr-4">
            <div className="text-[11px] font-bold text-slate-300 group-hover:text-white transition-colors">{label}</div>
            <p className="text-[10px] text-slate-500 mt-0.5 leading-tight">{description}</p>
         </div>
         <div className={`w-8 h-4 rounded-full p-0.5 transition-all mt-1 relative ${checked ? 'bg-indigo-600' : 'bg-slate-800'}`}>
            <div className={`w-3 h-3 bg-white rounded-full transition-all ${checked ? 'translate-x-4' : 'translate-x-0'}`} />
         </div>
      </div>
   );
};

const BindingDialog: React.FC<{ binding: Keybinding; existingBindings: Keybinding[]; onClose: () => void; onSave: (key: string) => void }> = ({ binding, existingBindings, onClose, onSave }) => {
   const [inputKey, setInputKey] = useState(binding.key);

   const conflict = useMemo(() => {
     if (inputKey === 'None' || inputKey === binding.key) return null;
     return existingBindings.find(b => b.key === inputKey);
   }, [inputKey, existingBindings, binding.key]);

   useEffect(() => {
      const handleKey = (e: KeyboardEvent) => {
         e.preventDefault();
         e.stopPropagation();

         if (e.key === 'Escape') {
            onClose();
            return;
         }

         if (e.key === 'Enter' && inputKey !== 'None') {
            onSave(inputKey);
            return;
         }

         const keys = [];
         if (e.metaKey || e.ctrlKey) keys.push('meta');
         if (e.shiftKey) keys.push('shift');
         if (e.altKey) keys.push('alt');
         
         const key = e.key.toLowerCase();
         if (!['meta', 'control', 'shift', 'alt'].includes(key)) {
            keys.push(key);
         }

         if (keys.length > 0) {
            setInputKey(keys.join('+'));
         }
      };

      window.addEventListener('keydown', handleKey, true);
      return () => window.removeEventListener('keydown', handleKey, true);
   }, [inputKey, onClose, onSave]);

   return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-300">
         <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 ring-1 ring-white/10">
            <div className="p-6 border-b border-slate-800">
               <h3 className="text-lg font-bold text-white mb-1">Edit Keybinding</h3>
               <p className="text-xs text-slate-500 uppercase tracking-widest font-mono">{binding.commandLabel}</p>
            </div>
            
            <div className="p-8 flex flex-col items-center space-y-8">
               <div className="flex items-center space-x-2">
                  {inputKey === 'None' ? (
                     <div className="text-slate-600 italic">Press any key sequence...</div>
                  ) : (
                     inputKey.split('+').map((k, i) => (
                        <div key={i} className="flex items-center">
                           <kbd className="px-4 py-2 rounded-xl bg-slate-800 border-2 border-slate-700 text-xl font-bold text-indigo-400 shadow-lg min-w-[60px] text-center animate-in zoom-in">
                              {k.replace('meta', '⌘').replace('shift', '⇧').replace('alt', '⌥')}
                           </kbd>
                           {i < inputKey.split('+').length - 1 && <span className="text-2xl text-slate-700 mx-2">+</span>}
                        </div>
                     ))
                  )}
               </div>

               <div className="text-center space-y-4">
                  <p className="text-sm text-slate-400">Capture mode is active. System keys are intercepted.</p>
                  
                  {conflict ? (
                    <div className="p-4 bg-amber-950/20 border border-amber-500/30 rounded-xl text-left animate-in slide-in-from-top-1">
                        <div className="flex items-center text-amber-500 text-[10px] font-bold uppercase tracking-widest mb-2">
                            <AlertTriangleIcon size={14} className="mr-2" /> Conflict Detected
                        </div>
                        <p className="text-xs text-amber-200/80 leading-relaxed">
                            ⚠️ <code className="font-bold text-amber-400">{inputKey.toUpperCase()}</code> is already used by <strong className="text-white">'{conflict.commandLabel}'</strong>. Do you want to replace it?
                        </p>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-4">
                        <div className="flex items-center text-[10px] text-slate-500">
                           <span className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 mr-2 font-mono text-white">ESC</span>
                           To Cancel
                        </div>
                        <div className="flex items-center text-[10px] text-slate-500">
                           <span className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 mr-2 font-mono text-white">ENTER</span>
                           To Save
                        </div>
                    </div>
                  )}
               </div>
            </div>

            <div className="p-6 bg-slate-950/50 border-t border-slate-800 flex items-center justify-end space-x-3">
               <Button variant="ghost" onClick={onClose}>Cancel</Button>
               <Button variant="primary" onClick={() => onSave(inputKey)} disabled={inputKey === 'None'}>
                  {conflict ? 'Replace Binding' : 'Save Binding'}
               </Button>
            </div>
         </div>
      </div>
   );
};

export default KeymapManager;
