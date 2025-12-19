
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { AgentPersona, AgentTemplate, AgentCapability, AgentStatus } from '../types';
import { MOCK_AGENTS, MOCK_AGENT_TEMPLATES, MOCK_AI_PROVIDERS } from '../constants';
import Button from './Button';
import Badge from './Badge';
import { 
  SparklesIcon, 
  SettingsIcon, 
  TrashIcon, 
  PlusIcon, 
  ChevronDownIcon, 
  ActivityIcon, 
  ShieldIcon, 
  LockIcon, 
  ZapIcon, 
  TerminalIcon, 
  HardDriveIcon, 
  GlobeIcon, 
  AlertTriangleIcon, 
  CodeIcon, 
  SaveIcon, 
  RotateCwIcon, 
  ArrowRightIcon, 
  SendIcon, 
  CrownIcon,
  XIcon,
  CheckCircleIcon,
  MessageSquareIcon
} from './Icons';
import { GoogleGenAI } from "@google/genai";

interface AgentStudioProps {
  agentId: string | null;
  onBack: () => void;
}

const AgentStudio: React.FC<AgentStudioProps> = ({ agentId, onBack }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [activeTemplateId, setActiveTemplateId] = useState<string>('tpl-coding');
  
  // Agent Config State
  const [config, setConfig] = useState<Partial<AgentPersona>>({
    name: '',
    role: '',
    model: 'gemini-3-pro-preview',
    provider: 'google',
    systemPrompt: '',
    avatarColor: 'indigo',
    capabilities: [
        { id: 'fs_write', label: 'File System', enabled: false, level: 'read' },
        { id: 'shell', label: 'Terminal Access', enabled: true, level: 'read' },
        { id: 'search', label: 'Web Access', enabled: true, level: 'read' }
    ]
  });

  // Test Flight State
  const [testInput, setTestInput] = useState('');
  const [testMessages, setTestMessages] = useState<{ role: 'user' | 'agent' | 'thought', text: string }[]>([]);
  const [isTestRunning, setIsTestRunning] = useState(false);
  const testEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (agentId && agentId !== 'new') {
        const found = MOCK_AGENTS.find(a => a.id === agentId);
        if (found) setConfig({ ...found });
    }
  }, [agentId]);

  useEffect(() => {
    testEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [testMessages]);

  const applyTemplate = (tpl: AgentTemplate) => {
    setConfig(prev => ({
        ...prev,
        name: tpl.name,
        model: tpl.defaultModel,
        systemPrompt: tpl.systemPrompt,
        capabilities: prev.capabilities?.map(cap => ({
            ...cap,
            enabled: tpl.recommendedSkills.includes(cap.id)
        }))
    }));
    setActiveTemplateId(tpl.id);
  };

  const handleRunTest = async () => {
    if (!testInput.trim()) return;
    
    const userMsg = { role: 'user' as const, text: testInput };
    setTestMessages(prev => [...prev, userMsg]);
    setTestInput('');
    setIsTestRunning(true);

    // Simulate Agent Thinking with current context
    await new Promise(r => setTimeout(r, 1000));
    setTestMessages(prev => [...prev, { role: 'thought', text: `Evaluating request against persona: ${config.name}.` }]);
    
    // Call Gemini API for real preview if using Gemini
    if (config.model?.startsWith('gemini-')) {
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const response = await ai.models.generateContent({
                model: config.model,
                contents: userMsg.text,
                config: {
                    systemInstruction: config.systemPrompt
                }
            });
            setTestMessages(prev => [...prev, { role: 'agent', text: response.text || 'No response.' }]);
        } catch (e) {
            setTestMessages(prev => [...prev, { role: 'agent', text: `[Simulation Error] ${e instanceof Error ? e.message : 'API failure'}` }]);
        }
    } else {
        await new Promise(r => setTimeout(r, 800));
        setTestMessages(prev => [...prev, { role: 'agent', text: "Persona behavior verified. No Gemini model selected for live preview." }]);
    }
    
    setIsTestRunning(false);
  };

  const updateSkill = (id: string, field: keyof AgentCapability, value: any) => {
    setConfig(prev => ({
        ...prev,
        capabilities: prev.capabilities?.map(cap => cap.id === id ? { ...cap, [field]: value } : cap)
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(r => setTimeout(r, 1200));
    setIsSaving(false);
    onBack();
  };

  const promptTokenCount = Math.floor((config.systemPrompt?.length || 0) / 4);
  const isPromptTooLong = promptTokenCount > 30000; // Arbitrary warning threshold for demo

  return (
    <div className="flex flex-col h-full bg-[#0f172a] text-slate-200 font-sans overflow-hidden">
      
      {/* 1. Header */}
      <header className="h-[64px] border-b border-slate-800 bg-slate-900/50 backdrop-blur shrink-0 flex items-center justify-between px-8 z-30">
         <div className="flex items-center space-x-6 flex-1">
            <button onClick={onBack} className="p-2 text-slate-500 hover:text-white transition-colors">
               <ArrowRightIcon className="rotate-180" size={20} />
            </button>
            <div className="flex items-center">
               <div className={`w-10 h-10 rounded-xl bg-${config.avatarColor}-500/10 flex items-center justify-center mr-4 border border-${config.avatarColor}-500/20 shadow-lg`}>
                  <SparklesIcon size={22} className={`text-${config.avatarColor}-400`} />
               </div>
               <div className="flex-1 max-w-sm">
                  <input 
                    type="text" 
                    value={config.name}
                    onChange={(e) => setConfig({...config, name: e.target.value})}
                    placeholder="Untilted Agent"
                    className="w-full bg-transparent border-none text-xl font-bold text-white outline-none focus:ring-0 p-0"
                  />
                  <div className="flex items-center text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">
                     <span>AGENT_STUDIO_V3</span>
                     <span className="mx-2">•</span>
                     {isSaving ? <span className="text-indigo-400">Saving...</span> : <span className="text-emerald-500">Synced</span>}
                  </div>
               </div>
            </div>
         </div>

         <div className="flex items-center space-x-3">
            <div className="flex bg-slate-800 rounded p-1 border border-slate-700 mr-4">
               <button className="px-3 py-1 text-[10px] font-bold uppercase text-white bg-slate-700 rounded shadow-sm">Config</button>
               <button className="px-3 py-1 text-[10px] font-bold uppercase text-slate-500 hover:text-slate-300">History</button>
            </div>
            <Button variant="ghost" className="text-red-400 hover:bg-red-500/10" onClick={onBack}>Cancel</Button>
            <Button 
               variant="primary" 
               size="sm" 
               icon={<SaveIcon size={14} />} 
               onClick={handleSave}
               disabled={isSaving}
               className="shadow-[0_0_20px_rgba(79,70,229,0.3)]"
            >
               {isSaving ? 'Deploying...' : 'Save & Deploy'}
            </Button>
         </div>
      </header>

      {/* 2. Main Studio Split Area */}
      <div className="flex-1 flex overflow-hidden">
         
         {/* LEFT: Configuration (The DNA) */}
         <main className="flex-1 overflow-y-auto custom-scrollbar p-10 bg-[#0f1117] border-r border-slate-800">
            <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in duration-500">
               
               {/* Template Quick Select */}
               <section className="space-y-4">
                  <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Start from Template</h3>
                  <div className="grid grid-cols-3 gap-4">
                     {MOCK_AGENT_TEMPLATES.map(tpl => (
                        <button 
                           key={tpl.id}
                           onClick={() => applyTemplate(tpl)}
                           className={`p-4 rounded-2xl border text-left transition-all group ${
                              activeTemplateId === tpl.id ? 'bg-indigo-600/10 border-indigo-500/50 shadow-lg' : 'bg-slate-800/40 border-slate-700 hover:border-slate-500'
                           }`}
                        >
                           <div className="text-2xl mb-3 group-hover:scale-110 transition-transform">{tpl.icon}</div>
                           <h4 className="text-sm font-bold text-white mb-1">{tpl.name}</h4>
                           <p className="text-[10px] text-slate-500 leading-relaxed">{tpl.description}</p>
                        </button>
                     ))}
                  </div>
               </section>

               <div className="h-px bg-slate-800" />

               {/* Group 1: The Brain */}
               <section className="space-y-6">
                  <div className="flex items-center justify-between">
                     <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] flex items-center">
                        <ActivityIcon size={14} className="mr-2 text-indigo-400" />
                        The Brain (Model)
                     </h3>
                     <button className="text-[10px] font-bold text-indigo-400 hover:underline uppercase">Manage Providers &rsaquo;</button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="space-y-4">
                        <div className="space-y-2">
                           <label className="text-xs font-bold text-slate-400">Provider</label>
                           <div className="relative">
                              <select 
                                 value={config.provider}
                                 onChange={(e) => setConfig({...config, provider: e.target.value as any})}
                                 className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:border-indigo-500 outline-none appearance-none cursor-pointer"
                              >
                                 {MOCK_AI_PROVIDERS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                              </select>
                              <ChevronDownIcon className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none" size={14} />
                           </div>
                        </div>
                        <div className="space-y-2">
                           <label className="text-xs font-bold text-slate-400">Model Architecture</label>
                           <div className="relative">
                              <select 
                                 value={config.model}
                                 onChange={(e) => setConfig({...config, model: e.target.value})}
                                 className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-indigo-300 font-bold focus:border-indigo-500 outline-none appearance-none cursor-pointer"
                              >
                                 <option value="gemini-3-pro-preview">Gemini 3 Pro (Reasoning)</option>
                                 <option value="gemini-3-flash-preview">Gemini 3 Flash (Fast)</option>
                                 <option value="claude-3-5-sonnet">Claude 3.5 Sonnet</option>
                                 <option value="gpt-4o">GPT-4o Omni</option>
                              </select>
                              <ChevronDownIcon className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none" size={14} />
                           </div>
                        </div>
                     </div>

                     <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-800 space-y-6">
                        <div className="space-y-3">
                           <div className="flex justify-between text-[10px] font-bold uppercase">
                              <span className="text-slate-500">Creativity (Temp)</span>
                              <span className="text-indigo-400 font-mono">0.7</span>
                           </div>
                           <input type="range" className="w-full accent-indigo-500" min="0" max="1" step="0.1" defaultValue="0.7" />
                        </div>
                        <div className="space-y-3">
                           <div className="flex justify-between text-[10px] font-bold uppercase">
                              <span className="text-slate-500">Max Tokens</span>
                              <span className="text-indigo-400 font-mono">4096</span>
                           </div>
                           <input type="range" className="w-full accent-indigo-500" min="512" max="16384" step="512" defaultValue="4096" />
                        </div>
                     </div>
                  </div>
               </section>

               {/* Group 2: The Persona */}
               <section className="space-y-4">
                  <div className="flex items-center justify-between">
                     <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] flex items-center">
                        <CodeIcon size={14} className="mr-2 text-indigo-400" />
                        The Persona (System Prompt)
                     </h3>
                     <span className={`text-[10px] font-mono font-bold ${isPromptTooLong ? 'text-red-400' : 'text-slate-600'}`}>
                        {promptTokenCount} tokens / 30k MAX
                     </span>
                  </div>
                  
                  <div className="flex gap-6">
                     <div className="flex-1 relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-2xl blur opacity-25 group-focus-within:opacity-100 transition duration-500" />
                        <textarea 
                           value={config.systemPrompt}
                           onChange={(e) => setConfig({...config, systemPrompt: e.target.value})}
                           className="relative w-full h-[320px] bg-slate-950 border border-slate-800 rounded-2xl p-6 text-sm font-mono leading-relaxed text-slate-300 focus:border-indigo-500 transition-all custom-scrollbar selection:bg-indigo-500/30"
                           placeholder="Define the core logic, goals, and tone of your agent..."
                        />
                     </div>
                     
                     <aside className="w-48 space-y-4 shrink-0">
                        <label className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">Injected Context</label>
                        <div className="space-y-1.5">
                           <VariablePill label="project_name" />
                           <VariablePill label="tech_stack" />
                           <VariablePill label="user_persona" />
                           <VariablePill label="test_framework" />
                           <VariablePill label="repo_map" />
                        </div>
                        <div className="p-3 bg-indigo-900/5 border border-indigo-500/10 rounded-xl mt-4">
                           <p className="text-[9px] text-slate-600 leading-relaxed italic">Use double curly braces to reference project data.</p>
                        </div>
                     </aside>
                  </div>
                  {isPromptTooLong && (
                     <div className="p-3 bg-red-950/20 border border-red-500/20 rounded-xl text-red-400 text-xs flex items-center animate-pulse">
                        <AlertTriangleIcon size={14} className="mr-2" />
                        System prompt is approaching context limit. Performance may degrade.
                     </div>
                  )}
               </section>

               {/* Group 3: The Skills */}
               <section className="space-y-6">
                  <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] flex items-center">
                     <ShieldIcon size={14} className="mr-2 text-emerald-400" />
                     Capability Guardrails
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     {config.capabilities?.map(cap => (
                        <div 
                           key={cap.id} 
                           className={`p-5 rounded-2xl border transition-all ${
                              cap.enabled ? 'bg-slate-800/60 border-slate-600 shadow-sm' : 'bg-slate-900/40 border-slate-800 opacity-60'
                           }`}
                        >
                           <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center space-x-3">
                                 <div className={`p-2 rounded-lg ${cap.enabled ? 'bg-indigo-500/10 text-indigo-400' : 'bg-slate-800 text-slate-600'}`}>
                                    {getToolIcon(cap.id)}
                                 </div>
                                 <span className="text-sm font-bold text-white">{cap.label}</span>
                              </div>
                              <button 
                                 onClick={() => updateSkill(cap.id, 'enabled', !cap.enabled)}
                                 className={`w-10 h-5 rounded-full p-1 transition-all duration-300 relative ${cap.enabled ? 'bg-indigo-600' : 'bg-slate-700'}`}
                              >
                                 <div className={`w-3 h-3 bg-white rounded-full shadow-sm transition-transform duration-300 ${cap.enabled ? 'translate-x-5' : 'translate-x-0'}`} />
                              </button>
                           </div>
                           
                           {cap.enabled && (
                              <div className="flex items-center bg-slate-950/50 p-1.5 rounded-lg border border-slate-800">
                                 <PermissionBtn 
                                    active={cap.level === 'read'} 
                                    onClick={() => updateSkill(cap.id, 'level', 'read')} 
                                    label="Read Only" 
                                 />
                                 <PermissionBtn 
                                    active={cap.level === 'write'} 
                                    onClick={() => updateSkill(cap.id, 'level', 'write')} 
                                    label="Write Access" 
                                    warning={cap.id === 'fs_write'}
                                 />
                                 <PermissionBtn 
                                    active={cap.level === 'exec'} 
                                    onClick={() => updateSkill(cap.id, 'level', 'exec')} 
                                    label="Root Access" 
                                    warning 
                                 />
                              </div>
                           )}
                        </div>
                     ))}
                  </div>
               </section>

               <div className="h-20" />
            </div>
         </main>

         {/* RIGHT: Test Flight (Live Preview) */}
         <aside className="w-[420px] bg-[#0f172a] flex flex-col shrink-0 relative shadow-2xl">
            <header className="h-[50px] border-b border-slate-800 bg-slate-900/80 backdrop-blur flex items-center justify-between px-6 shrink-0 z-20">
               <div className="flex items-center space-x-2">
                  <ActivityIcon size={14} className="text-amber-400" />
                  <span className="text-[10px] font-bold text-white uppercase tracking-widest">Test Flight</span>
               </div>
               <Badge variant="warning">SANDBOX MODE</Badge>
            </header>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-4 bg-gradient-to-b from-[#0f172a] to-[#0a0f1e]">
               {testMessages.length === 0 && (
                  <div className="h-full flex flex-col items-center justify-center text-center opacity-30 px-10">
                     <MessageSquareIcon size={48} className="mb-4" />
                     <p className="text-sm font-medium">No active session. Type below to test your persona configuration.</p>
                  </div>
               )}
               
               {testMessages.map((msg, i) => (
                  <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} animate-in fade-in slide-in-from-bottom-2`}>
                     {msg.role === 'thought' ? (
                        <div className="w-full bg-slate-900/50 border-l-2 border-indigo-500/30 p-3 text-[10px] font-mono text-slate-500 rounded-r-md mb-2">
                           <TerminalIcon size={10} className="inline mr-2" />
                           {msg.text}
                        </div>
                     ) : (
                        <div className={`max-w-[90%] p-3 rounded-2xl text-xs leading-relaxed shadow-sm ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700'}`}>
                           {msg.text}
                        </div>
                     )}
                  </div>
               ))}
               
               {isTestRunning && (
                  <div className="flex space-x-1 p-2">
                     <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" />
                     <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:200ms]" />
                     <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:400ms]" />
                  </div>
               )}
               <div ref={testEndRef} />
            </div>

            {/* Input Footer */}
            <div className="p-4 bg-slate-900 border-t border-slate-800">
               <div className="relative group">
                  <div className="absolute -inset-0.5 bg-indigo-500/20 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition duration-500" />
                  <div className="relative flex items-center bg-slate-950 border border-slate-700 rounded-xl overflow-hidden p-1 pr-2">
                     <input 
                        type="text" 
                        value={testInput}
                        onChange={(e) => setTestInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleRunTest()}
                        placeholder="Say something to test..."
                        className="flex-1 bg-transparent border-none text-xs text-white placeholder-slate-600 focus:ring-0 px-3 py-2.5"
                     />
                     <button 
                        onClick={handleRunTest}
                        disabled={!testInput.trim() || isTestRunning}
                        className={`p-2 rounded-lg transition-all ${
                           testInput.trim() && !isTestRunning
                           ? 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg' 
                           : 'bg-slate-800 text-slate-600'
                        }`}
                     >
                        <SendIcon size={14} fill="currentColor" />
                     </button>
                  </div>
               </div>
               <div className="mt-3 flex items-center justify-between text-[9px] font-bold text-slate-500 uppercase tracking-tighter">
                  <div className="flex items-center">
                     <ActivityIcon size={10} className="mr-1.5 text-amber-500" />
                     ISOLATED_SANDBOX_v1
                  </div>
                  <button onClick={() => setTestMessages([])} className="hover:text-white transition-colors">Clear History</button>
               </div>
            </div>
         </aside>

      </div>
    </div>
  );
};

// Sub-components

const VariablePill: React.FC<{ label: string }> = ({ label }) => (
   <button className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-850 transition-all text-left group">
      <code className="text-[10px] font-mono text-indigo-400">{"{{"}{label}{"}}"}</code>
      <PlusIcon size={10} className="text-slate-600 group-hover:text-indigo-400 opacity-0 group-hover:opacity-100 transition-all" />
   </button>
);

const PermissionBtn: React.FC<{ active: boolean; onClick: () => void; label: string; warning?: boolean }> = ({ active, onClick, label, warning }) => (
   <button 
      onClick={onClick}
      className={`flex-1 py-1.5 px-2 rounded-md text-[9px] font-bold uppercase tracking-tighter transition-all ${
         active 
            ? warning ? 'bg-red-500/20 text-red-400 shadow-inner' : 'bg-indigo-600 text-white shadow-lg' 
            : 'text-slate-500 hover:text-slate-300'
      }`}
   >
      {label}
   </button>
);

const getToolIcon = (id: string) => {
   switch (id) {
      case 'fs_write': return <HardDriveIcon size={16} />;
      case 'shell': return <TerminalIcon size={16} />;
      case 'search': return <GlobeIcon size={16} />;
      case 'browser': return <GlobeIcon size={16} />;
      default: return <ZapIcon size={16} />;
   }
};

export default AgentStudio;
