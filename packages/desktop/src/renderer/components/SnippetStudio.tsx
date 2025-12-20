
import React, { useState, useMemo, useEffect } from 'react';
import { Snippet, SnippetSource } from '../types';
import { MOCK_SNIPPETS } from '../constants';
import Button from './Button';
import Badge from './Badge';
import { 
  SearchIcon, 
  PlusIcon, 
  TrashIcon, 
  SaveIcon, 
  RotateCwIcon, 
  ChevronRightIcon, 
  ChevronDownIcon, 
  LockIcon, 
  CodeIcon, 
  AlertTriangleIcon,
  HelpCircleIcon,
  ExternalLinkIcon,
  SparklesIcon,
  TerminalIcon,
  RefreshCwIcon,
  XIcon,
  /* Import missing CheckCircleIcon */
  CheckCircleIcon
} from './Icons';

const SnippetStudio: React.FC = () => {
  const [snippets, setSnippets] = useState<Snippet[]>(MOCK_SNIPPETS);
  const [selectedId, setSelectedId] = useState<string | null>(MOCK_SNIPPETS[0].id);
  const [searchQuery, setSearchQuery] = useState('');
  const [languageFilter, setLanguageFilter] = useState('All');
  const [isSaving, setIsSaving] = useState(false);

  const selectedSnippet = snippets.find(s => s.id === selectedId);

  // Grouping logic
  const groupedSnippets = useMemo(() => {
    const groups: Record<string, Snippet[]> = {};
    
    snippets
      .filter(s => {
        const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             s.prefix.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesLang = languageFilter === 'All' || s.scope.includes(languageFilter.toLowerCase());
        return matchesSearch && matchesLang;
      })
      .forEach(s => {
        const group = s.scope ? s.scope.split(',')[0].trim() : 'Global';
        if (!groups[group]) groups[group] = [];
        groups[group].push(s);
      });
    
    return groups;
  }, [snippets, searchQuery, languageFilter]);

  const handleUpdate = (field: keyof Snippet, value: string) => {
    if (!selectedId || selectedSnippet?.isLocked) return;
    setSnippets(prev => prev.map(s => s.id === selectedId ? { ...s, [field]: value } : s));
  };

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(r => setTimeout(r, 800));
    setIsSaving(false);
  };

  const handleCreateNew = () => {
    const newId = `sn-${Date.now()}`;
    const newSnippet: Snippet = {
      id: newId,
      name: 'New Snippet',
      prefix: 'new',
      scope: 'typescript',
      body: '// Insert code here',
      description: 'A new snippet',
      source: 'local',
      updatedAt: 'Just now'
    };
    setSnippets([...snippets, newSnippet]);
    setSelectedId(newId);
  };

  return (
    <div className="flex flex-col h-full bg-[#0f172a] text-slate-200 overflow-hidden font-sans">
      
      {/* 1. Header Toolbar */}
      <header className="h-[64px] border-b border-slate-800 bg-slate-900/50 backdrop-blur shrink-0 flex items-center justify-between px-8 z-30">
         <div className="flex items-center space-x-6">
            <h1 className="text-xl font-bold text-white tracking-tight flex items-center">
               <CodeIcon className="mr-2 text-indigo-500" size={22} />
               Snippet Studio
            </h1>

            <div className="h-6 w-px bg-slate-800" />

            <div className="relative">
               <SearchIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
               <input 
                  type="text" 
                  placeholder="Search shortcuts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-slate-800/80 border border-slate-700 rounded-md py-1.5 pl-9 pr-3 text-xs text-slate-300 focus:outline-none focus:border-indigo-500 w-64 transition-all"
               />
            </div>

            <select 
               value={languageFilter}
               onChange={(e) => setLanguageFilter(e.target.value)}
               className="bg-slate-800 border border-slate-700 rounded-md py-1.5 px-3 text-xs text-slate-300 outline-none focus:border-indigo-500"
            >
               <option>All Languages</option>
               <option>TypeScript</option>
               <option>React</option>
               <option>Python</option>
               <option>Global</option>
            </select>
         </div>

         <Button 
            variant="primary" 
            size="sm" 
            icon={<PlusIcon size={14} />}
            onClick={handleCreateNew}
         >
            New Snippet
         </Button>
      </header>

      {/* 2. Main Studio Split */}
      <div className="flex-1 flex overflow-hidden">
         
         {/* Sidebar: Snippet Tree */}
         <aside className="w-[300px] border-r border-slate-800 bg-slate-900/30 flex flex-col shrink-0">
            <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-4">
               {/* Fix: Explicitly cast Object.entries to correct type to avoid 'unknown' map error on line 142 */}
               {(Object.entries(groupedSnippets) as [string, Snippet[]][]).map(([group, groupSnippets]) => (
                  <div key={group}>
                     <h3 className="px-3 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center">
                        <ChevronDownIcon size={10} className="mr-2" />
                        {group}
                     </h3>
                     <div className="space-y-0.5">
                        {groupSnippets.map(sn => (
                           <button
                              key={sn.id}
                              onClick={() => setSelectedId(sn.id)}
                              className={`w-full flex items-center px-3 py-2 rounded-lg transition-all text-left group ${
                                 selectedId === sn.id 
                                    ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/30' 
                                    : 'bg-transparent hover:bg-slate-800/50 text-slate-400'
                              }`}
                           >
                              <div className="min-w-0 flex-1">
                                 <div className="flex items-center justify-between mb-0.5">
                                    <span className={`text-xs font-bold truncate ${selectedId === sn.id ? 'text-white' : 'text-slate-300'}`}>
                                       {sn.name}
                                    </span>
                                    {sn.isLocked && <LockIcon size={10} className="text-slate-600" />}
                                 </div>
                                 <div className="flex items-center justify-between">
                                    <code className="text-[10px] font-mono text-indigo-500/70 group-hover:text-indigo-400 transition-colors">
                                       {sn.prefix}
                                    </code>
                                    <span className="text-[9px] text-slate-600 font-mono">{sn.source.toUpperCase()}</span>
                                 </div>
                              </div>
                           </button>
                        ))}
                     </div>
                  </div>
               ))}
            </div>
            
            <div className="p-4 border-t border-slate-800 bg-slate-900/50">
               <div className="flex items-center text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">
                  <RotateCwIcon size={12} className="mr-2" /> Local Sync State
               </div>
               <div className="flex items-center justify-between text-[10px] text-emerald-500 font-mono">
                  <span>ALL CHANGES STAGED</span>
                  <span>10:45 AM</span>
               </div>
            </div>
         </aside>

         {/* Main Workspace: Editor + Details */}
         <main className="flex-1 flex flex-col bg-[#0f172a] relative overflow-hidden">
            {selectedSnippet ? (
               <>
                  {/* Metadata Form Header */}
                  <div className="shrink-0 p-8 border-b border-slate-800 space-y-6">
                     <div className="flex items-start justify-between">
                        <div className="flex-1 max-w-2xl space-y-1">
                           <input 
                              value={selectedSnippet.name}
                              onChange={(e) => handleUpdate('name', e.target.value)}
                              disabled={selectedSnippet.isLocked}
                              className="w-full bg-transparent border-none text-3xl font-bold text-white outline-none focus:ring-0 p-0 placeholder-slate-800"
                              placeholder="Snippet Name"
                           />
                           <input 
                              value={selectedSnippet.description}
                              onChange={(e) => handleUpdate('description', e.target.value)}
                              disabled={selectedSnippet.isLocked}
                              className="w-full bg-transparent border-none text-sm text-slate-400 outline-none focus:ring-0 p-0 placeholder-slate-800"
                              placeholder="Describe what this snippet expands into..."
                           />
                        </div>
                        <div className="flex flex-col items-end space-y-3">
                           <div className="flex space-x-2">
                              {selectedSnippet.source === 'team' && <Badge variant="info">TEAM SNIPPET</Badge>}
                              {selectedSnippet.isLocked && <Badge variant="neutral">LOCKED BY EXTENSION</Badge>}
                           </div>
                           <div className="text-[10px] font-mono text-slate-600">LAST MODIFIED: {selectedSnippet.updatedAt}</div>
                        </div>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="space-y-1.5">
                           <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Prefix (Trigger)</label>
                           <input 
                              value={selectedSnippet.prefix}
                              onChange={(e) => handleUpdate('prefix', e.target.value)}
                              disabled={selectedSnippet.isLocked}
                              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm font-mono text-indigo-400 focus:border-indigo-500 outline-none"
                           />
                        </div>
                        <div className="space-y-1.5">
                           <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Language Scope</label>
                           <input 
                              value={selectedSnippet.scope}
                              onChange={(e) => handleUpdate('scope', e.target.value)}
                              disabled={selectedSnippet.isLocked}
                              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-300 focus:border-indigo-500 outline-none"
                              placeholder="e.g. typescript, python"
                           />
                        </div>
                     </div>
                  </div>

                  {/* Editor Stage */}
                  <div className="flex-1 flex overflow-hidden">
                     
                     {/* Left: Code Editor (Simulated) */}
                     <div className="flex-1 flex flex-col bg-slate-950/50 overflow-hidden border-r border-slate-800 relative">
                        <div className="h-8 border-b border-slate-800 bg-slate-900/50 flex items-center px-4 justify-between">
                           <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Expansion Body</span>
                           <div className="flex items-center text-[10px] text-slate-600 space-x-3">
                              <span>UTF-8</span>
                              <span>|</span>
                              <span>TAB_STOPS: ACTIVE</span>
                           </div>
                        </div>
                        <div className="flex-1 relative overflow-hidden group">
                           {/* Gutter */}
                           <div className="absolute left-0 top-0 bottom-0 w-10 bg-slate-900/50 border-r border-slate-800/50 flex flex-col pt-6 font-mono text-[10px] text-slate-700 items-end pr-2 select-none">
                              {selectedSnippet.body.split('\n').map((_, i) => <div key={i} className="h-6 leading-6">{i+1}</div>)}
                           </div>
                           {/* Textarea disguised as editor */}
                           <textarea 
                              value={selectedSnippet.body}
                              onChange={(e) => handleUpdate('body', e.target.value)}
                              disabled={selectedSnippet.isLocked}
                              className="absolute inset-0 pl-14 pt-6 bg-transparent border-none text-sm font-mono leading-6 text-slate-300 focus:ring-0 resize-none selection:bg-indigo-500/30 custom-scrollbar"
                              spellCheck={false}
                           />
                           
                           {/* Syntax Overlay Mock (Highlight variables) */}
                           <div className="absolute inset-0 pl-14 pt-6 pointer-events-none opacity-0 group-focus-within:opacity-100 transition-opacity">
                              {/* In a real app we would overlay highlighted spans using regex */}
                           </div>
                        </div>

                        {/* Expansion Preview Tooltip */}
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-slate-800 border border-slate-700 rounded-lg p-3 shadow-2xl animate-in slide-in-from-bottom-2 opacity-0 group-hover:opacity-100 transition-all">
                           <div className="flex items-center text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-1">
                              <SparklesIcon size={12} className="mr-2" /> Live Preview
                           </div>
                           <pre className="text-xs text-slate-300 font-mono">
                              {selectedSnippet.body.replace(/\$\{\d+:([^}]+)\}/g, '$1').replace(/\$\d+/g, '_')}
                           </pre>
                        </div>
                     </div>

                     {/* Right: Cheatsheet Panel */}
                     <aside className="w-[280px] bg-slate-900 flex flex-col shrink-0">
                        <div className="p-6 border-b border-slate-800">
                           <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Snippet Variables</h3>
                           <div className="space-y-3">
                              <VariableItem name="$0" desc="Final cursor position" />
                              <VariableItem name="$1, $2" desc="Tab stops" />
                              <VariableItem name="${1:val}" desc="Placeholder text" />
                              <VariableItem name="$TM_FILENAME" desc="Current filename" />
                              <VariableItem name="$CURRENT_YEAR" desc="2024" />
                              <VariableItem name="$CLIPBOARD" desc="Paste buffer" />
                           </div>
                           <button className="mt-6 w-full py-2 border border-dashed border-slate-800 rounded text-[10px] text-slate-500 hover:text-indigo-400 hover:border-indigo-500 transition-all uppercase tracking-widest flex items-center justify-center">
                              <ExternalLinkIcon size={12} className="mr-2" /> Full Variable Spec
                           </button>
                        </div>

                        <div className="p-6 space-y-6">
                           <div className="space-y-4">
                              <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Conflict Guard</h3>
                              <div className="flex items-start p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-lg text-[11px] text-emerald-400/80">
                                 {/* Use CheckCircleIcon imported on line 304 */}
                                 <CheckCircleIcon size={14} className="mr-2 mt-0.5 shrink-0" />
                                 No keyword collisions detected in typescript.
                              </div>
                           </div>

                           <div className="pt-4 border-t border-slate-800">
                              <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Integrations</h3>
                              <button 
                                 className="w-full flex items-center justify-between p-3 bg-indigo-900/10 border border-indigo-500/20 rounded-lg hover:bg-indigo-900/20 transition-all group"
                              >
                                 <div className="flex flex-col items-start text-left">
                                    <span className="text-[10px] font-bold text-indigo-300 uppercase">AI Workflow</span>
                                    <span className="text-xs text-slate-400">Convert to Playbook</span>
                                 </div>
                                 <ChevronRightIcon size={14} className="text-indigo-500 group-hover:translate-x-1 transition-transform" />
                              </button>
                           </div>
                        </div>
                     </aside>
                  </div>

                  {/* Footer Actions */}
                  <footer className="h-[70px] border-t border-slate-800 bg-slate-900 px-8 flex items-center justify-between shrink-0">
                     <div className="flex items-center space-x-6">
                        <Button variant="ghost" className="text-red-400 hover:text-red-300 hover:bg-red-950/20" disabled={selectedSnippet.isLocked}>
                           <TrashIcon size={16} className="mr-2" /> Delete Snippet
                        </Button>
                        <Button variant="ghost" className="text-slate-500 hover:text-white">Duplicate</Button>
                     </div>
                     <div className="flex items-center space-x-3">
                        <Button variant="ghost" onClick={() => setSelectedId(null)}>Cancel</Button>
                        <Button 
                           variant="primary" 
                           onClick={handleSave}
                           disabled={isSaving || selectedSnippet.isLocked}
                           icon={isSaving ? <RotateCwIcon size={16} className="animate-spin" /> : <SaveIcon size={16} />}
                           className="min-w-[140px] shadow-[0_0_20px_rgba(79,70,229,0.3)]"
                        >
                           {isSaving ? 'Syncing...' : 'Save Snippet'}
                        </Button>
                     </div>
                  </footer>
               </>
            ) : (
               <div className="flex flex-col items-center justify-center h-full text-slate-600">
                  <div className="w-24 h-24 rounded-full border-2 border-dashed border-slate-800 flex items-center justify-center mb-6">
                     <CodeIcon size={48} className="opacity-10" />
                  </div>
                  <h2 className="text-xl font-bold">No Snippet Selected</h2>
                  <p className="max-w-xs text-center text-sm mt-2">Select an entry from the sidebar to edit its expansion rules or create a new one.</p>
                  <Button variant="secondary" className="mt-8" onClick={handleCreateNew}>Create New Shortcut</Button>
               </div>
            )}
         </main>

      </div>
    </div>
  );
};

const VariableItem: React.FC<{ name: string; desc: string }> = ({ name, desc }) => (
   <div className="group cursor-help">
      <div className="text-[11px] font-mono text-indigo-400 font-bold mb-0.5">{name}</div>
      <div className="text-[10px] text-slate-600 group-hover:text-slate-400 transition-colors">{desc}</div>
   </div>
);

export default SnippetStudio;
