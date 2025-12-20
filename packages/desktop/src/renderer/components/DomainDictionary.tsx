
import React, { useState, useMemo } from 'react';
import { DictionaryTerm, DictionaryCategory } from '../types';
import { MOCK_DICTIONARY } from '../constants';
import Button from './Button';
import Badge from './Badge';
// Fix: Added missing AlertTriangleIcon to imports to fix the error on line 233.
import { 
  SearchIcon, 
  PlusIcon, 
  BookOpenIcon, 
  ChevronRightIcon, 
  ActivityIcon, 
  ShieldIcon, 
  ActivityIcon as PulseIcon,
  ChevronDownIcon,
  CodeIcon,
  DatabaseIcon,
  TrashIcon,
  UserIcon,
  LockIcon,
  TerminalIcon,
  ArrowRightIcon,
  SparklesIcon,
  AlertTriangleIcon
} from './Icons';

const DomainDictionary: React.FC = () => {
  const [terms, setTerms] = useState<DictionaryTerm[]>(MOCK_DICTIONARY);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<DictionaryCategory | 'all'>('all');
  const [selectedTermId, setSelectedTermId] = useState<string | null>(null);

  const categories: (DictionaryCategory | 'all')[] = ['all', 'business', 'technical', 'acronym'];

  const filteredTerms = useMemo(() => {
    return terms.filter(t => {
      const matchesSearch = t.term.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.definition.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.acronym?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'all' || t.category === activeCategory;
      return matchesSearch && matchesCategory;
    }).sort((a, b) => a.term.localeCompare(b.term));
  }, [terms, searchQuery, activeCategory]);

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  const alphaIndex = useMemo(() => {
    const map: Record<string, string[]> = {};
    filteredTerms.forEach(t => {
      const char = t.term[0].toUpperCase();
      if (!map[char]) map[char] = [];
      map[char].push(t.id);
    });
    return map;
  }, [filteredTerms]);

  const selectedTerm = useMemo(() => 
    selectedTermId ? terms.find(t => t.id === selectedTermId) : filteredTerms[0]
  , [selectedTermId, terms, filteredTerms]);

  const toggleAiContext = (id: string) => {
    setTerms(prev => prev.map(t => t.id === id ? { ...t, includeInAiContext: !t.includeInAiContext } : t));
  };

  return (
    <div className="flex flex-col h-full bg-[#0f172a] text-slate-200 overflow-hidden font-sans">
      
      {/* 1. Search Header */}
      <header className="h-[64px] border-b border-slate-800 bg-slate-900/50 backdrop-blur shrink-0 flex items-center justify-between px-8 z-30 sticky top-0 shadow-lg">
         <div className="flex items-center space-x-6 flex-1 max-w-4xl">
            <div className="flex items-center">
               <BookOpenIcon className="mr-3 text-indigo-400" size={24} />
               <h1 className="text-xl font-bold text-white tracking-tight uppercase">Domain Dictionary</h1>
            </div>

            <div className="h-6 w-px bg-slate-800" />

            <div className="flex-1 relative group">
               <SearchIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-all" />
               <input 
                  type="text" 
                  placeholder="Define a term... (e.g. Churn, ARR, Session)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-10 pr-3 py-2 text-sm text-white focus:border-indigo-500 outline-none transition-all"
               />
            </div>

            <div className="flex bg-slate-800 rounded p-1 border border-slate-700 shrink-0">
               {categories.map(c => (
                  <button
                     key={c}
                     onClick={() => setActiveCategory(c)}
                     className={`px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider transition-all ${
                        activeCategory === c ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'
                     }`}
                  >
                     {c}
                  </button>
               ))}
            </div>
         </div>

         <Button variant="primary" size="sm" icon={<PlusIcon size={14} />} className="ml-6">New Term</Button>
      </header>

      {/* 2. Main Content Split */}
      <div className="flex-1 flex overflow-hidden">
         
         {/* LEFT: Alphabetical Index (250px) */}
         <aside className="w-[250px] border-r border-slate-800 bg-slate-900/30 flex flex-col shrink-0">
            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-6">
               {alphabet.map(letter => {
                  const ids = alphaIndex[letter];
                  if (!ids) return null;
                  return (
                     <div key={letter}>
                        <h3 className="px-3 py-1 text-[10px] font-bold text-slate-600 uppercase tracking-widest border-b border-slate-800 mb-2">{letter}</h3>
                        <div className="space-y-0.5">
                           {ids.map(id => {
                              const t = terms.find(term => term.id === id)!;
                              const isActive = selectedTermId === id || (!selectedTermId && selectedTerm?.id === id);
                              return (
                                 <button
                                    key={id}
                                    onClick={() => setSelectedIdAndScroll(id)}
                                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition-all group ${
                                       isActive 
                                       ? 'bg-indigo-600/10 text-indigo-400 font-bold border-l-2 border-indigo-500' 
                                       : 'text-slate-500 hover:bg-slate-800 hover:text-slate-300'
                                    }`}
                                 >
                                    {t.term}
                                 </button>
                              );
                           })}
                        </div>
                     </div>
                  );
               })}
               {filteredTerms.length === 0 && (
                  <div className="text-center py-10 text-slate-700 italic text-xs">No terms found</div>
               )}
            </div>
         </aside>

         {/* CENTER: Term Detail Pane */}
         <main className="flex-1 overflow-y-auto custom-scrollbar bg-[#0d1117] p-12">
            <div className="max-w-3xl mx-auto space-y-12 animate-in fade-in duration-500 pb-20">
               {selectedTerm ? (
                  <dl className="space-y-12">
                     {/* Term Header */}
                     <div className="space-y-6">
                        <div className="flex items-start justify-between">
                           <div className="space-y-2">
                              <dt className="sr-only">Term</dt>
                              <dd className="text-5xl font-extrabold text-white tracking-tight">{selectedTerm.term}</dd>
                              {selectedTerm.acronym && (
                                 <div className="flex items-center space-x-2 text-indigo-400 font-mono text-sm font-bold">
                                    <ActivityIcon size={14} />
                                    <span>ACRONYM: {selectedTerm.acronym}</span>
                                 </div>
                              )}
                           </div>
                           <div className="flex flex-col items-end space-y-3">
                              <Badge variant={selectedTerm.category === 'business' ? 'info' : selectedTerm.category === 'technical' ? 'neutral' : 'warning'}>
                                 {selectedTerm.category.toUpperCase()}
                              </Badge>
                              <div 
                                 onClick={() => toggleAiContext(selectedTerm.id)}
                                 className="flex items-center p-2 rounded-xl bg-slate-800/50 border border-slate-700 cursor-pointer group hover:border-indigo-500/30 transition-all select-none"
                              >
                                 <div className={`w-8 h-4 rounded-full p-0.5 transition-all duration-300 relative mr-3 ${selectedTerm.includeInAiContext ? 'bg-indigo-600 shadow-[0_0_10px_rgba(99,102,241,0.4)]' : 'bg-slate-900'}`}>
                                    <div className={`w-3 h-3 bg-white rounded-full shadow-sm transition-transform duration-300 ${selectedTerm.includeInAiContext ? 'translate-x-4' : 'translate-x-0'}`} />
                                 </div>
                                 <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest group-hover:text-slate-300">AI Context</span>
                              </div>
                           </div>
                        </div>

                        <div className="p-8 bg-slate-800/40 border border-slate-700/50 rounded-3xl shadow-inner">
                           <dt className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Definition</dt>
                           <dd className="text-xl text-slate-200 leading-relaxed font-light">{selectedTerm.definition}</dd>
                        </div>
                     </div>

                     {/* Synonyms & Owner */}
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-slate-800 pt-8">
                        <div>
                           <dt className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Synonyms</dt>
                           <dd className="flex flex-wrap gap-2">
                              {selectedTerm.synonyms.map(s => (
                                 <span key={s} className="px-2 py-1 rounded bg-slate-800 text-slate-400 text-xs border border-slate-700 hover:text-indigo-400 hover:border-indigo-500/30 transition-colors cursor-pointer">{s}</span>
                              ))}
                              {selectedTerm.synonyms.length === 0 && <span className="text-slate-600 text-xs italic">None recorded</span>}
                           </dd>
                        </div>
                        <div>
                           <dt className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Domain Owner</dt>
                           <dd className="flex items-center space-x-3 bg-slate-900/50 p-3 rounded-2xl border border-slate-800">
                              <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-indigo-400 shadow-lg">
                                 <UserIcon size={16} />
                              </div>
                              <span className="text-sm font-bold text-slate-300">{selectedTerm.owner || 'Unassigned'}</span>
                           </dd>
                        </div>
                     </div>

                     {/* The Killer Feature: Code Mapping */}
                     <section className="space-y-6">
                        <div className="flex items-center justify-between">
                           <dt className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center">
                              <CodeIcon size={14} className="mr-2 text-indigo-400" />
                              Technical Implementation
                           </dt>
                           {selectedTerm.codeMappings.length === 0 && <Badge variant="error">UNMAPPED</Badge>}
                        </div>
                        <dd className="space-y-3">
                           {selectedTerm.codeMappings.map((m, i) => (
                              <div key={i} className="flex items-center justify-between p-4 bg-[#0a0f1e] border border-slate-800 rounded-2xl group hover:border-indigo-500/30 transition-all shadow-inner">
                                 <div className="flex items-center space-x-4">
                                    <div className={`p-2 rounded-lg bg-slate-900 border border-slate-800 ${m.type === 'table' ? 'text-amber-400' : 'text-indigo-400'}`}>
                                       {m.type === 'table' ? <DatabaseIcon size={18} /> : <CodeIcon size={18} />}
                                    </div>
                                    <div>
                                       <div className="text-sm font-bold text-white group-hover:text-indigo-200 transition-colors">{m.label}</div>
                                       <div className="text-[10px] font-mono text-slate-600 truncate max-w-sm">{m.path}</div>
                                    </div>
                                 </div>
                                 <button className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity">Open in Editor &rsaquo;</button>
                              </div>
                           ))}
                           {selectedTerm.codeMappings.length === 0 && (
                              <div className="p-6 bg-red-950/10 border border-red-900/20 rounded-2xl flex items-start space-x-4">
                                 <AlertTriangleIcon size={18} className="text-red-500 mt-0.5 shrink-0" />
                                 <p className="text-xs text-red-300/80 leading-relaxed italic">
                                    This term is defined in business docs but has no explicit technical mapping. Is this a conceptual-only entity?
                                 </p>
                              </div>
                           )}
                        </dd>
                     </section>

                     {/* Usage Examples */}
                     <section className="space-y-4">
                        <dt className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">In-context Usage</dt>
                        <dd className="space-y-3">
                           {selectedTerm.usageExamples.map((ex, i) => (
                              <div key={i} className="p-4 bg-slate-900 border border-slate-800 rounded-2xl italic text-sm text-slate-400 border-l-4 border-l-indigo-500/30">
                                 "{ex}"
                              </div>
                           ))}
                        </dd>
                     </section>

                     {/* Context Conflicts (Conditional Tabs) */}
                     {selectedTerm.conflicts && (
                        <section className="space-y-4 border-t border-slate-800 pt-10">
                           <dt className="text-[10px] font-bold text-red-500 uppercase tracking-[0.2em] flex items-center">
                              <ShieldIcon size={14} className="mr-2" />
                              Term Overloading Detectec
                           </dt>
                           <dd className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
                              <div className="flex border-b border-slate-800">
                                 {selectedTerm.conflicts.map(c => (
                                    <button key={c.context} className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-white border-r border-slate-800 last:border-r-0 transition-colors">
                                       Context: {c.context}
                                    </button>
                                 ))}
                              </div>
                              <div className="p-6 text-sm text-slate-400 leading-relaxed italic">
                                 Switch context tabs above to see how this term changes definition across departments.
                              </div>
                           </dd>
                        </section>
                     )}
                  </dl>
               ) : (
                  <div className="flex flex-col items-center justify-center py-40 text-slate-700 opacity-20">
                     <BookOpenIcon size={80} className="mb-6" />
                     <p className="text-2xl font-bold uppercase tracking-[0.3em]">Ambiguity Terminal</p>
                  </div>
               )}
            </div>
         </main>
      </div>

      {/* 3. Global Status Bar (Footer) */}
      <footer className="h-10 bg-slate-900 border-t border-slate-800 shrink-0 px-8 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-slate-500 z-30">
         <div className="flex items-center space-x-8">
            <div className="flex items-center">
               <PulseIcon size={12} className="mr-2 text-indigo-400" />
               DICTIONARY_INDEX: <span className="ml-2 text-emerald-500 font-mono">100% SYNCED</span>
            </div>
            <div className="flex items-center">
               <ShieldIcon size={12} className="mr-2 text-indigo-400" />
               UBIQUITOUS_LANGUAGE: <span className="ml-2 text-slate-300">ACTIVE_ENFORCEMENT</span>
            </div>
         </div>
         <div className="flex items-center space-x-4">
            <span className="text-slate-600 font-mono">NODE_HASH: DICT_V1_72</span>
            <div className="h-3 w-px bg-slate-800" />
            <button className="text-indigo-400 hover:text-indigo-300">Export Glossary &rsaquo;</button>
         </div>
      </footer>
    </div>
  );

  function setSelectedIdAndScroll(id: string) {
    setSelectedTermId(id);
    // In a real app we might scroll to definition top if on mobile or small screens
  }
};

export default DomainDictionary;
