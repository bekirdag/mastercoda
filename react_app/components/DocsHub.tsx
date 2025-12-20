
import React, { useState, useMemo } from 'react';
import { DocPage, DocSource } from '../types';
import { MOCK_DOC_PAGES, MOCK_DOC_SOURCES } from '../constants';
import Button from './Button';
import Badge from './Badge';
import { 
  SearchIcon, 
  SparklesIcon, 
  StarIcon, 
  ClockIcon, 
  FileTextIcon, 
  FolderIcon, 
  ActivityIcon, 
  ChevronRightIcon, 
  PlusIcon, 
  ExternalLinkIcon,
  ShieldIcon,
  ZapIcon,
  LockIcon,
  BookOpenIcon,
  HistoryIcon,
  RotateCwIcon,
  CheckCircleIcon,
  GlobeIcon
} from './Icons';

const DocsHub: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeScope, setActiveScope] = useState('All');
  const [isAskingAI, setIsAskingAI] = useState(false);
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);

  const scopes = ['All', 'Engineering', 'Product', 'External APIs'];

  // Data Filtering
  const recentlyViewed = useMemo(() => MOCK_DOC_PAGES.filter(p => p.lastViewedAt).sort((a, b) => b.lastViewedAt!.localeCompare(a.lastViewedAt!)), []);
  const pinnedDocs = useMemo(() => MOCK_DOC_PAGES.filter(p => p.isPinned), []);
  const drafts = useMemo(() => MOCK_DOC_PAGES.filter(p => p.isDraft), []);

  const handleAskAI = async () => {
    if (!searchQuery) return;
    setIsAskingAI(true);
    setAiAnswer(null);
    // Simulate AI thinking
    await new Promise(r => setTimeout(r, 1800));
    setAiAnswer(`Based on the **Core Backend** specs and **Engineering Standards**: \n\nWe handle 404s by throwing a custom \`ResourceNotFoundException\` which is intercepted by the global \`ApiExceptionFilter\`. This ensuring all error responses follow the JSend specification.`);
    setIsAskingAI(false);
  };

  const handleCreateNew = () => {
    const evt = new CustomEvent('app-navigate', { detail: '/docs/edit/new' });
    window.dispatchEvent(evt);
  };

  const handleManageSite = () => {
    const evt = new CustomEvent('app-navigate', { detail: '/docs/manage/site-config' });
    window.dispatchEvent(evt);
  };

  return (
    <div className="min-h-full bg-[#0f172a] text-slate-200 font-sans pb-32">
      
      {/* 1. Hero Search Section */}
      <section className="relative pt-20 pb-16 px-6 flex flex-col items-center overflow-hidden">
         {/* Background Glow */}
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-600/10 blur-[120px] -z-10 pointer-events-none" />
         
         <div className="w-full max-w-3xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="text-center space-y-2">
               <h1 className="text-4xl font-bold text-white tracking-tight">Documentation Hub</h1>
               <p className="text-slate-400 text-lg font-light">Search the entire knowledge base—projects, wikis, and APIs.</p>
            </div>

            {/* Search Bar Container */}
            <div className="relative group">
               <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-2xl blur opacity-25 group-focus-within:opacity-100 transition duration-500"></div>
               <div className="relative flex flex-col bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden">
                  <div className="flex items-center p-4">
                     <SearchIcon className="text-slate-500 mr-4" size={24} />
                     <input 
                        autoFocus
                        type="text" 
                        placeholder="Search the knowledge base... (Press / to focus)" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAskAI()}
                        className="flex-1 bg-transparent border-none text-xl text-white placeholder-slate-600 focus:ring-0"
                     />
                     <div className="flex items-center space-x-2">
                        <button 
                           onClick={handleAskAI}
                           disabled={!searchQuery || isAskingAI}
                           className={`flex items-center px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                              searchQuery 
                              ? 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-900/40' 
                              : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                           }`}
                        >
                           {isAskingAI ? <RotateCwIcon size={16} className="animate-spin mr-2" /> : <SparklesIcon size={16} className="mr-2" />}
                           {isAskingAI ? 'Consulting...' : 'Ask AI'}
                        </button>
                     </div>
                  </div>
                  
                  {/* Scope Pills */}
                  <div className="px-4 pb-4 flex items-center justify-between">
                     <div className="flex items-center space-x-2">
                        {scopes.map(s => (
                           <button 
                              key={s}
                              onClick={() => setActiveScope(s)}
                              className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all border ${
                                 activeScope === s 
                                 ? 'bg-indigo-500/10 border-indigo-500 text-indigo-400' 
                                 : 'bg-slate-900/50 border-slate-700 text-slate-500 hover:text-slate-300 hover:border-slate-600'
                              }`}
                           >
                              {s}
                           </button>
                        ))}
                     </div>
                     <button 
                        onClick={handleManageSite}
                        className="flex items-center text-[10px] font-bold text-indigo-400 hover:text-indigo-300 uppercase tracking-widest transition-all"
                     >
                        <GlobeIcon size={12} className="mr-1.5" /> Manage Public Site
                     </button>
                  </div>
               </div>

               {/* AI Answer Result */}
               {aiAnswer && (
                  <div className="mt-6 p-6 bg-indigo-950/30 border border-indigo-500/30 rounded-2xl animate-in zoom-in-95 duration-300">
                     <div className="flex items-center text-xs font-bold text-indigo-400 uppercase tracking-widest mb-4">
                        <SparklesIcon size={14} className="mr-2" /> AI Summary Result
                     </div>
                     <p className="text-slate-200 leading-relaxed font-light whitespace-pre-wrap">
                        {aiAnswer}
                     </p>
                     <div className="mt-4 pt-4 border-t border-indigo-500/10 flex items-center justify-between">
                        <span className="text-[10px] text-slate-500 font-mono">SOURCES: Core Backend Specs, Engineering Standard v2</span>
                        <button className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 uppercase tracking-tighter">View Detailed Citations &rsaquo;</button>
                     </div>
                  </div>
               )}
            </div>
         </div>
      </section>

      {/* 2. Quick Access Grid */}
      <section className="max-w-7xl mx-auto px-6 mb-16">
         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Recently Viewed */}
            <QuickGridColumn title="Recently Viewed" icon={<HistoryIcon size={16} />}>
               {recentlyViewed.map(doc => (
                  <DocListItem key={doc.id} doc={doc} sub={doc.lastViewedAt} />
               ))}
            </QuickGridColumn>

            {/* Pinned / Starred */}
            <QuickGridColumn title="Pinned Resources" icon={<StarIcon size={16} />}>
               {pinnedDocs.map(doc => (
                  <DocListItem key={doc.id} doc={doc} />
               ))}
               {pinnedDocs.length === 0 && <p className="text-slate-600 italic text-xs py-4">No pinned items</p>}
            </QuickGridColumn>

            {/* Drafts */}
            <QuickGridColumn title="My Drafts" icon={<FileTextIcon size={16} />}>
               {drafts.map(doc => (
                  <DocListItem key={doc.id} doc={doc} />
               ))}
               <button 
                  onClick={handleCreateNew}
                  className="w-full mt-2 py-2 border border-dashed border-slate-700 rounded-lg text-[10px] font-bold text-slate-500 hover:text-indigo-400 hover:border-indigo-500 transition-all uppercase tracking-widest"
               >
                  + Create New Document
               </button>
            </QuickGridColumn>

         </div>
      </section>

      {/* 3. Source Browser */}
      <section className="max-w-7xl mx-auto px-6">
         <div className="flex items-center justify-between mb-8">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em] flex items-center">
               <BookOpenIcon size={18} className="mr-3 text-indigo-400" />
               The Source Library
            </h2>
            <div className="flex items-center space-x-2">
               <span className="text-[10px] text-slate-600 font-mono">INDEX_STATUS: SYNCED</span>
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            </div>
         </div>

         <div className="space-y-12">
            <SourceGroup title="Active Projects" sources={MOCK_DOC_SOURCES.filter(s => s.type === 'project')} />
            <SourceGroup title="Team Spaces" sources={MOCK_DOC_SOURCES.filter(s => s.type === 'team')} />
            <SourceGroup title="External References" sources={MOCK_DOC_SOURCES.filter(s => s.type === 'external')} />
         </div>
      </section>

    </div>
  );
};

// Sub-components

const QuickGridColumn: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
   <div className="space-y-4">
      <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center border-b border-slate-800 pb-2">
         <span className="mr-2 text-indigo-400">{icon}</span>
         {title}
      </h3>
      <div className="space-y-2">
         {children}
      </div>
   </div>
);

const DocListItem: React.FC<{ doc: DocPage; sub?: string }> = ({ doc, sub }) => (
   <div className="group flex items-center justify-between p-3 rounded-xl hover:bg-slate-800 transition-all cursor-pointer border border-transparent hover:border-slate-700">
      <div className="flex items-center min-w-0">
         <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
            <FileTextIcon size={14} className="text-slate-500 group-hover:text-indigo-400" />
         </div>
         <div className="min-w-0">
            <div className="text-sm font-bold text-slate-300 group-hover:text-white transition-colors truncate">{doc.title}</div>
            {sub && <div className="text-[10px] text-slate-600 font-mono uppercase">{sub}</div>}
         </div>
      </div>
      <ChevronRightIcon size={14} className="text-slate-700 group-hover:text-slate-400 opacity-0 group-hover:opacity-100 transition-all" />
   </div>
);

const SourceGroup: React.FC<{ title: string; sources: DocSource[] }> = ({ title, sources }) => (
   <div className="space-y-6">
      <h3 className="text-sm font-bold text-white tracking-tight pl-2">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {sources.map(src => (
            <SourceCard key={src.id} source={src} />
         ))}
      </div>
   </div>
);

const SourceCard: React.FC<{ source: DocSource }> = ({ source }) => (
   <div className="group relative flex flex-col h-full bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6 hover:bg-slate-800 hover:border-indigo-500/50 hover:-translate-y-1 transition-all duration-300 shadow-sm hover:shadow-2xl cursor-pointer overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-5 transform rotate-12 group-hover:scale-125 transition-transform duration-700">
         <div className="text-6xl">{typeof source.icon === 'string' ? source.icon : null}</div>
      </div>
      
      <div className="flex items-center space-x-4 mb-4">
         <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-2xl group-hover:bg-indigo-600 group-hover:text-white transition-colors">
            {source.icon}
         </div>
         <div>
            <h4 className="font-bold text-white group-hover:text-indigo-200 transition-colors">{source.name}</h4>
            <div className="flex items-center text-[10px] font-mono text-slate-500">
               <span>{source.pageCount} PAGES</span>
               <span className="mx-2">•</span>
               <span>UPDATED {source.lastUpdated.toUpperCase()}</span>
            </div>
         </div>
      </div>

      <p className="text-xs text-slate-400 leading-relaxed mb-6 line-clamp-2">
         {source.description}
      </p>

      <div className="mt-auto flex items-center justify-between">
         <div className="flex -space-x-1">
            {[1, 2, 3].map(i => (
               <div key={i} className="w-5 h-5 rounded-full border border-slate-800 bg-slate-700 flex items-center justify-center text-[8px] font-bold">
                  {String.fromCharCode(64 + i)}
               </div>
            ))}
         </div>
         <button className="flex items-center text-[10px] font-bold text-slate-500 hover:text-white uppercase tracking-widest transition-all">
            Open Space <ChevronRightIcon size={12} className="ml-1" />
         </button>
      </div>
   </div>
);

export default DocsHub;
