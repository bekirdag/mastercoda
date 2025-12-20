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
  RefreshCwIcon,
  XIcon,
  GlobeIcon,
  HardDriveIcon,
  // Added SettingsIcon to fix "Cannot find name 'SettingsIcon'" error on line 453
  SettingsIcon
} from './Icons';
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

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

    const ids = isCompareMode ? ['A', 'B'] : ['A'];
    
    setResults(prev => {
        const next = { ...prev };
        ids.forEach(id => {
            next[id] = { ...next[id], output: '', status: 'streaming', latency: 0 };
        });
        return next;
    });

    ids.forEach(async (id) => {
        const startTime = Date.now();
        const modelName = id === 'A' ? modelA : modelB;
        
        // Handle Gemini Models with real API
        if (modelName.startsWith('gemini-')) {
            try {
                const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
                
                // Construct injected prompt with variables
                let finalPrompt = userPrompt;
                variables.forEach(v => {
                    if (v.key) finalPrompt = finalPrompt.replace(new RegExp(`{{${v.key}}}`, 'g'), v.value);
                });

                // Correctly include thinkingConfig for Gemini 3 and 2.5 models when maxOutputTokens is set
                const stream = await ai.models.generateContentStream({
                    model: modelName,
                    contents: finalPrompt,
                    config: {
                        systemInstruction: systemPrompt,
                        temperature: temp,
                        topP: topP,
                        maxOutputTokens: maxTokens,
                        thinkingConfig: { thinkingBudget: Math.floor(maxTokens / 2) }
                    }
                });

                let fullText = "";
                for await (const chunk of stream) {
                    fullText += chunk.text || "";
                    setResults(prev => ({
                        ...prev,
                        [id]: { ...prev[id], output: fullText }
                    }));
                }

                setResults(prev => ({
                    ...prev,
                    [id]: { 
                        ...prev[id], 
                        status: 'complete', 
                        latency: Date.now() - startTime,
                        tokensIn: Math.floor(finalPrompt.length / 4),
                        tokensOut: Math.floor(fullText.length / 4),
                        cost: 0.002 // Est.
                    }
                }));
            } catch (err) {
                console.error(`Error running ${modelName}:`, err);
                setResults(prev => ({
                    ...prev,
                    [id]: { ...prev[id], status: 'error', output: `Error: ${err instanceof Error ? err.message : String(err)}` }
                }));
            }
            return;
        }

        // Fallback for non-Gemini models (Mock)
        const mockResponses: Record<string, string> = {
            'claude-3-5-sonnet': "Implementing streaming in React requires careful handling of side effects. I recommend using an async generator for clean flow control. \n\n```typescript\nasync function* streamReader(response) {\n  const reader = response.body.getReader();\n  // ...\n}\n```",
            'gpt-4o': "To handle real-time data in a professional dashboard, you should integrate SSE (Server-Sent Events) with a global state manager like Zustand."
        };

        const responseText = mockResponses[modelName] || "This is a simulated response from the playground for non-Gemini models.";
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
               <h1 className="text-xl font-bold text-white tracking-tight uppercase">Prompt Lab</h1>
            </div>

            <div className="h-6 w-px bg-slate-800" />

            <div className="flex items-center space-x-4">
               <div className="flex flex-col">
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest leading-none mb-1">Preset</span>
                  <select className="bg-transparent border-none text-xs font-bold text-indigo-400 outline-none p-0 cursor-pointer">
                     <option>Code Refactor</option>
                     <option>JSDoc Generator</option>
                     <option>Unit Test Boilerplate</option>
                     <option>Custom</option>
                  </select>
               </div>

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

               <button 
                  onClick={() => setIsCompareMode(!isCompareMode)}
                  className={`flex items-center px-3 py-1.5 rounded border transition-all ${
                    isCompareMode 
                    ? 'bg-indigo-600/10 border-indigo-500/50 text-indigo-400' 
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
                  }`}
               >
                  <ActivityIcon size={14} className="mr-2" />
                  <span className="text-[10px] font-bold uppercase">Split View</span>
               </button>
            </div>
         </div>

         <div className="flex items-center space-x-3">
            <Button variant="secondary" size="sm" icon={<RotateCwIcon size={14} />} onClick={() => setResults({
                'A': { id: 'A', model: modelA, output: '', status: 'idle', latency: 0, tokensIn: 0, tokensOut: 0, cost: 0 },
                'B': { id: 'B', model: modelB, output: '', status: 'idle', latency: 0, tokensIn: 0, tokensOut: 0, cost: 0 }
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
         
         <aside className="w-[320px] border-r border-slate-800 bg-slate-900/30 flex flex-col shrink-0">
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8">
               
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
                           <option value="gemini-3-flash-preview">Gemini 3 Flash</option>
                        </select>
                     </div>
                  )}
               </div>

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

         <main className="flex-1 flex flex-col bg-[#0f1117] overflow-hidden relative border-r border-slate-800">
            <div className={`flex-1 flex divide-x divide-slate-800 overflow-hidden ${isCompareMode ? '' : 'bg-slate-900/10'}`}>
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

               {isCompareMode && (
                  <div className="flex-1 flex flex-col overflow-hidden animate-in slide-in-from-right-full duration-500 bg-slate-900/20 group/col">
                     <ResultHeader result={results['B']} isCompare={isCompareMode} onCopy={handleCopy} />
                     <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                        <div className="prose prose-invert prose-indigo max-w-none">
                           <div className="text-sm text-slate-300 font-mono leading-relaxed whitespace-pre-wrap">
                              {results['B'].output}
                              {results['B'].status === 'streaming' && <span className="inline-block w-1.5 h-4 bg-indigo-500 ml-1 animate-pulse" />}
                           </div>
                           {results['B'].status === 'idle' && !userPrompt && (
                              <div className="h-full flex flex-col items-center justify-center text-slate-700 opacity-20">
                                 <CodeIcon size={64} className="mb-4" />
                                 <p className="text-xl font-bold uppercase tracking-widest">Model B Standby</p>
                              </div>
                           )}
                        </div>
                     </div>
                     <ResultMeta result={results['B']} />
                  </div>
               )}
            </div>

            {/* User Input Section (Center Bottom) */}
            <div className="bg-slate-900/90 backdrop-blur border-t border-slate-800 p-6 z-20">
               <div className="max-w-4xl mx-auto space-y-4">
                  <div className="relative">
                     <textarea 
                        value={userPrompt}
                        onChange={(e) => setUserPrompt(e.target.value)}
                        placeholder="Type your prompt here... (e.g. 'Refactor this function to be more efficient')"
                        className="w-full h-32 bg-slate-950 border border-slate-700 rounded-xl p-4 text-sm font-mono text-slate-300 focus:border-indigo-500 outline-none resize-none transition-all pr-12 shadow-inner"
                     />
                     <div className="absolute top-4 right-4 flex flex-col space-y-2 opacity-50 group-hover:opacity-100">
                         <div className="h-1 w-8 bg-slate-800 rounded-full overflow-hidden">
                             <div className="h-full bg-indigo-500" style={{ width: `${tokenPercentage}%` }} />
                         </div>
                     </div>
                  </div>
                  <div className="flex items-center justify-between">
                     <div className="flex items-center space-x-6 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                        <div className="flex items-center"><ActivityIcon size={12} className="mr-2 text-indigo-400" /> CONTEXT: USER_PROVIDED</div>
                        <div className="flex items-center"><TerminalIcon size={12} className="mr-2 text-indigo-400" /> MODE: {mode}</div>
                     </div>
                     <div className="flex items-center space-x-3">
                        <Badge variant="neutral">Tokens: ~{Math.floor((systemPrompt.length + userPrompt.length)/4)} / {maxTokens}</Badge>
                     </div>
                  </div>
               </div>
            </div>
         </main>

         {/* 3. Right Sidebar: Context & Variables */}
         {isRightPaneOpen && (
            <aside className="w-[300px] border-l border-slate-800 bg-slate-900 flex flex-col shrink-0 z-20 animate-in slide-in-from-right-full">
               <div className="flex h-12 border-b border-slate-800 bg-slate-900 shrink-0">
                  <button 
                     onClick={() => setRightTab('variables')}
                     className={`flex-1 flex flex-col items-center justify-center transition-all relative ${rightTab === 'variables' ? 'text-white' : 'text-slate-600 hover:text-slate-300'}`}
                  >
                     <PlusIcon size={14} className="mb-1" />
                     <span className="text-[9px] font-bold uppercase tracking-widest">Variables</span>
                     {rightTab === 'variables' && <div className="absolute bottom-0 inset-x-0 h-0.5 bg-indigo-500" />}
                  </button>
                  <button 
                     onClick={() => setRightTab('tools')}
                     className={`flex-1 flex flex-col items-center justify-center transition-all relative ${rightTab === 'tools' ? 'text-white' : 'text-slate-600 hover:text-slate-300'}`}
                  >
                     <SettingsIcon size={14} className="mb-1" />
                     <span className="text-[9px] font-bold uppercase tracking-widest">Tools</span>
                     {rightTab === 'tools' && <div className="absolute bottom-0 inset-x-0 h-0.5 bg-indigo-500" />}
                  </button>
               </div>

               <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                  {rightTab === 'variables' && (
                     <div className="space-y-6 animate-in fade-in duration-300">
                        <div className="flex items-center justify-between">
                           <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Injected Context</h3>
                           <button onClick={() => setVariables([...variables, { id: String(Date.now()), key: '', value: '' }])} className="text-indigo-400 hover:text-indigo-300">
                              <PlusIcon size={16} />
                           </button>
                        </div>
                        <div className="space-y-4">
                           {variables.map(v => (
                              <div key={v.id} className="space-y-2 group">
                                 <div className="flex items-center justify-between">
                                    <input 
                                       value={v.key} 
                                       onChange={(e) => setVariables(variables.map(vr => vr.id === v.id ? { ...vr, key: e.target.value } : vr))}
                                       placeholder="key" 
                                       className="bg-transparent border-none text-[10px] font-mono text-indigo-400 p-0 focus:ring-0 w-24" 
                                    />
                                    <button onClick={() => setVariables(variables.filter(vr => vr.id !== v.id))} className="opacity-0 group-hover:opacity-100 text-slate-600 hover:text-red-400 transition-all">
                                       <XIcon size={12} />
                                    </button>
                                 </div>
                                 <textarea 
                                    value={v.value} 
                                    onChange={(e) => setVariables(variables.map(vr => vr.id === v.id ? { ...vr, value: e.target.value } : vr))}
                                    className="w-full bg-slate-950 border border-slate-800 rounded p-2 text-xs text-slate-400 h-20 resize-none focus:border-indigo-500 outline-none" 
                                 />
                              </div>
                           ))}
                        </div>
                     </div>
                  )}

                  {rightTab === 'tools' && (
                     <div className="space-y-6 animate-in fade-in duration-300">
                        <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Function Declarations</h3>
                        <div className="space-y-3">
                           <ToolToggle label="Google Search" icon={<GlobeIcon size={12}/>} checked={true} />
                           <ToolToggle label="Code Interpreter" icon={<TerminalIcon size={12}/>} checked={true} />
                           <ToolToggle label="File System Access" icon={<HardDriveIcon size={12}/>} checked={false} />
                        </div>
                     </div>
                  )}
               </div>
            </aside>
         )}
      </div>

      {/* Control Pane Toggle (Bottom Right Floating) */}
      <button 
        onClick={() => setIsRightPaneOpen(!isRightPaneOpen)}
        className="absolute bottom-24 right-6 w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-2xl z-50 hover:bg-indigo-500 transition-all"
      >
         {isRightPaneOpen ? <MinimizeIcon size={20} /> : <MaximizeIcon size={20} />}
      </button>
    </div>
  );
};

const ResultHeader: React.FC<{ result: RunResult; isCompare: boolean; onCopy: (t: string) => void }> = ({ result, isCompare, onCopy }) => (
    <div className="h-12 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between px-6 shrink-0">
       <div className="flex items-center space-x-3">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
             {isCompare ? `Model ${result.id}:` : 'Output:'}
          </span>
          <span className="text-xs font-bold text-indigo-400 font-mono">{result.model}</span>
       </div>
       <div className="flex items-center space-x-2">
          <button 
             onClick={() => onCopy(result.output)}
             className="p-1.5 text-slate-500 hover:text-white transition-colors"
             title="Copy Output"
          >
             <CopyIcon size={14} />
          </button>
       </div>
    </div>
  );
  
  const ResultMeta: React.FC<{ result: RunResult }> = ({ result }) => (
    <div className="h-8 border-t border-slate-800 bg-slate-900/30 px-6 flex items-center justify-between shrink-0">
       <div className="flex items-center space-x-4 text-[9px] font-mono text-slate-600">
          <span>LATENCY: {result.latency}ms</span>
          <span>TOKENS: {result.tokensIn} in / {result.tokensOut} out</span>
          <span>COST: ${result.cost.toFixed(4)}</span>
       </div>
       <div className={`w-1.5 h-1.5 rounded-full ${result.status === 'complete' ? 'bg-emerald-500' : result.status === 'streaming' ? 'bg-indigo-500 animate-pulse' : 'bg-slate-700'}`} />
    </div>
  );

  const ToolToggle: React.FC<{ label: string; icon: React.ReactNode; checked: boolean }> = ({ label, icon, checked }) => (
    <div className="flex items-center justify-between p-3 bg-slate-800/40 border border-slate-700 rounded-xl">
        <div className="flex items-center space-x-3">
            <div className="text-slate-500">{icon}</div>
            <span className="text-xs font-medium text-slate-300">{label}</span>
        </div>
        <div className={`w-8 h-4 rounded-full p-0.5 transition-all relative ${checked ? 'bg-indigo-600' : 'bg-slate-700'}`}>
            <div className={`w-3 h-3 bg-white rounded-full transition-all ${checked ? 'translate-x-4' : 'translate-x-0'}`} />
        </div>
    </div>
  );

export default PromptPlayground;