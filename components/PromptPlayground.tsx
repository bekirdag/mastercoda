
import React, { useState, useEffect, useRef } from 'react';
import Button from './Button';
import Badge from './Badge';
import { 
  BeakerIcon, 
  PlayIcon, 
  RotateCwIcon, 
  ChevronDownIcon, 
  MaximizeIcon, 
  MinimizeIcon, 
  CodeIcon, 
  SparklesIcon, 
  ActivityIcon, 
  ShieldIcon, 
  LockIcon, 
  TrashIcon, 
  ChevronRightIcon,
  SaveIcon,
  AlertTriangleIcon,
  SearchIcon,
  PlusIcon,
  TerminalIcon,
  CheckCircleIcon,
  RefreshCwIcon
} from './Icons';

// Proxy for Copy icon 
const CopyIcon: React.FC<any> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={props.size || 16}
    height={props.size || 16}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
  </svg>
);

type PlaygroundMode = 'chat' | 'completion';

interface PlaygroundVariable {
  id: string;
  key: string;
  value: string;
}

interface RunResult {
  id: string;
  model: string;
  output: string;
  latency: number;
  tokensIn: number;
  tokensOut: number;
  cost: number;
  status: 'idle' | 'streaming' | 'complete' | 'error';
}

const PromptPlayground: React.FC = () => {
  // Config State
  const [mode, setMode] = useState<PlaygroundMode>('chat');
  const [isCompareMode, setIsCompareMode] = useState(false);
  const [systemPrompt, setSystemPrompt] = useState('You are an expert senior software engineer. Help the user with complex coding tasks.');
  const [userPrompt, setUserPrompt] = useState('');
  
  // Params
  const [temp, setTemp] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(4096);
  const [topP, setTopP] = useState(0.95);

  // Models
  const [modelA, setModelA] = useState('gemini-3-pro-preview');
  const [modelB, setModelB] = useState('claude-3-5-sonnet');

  // Runtime State
  const [results, setResults] = useState<Record<string, RunResult>>({
    'A': { id: 'A', model: 'gemini-3-pro-preview', output: '', latency: 0, tokensIn: 0, tokensOut: 0, cost: 0, status: 'idle' },
    'B': { id: 'B', model: 'claude-3-5-sonnet', output: '', latency: 0, tokensIn: 0, tokensOut: 0, cost: 0, status: 'idle' }
  });
  const [isRightPaneOpen, setIsRightPaneOpen] = useState(true);
  const [rightTab, setRightTab] = useState<'variables' | 'tools'>('variables');
  const [variables, setVariables] = useState<PlaygroundVariable[]>([
    { id: '1', key: 'language', value: 'TypeScript' }
  ]);

  const handleRun = async () => {
    if (!userPrompt.trim()) return;

    // Initialize/Reset output for models
    const ids = isCompareMode ? ['A', 'B'] : ['A'];
    
    setResults(prev => {
        const next = { ...prev };
        ids.forEach(id => {
            next[id] = { ...next[id], output: '', status: 'streaming', latency: 0 };
        });
        return next;
    });

    // Simulate streaming for each model
    ids.forEach(async (id) => {
        const startTime = Date.now();
        const modelName = id === 'A' ? modelA : modelB;
        
        // Mock responses for simulation
        const mockResponses: Record<string, string> = {
            'gemini-3-pro-preview': "Based on your requirements, the best way to implement a custom hook for streaming would be using the `AbortController` and `fetch` API. Here is a clean implementation in " + (variables.find(v => v.key === 'language')?.value || 'code') + ":\n\n```typescript\nconst useStream = (url: string) => {\n  // Implementation details\n}\n```",
            'claude-3-5-sonnet': "Implementing streaming in React requires careful handling of side effects. I recommend using an async generator for clean flow control. \n\n```typescript\nasync function* streamReader(response) {\n  const reader = response.body.getReader();\n  // ...\n}\n```",
            'gpt-4o': "To handle real-time data in a professional dashboard, you should integrate SSE (Server-Sent Events) with a global state manager like Zustand."
        };

        const responseText = mockResponses[modelName] || "This is a simulated response from the playground.";
        const chunks = responseText.split(' ');
        
        let currentOutput = '';
        for (let i = 0; i < chunks.length; i++) {
            await new Promise(r => setTimeout(r, Math.random() * 50 + 20));
            currentOutput += (i === 0 ? '' : ' ') + chunks[i];
            
            setResults(prev => ({
                ...prev,
                [id]: { ...prev[id], output: currentOutput }
            }));
        }

        setResults(prev => ({
            ...prev,
            [id]: { 
                ...prev[id], 
                status: 'complete', 
                latency: Date.now() - startTime,
                tokensIn: Math.floor(userPrompt.length / 4),
                tokensOut: Math.floor(currentOutput.length / 4),
                cost: 0.005
            }
        }));
    });
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const tokenPercentage = Math.min(100, Math.floor(((systemPrompt.length + userPrompt.length) / 4) / (maxTokens / 100)));

  return (
    <div className="flex flex-col h-full bg-[#0f172a] text-slate-200 overflow-hidden font-sans">
      
      {/* 1. Global Toolbar */}
      <header className="h-[64px] border-b border-slate-800 bg-slate-900 flex items-center justify-between px-6 shrink-0 z-30">
         <div className="flex items-center space-x-6">
            <div className="flex items-center">
               <BeakerIcon className="mr-3 text-indigo-400" size={24} />
               <h1 className="text-xl font-bold text-white tracking-tight">Prompt Lab</h1>
            </div>

            <div className="h-6 w-px bg-slate-800" />

            <div className="flex items-center space-x-4">
               {/* Preset Select */}
               <div className="flex flex-col">
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest leading-none mb-1">Preset</span>
                  <select className="bg-transparent border-none text-xs font-bold text-indigo-400 outline-none p-0 cursor-pointer">
                     <option>Code Refactor</option>
                     <option>JSDoc Generator</option>
                     <option>Unit Test Boilerplate</option>
                     <option>Custom</option>
                  </select>
               </div>

               {/* Mode Switch */}
               <div className="flex bg-slate-800 rounded p-1 border border-slate-700">
                  {(['chat', 'completion'] as PlaygroundMode[]).map(m => (
                     <button
                        key={m}
                        onClick={() => setMode(m)}
                        className={`px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider transition-all ${
                           mode === m 
                           ? 'bg-indigo-600 text-white shadow-sm' 
                           : 'text-slate-500 hover:text-slate-300'
                        }`}
                     >
                        {m}
                     </button>
                  ))}
               </div>

               {/* Compare Toggle */}
               <button 
                  onClick={() => setIsCompareMode(!isCompareMode)}
                  className={`flex items-center px-3 py-1.5 rounded border transition-all ${
                    isCompareMode 
                    ? 'bg-indigo-600/10 border-indigo-500/50 text-indigo-400' 
                    : 'bg-slate-800/50 border-slate-700 text-slate-500 hover:text-slate-300'
                  }`}
               >
                  <ActivityIcon size={14} className="mr-2" />
                  <span className="text-[10px] font-bold uppercase">Split View</span>
               </button>
            </div>
         </div>

         <div className="flex items-center space-x-3">
            <Button variant="secondary" size="sm" icon={<RotateCwIcon size={14} />} onClick={() => setResults({
                'A': { id: 'A', model: 'gemini-3-pro-preview', output: '', status: 'idle', latency: 0, tokensIn: 0, tokensOut: 0, cost: 0 },
                'B': { id: 'B', model: 'claude-3-5-sonnet', output: '', status: 'idle', latency: 0, tokensIn: 0, tokensOut: 0, cost: 0 }
            })}>Clear</Button>
            <Button 
               variant="primary" 
               size="sm" 
               icon={<PlayIcon size={14} fill="currentColor" />}
               onClick={handleRun}
               disabled={results['A'].status === 'streaming'}
               className="bg-indigo-600 hover:bg-indigo-500 shadow-[0_0_20px_rgba(79,70,229,0.3)] min-w-[120px]"
            >
               Run Prompt
            </Button>
         </div>
      </header>

      {/* 2. Main Three-Pane Workspace */}
      <div className="flex-1 flex overflow-hidden">
         
         {/* LEFT PANE: Configuration */}
         <aside className="w-[320px] border-r border-slate-800 bg-slate-900/30 flex flex-col shrink-0">
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
               
               {/* Model Selection */}
               <div className="space-y-4">
                  <div className="space-y-2">
                     <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Model A (Primary)</label>
                     <select 
                        value={modelA}
                        onChange={(e) => setModelA(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-indigo-300 font-bold focus:border-indigo-500 outline-none appearance-none cursor-pointer"
                     >
                        <option value="gemini-3-pro-preview">Gemini 3 Pro</option>
                        <option value="gemini-3-flash-preview">Gemini 3 Flash</option>
                        <option value="gpt-4o">GPT-4o (Omni)</option>
                     </select>
                  </div>
                  {isCompareMode && (
                     <div className="space-y-2 animate-in slide-in-from-top-2">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Model B (Comparison)</label>
                        <select 
                           value={modelB}
                           onChange={(e) => setModelB(e.target.value)}
                           className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-indigo-300 font-bold focus:border-indigo-500 outline-none appearance-none cursor-pointer"
                        >
                           <option value="claude-3-5-sonnet">Claude 3.5 Sonnet</option>
                           <option value="gpt-4-turbo">GPT-4 Turbo</option>
                           <option value="llama3-70b">Llama 3 (Local)</option>
                        </select>
                     </div>
                  )}
               </div>

               {/* System Prompt */}
               <div className="space-y-2">
                  <div className="flex items-center justify-between">
                     <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">System Instructions</label>
                     <span className="text-[9px] text-slate-600 font-mono">MDX_SUPPORT</span>
                  </div>
                  <textarea 
                     value={systemPrompt}
                     onChange={(e) => setSystemPrompt(e.target.value)}
                     className="w-full h-48 bg-slate-950 border border-slate-700 rounded-xl p-4 text-xs font-mono leading-relaxed text-slate-300 focus:border-indigo-500 outline-none resize-none transition-all"
                     placeholder="You are a helpful assistant..."
                  />
               </div>

               {/* Parameters */}
               <div className="space-y-6 pt-4 border-t border-slate-800">
                  <div className="space-y-3">
                     <div className="flex justify-between items-center text-[10px] font-bold uppercase">
                        <span className="text-slate-500">Temperature</span>
                        <span className="text-indigo-400 font-mono">{temp.toFixed(1)}</span>
                     </div>
                     <input 
                        type="range" min="0" max="1" step="0.1" value={temp} 
                        onChange={(e) => setTemp(parseFloat(e.target.value))}
                        className="w-full accent-indigo-500" 
                     />
                  </div>
                  <div className="space-y-3">
                     <div className="flex justify-between items-center text-[10px] font-bold uppercase">
                        <span className="text-slate-500">Max Tokens</span>
                        <span className="text-indigo-400 font-mono">{maxTokens}</span>
                     </div>
                     <input 
                        type="range" min="100" max="32000" step="100" value={maxTokens} 
                        onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                        className="w-full accent-indigo-500" 
                     />
                  </div>
                  <div className="space-y-3">
                     <div className="flex justify-between items-center text-[10px] font-bold uppercase">
                        <span className="text-slate-500">Top P</span>
                        <span className="text-indigo-400 font-mono">{topP.toFixed(2)}</span>
                     </div>
                     <input 
                        type="range" min="0" max="1" step="0.01" value={topP} 
                        onChange={(e) => setTopP(parseFloat(e.target.value))}
                        className="w-full accent-indigo-500" 
                     />
                  </div>
               </div>
            </div>
         </aside>

         {/* CENTER PANE: Interactions */}
         <main className="flex-1 flex flex-col bg-[#0f1117] overflow-hidden relative border-r border-slate-800">
            
            {/* Output Streams */}
            <div className={`flex-1 flex divide-x divide-slate-800 overflow-hidden ${isCompareMode ? '' : 'bg-slate-900/10'}`}>
               {/* Result Column A */}
               <div className="flex-1 flex flex-col overflow-hidden animate-in fade-in duration-500 group/col">
                  <ResultHeader result={results['A']} isCompare={isCompareMode} onCopy={handleCopy} />
                  <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                     <div className="prose prose-invert prose-indigo max-w-none">
                        <div className="text-sm text-slate-300 font-mono leading-relaxed whitespace-pre-wrap">
                           {results['A'].output}
                           {results['A'].status === 'streaming' && <span className="inline-block w-1.5 h-4 bg-indigo-500 ml-1 animate-pulse" />}
                        </div>
                        {results['A'].status === 'idle' && !userPrompt && (
                           <div className="h-full flex flex-col items-center justify-center text-slate-700 opacity-20">
                              <CodeIcon size={64} className="mb-4" />
                              <p className="text-xl font-bold uppercase tracking-widest">Ready for input</p>
                           </div>
                        )}
                     </div>
                  </div>
                  <ResultMeta result={results['A']} />
               </div>

               {/* Result Column B (Optional) */}
               {isCompareMode && (
                  <div className="flex-1 flex flex-col overflow-hidden animate-in slide-in-from-right-full duration-500 bg-slate-900/20 group/col">
                     <ResultHeader result={results['B']} isCompare={isCompareMode} onCopy={handleCopy} />
                     <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                        <div className="prose prose-invert prose-indigo max-w-none">
                           <div className="text-sm text-slate-300 font-mono leading-relaxed whitespace-pre-wrap">
                              {results['B'].output}
                              {results['B'].status === 'streaming' && <span className="inline-block w-1.5 h-4 bg-indigo-500 ml-1 animate-pulse" />}
                           </div>
                        </div>
                     </div>
                     <ResultMeta result={results['B']} />
                  </div>
               )}
            </div>

            {/* User Input Area */}
            <div className="shrink-0 p-6 bg-[#0f1117] border-t border-slate-800">
               <div className="max-w-4xl mx-auto space-y-4">
                  <div className="relative group">
                     <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-xl blur group-focus-within:opacity-100 transition duration-500 opacity-50"></div>
                     <textarea 
                        value={userPrompt}
                        onChange={(e) => setUserPrompt(e.target.value)}
                        onKeyDown={(e) => {
                           if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
                              handleRun();
                           }
                        }}
                        placeholder="Ask the models something... (Cmd + Enter to run)"
                        className="relative w-full h-32 bg-slate-950 border border-slate-700 rounded-xl p-4 text-sm text-white focus:border-indigo-500 outline-none resize-none custom-scrollbar shadow-inner"
                     />
                     
                     <div className="absolute bottom-3 right-4 flex items-center space-x-3">
                        <div className="flex items-center text-[10px] font-mono font-bold">
                           <span className={tokenPercentage > 90 ? 'text-red-400' : 'text-slate-500'}>
                              {Math.floor((systemPrompt.length + userPrompt.length) / 4)} tokens
                           </span>
                           <span className="text-slate-700 mx-1">/</span>
                           <span className="text-slate-600">{maxTokens}</span>
                        </div>
                        <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                           <div 
                              className={`h-full transition-all duration-300 ${tokenPercentage > 90 ? 'bg-red-500' : 'bg-indigo-500'}`} 
                              style={{ width: `${tokenPercentage}%` }} 
                           />
                        </div>
                     </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                     <div className="flex space-x-3">
                        <button className="flex items-center text-[10px] font-bold text-slate-500 hover:text-white uppercase tracking-widest transition-colors">
                           <SearchIcon size={12} className="mr-1.5" /> Reference Files
                        </button>
                        <button className="flex items-center text-[10px] font-bold text-slate-500 hover:text-white uppercase tracking-widest transition-colors">
                           <PlusIcon size={12} className="mr-1.5" /> Attach History
                        </button>
                     </div>
                     <div className="flex items-center space-x-4">
                        <button className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 uppercase tracking-widest flex items-center">
                           <SaveIcon size={12} className="mr-1.5" /> Save as Playbook
                        </button>
                     </div>
                  </div>
               </div>
            </div>
         </main>

         {/* RIGHT PANE: Variables & Tools */}
         {isRightPaneOpen ? (
           <aside className="w-[300px] border-l border-slate-800 bg-slate-900/30 flex flex-col shrink-0 animate-in slide-in-from-right-4 duration-300">
              <div className="h-12 border-b border-slate-800 flex items-center bg-slate-900/50">
                 {(['variables', 'tools'] as const).map(tab => (
                    <button 
                       key={tab}
                       onClick={() => setRightTab(tab)}
                       className={`flex-1 h-full text-[10px] font-bold uppercase tracking-widest transition-all relative ${
                          rightTab === tab ? 'text-white' : 'text-slate-500 hover:text-slate-300'
                       }`}
                    >
                       {tab}
                       {rightTab === tab && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500" />}
                    </button>
                 ))}
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                 {rightTab === 'variables' ? (
                    <div className="space-y-6">
                       <div className="flex items-center justify-between">
                          <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Template Keys</h3>
                          <button onClick={() => setVariables([...variables, { id: Date.now().toString(), key: '', value: '' }])} className="text-indigo-400 hover:text-indigo-300">
                             <PlusIcon size={14} />
                          </button>
                       </div>
                       
                       <div className="space-y-3">
                          {variables.map(v => (
                             <div key={v.id} className="p-3 bg-slate-800/40 border border-slate-700/50 rounded-xl space-y-2 group">
                                <div className="flex items-center justify-between">
                                   <input 
                                      value={v.key}
                                      onChange={(e) => setVariables(variables.map(x => x.id === v.id ? { ...x, key: e.target.value } : x))}
                                      placeholder="key" 
                                      className="bg-transparent border-none text-[10px] font-mono text-emerald-400 outline-none w-20" 
                                   />
                                   <button 
                                      onClick={() => setVariables(variables.filter(x => x.id !== v.id))}
                                      className="opacity-0 group-hover:opacity-100 text-slate-600 hover:text-red-400 transition-all"
                                   >
                                      <TrashIcon size={12} />
                                   </button>
                                </div>
                                <input 
                                   value={v.value}
                                   onChange={(e) => setVariables(variables.map(x => x.id === v.id ? { ...x, value: e.target.value } : x))}
                                   placeholder="value" 
                                   className="w-full bg-slate-900/50 border border-slate-700 rounded px-2 py-1 text-xs text-slate-400 outline-none focus:border-indigo-500" 
                                />
                             </div>
                          ))}
                       </div>

                       <div className="bg-indigo-900/10 border border-indigo-500/20 rounded-xl p-4 text-[10px] text-indigo-200/60 leading-relaxed">
                          Use <code className="text-indigo-400 font-bold">{"{{key}}"}</code> in your prompts to inject these values automatically.
                       </div>
                    </div>
                 ) : (
                    <div className="space-y-6">
                       <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Available Extensions</h3>
                       
                       <div className="space-y-2">
                          <ToolToggle label="fs.readFile" enabled />
                          <ToolToggle label="fs.writeFile" enabled={false} />
                          <ToolToggle label="git.commit" enabled />
                          <ToolToggle label="shell.exec" enabled={false} />
                       </div>

                       <div className="pt-6 border-t border-slate-800">
                          <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Function Call Log</h3>
                          <div className="bg-slate-950 rounded-xl border border-slate-800 p-4 font-mono text-[10px] text-slate-500 h-48 overflow-y-auto custom-scrollbar">
                             <div className="opacity-40 italic">Waiting for agent to invoke tools...</div>
                          </div>
                       </div>
                    </div>
                 )}
              </div>
           </aside>
         ) : (
           <button 
             onClick={() => setIsRightPaneOpen(true)}
             className="w-10 border-l border-slate-800 bg-slate-900/30 flex items-center justify-center text-slate-600 hover:text-white transition-colors"
           >
              <ChevronRightIcon className="rotate-180" size={16} />
           </button>
         )}

      </div>
    </div>
  );
};

// Sub-components

const ResultHeader: React.FC<{ result: RunResult; isCompare: boolean; onCopy: (s: string) => void }> = ({ result, isCompare, onCopy }) => (
   <div className="h-10 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between px-4 shrink-0">
      <div className="flex items-center space-x-2">
         <div className={`w-1.5 h-1.5 rounded-full ${result.status === 'streaming' ? 'bg-indigo-500 animate-pulse' : result.status === 'error' ? 'bg-red-500' : 'bg-emerald-500'}`} />
         <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate max-w-[120px]">
            {isCompare ? result.model : 'MODEL OUTPUT'}
         </span>
      </div>
      <div className="flex items-center space-x-1 opacity-0 group-hover/col:opacity-100 transition-opacity">
         <button 
            onClick={() => onCopy(result.output)}
            className="p-1.5 text-slate-600 hover:text-white rounded transition-colors"
         >
            <CopyIcon size={14} />
         </button>
      </div>
   </div>
);

const ResultMeta: React.FC<{ result: RunResult }> = ({ result }) => (
   <div className="h-8 bg-slate-900/50 border-t border-slate-800 flex items-center justify-between px-4 shrink-0 text-[10px] font-mono text-slate-600">
      {result.status === 'complete' ? (
         <>
            <div className="flex items-center space-x-4">
               <span>LATENCY: {result.latency}ms</span>
               <span>TOKENS: {result.tokensIn} in / {result.tokensOut} out</span>
            </div>
            <div className="text-emerald-500/80 font-bold">COST: ${result.cost.toFixed(3)}</div>
         </>
      ) : result.status === 'streaming' ? (
         <div className="flex items-center">
            <RotateCwIcon size={10} className="animate-spin mr-2 text-indigo-500" />
            GENERATING...
         </div>
      ) : (
         <span>STANDBY</span>
      )}
   </div>
);

const ToolToggle: React.FC<{ label: string; enabled: boolean }> = ({ label, enabled }) => (
   <div className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-800 transition-colors group">
      <div className="flex items-center space-x-2">
         <div className={`p-1 rounded bg-slate-900 ${enabled ? 'text-indigo-400' : 'text-slate-600'}`}>
            <CodeIcon size={12} />
         </div>
         <span className={`text-xs font-mono ${enabled ? 'text-slate-200' : 'text-slate-500'}`}>{label}</span>
      </div>
      <div className={`w-8 h-4 rounded-full p-0.5 transition-all relative ${enabled ? 'bg-indigo-600' : 'bg-slate-700'}`}>
         <div className={`w-3 h-3 bg-white rounded-full transition-transform ${enabled ? 'translate-x-4' : 'translate-x-0'}`} />
      </div>
   </div>
);

export default PromptPlayground;
