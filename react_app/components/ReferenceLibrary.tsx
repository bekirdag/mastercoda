
import React, { useState, useMemo, useEffect } from 'react';
import { DocSet, DocChapter } from '../types';
import { MOCK_DOCSETS } from '../constants';
import Button from './Button';
import Badge from './Badge';
import { 
  SearchIcon, 
  BookOpenIcon, 
  ChevronRightIcon, 
  ChevronDownIcon, 
  SparklesIcon, 
  RotateCwIcon, 
  PlusIcon, 
  ArrowRightIcon, 
  AlertTriangleIcon,
  CodeIcon,
  ExternalLinkIcon,
  XCircleIcon,
  CheckCircleIcon,
  TerminalIcon
} from './Icons';

const ReferenceLibrary: React.FC = () => {
  const [docSets, setDocSets] = useState<DocSet[]>(MOCK_DOCSETS);
  const [activeDocSetId, setActiveDocSetId] = useState<string | null>(MOCK_DOCSETS[0].id);
  const [activeChapterId, setActiveChapterId] = useState<string | null>(MOCK_DOCSETS[0].chapters[0]?.children?.[0]?.id || null);
  const [searchQuery, setSearchQuery] = useState('');
  const [askAI, setAskAI] = useState(false);
  const [searchScope, setSearchScope] = useState<'all' | 'active'>('all');
  const [expandedDocSets, setExpandedDocSets] = useState<Set<string>>(new Set([MOCK_DOCSETS[0].id]));
  const [isReaderMode, setIsReaderMode] = useState(false);

  // Derive active content
  const activeDocSet = useMemo(() => docSets.find(ds => ds.id === activeDocSetId), [docSets, activeDocSetId]);
  
  const activeChapter = useMemo(() => {
    if (!activeDocSet) return null;
    let found: DocChapter | null = null;
    const findInChapters = (chapters: DocChapter[]) => {
      for (const ch of chapters) {
        if (ch.id === activeChapterId) { found = ch; return; }
        if (ch.children) findInChapters(ch.children);
      }
    };
    findInChapters(activeDocSet.chapters);
    return found;
  }, [activeDocSet, activeChapterId]);

  const toggleDocSet = (id: string) => {
    const next = new Set(expandedDocSets);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setExpandedDocSets(next);
  };

  const handleDownload = async (id: string) => {
    setDocSets(prev => prev.map(ds => ds.id === id ? { ...ds, status: 'downloaded' } : ds));
  };

  return (
    <div className="flex flex-col h-full bg-[#0f172a] text-slate-200 overflow-hidden font-sans">
      
      {/* 1. Omni-Search Header */}
      {!isReaderMode && (
        <header className="h-[64px] border-b border-slate-800 bg-slate-900 flex items-center justify-between px-6 shrink-0 z-30">
          <div className="flex-1 max-w-2xl flex items-center space-x-4">
             <div className="relative flex-1 group">
                <div className={`absolute -inset-0.5 rounded-lg blur opacity-20 transition duration-500 ${askAI ? 'bg-indigo-500 opacity-40' : 'bg-slate-700 opacity-0 group-focus-within:opacity-40'}`}></div>
                <div className="relative flex items-center bg-slate-800 border border-slate-700 rounded-lg shadow-inner">
                   <SearchIcon className={`ml-3 ${askAI ? 'text-indigo-400' : 'text-slate-500'}`} size={18} />
                   <input 
                      type="text" 
                      placeholder={askAI ? "Ask AI: 'How do I filter a list in Python?'" : "Search React, Python, and Node docs..."}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex-1 bg-transparent border-none text-sm text-white placeholder-slate-600 focus:ring-0 px-3 py-2.5"
                   />
                   <div className="flex items-center pr-3 space-x-2">
                      <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono font-medium text-slate-500 bg-slate-900 rounded border border-slate-700">⌘⇧F</kbd>
                   </div>
                </div>
             </div>

             <div className="flex items-center space-x-3">
                <select 
                   value={searchScope}
                   onChange={(e) => setSearchScope(e.target.value as any)}
                   className="bg-slate-800 border border-slate-700 rounded px-2 py-1.5 text-xs text-slate-300 outline-none focus:border-indigo-500"
                >
                   <option value="all">All Libraries</option>
                   <option value="active">Active Project Only</option>
                </select>

                <button 
                  onClick={() => setAskAI(!askAI)}
                  className={`flex items-center px-3 py-1.5 rounded border transition-all ${
                    askAI 
                    ? 'bg-indigo-600 border-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.5)]' 
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
                  }`}
                >
                   <SparklesIcon size={14} className={`mr-2 ${askAI ? 'animate-pulse' : ''}`} />
                   <span className="text-xs font-bold uppercase tracking-widest">Ask AI</span>
                </button>
             </div>
          </div>

          <div className="flex items-center space-x-4 ml-6">
             <button 
                onClick={() => setIsReaderMode(true)}
                className="p-2 text-slate-500 hover:text-white rounded hover:bg-slate-800 transition-colors"
                title="Reader Mode"
             >
                <BookOpenIcon size={20} />
             </button>
          </div>
        </header>
      )}

      {/* 2. Main content Layout */}
      <div className="flex-1 flex overflow-hidden">
         
         {/* Left Column: Library Sidebar */}
         {!isReaderMode && (
           <aside className="w-[280px] border-r border-slate-800 bg-slate-900/30 flex flex-col shrink-0">
              <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
                 
                 {/* Group: Active Project */}
                 <div className="mb-6">
                    <h3 className="px-3 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Active Project</h3>
                    <div className="space-y-1">
                       {docSets.filter(ds => ds.category === 'Active Project').map(ds => (
                          <div key={ds.id} className="space-y-0.5">
                             <DocSetItem 
                                ds={ds} 
                                isExpanded={expandedDocSets.has(ds.id)} 
                                onToggle={() => toggleDocSet(ds.id)}
                                isActive={activeDocSetId === ds.id}
                                onSelect={() => setActiveDocSetId(ds.id)}
                             />
                             {expandedDocSets.has(ds.id) && (
                                <div className="ml-4 border-l border-slate-800 pl-2 py-1 space-y-0.5">
                                   {ds.chapters.map(ch => (
                                      <ChapterTree 
                                         key={ch.id} 
                                         chapter={ch} 
                                         activeId={activeChapterId} 
                                         onSelect={setActiveChapterId} 
                                      />
                                   ))}
                                </div>
                             )}
                          </div>
                       ))}
                    </div>
                 </div>

                 {/* Group: Installed Extensions */}
                 <div className="mb-6">
                    <h3 className="px-3 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Installed Extensions</h3>
                    <div className="space-y-1">
                       {docSets.filter(ds => ds.category === 'Installed Extension').map(ds => (
                          <div key={ds.id}>
                             <DocSetItem 
                                ds={ds} 
                                isExpanded={expandedDocSets.has(ds.id)} 
                                onToggle={() => toggleDocSet(ds.id)}
                                isActive={activeDocSetId === ds.id}
                                onSelect={() => {
                                   if (ds.status !== 'not_downloaded') setActiveDocSetId(ds.id);
                                }}
                                onDownload={() => handleDownload(ds.id)}
                             />
                             {expandedDocSets.has(ds.id) && ds.status === 'downloaded' && (
                                <div className="ml-4 border-l border-slate-800 pl-2 py-1 space-y-0.5">
                                   {ds.chapters.map(ch => (
                                      <ChapterTree 
                                         key={ch.id} 
                                         chapter={ch} 
                                         activeId={activeChapterId} 
                                         onSelect={setActiveChapterId} 
                                      />
                                   ))}
                                </div>
                             )}
                          </div>
                       ))}
                    </div>
                 </div>

                 <button className="w-full flex items-center px-3 py-2 text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors uppercase tracking-widest">
                    <PlusIcon size={14} className="mr-2" /> Add DocSet
                 </button>
              </div>

              <div className="p-4 border-t border-slate-800 bg-slate-900/50">
                 <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                    <span>STORAGE: 1.2 GB</span>
                    <span className="text-emerald-500">OFFLINE_SYNC: OK</span>
                 </div>
              </div>
           </aside>
         )}

         {/* Center Column: Content Viewer */}
         <main className="flex-1 flex flex-col bg-[#0f172a] relative overflow-hidden">
            {activeDocSet && activeChapter ? (
               <>
                  <header className="h-10 border-b border-slate-800/50 bg-slate-900/50 flex items-center justify-between px-6 shrink-0 z-10">
                     <div className="flex items-center text-xs space-x-2">
                        <span className="text-slate-500">{activeDocSet.name}</span>
                        <ChevronRightIcon size={12} className="text-slate-700" />
                        <span className="text-slate-200 font-medium">{activeChapter.title}</span>
                     </div>
                     <div className="flex items-center space-x-3">
                        {isReaderMode && (
                           <button 
                             onClick={() => setIsReaderMode(false)}
                             className="text-xs text-slate-500 hover:text-white"
                           >Exit Reader</button>
                        )}
                        <select 
                           className="bg-transparent border-none text-[10px] font-bold text-slate-500 uppercase outline-none p-0 cursor-pointer hover:text-white"
                           value={activeDocSet.version}
                        >
                           {activeDocSet.versions.map(v => <option key={v} value={v}>{v}</option>)}
                        </select>
                     </div>
                  </header>

                  {activeDocSet.status === 'update_available' && (
                     <div className="bg-indigo-600/10 border-b border-indigo-500/20 px-6 py-1.5 flex items-center justify-between">
                        <div className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest flex items-center">
                           <RotateCwIcon size={12} className="mr-2" /> New version available for {activeDocSet.name}
                        </div>
                        <button className="text-[10px] font-bold text-white bg-indigo-600 px-2 py-0.5 rounded hover:bg-indigo-500 transition-colors">UPDATE</button>
                     </div>
                  )}

                  <div className="flex-1 overflow-y-auto custom-scrollbar p-12">
                     <div className="max-w-[800px] mx-auto animate-in fade-in duration-500">
                        <div className="prose prose-invert prose-indigo max-w-none">
                           <h1 className="text-5xl font-bold text-white mb-8 tracking-tight border-b border-slate-800 pb-8">
                              {activeChapter.title}
                           </h1>
                           
                           <div className="markdown-content text-slate-300 leading-relaxed text-lg font-light space-y-8">
                              <p>
                                 The <code>useEffect</code> Hook lets you perform side effects in functional components. 
                                 It’s a close replacement for <code>componentDidMount</code>, <code>componentDidUpdate</code>, 
                                 and <code>componentWillUnmount</code> combined.
                              </p>

                              <h2 className="text-2xl font-bold text-white pt-8 border-t border-slate-800">Basic Usage</h2>
                              <div className="bg-slate-900 rounded-xl border border-slate-700 overflow-hidden group">
                                 <div className="h-8 bg-slate-800/50 flex items-center justify-between px-4">
                                    <span className="text-[10px] font-bold text-slate-500 uppercase">React (TSX)</span>
                                    <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                       <button className="p-1 hover:text-white transition-colors" title="Copy"><CodeIcon size={14}/></button>
                                       <button className="p-1 hover:text-white transition-colors" title="Insert into Editor"><ArrowRightIcon size={14}/></button>
                                    </div>
                                 </div>
                                 <pre className="p-6 text-sm font-mono leading-relaxed overflow-x-auto selection:bg-indigo-500/30">
                                    <span className="text-indigo-400">useEffect</span>(() =&gt; {'{'}{"\n"}
                                    {"  "}console.<span className="text-emerald-400">log</span>(<span className="text-amber-300">'Component mounted'</span>);{"\n"}
                                    {"  "}<span className="text-slate-500">// Cleanup function</span>{"\n"}
                                    {"  "}<span className="text-indigo-400">return</span> () =&gt; {'{'}{"\n"}
                                    {"    "}console.<span className="text-emerald-400">log</span>(<span className="text-amber-300">'Component unmounted'</span>);{"\n"}
                                    {"  "}{'}'};{"\n"}
                                    {'}'}, []);
                                 </pre>
                              </div>

                              <div className="p-6 bg-indigo-900/10 border border-indigo-500/20 rounded-2xl flex items-start gap-4">
                                 <SparklesIcon size={20} className="text-indigo-400 mt-1" />
                                 <div>
                                    <h4 className="font-bold text-white mb-2">Agent Insight</h4>
                                    <p className="text-sm text-indigo-200/80 leading-relaxed">
                                       In React 18, <code>useEffect</code> runs twice in Development Mode with Strict Mode enabled to help identify missing cleanup functions. This is normal and won't happen in Production.
                                    </p>
                                    <button className="mt-3 text-[10px] font-bold text-indigo-400 uppercase tracking-widest hover:text-indigo-300">Generate Practical Example &rarr;</button>
                                 </div>
                              </div>

                              <h2 className="text-2xl font-bold text-white pt-8 border-t border-slate-800">Parameters</h2>
                              <ul className="space-y-4">
                                 <li className="flex items-start">
                                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 mr-3 shrink-0" />
                                    <div>
                                       <code className="text-white font-bold">setup</code>: The function with your Effect’s logic. Your setup function may also optionally return a cleanup function.
                                    </div>
                                 </li>
                                 <li className="flex items-start">
                                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 mr-3 shrink-0" />
                                    <div>
                                       <code className="text-white font-bold">dependencies</code> (optional): The list of all reactive values referenced inside of the setup code.
                                    </div>
                                 </li>
                              </ul>
                           </div>
                        </div>
                     </div>
                  </div>
               </>
            ) : (
               <div className="flex-1 flex flex-col items-center justify-center text-slate-600 opacity-50">
                  <BookOpenIcon size={64} className="mb-4" />
                  <p>Select a library and chapter to read</p>
               </div>
            )}
         </main>

         {/* Right Column: Table of Contents */}
         {!isReaderMode && (
           <aside className="w-[250px] border-l border-slate-800 bg-slate-900/30 flex flex-col shrink-0">
              <div className="p-6">
                 <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-6">In this Article</h3>
                 <nav className="space-y-4">
                    {activeChapter?.headers?.map(h => (
                       <a 
                          key={h.id} 
                          href={`#${h.id}`} 
                          className={`block text-xs transition-colors hover:text-white ${
                             h.level > 2 ? 'ml-4 text-slate-600' : 'text-slate-400 font-medium'
                          }`}
                       >
                          {h.text}
                       </a>
                    )) || (
                       <div className="text-xs text-slate-600 italic">No headers found</div>
                    )}
                 </nav>

                 <div className="mt-12 pt-6 border-t border-slate-800">
                    <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">AI Context</h3>
                    <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                       <div className="flex items-center text-xs text-emerald-400 font-bold mb-2">
                          <CheckCircleIcon size={14} className="mr-2" />
                          RAG_READY
                       </div>
                       <p className="text-[10px] text-slate-500 leading-relaxed">
                          This library is fully indexed. The Agent can answer specific questions about {activeDocSet?.name} APIs.
                       </p>
                    </div>
                 </div>
              </div>
           </aside>
         )}

      </div>
    </div>
  );
};

// Sub-components

const DocSetItem: React.FC<{ 
  ds: DocSet; 
  isExpanded: boolean; 
  isActive: boolean; 
  onToggle: () => void; 
  onSelect: () => void;
  onDownload?: () => void;
}> = ({ ds, isExpanded, isActive, onToggle, onSelect, onDownload }) => {
   const isNotDownloaded = ds.status === 'not_downloaded';
   
   return (
      <div 
         onClick={() => !isNotDownloaded && onSelect()}
         className={`flex items-center p-2 rounded-lg group cursor-pointer transition-all ${
            isActive ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20' : 'hover:bg-slate-800/50 text-slate-400'
         } ${isNotDownloaded ? 'opacity-50' : ''}`}
      >
         <button 
            onClick={(e) => { e.stopPropagation(); onToggle(); }}
            className={`p-1 hover:text-white transition-colors ${isNotDownloaded ? 'invisible' : ''}`}
         >
            {isExpanded ? <ChevronDownIcon size={14} /> : <ChevronRightIcon size={14} />}
         </button>
         <div className="w-6 h-6 rounded-md bg-slate-800 flex items-center justify-center mr-3 shrink-0 text-sm">
            {ds.icon}
         </div>
         <div className="min-w-0 flex-1">
            <div className="text-xs font-bold truncate group-hover:text-white transition-colors">{ds.name}</div>
            <div className="text-[10px] text-slate-600 font-mono">{ds.version}</div>
         </div>
         {isNotDownloaded ? (
            <button 
               onClick={(e) => { e.stopPropagation(); onDownload?.(); }}
               className="p-1.5 bg-indigo-600 text-white rounded hover:bg-indigo-500"
               title="Download for offline use"
            >
               <PlusIcon size={12} />
            </button>
         ) : ds.status === 'update_available' && (
            <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
         )}
      </div>
   );
};

const ChapterTree: React.FC<{ chapter: DocChapter; activeId: string | null; onSelect: (id: string) => void }> = ({ chapter, activeId, onSelect }) => {
   const [expanded, setExpanded] = useState(false);
   const isLeaf = !chapter.children;
   const isActive = activeId === chapter.id;

   return (
      <div className="select-none">
         <div 
            onClick={() => isLeaf ? onSelect(chapter.id) : setExpanded(!expanded)}
            className={`flex items-center py-1 px-2 rounded cursor-pointer text-xs transition-colors ${
               isActive ? 'bg-indigo-500/10 text-indigo-300 font-bold' : 'text-slate-500 hover:text-slate-300'
            }`}
         >
            {!isLeaf && (
               <span className="mr-1 text-slate-700">
                  {expanded ? <ChevronDownIcon size={10} /> : <ChevronRightIcon size={10} />}
               </span>
            )}
            <span className="truncate">{chapter.title}</span>
         </div>
         {expanded && chapter.children && (
            <div className="ml-3 border-l border-slate-800 pl-2 space-y-0.5 mt-0.5">
               {chapter.children.map(ch => (
                  <ChapterTree key={ch.id} chapter={ch} activeId={activeId} onSelect={onSelect} />
               ))}
            </div>
         )}
      </div>
   );
};

export default ReferenceLibrary;
