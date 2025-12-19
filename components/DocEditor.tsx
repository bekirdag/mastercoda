
import React, { useState, useEffect, useRef, useMemo } from 'react';
import Button from './Button';
import Badge from './Badge';
import { 
  XIcon, 
  ChevronRightIcon, 
  ChevronDownIcon, 
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
  MessageSquareIcon,
  ShareIcon,
  GlobeIcon,
  ShieldIcon,
  ArrowRightIcon,
  PlusIcon,
  TrashIcon,
  MaximizeIcon,
  MinimizeIcon,
  CheckCircleIcon,
  /* Fix: Added missing SettingsIcon and RefreshCwIcon imports */
  SettingsIcon,
  RefreshCwIcon
} from './Icons';

interface DocEditorProps {
  onBack: () => void;
  docId?: string;
}

type ViewMode = 'raw' | 'split' | 'preview';

const DocEditor: React.FC<DocEditorProps> = ({ onBack, docId }) => {
  const [content, setContent] = useState('# New Technical Specification\n\n## Overview\nDescribe the system goals here...\n\n```typescript\nconst example = "live code";\n```');
  const [viewMode, setViewMode] = useState<ViewMode>('split');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'dirty'>('saved');
  const [showSlashMenu, setShowSlashMenu] = useState(false);
  const [slashMenuPos, setSlashMenuPos] = useState({ top: 0, left: 0 });
  const [selection, setSelection] = useState({ start: 0, end: 0 });
  const [isAiPanelOpen, setIsAiPanelOpen] = useState(false);

  const editorRef = useRef<HTMLTextAreaElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  // Autosave simulation
  useEffect(() => {
    if (saveStatus === 'dirty') {
      const timer = setTimeout(() => {
        setSaveStatus('saving');
        setTimeout(() => setSaveStatus('saved'), 800);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [saveStatus]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    setSaveStatus('dirty');

    // Slash command detection
    const cursorPos = e.target.selectionStart;
    const lastChar = e.target.value[cursorPos - 1];
    
    if (lastChar === '/') {
      const rect = e.target.getBoundingClientRect();
      // Naive position calculation for a simple div
      setSlashMenuPos({ top: rect.top + 40, left: rect.left + 40 });
      setShowSlashMenu(true);
    } else {
      setShowSlashMenu(false);
    }
  };

  const handleSelection = () => {
    if (editorRef.current) {
      const { selectionStart, selectionEnd } = editorRef.current;
      if (selectionStart !== selectionEnd) {
        setIsAiPanelOpen(true);
        setSelection({ start: selectionStart, end: selectionEnd });
      } else {
        setIsAiPanelOpen(false);
      }
    }
  };

  const insertText = (text: string) => {
    if (editorRef.current) {
      const start = editorRef.current.selectionStart;
      const end = editorRef.current.selectionEnd;
      const newContent = content.substring(0, start) + text + content.substring(end);
      setContent(newContent);
      setShowSlashMenu(false);
      editorRef.current.focus();
    }
  };

  // Sync scroll implementation
  const handleScroll = (e: React.UIEvent<HTMLElement>) => {
    if (viewMode !== 'split' || !editorRef.current || !previewRef.current) return;
    
    const target = e.currentTarget;
    const other = target === editorRef.current ? previewRef.current : editorRef.current;
    
    const percentage = target.scrollTop / (target.scrollHeight - target.clientHeight);
    other.scrollTop = percentage * (other.scrollHeight - other.clientHeight);
  };

  return (
    <div className="flex flex-col h-full bg-[#0f172a] text-slate-200 overflow-hidden font-sans relative">
      
      {/* 1. Header Toolbar */}
      <header className="h-[50px] border-b border-slate-800 bg-slate-900/50 backdrop-blur shrink-0 flex items-center justify-between px-6 z-30">
         <div className="flex items-center space-x-6">
            <button onClick={onBack} className="text-slate-500 hover:text-white p-1 transition-colors">
               <ArrowRightIcon className="rotate-180" size={18} />
            </button>
            <div className="h-6 w-px bg-slate-800" />
            
            {/* View Mode Switcher */}
            <div className="flex bg-slate-800 rounded-lg p-0.5 border border-slate-700">
               {(['raw', 'split', 'preview'] as ViewMode[]).map(m => (
                  <button
                     key={m}
                     onClick={() => setViewMode(m)}
                     className={`px-3 py-1 text-[10px] font-bold uppercase rounded transition-all ${
                        viewMode === m 
                        ? 'bg-indigo-600 text-white shadow-lg' 
                        : 'text-slate-500 hover:text-slate-300'
                     }`}
                  >
                     {m}
                  </button>
               ))}
            </div>

            {/* Quick Actions */}
            <div className="flex items-center space-x-1">
               <ToolbarButton icon={<PlusIcon size={14}/>} title="Insert Image" />
               <ToolbarButton icon={<CodeIcon size={14}/>} title="Insert Code Block" onClick={() => insertText('\n```typescript\n\n```')} />
               <ToolbarButton icon={<ActivityIcon size={14}/>} title="Insert Diagram" onClick={() => insertText('\n```mermaid\ngraph TD;\n  A-->B;\n```')} />
               <ToolbarButton icon={<LinkIcon size={14}/>} title="Insert Link" />
            </div>
         </div>

         <div className="flex items-center space-x-4">
            <div className="flex items-center text-[10px] font-mono text-slate-500">
               {saveStatus === 'saving' ? (
                  <span className="flex items-center text-indigo-400">
                     <RotateCwIcon size={10} className="animate-spin mr-1.5" /> SAVING...
                  </span>
               ) : saveStatus === 'saved' ? (
                  <span className="flex items-center text-emerald-500">
                     <CheckCircleIcon size={10} className="mr-1.5" /> SAVED
                  </span>
               ) : (
                  <span className="text-slate-600 italic">UNSAVED CHANGES</span>
               )}
            </div>
            
            <div className="h-6 w-px bg-slate-800" />
            
            <Button variant="ghost" size="sm">Discard</Button>
            <Button variant="primary" size="sm" icon={<GlobeIcon size={14} />}>Publish</Button>
            
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className={`p-1.5 rounded transition-colors ${isSidebarOpen ? 'text-indigo-400 bg-indigo-600/10' : 'text-slate-500 hover:text-white'}`}
            >
               <SettingsIcon size={18} />
            </button>
         </div>
      </header>

      {/* 2. Main content Editor Area */}
      <div className="flex-1 flex overflow-hidden">
         
         {/* Split Editor / Preview */}
         <div className="flex-1 flex overflow-hidden relative">
            
            {/* RAW EDITOR */}
            {(viewMode === 'raw' || viewMode === 'split') && (
               <div className={`flex-1 flex flex-col bg-[#0d1117] ${viewMode === 'split' ? 'border-r border-slate-800' : ''}`}>
                  <textarea 
                     ref={editorRef}
                     value={content}
                     onChange={handleChange}
                     onMouseUp={handleSelection}
                     onScroll={handleScroll}
                     spellCheck={false}
                     className="flex-1 w-full bg-transparent p-12 text-slate-300 font-mono text-sm leading-relaxed border-none outline-none focus:ring-0 resize-none custom-scrollbar selection:bg-indigo-500/30"
                     placeholder="Type / for commands, {{embed:...}} for code references..."
                  />
               </div>
            )}

            {/* PREVIEW PANEL */}
            {(viewMode === 'preview' || viewMode === 'split') && (
               <div 
                  ref={previewRef}
                  onScroll={handleScroll}
                  className="flex-1 flex flex-col bg-[#0f172a] overflow-y-auto custom-scrollbar p-12"
               >
                  <div className="max-w-[800px] mx-auto w-full animate-in fade-in duration-500">
                     <MarkdownPreview content={content} />
                  </div>
               </div>
            )}

            {/* FLOATING SLASH MENU */}
            {showSlashMenu && (
               <div 
                  className="absolute z-50 w-64 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
                  style={{ top: slashMenuPos.top, left: slashMenuPos.left }}
               >
                  <div className="px-3 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest bg-slate-900/50">Actions</div>
                  <div className="p-1 space-y-0.5">
                     <SlashItem icon={<SparklesIcon size={14}/>} label="AI Rewrite" onClick={() => setIsAiPanelOpen(true)} />
                     <SlashItem icon={<CodeIcon size={14}/>} label="Code Block" onClick={() => insertText('code\n```typescript\n\n```')} />
                     <SlashItem icon={<ActivityIcon size={14}/>} label="Mermaid Diagram" onClick={() => insertText('diagram\n```mermaid\ngraph TD;\n  A-->B;\n```')} />
                     <SlashItem icon={<LinkIcon size={14}/>} label="Embed Live File" onClick={() => insertText('{{embed:src/utils/auth.ts:10-20}}')} />
                  </div>
               </div>
            )}

            {/* FLOATING AI ASSISTANT PANEL */}
            {isAiPanelOpen && (
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[400px] bg-slate-900 border border-indigo-500/30 rounded-2xl shadow-[0_0_100px_rgba(79,70,229,0.2)] overflow-hidden animate-in zoom-in-95 duration-300">
                  <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                     <div className="flex items-center text-indigo-400">
                        <SparklesIcon size={18} className="mr-2 animate-pulse" />
                        <h3 className="font-bold uppercase text-xs tracking-widest">AI Intelligence</h3>
                     </div>
                     <button onClick={() => setIsAiPanelOpen(false)} className="text-slate-600 hover:text-white transition-colors">
                        <XIcon size={20} />
                     </button>
                  </div>
                  <div className="p-6 space-y-4">
                     <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase">Context Intent</label>
                        <input type="text" placeholder="e.g. rewrite this to be more formal" className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:border-indigo-500 outline-none" autoFocus />
                     </div>
                     <div className="grid grid-cols-2 gap-3">
                        <AiAction label="Summarize" />
                        <AiAction label="Formalize" />
                        <AiAction label="Simplify" />
                        <AiAction label="Expand" />
                     </div>
                  </div>
                  <div className="p-4 bg-slate-850 border-t border-slate-800 flex justify-end">
                     <Button variant="primary" size="sm">Generate Preview</Button>
                  </div>
               </div>
            )}
         </div>

         {/* RIGHT SIDEBAR: Metadata */}
         {isSidebarOpen && (
            <aside className="w-[300px] border-l border-slate-800 bg-slate-900 flex flex-col shrink-0 animate-in slide-in-from-right-4 duration-300">
               <div className="p-6 border-b border-slate-800 bg-slate-900/50">
                  <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-6">Document Metadata</h3>
                  
                  <div className="space-y-6">
                     <div className="space-y-2">
                        <label className="text-[10px] text-slate-600 font-bold uppercase">Slugs & Routes</label>
                        <input type="text" value="new-tech-spec" className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-xs font-mono text-indigo-400" />
                     </div>

                     <div className="space-y-2">
                        <label className="text-[10px] text-slate-600 font-bold uppercase">Parent Folder</label>
                        <div className="flex items-center justify-between bg-slate-950 border border-slate-800 rounded px-3 py-2 cursor-pointer hover:border-slate-700 transition-all">
                           <span className="text-xs text-slate-300">/specs/architecture</span>
                           <ChevronDownIcon size={12} className="text-slate-600" />
                        </div>
                     </div>

                     <div className="space-y-3">
                        <label className="text-[10px] text-slate-600 font-bold uppercase">Tags</label>
                        <div className="flex flex-wrap gap-2">
                           <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] text-slate-400">#v2_API</span>
                           <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] text-slate-400">#SECURITY</span>
                           <button className="w-5 h-5 rounded border border-dashed border-slate-700 text-slate-600 hover:text-white flex items-center justify-center">+</button>
                        </div>
                     </div>
                  </div>
               </div>

               <div className="p-6 flex-1 overflow-y-auto custom-scrollbar">
                  <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Sharing & Export</h3>
                  <div className="space-y-3">
                     <ExportOption icon={<GlobeIcon size={14}/>} label="Public Docs Site" enabled={true} />
                     <ExportOption icon={<CodeIcon size={14}/>} label="Git Repository" enabled={false} />
                     <ExportOption icon={<ShieldIcon size={14}/>} label="Internal Wiki" enabled={true} />
                  </div>
               </div>

               <div className="p-6 bg-indigo-900/5 border-t border-indigo-500/10">
                  <div className="text-[9px] text-slate-500 font-mono mb-2 uppercase">Collaboration Status</div>
                  <div className="flex items-center space-x-2">
                     <div className="w-6 h-6 rounded-full bg-emerald-500 border border-slate-800 flex items-center justify-center text-[10px] font-bold">A</div>
                     <span className="text-[11px] text-slate-400">Alex is currently editing...</span>
                  </div>
               </div>
            </aside>
         )}
      </div>

      {/* 3. Status Bar Footer */}
      <footer className="h-10 bg-slate-900 border-t border-slate-800 shrink-0 px-6 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-slate-500">
         <div className="flex items-center space-x-8">
            <div className="flex items-center">
               WORDS: <span className="ml-2 text-slate-300">{content.split(/\s+/).filter(Boolean).length}</span>
            </div>
            <div className="flex items-center">
               UTF-8 CR/LF
            </div>
         </div>
         <div className="flex items-center space-x-4">
            <span className="text-indigo-400">AGENT_HINT: Markdown L1 Detected</span>
            <div className="h-3 w-px bg-slate-800" />
            <div className="flex items-center">
               <ShieldIcon size={12} className="mr-2 text-emerald-500" />
               SECURE_SESSION_v4.2
            </div>
         </div>
      </footer>

    </div>
  );
};

// Sub-components

const ToolbarButton: React.FC<{ icon: React.ReactNode; title: string; onClick?: () => void }> = ({ icon, title, onClick }) => (
   <button 
      onClick={onClick}
      className="p-1.5 text-slate-500 hover:text-white rounded hover:bg-slate-800 transition-colors" 
      title={title}
   >
      {icon}
   </button>
);

const SlashItem: React.FC<{ icon: React.ReactNode; label: string; onClick: () => void }> = ({ icon, label, onClick }) => (
   <button 
      onClick={onClick}
      className="w-full flex items-center px-3 py-2 text-xs text-slate-400 hover:text-white hover:bg-indigo-600 transition-all rounded-lg group"
   >
      <span className="mr-3 text-slate-500 group-hover:text-white transition-colors">{icon}</span>
      {label}
   </button>
);

const AiAction: React.FC<{ label: string }> = ({ label }) => (
   <button className="py-2 rounded-xl bg-slate-800 border border-slate-700 text-[11px] font-bold text-slate-300 hover:bg-indigo-600 hover:text-white hover:border-indigo-500 transition-all uppercase tracking-tighter shadow-sm">
      {label}
   </button>
);

const ExportOption: React.FC<{ icon: React.ReactNode; label: string; enabled: boolean }> = ({ icon, label, enabled }) => (
   <div className={`flex items-center justify-between p-3 rounded-xl border transition-all ${enabled ? 'bg-slate-800/40 border-slate-700' : 'bg-slate-900 border-slate-800 opacity-40 grayscale'}`}>
      <div className="flex items-center space-x-3">
         <div className="text-slate-500">{icon}</div>
         <span className="text-xs font-medium">{label}</span>
      </div>
      <div className={`w-1.5 h-1.5 rounded-full ${enabled ? 'bg-emerald-500' : 'bg-slate-700'}`} />
   </div>
);

const MarkdownPreview: React.FC<{ content: string }> = ({ content }) => {
   return (
      <article className="prose prose-invert prose-indigo max-w-none space-y-6">
         {content.split('\n').map((line, i) => {
            if (line.startsWith('# ')) return <h1 key={i} className="text-4xl font-bold text-white mb-6 border-b border-slate-800 pb-4">{line.replace('# ', '')}</h1>;
            if (line.startsWith('## ')) return <h2 key={i} className="text-2xl font-bold text-slate-100 mt-10 mb-4">{line.replace('## ', '')}</h2>;
            if (line.startsWith('### ')) return <h3 key={i} className="text-xl font-bold text-indigo-400 mt-8 mb-3">{line.replace('### ', '')}</h3>;
            
            // Code block simplified match
            if (line.startsWith('```')) {
               if (line.length > 3) return null; // skip start line
               return null; // skip end line
            }

            // Code Embed Macro Mock
            if (line.includes('{{embed:')) {
               return (
                  <div key={i} className="my-6 rounded-xl border-2 border-indigo-500/20 bg-[#0d1117] overflow-hidden shadow-2xl">
                     <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 flex justify-between items-center">
                        <span className="text-[10px] font-mono text-indigo-400">src/utils/auth.ts : L10-L20</span>
                        <div className="flex items-center space-x-3">
                           <span className="text-[9px] font-bold text-emerald-500 uppercase tracking-tighter">Live Reference</span>
                           <RefreshCwIcon size={10} className="text-slate-600" />
                        </div>
                     </div>
                     <pre className="p-6 text-sm font-mono text-slate-300">
                        {"export const verifyToken = (token: string) => {\n  return jwt.verify(token, process.env.SECRET);\n};"}
                     </pre>
                  </div>
               );
            }

            if (!line.trim()) return <br key={i} />;
            return <p key={i} className="text-slate-300 leading-relaxed">{line}</p>;
         })}
      </article>
   );
};

export default DocEditor;