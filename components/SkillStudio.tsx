
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Skill, SkillCategory, SkillLanguage, SkillArgument } from '../types';
import { MOCK_SKILLS, MOCK_AGENTS } from '../constants';
import Button from './Button';
import Badge from './Badge';
import { 
  PlusIcon, 
  SearchIcon, 
  ChevronRightIcon, 
  ChevronDownIcon, 
  SettingsIcon, 
  ActivityIcon, 
  RotateCwIcon, 
  ShieldIcon, 
  ZapIcon, 
  TerminalIcon, 
  HardDriveIcon, 
  GlobeIcon, 
  LockIcon, 
  CodeIcon, 
  ArrowRightIcon, 
  SparklesIcon, 
  XIcon, 
  CheckCircleIcon,
  TrashIcon,
  HelpCircleIcon,
  PlayIcon,
  SaveIcon,
  AlertTriangleIcon
} from './Icons';

const SkillStudio: React.FC = () => {
  const [skills, setSkills] = useState<Skill[]>(MOCK_SKILLS);
  const [selectedId, setSelectedId] = useState<string | null>(MOCK_SKILLS[0].id);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [activeCenterTab, setActiveCenterTab] = useState<'code' | 'schema' | 'usage'>('code');
  
  // Sandbox State
  const [isExecuting, setIsExecuting] = useState(false);
  const [testArgs, setTestArgs] = useState<Record<string, any>>({});
  const [executionResult, setExecutionResult] = useState<any>(null);
  const [executionLogs, setExecutionLogs] = useState<string[]>([]);
  const [mockMode, setMockMode] = useState(false);
  const [runStatus, setRunStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const activeSkill = useMemo(() => skills.find(s => s.id === selectedId), [skills, selectedId]);

  useEffect(() => {
    if (activeSkill) {
      const initialArgs: Record<string, any> = {};
      activeSkill.parameters.forEach(p => initialArgs[p.name] = p.example || '');
      setTestArgs(initialArgs);
      setExecutionResult(null);
      setExecutionLogs([]);
      setRunStatus('idle');
    }
  }, [activeSkill]);

  const handleRunTest = async () => {
    if (!activeSkill) return;
    setIsExecuting(true);
    setRunStatus('idle');
    setExecutionLogs([`[INFO] Spawning microVM isolate for ${activeSkill.name}...`]);
    setExecutionResult(null);

    await new Promise(r => setTimeout(r, 600));
    setExecutionLogs(prev => [...prev, `[INFO] Injecting arguments: ${JSON.stringify(testArgs)}`]);
    
    if (mockMode) {
      await new Promise(r => setTimeout(r, 400));
      setExecutionLogs(prev => [...prev, `[MOCK] Intercepted network call to ${activeSkill.category === 'integration' ? 'external API' : 'local resource'}`]);
    }

    await new Promise(r => setTimeout(r, 1000));
    
    // Simulate Result
    const success = Math.random() > 0.1;
    if (success) {
      setExecutionLogs(prev => [...prev, `[SUCCESS] Function returned exit code 0`]);
      setExecutionResult({ status: "success", data: mockMode ? "SIMULATED_DATA_REF_01" : "Task completed successfully." });
      setRunStatus('success');
    } else {
      setExecutionLogs(prev => [...prev, `[ERROR] Runtime exception: Access Denied to resource.`]);
      setExecutionResult({ error: "E_AUTH_FAILED", message: "Missing required session token." });
      setRunStatus('error');
    }
    
    setIsExecuting(false);
  };

  const updateSkillCode = (code: string) => {
    if (activeSkill?.isLocked) return;
    setSkills(prev => prev.map(s => s.id === selectedId ? { ...s, code } : s));
    // In a real app, we'd trigger a debounced regex scan here to auto-update the schema/parameters
  };

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(r => setTimeout(r, 1000));
    setIsSaving(false);
  };

  const handleNewSkill = () => {
     const newId = `s-custom-${Date.now()}`;
     const newSkill: Skill = {
        id: newId,
        name: 'new_skill',
        category: 'custom',
        language: 'typescript',
        description: 'New custom agent capability',
        code: `export const new_skill = async () => {\n  // Implementation here\n};`,
        schema: { name: 'new_skill', description: 'New skill', parameters: { type: 'object', properties: {} } },
        parameters: [],
        source: 'User Defined',
        usedBy: [],
        updatedAt: 'Just now'
     };
     setSkills([...skills, newSkill]);
     setSelectedId(newId);
  };

  // Keyboard listener for F5
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F5') {
        e.preventDefault();
        handleRunTest();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeSkill, testArgs]);

  return (
    <div className="flex h-full bg-[#0f172a] text-slate-200 overflow-hidden font-sans">
      
      {/* 1. Skill Library Sidebar */}
      <aside className="w-[250px] border-r border-slate-800 bg-slate-900/30 flex flex-col shrink-0">
         <div className="p-4 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Library</span>
            <button onClick={handleNewSkill} className="text-indigo-400 hover:text-indigo-300 transition-colors">
               <PlusIcon size={16} />
            </button>
         </div>
         <div className="p-3 border-b border-slate-800">
            <div className="relative group">
               <SearchIcon size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-600" />
               <input 
                  type="text" 
                  placeholder="Find skill..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-2 py-1.5 text-xs text-white focus:border-indigo-500 outline-none"
               />
            </div>
         </div>
         <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-4">
            <SkillTreeGroup 
               title="System" 
               skills={skills.filter(s => s.category === 'system' && s.name.includes(searchQuery))} 
               selectedId={selectedId} 
               onSelect={setSelectedId} 
            />
            <SkillTreeGroup 
               title="Integrations" 
               skills={skills.filter(s => s.category === 'integration' && s.name.includes(searchQuery))} 
               selectedId={selectedId} 
               onSelect={setSelectedId} 
            />
            <SkillTreeGroup 
               title="Custom" 
               skills={skills.filter(s => s.category === 'custom' && s.name.includes(searchQuery))} 
               selectedId={selectedId} 
               onSelect={setSelectedId} 
            />
         </div>
      </aside>

      {/* 2. Workspace Center Pane */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#0d1117] overflow-hidden relative">
         {activeSkill ? (
            <>
               <header className="h-14 border-b border-slate-800 bg-slate-900/40 backdrop-blur px-6 flex items-center justify-between shrink-0 z-20">
                  <div className="flex items-center space-x-4">
                     <div className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-indigo-400">
                        <CodeIcon size={20} />
                     </div>
                     <div>
                        <h2 className="text-lg font-bold text-white tracking-tight">{activeSkill.name}</h2>
                        <div className="flex items-center text-[10px] font-mono text-slate-500 uppercase space-x-2">
                           <span>{activeSkill.language}</span>
                           <span>•</span>
                           <span>{activeSkill.source}</span>
                           <span>•</span>
                           <span className="text-emerald-500">SYNCED</span>
                        </div>
                     </div>
                  </div>
                  <div className="flex items-center space-x-3">
                     <Button variant="secondary" size="sm" icon={<RotateCwIcon size={14}/>}>Revert</Button>
                     <Button 
                        variant="primary" 
                        size="sm" 
                        icon={isSaving ? <RotateCwIcon size={14} className="animate-spin" /> : <SaveIcon size={14}/>}
                        onClick={handleSave}
                        disabled={isSaving || activeSkill.isLocked}
                     >
                        {isSaving ? 'Deploying...' : 'Deploy Changes'}
                     </Button>
                  </div>
               </header>

               <div className="flex-1 flex flex-col overflow-hidden">
                  {/* Tab Selector */}
                  <div className="flex border-b border-slate-800 bg-slate-900/20 shrink-0 px-6">
                     <WorkspaceTab active={activeCenterTab === 'code'} onClick={() => setActiveCenterTab('code')} label="Logic (Source)" icon={<CodeIcon size={12}/>} />
                     <WorkspaceTab active={activeCenterTab === 'schema'} onClick={() => setActiveCenterTab('schema')} label="LLM Interface (Schema)" icon={<ShieldIcon size={12}/>} />
                     <WorkspaceTab active={activeCenterTab === 'usage'} onClick={() => setActiveCenterTab('usage')} label="Deployment Status" icon={<ActivityIcon size={12}/>} />
                  </div>

                  <div className="flex-1 overflow-hidden flex relative">
                     {activeCenterTab === 'code' && (
                        <div className="flex-1 flex flex-col animate-in fade-in duration-300">
                           <div className="flex-1 relative group">
                              <div className="absolute left-0 top-0 bottom-0 w-12 bg-slate-900 border-r border-slate-800 flex flex-col pt-6 font-mono text-[11px] text-slate-600 items-end pr-3 select-none">
                                 {activeSkill.code.split('\n').map((_, i) => <div key={i} className="h-6 leading-6">{i+1}</div>)}
                              </div>
                              <textarea 
                                 value={activeSkill.code}
                                 onChange={(e) => updateSkillCode(e.target.value)}
                                 readOnly={activeSkill.isLocked}
                                 spellCheck={false}
                                 className="absolute inset-0 pl-16 pt-6 bg-transparent border-none text-sm font-mono leading-6 text-indigo-100/90 focus:ring-0 resize-none custom-scrollbar selection:bg-indigo-500/30"
                              />
                              {activeSkill.isLocked && (
                                 <div className="absolute top-4 right-6 pointer-events-none opacity-50 flex items-center text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                    <LockIcon size={12} className="mr-2" /> Read Only System Skill
                                 </div>
                              )}
                           </div>
                           <footer className="h-10 bg-slate-950 border-t border-slate-800 flex items-center px-4 justify-between text-[10px] font-bold text-slate-600">
                              <span>INT_ENCLAVE_READY</span>
                              <div className="flex space-x-4">
                                 <span>TS: {activeSkill.updatedAt}</span>
                                 <span>CHARS: {activeSkill.code.length}</span>
                              </div>
                           </footer>
                        </div>
                     )}

                     {activeCenterTab === 'schema' && (
                        <div className="flex-1 p-8 overflow-y-auto custom-scrollbar bg-[#0d1117] animate-in slide-in-from-bottom-2 duration-300">
                           <div className="max-w-2xl space-y-6">
                              <div className="flex items-center justify-between">
                                 <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">OpenAI / Gemini Function Schema</h3>
                                 <Badge variant="info">JSON-V1</Badge>
                              </div>
                              <div className="p-6 bg-slate-950 rounded-2xl border border-slate-800 font-mono text-xs text-emerald-400 leading-relaxed shadow-inner">
                                 <pre>{JSON.stringify(activeSkill.schema, null, 2)}</pre>
                              </div>
                              <div className="p-4 bg-indigo-900/10 border border-indigo-500/20 rounded-xl flex items-start gap-4">
                                 <SparklesIcon size={18} className="text-indigo-400 mt-0.5" />
                                 <div className="text-xs text-indigo-200/70 leading-relaxed">
                                    This schema is automatically generated based on the source code docstrings and type definitions. It is used to inform the LLM of the tool's existence and call parameters.
                                 </div>
                              </div>
                           </div>
                        </div>
                     )}

                     {activeCenterTab === 'usage' && (
                        <div className="flex-1 p-8 overflow-y-auto custom-scrollbar animate-in fade-in duration-300">
                           <div className="max-w-2xl space-y-8">
                              <section className="space-y-4">
                                 <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Fleet Assignment</h3>
                                 <div className="space-y-2">
                                    {activeSkill.usedBy.map(agentId => {
                                       const agent = MOCK_AGENTS.find(a => a.id === agentId);
                                       return (
                                          <div key={agentId} className="flex items-center justify-between p-3 bg-slate-800/40 border border-slate-700 rounded-xl hover:border-indigo-500/30 transition-all cursor-pointer group">
                                             <div className="flex items-center space-x-3">
                                                <div className={`w-8 h-8 rounded-lg bg-${agent?.avatarColor}-500/10 flex items-center justify-center text-lg`}>
                                                   {agent?.isPrimary ? '👑' : '🤖'}
                                                </div>
                                                <span className="text-sm font-bold text-slate-200">{agent?.name}</span>
                                             </div>
                                             <ChevronRightIcon size={14} className="text-slate-600 group-hover:text-indigo-400 transition-all" />
                                          </div>
                                       );
                                    })}
                                 </div>
                              </section>

                              <section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 space-y-4">
                                 <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center">
                                    <ActivityIcon size={14} className="mr-2 text-indigo-400" /> Performance Profile
                                 </h3>
                                 <div className="grid grid-cols-3 gap-4 font-mono text-[11px]">
                                    <div className="space-y-1">
                                       <span className="text-slate-600 block">LAST_CALLED</span>
                                       <span className="text-slate-300">2h ago</span>
                                    </div>
                                    <div className="space-y-1">
                                       <span className="text-slate-600 block">AVG_LATENCY</span>
                                       <span className="text-emerald-400">14ms</span>
                                    </div>
                                    <div className="space-y-1">
                                       <span className="text-slate-600 block">ERROR_RATE</span>
                                       <span className="text-slate-300">0.2%</span>
                                    </div>
                                 </div>
                              </section>
                           </div>
                        </div>
                     )}
                  </div>
               </div>
            </>
         ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-700 opacity-20">
               <ZapIcon size={80} className="mb-4" />
               <p className="text-2xl font-bold uppercase tracking-[0.2em]">Select a tool to inspect</p>
            </div>
         )}
      </main>

      {/* 3. Right Sandbox Pane */}
      <aside className={`w-[350px] border-l border-slate-800 bg-slate-900 flex flex-col shrink-0 z-20 transition-all duration-500 ${runStatus === 'success' ? 'ring-1 ring-emerald-500/50 shadow-[inset_0_0_50px_rgba(16,185,129,0.05)]' : runStatus === 'error' ? 'ring-1 ring-red-500/50' : ''}`}>
         <header className="h-14 border-b border-slate-800 px-6 flex items-center justify-between shrink-0 bg-slate-950/50">
            <div className="flex items-center space-x-2">
               <TerminalIcon size={16} className="text-amber-400" />
               <h3 className="text-[10px] font-bold text-white uppercase tracking-widest">Sandbox Execution</h3>
            </div>
            <div className="flex items-center space-x-3">
               <span className="text-[9px] font-bold text-slate-500 uppercase">Mock Mode</span>
               <button 
                  onClick={() => setMockMode(!mockMode)}
                  className={`w-8 h-4 rounded-full p-0.5 relative transition-colors duration-300 ${mockMode ? 'bg-indigo-600' : 'bg-slate-700'}`}
               >
                  <div className={`w-3 h-3 bg-white rounded-full transition-transform ${mockMode ? 'translate-x-4' : 'translate-x-0'}`} />
               </button>
            </div>
         </header>

         <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
            {/* Input Form */}
            <section className="space-y-4">
               <div className="flex items-center justify-between">
                  <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Argument Inputs</h4>
                  <span className="text-[10px] font-mono text-slate-600">k={activeSkill?.parameters.length || 0}</span>
               </div>
               
               <div className="space-y-4">
                  {activeSkill?.parameters.map(param => (
                     <div key={param.name} className="space-y-1.5">
                        <div className="flex items-center justify-between">
                           <label className="text-[10px] font-bold text-slate-400 font-mono uppercase">{param.name}</label>
                           <span className="text-[8px] text-slate-600 font-bold uppercase">{param.type}</span>
                        </div>
                        {param.type === 'boolean' ? (
                           <div 
                              onClick={() => setTestArgs({...testArgs, [param.name]: !testArgs[param.name]})}
                              className="flex items-center space-x-3 cursor-pointer group"
                           >
                              <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${testArgs[param.name] ? 'bg-indigo-600 border-indigo-500' : 'bg-slate-950 border-slate-700 group-hover:border-slate-500'}`}>
                                 {testArgs[param.name] && <CheckCircleIcon size={12} className="text-white"/>}
                              </div>
                              <span className="text-xs text-slate-500 group-hover:text-slate-300 uppercase font-mono">Toggle Confirm</span>
                           </div>
                        ) : (
                           <input 
                              type="text" 
                              value={testArgs[param.name] || ''}
                              onChange={(e) => setTestArgs({...testArgs, [param.name]: e.target.value})}
                              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-indigo-300 font-mono focus:border-indigo-500 outline-none shadow-inner"
                              placeholder={param.description}
                           />
                        )}
                     </div>
                  ))}
                  {!activeSkill?.parameters.length && (
                     <div className="py-8 text-center text-xs text-slate-600 italic border border-dashed border-slate-800 rounded-xl">No input arguments required</div>
                  )}
               </div>
            </section>

            {/* Run Button */}
            <div className="pt-2">
               <button 
                  onClick={handleRunTest}
                  disabled={isExecuting || !activeSkill}
                  className={`w-full py-3 rounded-xl flex items-center justify-center font-bold text-xs uppercase tracking-[0.2em] transition-all shadow-lg active:scale-95 ${
                     isExecuting 
                        ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 animate-pulse' 
                        : 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-indigo-900/40'
                  }`}
               >
                  {isExecuting ? (
                     <><RotateCwIcon size={16} className="animate-spin mr-3" /> Isolating Runtime...</>
                  ) : (
                     <><PlayIcon size={14} fill="currentColor" className="mr-3" /> Execute Sandbox (F5)</>
                  )}
               </button>
            </div>

            {/* Logs & STDOUT */}
            <section className="space-y-4">
               <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center">
                  <ActivityIcon size={12} className="mr-2" /> Live Trace Log
               </h4>
               <div className="bg-[#0a0f1e] border border-slate-800 rounded-xl p-4 h-40 overflow-y-auto custom-scrollbar font-mono text-[10px] space-y-1 text-slate-500 leading-relaxed shadow-inner">
                  {executionLogs.map((log, i) => (
                     <div key={i} className={`animate-in fade-in slide-in-from-left-1 duration-300 ${log.includes('ERROR') ? 'text-red-400' : log.includes('SUCCESS') ? 'text-emerald-400' : ''}`}>
                        {log}
                     </div>
                  ))}
                  {isExecuting && <div className="w-1.5 h-3 bg-indigo-500 animate-pulse mt-1" />}
               </div>
            </section>

            {/* Result Object */}
            <section className="space-y-4">
               <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Return Result</h4>
               <div className={`p-4 rounded-xl border font-mono text-[10px] leading-relaxed overflow-x-auto shadow-2xl transition-all ${
                  runStatus === 'error' ? 'bg-red-950/20 border-red-500/30 text-red-300' : 
                  runStatus === 'success' ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300' :
                  'bg-slate-950 border-slate-800 text-slate-600'
               }`}>
                  {executionResult ? (
                     <pre>{JSON.stringify(executionResult, null, 2)}</pre>
                  ) : (
                     <span className="italic">Awaiting execution...</span>
                  )}
               </div>
            </section>
         </div>

         <footer className="p-6 bg-slate-950 border-t border-slate-800 space-y-4 shrink-0">
            <div className="flex items-center justify-between text-[9px] font-bold text-slate-600 uppercase">
               <span>CPU_ENV: V8_ISOLATE</span>
               <div className="flex items-center">
                  <LockIcon size={10} className="mr-1.5" /> SECURE_EXEC
               </div>
            </div>
         </footer>
      </aside>

    </div>
  );
};

// Sub-components

const SkillTreeGroup: React.FC<{ 
  title: string; 
  skills: Skill[]; 
  selectedId: string | null; 
  onSelect: (id: string) => void 
}> = ({ title, skills, selectedId, onSelect }) => {
   const [expanded, setExpanded] = useState(true);
   if (skills.length === 0) return null;

   return (
      <div className="space-y-1">
         <button 
            onClick={() => setExpanded(!expanded)}
            className="w-full flex items-center px-2 py-1 text-[10px] font-bold text-slate-500 uppercase tracking-widest hover:text-slate-300 transition-colors"
         >
            {expanded ? <ChevronDownIcon size={12} className="mr-2" /> : <ChevronRightIcon size={12} className="mr-2" />}
            {title}
         </button>
         {expanded && (
            <div className="space-y-0.5">
               {skills.map(skill => (
                  <button
                     key={skill.id}
                     onClick={() => onSelect(skill.id)}
                     className={`w-full flex flex-col p-3 rounded-xl border transition-all text-left group ${
                        selectedId === skill.id 
                           ? 'bg-indigo-600/10 border-indigo-500/30' 
                           : 'bg-transparent border-transparent hover:bg-slate-800/40 text-slate-400'
                     }`}
                  >
                     <div className="flex items-center justify-between w-full mb-1.5">
                        <span className={`text-xs font-bold truncate ${selectedId === skill.id ? 'text-white' : 'text-slate-300 group-hover:text-slate-200'}`}>
                           {skill.name}
                        </span>
                        {skill.isLocked && <LockIcon size={10} className="text-slate-600" />}
                     </div>
                     <div className="flex items-center space-x-2">
                        <LanguageBadge lang={skill.language} />
                        <span className="text-[8px] font-mono text-slate-600 uppercase">{skill.updatedAt}</span>
                     </div>
                  </button>
               ))}
            </div>
         )}
      </div>
   );
};

const LanguageBadge: React.FC<{ lang: SkillLanguage }> = ({ lang }) => {
   const styles = {
      python: 'text-blue-400 border-blue-500/20 bg-blue-500/5',
      typescript: 'text-indigo-400 border-indigo-500/20 bg-indigo-500/5',
      http: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5'
   };
   return (
      <span className={`text-[8px] font-bold px-1 py-0.5 rounded border uppercase tracking-widest ${styles[lang]}`}>
         {lang}
      </span>
   );
};

const WorkspaceTab: React.FC<{ active: boolean; onClick: () => void; label: string; icon: React.ReactNode }> = ({ active, onClick, label, icon }) => (
   <button 
      onClick={onClick}
      className={`px-6 py-4 text-[10px] font-bold uppercase tracking-widest transition-all relative flex items-center group ${
         active ? 'text-white' : 'text-slate-500 hover:text-slate-300'
      }`}
   >
      <span className={`mr-2.5 transition-transform group-hover:scale-110 ${active ? 'text-indigo-400' : ''}`}>{icon}</span>
      {label}
      {active && (
         <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)] animate-in fade-in" />
      )}
   </button>
);

const StatItem: React.FC<{ label: string; value: string; icon: React.ReactNode }> = ({ label, value, icon }) => (
   <div className="flex flex-col">
      <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest leading-none mb-1 flex items-center">
         <span className="mr-1.5">{icon}</span>
         {label}
      </span>
      <span className="text-xs font-bold text-slate-200 font-mono">{value}</span>
   </div>
);

export default SkillStudio;
