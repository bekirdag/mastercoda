
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { DocPage, DocFolder, DocComment } from '../types';
import { MOCK_DOC_PAGES, MOCK_DOC_FOLDERS, MOCK_DOC_COMMENTS } from '../constants';
import Button from './Button';
import { 
  FolderIcon, 
  FileTextIcon, 
  ChevronRightIcon, 
  ChevronDownIcon, 
  SearchIcon, 
  PlusIcon, 
  SparklesIcon, 
  ActivityIcon,
  TagIcon,
  LinkIcon,
  ClockIcon,
  RotateCwIcon,
  Edit2Icon,
  SaveIcon,
  CodeIcon,
  MoreVerticalIcon,
  StarIcon,
  XIcon,
  MessageSquareIcon,
  ShareIcon,
  GlobeIcon,
  // Fix: Added missing ShieldIcon import to resolve error on line 264
  ShieldIcon
} from './Icons';

const Documentation: React.FC = () => {
  const [pages, setPages] = useState<DocPage[]>(MOCK_DOC_PAGES);
  const [folders] = useState<DocFolder[]>(MOCK_DOC_FOLDERS);
  const [activePageId, setActivePageId] = useState<string>(MOCK_DOC_PAGES[0].id);
  const [isEditing, setIsEditing] = useState(false);
  const [rightTab, setRightTab] = useState<'outline' | 'insights' | 'discussion'>('outline');
  const [activeSection, setActiveSection] = useState<string>('');
  
  const activePage = pages.find(p => p.id === activePageId);
  const siblings = activePage ? pages.filter(p => p.folderId === activePage.folderId) : [];
  const comments = activePage ? MOCK_DOC_COMMENTS[activePage.id] || [] : [];

  // Refs for Scroll Spy
  const contentRef = useRef<HTMLDivElement>(null);
  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, { rootMargin: '-10% 0% -80% 0%' });

    const headings = contentRef.current?.querySelectorAll('h1, h2, h3');
    headings?.forEach((h) => observer.current?.observe(h));

    return () => observer.current?.disconnect();
  }, [activePageId, isEditing]);

  const handleCopyLink = (id: string) => {
    const url = `${window.location.origin}/docs/view/${activePageId}#${id}`;
    navigator.clipboard.writeText(url);
    alert('Link copied to clipboard');
  };

  return (
    <div className="flex h-full bg-[#0f172a] text-slate-200 overflow-hidden font-sans">
      
      {/* 1. Left Sidebar: Collection Navigation (250px) */}
      <aside className="w-[250px] border-r border-slate-800 bg-slate-900/50 flex flex-col shrink-0">
        <div className="p-4 border-b border-slate-800 bg-slate-900/80">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.15em] mb-3">Collection</div>
          <div className="flex items-center space-x-2 text-indigo-400">
             <FolderIcon size={16} />
             <span className="text-sm font-bold truncate">
                {folders.find(f => f.id === activePage?.folderId)?.name.toUpperCase() || 'ROOT'}
             </span>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto custom-scrollbar p-2">
          {siblings.map(page => (
            <button
              key={page.id}
              onClick={() => setActivePageId(page.id)}
              className={`w-full flex items-center px-3 py-2.5 rounded-lg text-xs transition-all group ${
                activePageId === page.id 
                  ? 'bg-indigo-600/10 text-indigo-400 font-bold border-l-2 border-indigo-500' 
                  : 'text-slate-500 hover:bg-slate-800 hover:text-slate-300'
              }`}
            >
              <FileTextIcon size={14} className={`mr-2.5 shrink-0 ${activePageId === page.id ? 'text-indigo-400' : 'text-slate-600'}`} />
              <span className="truncate">{page.title}</span>
            </button>
          ))}
          
          <div className="mt-6 px-2">
            <button className="w-full flex items-center justify-center py-2 rounded-lg border border-dashed border-slate-700 text-slate-600 hover:text-slate-400 hover:border-slate-600 transition-all text-[10px] font-bold uppercase tracking-widest">
              + Add Document
            </button>
          </div>
        </nav>
      </aside>

      {/* 2. Main Center: The Reader View (Standard Tri-Pane Center) */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        
        {/* Context Bar (Header) */}
        <header className="h-[40px] border-b border-slate-800 bg-slate-900 flex items-center justify-between px-6 shrink-0 z-30">
          <div className="flex items-center text-[10px] font-bold text-slate-500 space-x-2">
            <span className="hover:text-slate-300 cursor-pointer">Engineering</span>
            <ChevronRightIcon size={10} className="text-slate-700" />
            <span className="hover:text-slate-300 cursor-pointer">Specs</span>
            <ChevronRightIcon size={10} className="text-slate-700" />
            <span className="text-slate-300">{activePage?.title}</span>
            <div className="h-3 w-px bg-slate-800 mx-2" />
            <div className="flex items-center space-x-1.5 px-2 py-0.5 rounded bg-slate-800 border border-slate-700">
               {activePage?.sourceType === 'github' ? <CodeIcon size={10} /> : <GlobeIcon size={10} />}
               <span className="uppercase text-slate-400">{activePage?.sourceType || 'local'}</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
             <span className="text-[10px] text-slate-500 italic">
                Last edited 2d ago by <strong className="text-slate-400 not-italic">Sarah</strong>
             </span>
             <div className="flex items-center space-x-1">
                <ActionIcon icon={<StarIcon size={14} />} title="Star" />
                <ActionIcon icon={<ShareIcon size={14} />} title="Share Link" />
                <ActionIcon icon={<Edit2Icon size={14} />} title="Edit Document" onClick={() => setIsEditing(true)} />
             </div>
          </div>
        </header>

        {/* Content Pane */}
        <main className="flex-1 overflow-y-auto custom-scrollbar bg-[#0f172a] selection:bg-indigo-500/30">
          <div className="max-w-[800px] mx-auto p-12 lg:p-20">
            {activePage ? (
              <article ref={contentRef} className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                {isEditing ? (
                  <div className="space-y-6">
                    <input 
                      type="text" 
                      defaultValue={activePage.title}
                      className="w-full bg-transparent text-5xl font-bold text-white border-none outline-none focus:ring-0 p-0 mb-4 tracking-tight"
                    />
                    <textarea 
                      className="w-full min-h-[600px] bg-transparent text-slate-300 font-mono text-sm leading-relaxed border-none outline-none focus:ring-0 resize-none"
                      defaultValue={activePage.content}
                      placeholder="Start writing documentation..."
                    />
                    <div className="fixed bottom-10 left-1/2 -translate-x-1/2 flex items-center space-x-3 bg-slate-900 border border-indigo-500/30 p-2 rounded-xl shadow-2xl z-50">
                       <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)}>Discard</Button>
                       <Button variant="primary" size="sm" icon={<SaveIcon size={14} />} onClick={() => setIsEditing(false)}>Publish Changes</Button>
                    </div>
                  </div>
                ) : (
                  <MarkdownRenderer content={activePage.content} onAnchorClick={handleCopyLink} />
                )}
                
                {/* Footer Meta */}
                {!isEditing && (
                  <div className="mt-20 pt-10 border-t border-slate-800/50 flex flex-wrap gap-4">
                     {activePage.tags.map(tag => (
                        <span key={tag} className="px-2 py-1 rounded bg-slate-800 text-slate-500 text-[10px] font-bold uppercase tracking-widest border border-slate-700 hover:border-indigo-500/30 hover:text-indigo-400 transition-all cursor-pointer">
                           #{tag}
                        </span>
                     ))}
                  </div>
                )}
              </article>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-700 opacity-20">
                <ActivityIcon size={64} />
              </div>
            )}
          </div>
        </main>
      </div>

      {/* 3. Right Sidebar: Auxiliary Context (300px) */}
      <aside className="w-[300px] border-l border-slate-800 bg-slate-900/50 flex flex-col shrink-0 z-20">
        <div className="flex h-12 border-b border-slate-800 bg-slate-900 shrink-0">
          <TabButton active={rightTab === 'outline'} onClick={() => setRightTab('outline')} label="Outline" icon={<ListIconProxy size={14} />} />
          <TabButton active={rightTab === 'insights'} onClick={() => setRightTab('insights')} label="AI" icon={<SparklesIcon size={14} />} />
          <TabButton active={rightTab === 'discussion'} onClick={() => setRightTab('discussion')} label="Chat" icon={<MessageSquareIcon size={14} />} badge={comments.length} />
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
          {rightTab === 'outline' && (
             <div className="space-y-4 animate-in fade-in duration-300">
                <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-6">Table of Contents</h3>
                <nav className="space-y-0.5 relative">
                   <div className="absolute left-[-13px] top-0 bottom-0 w-0.5 bg-slate-800" />
                   <OutlineItem level={1} label="Overview" active={activeSection === ''} />
                   <OutlineItem level={2} label="Authentication Logic" active={activeSection === 'auth-logic'} />
                   <OutlineItem level={3} label="JWT Strategy" active={activeSection === 'jwt-strategy'} />
                   <OutlineItem level={2} label="Sequence Diagram" active={activeSection === 'sequence-diagram'} />
                   <OutlineItem level={2} label="Implementation" active={activeSection === 'implementation'} />
                </nav>
             </div>
          )}

          {rightTab === 'insights' && (
             <div className="space-y-8 animate-in fade-in duration-300">
                <section>
                   <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Summary</h3>
                   <div className="space-y-3">
                      {activePage?.aiSummary?.map((s, i) => (
                         <div key={i} className="flex items-start text-xs text-slate-300 leading-relaxed">
                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 mr-3 shrink-0" />
                            {s}
                         </div>
                      ))}
                   </div>
                </section>
                
                <section>
                   <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Related Documents</h3>
                   <div className="space-y-2">
                      {activePage?.relatedDocs?.map(doc => (
                         <div key={doc.id} className="flex items-center justify-between p-2.5 bg-slate-800/40 rounded-lg border border-slate-700 hover:border-indigo-500/30 transition-all group cursor-pointer">
                            <span className="text-xs text-slate-400 group-hover:text-white transition-colors truncate">{doc.title}</span>
                            <ChevronRightIcon size={12} className="text-slate-700 group-hover:text-indigo-400" />
                         </div>
                      ))}
                   </div>
                </section>
             </div>
          )}

          {rightTab === 'discussion' && (
             <div className="space-y-8 animate-in fade-in duration-300">
                <div className="flex items-center justify-between">
                   <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Discussion Thread</h3>
                   <span className="text-[9px] text-slate-600 font-mono">ENCRYPTED_COMMS</span>
                </div>
                
                <div className="space-y-6">
                   {comments.map(comment => (
                      <CommentThread key={comment.id} comment={comment} />
                   ))}
                </div>

                <div className="pt-6 border-t border-slate-800">
                   <textarea 
                     placeholder="Reply to document..."
                     className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-xs text-slate-300 focus:outline-none focus:border-indigo-500 resize-none"
                     rows={3}
                   />
                   <div className="mt-3 flex justify-end">
                      <Button variant="primary" size="sm">Post Comment</Button>
                   </div>
                </div>
             </div>
          )}
        </div>

        <div className="p-6 bg-indigo-900/5 border-t border-indigo-500/10">
           <div className="flex items-center text-indigo-400 text-[10px] font-bold uppercase tracking-widest mb-2">
              <ShieldIcon size={12} className="mr-2" />
              RAG CONTEXT: ACTIVE
           </div>
           <p className="text-[10px] text-slate-600 leading-relaxed">
              This document is indexed in the global vector database for cross-project agent reasoning.
           </p>
        </div>
      </aside>

    </div>
  );
};

// Internal Sub-components

const MarkdownRenderer: React.FC<{ content: string; onAnchorClick: (id: string) => void }> = ({ content, onAnchorClick }) => {
   return (
      <div className="space-y-8 text-slate-300 leading-[1.8] font-sans text-base">
         {content.split('\n').map((line, i) => {
            const id = line.replace(/[^a-z0-9]/gi, '-').toLowerCase().slice(0, 30);
            
            if (line.startsWith('# ')) return (
               <h1 key={i} id={id} className="text-5xl font-extrabold text-white mt-16 mb-8 tracking-tighter group flex items-center">
                  {line.replace('# ', '')}
                  <button onClick={() => onAnchorClick(id)} className="ml-4 opacity-0 group-hover:opacity-100 text-slate-700 hover:text-indigo-400 transition-all"><LinkIcon size={20}/></button>
               </h1>
            );
            if (line.startsWith('## ')) return (
               <h2 key={i} id={id} className="text-2xl font-bold text-slate-100 mt-12 mb-6 border-b border-slate-800/50 pb-4 group flex items-center">
                  {line.replace('## ', '')}
                  <button onClick={() => onAnchorClick(id)} className="ml-3 opacity-0 group-hover:opacity-100 text-slate-700 hover:text-indigo-400 transition-all"><LinkIcon size={16}/></button>
               </h2>
            );
            if (line.startsWith('### ')) return (
               <h3 key={i} id={id} className="text-lg font-bold text-slate-200 mt-8 mb-4 uppercase tracking-wider text-indigo-400">
                  {line.replace('### ', '')}
               </h3>
            );
            
            // Mermaid Mock
            if (line.startsWith('```mermaid')) return (
               <div key={i} className="my-10 p-10 bg-slate-900 border border-indigo-500/20 rounded-3xl shadow-inner flex flex-col items-center">
                  <div className="text-[9px] font-bold text-indigo-500/50 uppercase tracking-[0.3em] mb-8">Generated Diagram</div>
                  <div className="flex flex-col items-center space-y-6">
                     <div className="px-6 py-3 rounded-xl border-2 border-indigo-500/50 bg-indigo-500/10 text-xs font-bold text-white shadow-[0_0_20px_rgba(99,102,241,0.2)]">Client</div>
                     <div className="h-10 w-0.5 bg-gradient-to-b from-indigo-500 to-emerald-500" />
                     <div className="px-6 py-3 rounded-xl border-2 border-emerald-500/50 bg-emerald-500/10 text-xs font-bold text-white shadow-[0_0_20px_rgba(16,185,129,0.2)]">Auth Service</div>
                  </div>
               </div>
            );

            // Code Block Mock
            if (line.startsWith('```')) {
               if (line === '```') return null;
               return (
                  <div key={i} className="relative group/code my-6">
                     <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-xl blur opacity-20 group-hover/code:opacity-40 transition duration-1000"></div>
                     <div className="relative bg-[#0d1117] border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
                        <div className="flex items-center justify-between px-4 py-2 bg-slate-900/50 border-b border-slate-800">
                           <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{line.replace('```', '') || 'code'}</span>
                           <div className="flex items-center space-x-2">
                              <button className="text-[10px] font-bold text-slate-600 hover:text-indigo-400 transition-colors uppercase tracking-tighter">Copy</button>
                              <div className="h-3 w-px bg-slate-800" />
                              <button className="text-[10px] font-bold text-indigo-500 hover:text-indigo-400 transition-colors uppercase tracking-tighter">Run in Playground</button>
                           </div>
                        </div>
                        <pre className="p-6 text-sm font-mono leading-relaxed text-indigo-100/90 overflow-x-auto">
                           {/* Naive extraction of following lines would go here in a real parser */}
                           {"export const verify = async (token: string) => {\n  return await gateway.auth(token);\n};"}
                        </pre>
                     </div>
                  </div>
               );
            }

            if (!line.trim()) return <br key={i} />;
            return <p key={i} className="mb-6">{line}</p>;
         })}
      </div>
   );
};

const TabButton: React.FC<{ active: boolean; onClick: () => void; label: string; icon: React.ReactNode; badge?: number }> = ({ active, onClick, label, icon, badge }) => (
   <button 
      onClick={onClick}
      className={`flex-1 flex flex-col items-center justify-center transition-all relative group ${
         active ? 'text-white' : 'text-slate-600 hover:text-slate-300'
      }`}
   >
      <div className={`mb-1 transition-transform group-hover:scale-110 ${active ? 'text-indigo-400' : ''}`}>{icon}</div>
      <span className="text-[9px] font-bold uppercase tracking-widest">{label}</span>
      {badge !== undefined && badge > 0 && (
         <span className="absolute top-2 right-6 w-4 h-4 bg-indigo-600 text-white text-[8px] font-bold rounded-full flex items-center justify-center border-2 border-slate-900">
            {badge}
         </span>
      )}
      {active && (
         <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500 animate-in fade-in" />
      )}
   </button>
);

const OutlineItem: React.FC<{ level: number; label: string; active: boolean }> = ({ level, label, active }) => (
   <div 
     className={`relative py-1.5 cursor-pointer transition-all border-l-2 ${
       active ? 'border-indigo-500 bg-indigo-600/5' : 'border-transparent hover:border-slate-700'
     }`}
     style={{ paddingLeft: `${level * 12}px` }}
   >
      <span className={`text-[11px] transition-colors ${active ? 'text-white font-bold' : 'text-slate-500 hover:text-slate-300'}`}>
         {label}
      </span>
   </div>
);

const CommentThread: React.FC<{ comment: DocComment }> = ({ comment }) => (
   <div className="space-y-4">
      <div className="flex items-start space-x-3">
         <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-400 shrink-0">
            {comment.author[0]}
         </div>
         <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between">
               <span className="text-[11px] font-bold text-slate-200">{comment.author}</span>
               <span className="text-[9px] font-mono text-slate-600">{comment.timestamp}</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed bg-slate-900/50 p-2.5 rounded-lg border border-slate-800/50">{comment.text}</p>
         </div>
      </div>
      {comment.replies?.map(reply => (
         <div key={reply.id} className="ml-10 flex items-start space-x-3 border-l border-slate-800 pl-4 py-1">
            <div className="w-6 h-6 rounded-lg bg-indigo-900/30 border border-indigo-500/20 flex items-center justify-center text-[9px] font-bold text-indigo-400 shrink-0">
               {reply.author[0]}
            </div>
            <div className="flex-1 space-y-1">
               <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-300">{reply.author}</span>
                  <span className="text-[9px] font-mono text-slate-600">{reply.timestamp}</span>
               </div>
               <p className="text-[11px] text-slate-500 leading-relaxed">{reply.text}</p>
            </div>
         </div>
      ))}
   </div>
);

const ActionIcon: React.FC<{ icon: React.ReactNode; title: string; onClick?: () => void }> = ({ icon, title, onClick }) => (
   <button 
      onClick={onClick}
      className="p-1.5 text-slate-600 hover:text-white rounded hover:bg-slate-800 transition-all" 
      title={title}
   >
      {icon}
   </button>
);

const ListIconProxy: React.FC<any> = (props) => (
   <svg
     xmlns="http://www.w3.org/2000/svg"
     width={props.size || 20}
     height={props.size || 20}
     viewBox="0 0 24 24"
     fill="none"
     stroke="currentColor"
     strokeWidth="2"
     strokeLinecap="round"
     strokeLinejoin="round"
     {...props}
   >
     <line x1="8" y1="6" x2="21" y2="6" />
     <line x1="8" y1="12" x2="21" y2="12" />
     <line x1="8" y1="18" x2="21" y2="18" />
     <line x1="3" y1="6" x2="3.01" y2="6" />
     <line x1="3" y1="12" x2="3.01" y2="12" />
     <line x1="3" y1="18" x2="3.01" y2="18" />
   </svg>
 );

export default Documentation;
