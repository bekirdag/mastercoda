import React, { useState, useMemo } from 'react';
import { DocTemplate, TemplateSection, DocTemplateType } from '../types';
import { MOCK_DOC_TEMPLATES } from '../constants';
import Button from './Button';
import Badge from './Badge';
import { 
  FileStackIcon, 
  ListTreeIcon, 
  PlusIcon, 
  SearchIcon, 
  ChevronRightIcon, 
  ChevronDownIcon, 
  TrashIcon, 
  RotateCwIcon, 
  SparklesIcon, 
  ShieldIcon, 
  LockIcon, 
  CodeIcon, 
  ActivityIcon,
  CheckCircleIcon,
  XIcon,
  RefreshCwIcon,
  SaveIcon,
  SettingsIcon
} from './Icons';

// Proxy for InfoIcon
const InfoIconProxy: React.FC<any> = (props) => (
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
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
);

const DocStructuralTemplates: React.FC = () => {
  const [templates, setTemplates] = useState<DocTemplate[]>(MOCK_DOC_TEMPLATES);
  const [selectedId, setSelectedId] = useState<string | null>(MOCK_DOC_TEMPLATES[0].id);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeType, setActiveType] = useState<DocTemplateType | 'all'>('all');
  const [isSaving, setIsSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const selectedTemplate = useMemo(() => templates.find(t => t.id === selectedId), [templates, selectedId]);

  const filteredTemplates = useMemo(() => {
    return templates.filter(t => {
      const matchSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchType = activeType === 'all' || t.type === activeType;
      return matchSearch && matchType;
    });
  }, [templates, searchQuery, activeType]);

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(r => setTimeout(r, 1200));
    setIsSaving(false);
  };

  const toggleDefault = (id: string) => {
    setTemplates(prev => prev.map(t => ({
      ...t,
      isDefault: t.id === id ? !t.isDefault : false
    })));
  };

  return (
    <div className="flex flex-col h-full bg-[#0f172a] text-slate-200 overflow-hidden font-sans">
      
      <header className="h-[64px] border-b border-slate-800 bg-slate-900/50 backdrop-blur shrink-0 flex items-center justify-between px-8 z-30 sticky top-0 shadow-lg">
         <div className="flex items-center space-x-8">
            <div className="flex items-center">
               <ListTreeIcon className="mr-3 text-indigo-400" size={24} />
               <div>
                  <h1 className="text-xl font-bold text-white tracking-tight uppercase">Document Skeletons</h1>
                  <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest leading-none mt-1">Structural_Governance_v1.0</p>
               </div>
            </div>

            <div className="h-6 w-px bg-slate-800" />

            <div className="flex bg-slate-800 rounded p-1 border border-slate-700">
               {(['all', 'rfp', 'pdr', 'sds'] as const).map(t => (
                  <button
                     key={t}
                     onClick={() => setActiveType(t)}
                     className={`px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider transition-all ${
                        activeType === t 
                        ? 'bg-indigo-600 text-white shadow-sm' 
                        : 'text-slate-500 hover:text-slate-300'
                     }`}
                  >
                     {t}
                  </button>
               ))}
            </div>
         </div>

         <div className="flex items-center space-x-3">
            <div className="relative group">
               <SearchIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400" />
               <input 
                  type="text" 
                  placeholder="Filter skeletons..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white focus:border-indigo-500 outline-none w-48 transition-all"
               />
            </div>
            <Button variant="primary" size="sm" icon={<PlusIcon size={14} />}>Create Template</Button>
         </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
         <aside className="w-[350px] border-r border-slate-800 bg-slate-900/30 flex flex-col shrink-0">
            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3">
               {filteredTemplates.map(tpl => (
                  <div 
                     key={tpl.id}
                     onClick={() => setSelectedId(tpl.id)}
                     className={`p-5 rounded-2xl border-2 transition-all cursor-pointer group flex flex-col ${
                        selectedId === tpl.id 
                           ? 'bg-indigo-600/10 border-indigo-500/50 shadow-xl' 
                           : 'bg-slate-800/40 border-slate-800 hover:border-slate-700 hover:bg-slate-800/60'
                     }`}
                  >
                     <div className="flex items-center justify-between mb-3">
                        <Badge variant={tpl.type === 'sds' ? 'success' : tpl.type === 'pdr' ? 'info' : 'warning'}>
                           {tpl.type.toUpperCase()}
                        </Badge>
                        {tpl.isDefault && (
                           <div className="text-[8px] font-bold text-emerald-400 uppercase tracking-tighter flex items-center">
                              <CheckCircleIcon size={10} className="mr-1" /> System Default
                           </div>
                        )}
                     </div>
                     <h3 className={`text-sm font-bold transition-colors ${selectedId === tpl.id ? 'text-white' : 'text-slate-300'}`}>
                        {tpl.title}
                     </h3>
                     <p className="text-[11px] text-slate-500 leading-relaxed mt-1 line-clamp-2">{tpl.description}</p>
                     
                     <div className="mt-4 pt-4 border-t border-slate-700/50 flex items-center justify-between">
                        <span className="text-[9px] font-mono text-slate-600">MODIFIED: {tpl.lastUpdated}</span>
                        <ChevronRightIcon size={14} className={`text-slate-700 transition-all ${selectedId === tpl.id ? 'text-indigo-400 translate-x-1' : 'opacity-0 group-hover:opacity-100'}`} />
                     </div>
                  </div>
               ))}
               
               <button className="w-full py-4 border-2 border-dashed border-slate-800 rounded-2xl flex flex-col items-center justify-center text-slate-600 hover:text-indigo-400 hover:border-indigo-500/50 transition-all group">
                  <PlusIcon size={24} className="mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Import from ISO/IEEE Standard</span>
               </button>
            </div>
         </aside>

         <main className="flex-1 flex flex-col bg-[#0d1117] overflow-hidden">
            {selectedTemplate ? (
               <>
                  <div className="shrink-0 p-8 border-b border-slate-800 flex items-center justify-between bg-slate-900/40">
                     <div className="flex items-center space-x-6">
                        <div className="w-14 h-14 rounded-2xl bg-indigo-600/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-lg">
                           <FileStackIcon size={32} />
                        </div>
                        <div className="space-y-1">
                           <h2 className="text-2xl font-bold text-white tracking-tight">{selectedTemplate.title}</h2>
                           <div className="flex items-center space-x-4 text-[10px] font-mono text-slate-500 uppercase">
                              <span>Format: {selectedTemplate.outputFormat}</span>
                              <span>•</span>
                              <span>Category: {selectedTemplate.category}</span>
                           </div>
                        </div>
                     </div>
                     <div className="flex items-center space-x-3">
                        <button 
                           onClick={() => setShowPreview(!showPreview)}
                           className={`p-2 rounded-xl border transition-all ${showPreview ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-slate-800 border-slate-700 text-slate-500'}`}
                           title="Preview Sample Document"
                        >
                           <ActivityIcon size={20} />
                        </button>
                        <Button 
                           variant="primary" 
                           onClick={handleSave} 
                           disabled={isSaving}
                           icon={isSaving ? <RotateCwIcon size={16} className="animate-spin" /> : <SaveIcon size={16}/>}
                        >
                           {isSaving ? 'Synchronizing...' : 'Save Template'}
                        </Button>
                     </div>
                  </div>

                  <div className="flex-1 flex overflow-hidden">
                     <section className="flex-1 flex flex-col border-r border-slate-800 overflow-hidden">
                        <div className="h-10 px-6 bg-slate-900/50 border-b border-slate-800 flex items-center justify-between shrink-0">
                           <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Document Skeleton (TOC)</span>
                           <div className="flex items-center space-x-2">
                              <button className="text-[9px] font-bold text-indigo-400 hover:underline uppercase">AUTO-GEN SKETCH</button>
                           </div>
                        </div>
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
                           <div className="max-w-2xl mx-auto space-y-4">
                              {selectedTemplate.sections.map((section, idx) => (
                                 <SectionRow key={section.id} section={section} depth={0} index={idx} />
                              ))}
                              
                              <button className="w-full py-3 border border-dashed border-slate-800 rounded-xl text-[10px] font-bold text-slate-600 hover:text-indigo-400 hover:border-indigo-500 transition-all uppercase tracking-[0.2em]">
                                 + Add New Parent Section
                              </button>
                           </div>
                        </div>
                     </section>

                     <aside className="w-[450px] flex flex-col bg-[#0d1117] overflow-hidden">
                        <div className="h-10 px-6 bg-slate-900/50 border-b border-slate-800 flex items-center justify-between shrink-0">
                           <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center">
                              <SparklesIcon size={12} className="mr-2 text-indigo-400" />
                              Section Rulebook (Prompting)
                           </span>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-10">
                           <section className="space-y-6">
                              <div className="flex items-center justify-between">
                                 <h4 className="text-[10px] font-bold text-white uppercase tracking-widest">Output Controls</h4>
                                 <Badge variant="neutral">YAML_STORE</Badge>
                              </div>
                              <div className="space-y-4">
                                 <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-600 uppercase">Target Format</label>
                                    <div className="grid grid-cols-3 gap-2">
                                       <FormatBtn label="Markdown" active={selectedTemplate.outputFormat === 'markdown'} />
                                       <FormatBtn label="LaTeX" active={selectedTemplate.outputFormat === 'latex'} />
                                       <FormatBtn label="JSON" active={selectedTemplate.outputFormat === 'json'} />
                                    </div>
                                 </div>
                                 <div 
                                    onClick={() => toggleDefault(selectedTemplate.id)}
                                    className="flex items-center justify-between p-4 bg-slate-800/40 border border-slate-700 rounded-2xl cursor-pointer group hover:border-indigo-500/30 transition-all"
                                 >
                                    <div className="flex-1 pr-6">
                                       <div className="text-sm font-bold text-white mb-1">Set as Default {selectedTemplate.type.toUpperCase()}</div>
                                       <p className="text-[10px] text-slate-500 leading-relaxed uppercase tracking-tighter">New projects using this type will automatically start with this skeleton.</p>
                                    </div>
                                    <div className={`w-10 h-5 rounded-full p-1 relative transition-all ${selectedTemplate.isDefault ? 'bg-indigo-600' : 'bg-slate-700'}`}>
                                       <div className={`w-3 h-3 bg-white rounded-full transition-transform ${selectedTemplate.isDefault ? 'translate-x-5' : 'translate-x-0'}`} />
                                    </div>
                                 </div>
                              </div>
                           </section>

                           <div className="h-px bg-slate-800" />

                           <section className="space-y-6">
                              <div className="flex items-center justify-between">
                                 <h4 className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Mini-Prompt Mapping</h4>
                                 <button className="text-[10px] text-slate-500 hover:text-white"><RefreshCwIcon size={12}/></button>
                              </div>
                              <div className="space-y-4">
                                 <p className="text-[11px] text-slate-500 leading-relaxed italic">Select a section on the left to edit its unique AI behavioral instructions.</p>
                                 <div className="relative group">
                                    <div className="absolute -inset-0.5 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-2xl blur opacity-25" />
                                    <textarea 
                                       className="relative w-full h-48 bg-slate-950 border border-slate-700 rounded-2xl p-4 text-xs font-mono leading-relaxed text-indigo-300 focus:border-indigo-500 outline-none resize-none shadow-inner"
                                       defaultValue={selectedTemplate.sections[0]?.aiInstruction}
                                       placeholder="Analyze the context and..."
                                    />
                                 </div>
                                 <div className="p-4 bg-indigo-900/10 border border-indigo-500/20 rounded-2xl flex items-start gap-3">
                                    <InfoIconProxy size={14} className="text-indigo-400 mt-0.5 shrink-0" />
                                    <p className="text-[10px] text-indigo-200/70 leading-relaxed">
                                       Instructions provided here will be appended to the Architect Prime's base persona specifically when generating this section.
                                    </p>
                                 </div>
                              </div>
                           </section>
                        </div>
                     </aside>
                  </div>
               </>
            ) : (
               <div className="flex-1 flex flex-col items-center justify-center text-slate-700 opacity-20">
                  <ListTreeIcon size={80} className="mb-4" />
                  <p className="text-2xl font-bold uppercase tracking-[0.3em]">Ambiguity Terminal</p>
               </div>
            )}
         </main>
      </div>

      <footer className="h-10 bg-slate-900 border-t border-slate-800 shrink-0 px-8 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-slate-500 z-30 shadow-[0_-4px_20px_rgba(0,0,0,0.5)]">
         <div className="flex items-center space-x-12">
            <div className="flex items-center">
               <ShieldIcon size={12} className="mr-2 text-indigo-400" />
               GOVERNANCE_MODE: <span className="ml-2 text-indigo-300">ACTIVE_ENFORCEMENT</span>
            </div>
            <div className="flex items-center">
               <CodeIcon size={12} className="mr-2 text-indigo-400" />
               YAML_REGISTRY: <span className="ml-2 text-emerald-500">SYNCED</span>
            </div>
         </div>
         <div className="flex items-center space-x-6">
            <span className="text-slate-700 font-mono tracking-tighter">AG-16_BUILD_8902_X</span>
            <div className="h-3 w-px bg-slate-800" />
            <div className="flex items-center text-indigo-400">
               <LockIcon size={12} className="mr-2" />
               ENCLAVE_CONTROL
            </div>
         </div>
      </footer>

      {showPreview && selectedTemplate && (
         <PreviewModal template={selectedTemplate} onClose={() => setShowPreview(false)} />
      )}
    </div>
  );
};

const SectionRow: React.FC<{ section: TemplateSection; depth: number; index: number }> = ({ section, depth, index }) => {
   const [expanded, setExpanded] = useState(true);
   const hasChildren = section.children && section.children.length > 0;

   return (
      <div className="space-y-2">
         <div 
            className="group flex items-center justify-between p-3 rounded-xl bg-slate-800/40 border border-slate-700 hover:border-indigo-500/30 transition-all cursor-grab active:cursor-grabbing shadow-sm"
            style={{ marginLeft: `${depth * 24}px` }}
         >
            <div className="flex items-center space-x-3 min-w-0">
               <button onClick={() => setExpanded(!expanded)} className={`text-slate-600 hover:text-white transition-colors ${!hasChildren ? 'invisible' : ''}`}>
                  {expanded ? <ChevronDownIcon size={14}/> : <ChevronRightIcon size={14}/>}
               </button>
               <div className="flex flex-col min-w-0">
                  <div className="flex items-center space-x-3">
                     <span className="text-[11px] font-bold text-white uppercase tracking-wider truncate">{section.label}</span>
                     {section.isRequired && (
                        <div className="text-[7px] font-black text-indigo-400 border border-indigo-400/30 px-1 rounded uppercase tracking-tighter bg-indigo-400/5">Mandatory</div>
                     )}
                     {section.isConditional && (
                        <div className="text-[7px] font-black text-amber-500 border border-amber-500/30 px-1 rounded uppercase tracking-tighter bg-amber-500/5">Conditional</div>
                     )}
                  </div>
                  {section.condition && <div className="text-[9px] font-mono text-slate-600 truncate">IF {section.condition}</div>}
               </div>
            </div>
            <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
               <button className="p-1.5 text-slate-500 hover:text-indigo-400 transition-colors" title="Manage Rules"><SettingsIcon size={14}/></button>
               <button className="p-1.5 text-slate-500 hover:text-white transition-colors" title="Add Sub-section"><PlusIcon size={14}/></button>
               <button className="p-1.5 text-slate-500 hover:text-red-400 transition-colors" title="Remove"><TrashIcon size={14}/></button>
            </div>
         </div>
         {expanded && section.children?.map((child, cidx) => (
            <SectionRow key={child.id} section={child} depth={depth + 1} index={cidx} />
         ))}
      </div>
   );
};

const PreviewModal: React.FC<{ template: DocTemplate; onClose: () => void }> = ({ template, onClose }) => {
   return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-8 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300">
         <div className="w-full max-w-4xl h-full bg-[#0f172a] border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
            <header className="h-16 border-b border-slate-800 px-8 flex items-center justify-between shrink-0 bg-slate-900/50">
               <div className="flex items-center space-x-3">
                  <ActivityIcon size={20} className="text-indigo-400" />
                  <h3 className="font-bold text-white">Sample Output: {template.title}</h3>
               </div>
               <button onClick={onClose} className="p-2 text-slate-500 hover:text-white transition-colors">
                  <XIcon size={24} />
               </button>
            </header>
            <div className="flex-1 overflow-y-auto custom-scrollbar p-16 bg-[#0d1117] selection:bg-indigo-500/30">
               <div className="max-w-[700px] mx-auto space-y-12">
                  <h1 className="text-5xl font-black text-white tracking-tighter border-b border-slate-800 pb-10 uppercase">
                     {template.title} Sample
                  </h1>
                  
                  <div className="space-y-16">
                     {template.sections.map(s => (
                        <section key={s.id} className="space-y-6">
                           <h2 className="text-xl font-bold text-white uppercase tracking-[0.2em] flex items-center">
                              <span className="text-indigo-500 mr-4 font-mono">01.</span> {s.label}
                           </h2>
                           <div className="h-20 bg-slate-900/50 border border-dashed border-slate-800 rounded-2xl flex items-center justify-center">
                              <p className="text-[10px] text-slate-700 font-mono uppercase tracking-[0.3em]">Dynamically generated content enclave</p>
                           </div>
                           {s.children?.map(c => (
                              <div key={c.id} className="ml-10 space-y-4">
                                 <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">{c.label}</h3>
                                 <div className="h-10 bg-slate-900/30 border border-dashed border-slate-800 rounded-xl" />
                              </div>
                           ))}
                        </section>
                     ))}
                  </div>
               </div>
            </div>
            <footer className="p-8 bg-slate-950/50 border-t border-slate-800 flex justify-end shrink-0">
               <Button variant="primary" onClick={onClose}>Close Preview</Button>
            </footer>
         </div>
      </div>
   );
};

const FormatBtn: React.FC<{ label: string; active: boolean }> = ({ label, active }) => (
   <button className={`py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${active ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-800 text-slate-400 hover:text-slate-200'}`}>
      {label}
   </button>
);

export default DocStructuralTemplates;
