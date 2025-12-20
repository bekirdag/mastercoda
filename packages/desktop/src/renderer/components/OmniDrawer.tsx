import React, { useState, useEffect, useRef } from 'react';
import { OmniDrawerState, OmniTab } from '../types';
import { 
  TerminalIcon, 
  SparklesIcon, 
  ActivityIcon, 
  ChevronUpIcon, 
  ChevronDownIcon,
  XIcon,
  TrashIcon,
  MaximizeIcon,
  MinimizeIcon,
  ChevronRightIcon,
  CornerDownRightIcon
} from './Icons';
import { MOCK_AGENT_LOGS, MOCK_SERVER_LOGS } from '../constants';

interface OmniDrawerProps {
  state: OmniDrawerState;
  onStateChange: (state: OmniDrawerState) => void;
}

const OmniDrawer: React.FC<OmniDrawerProps> = ({ state, onStateChange }) => {
  const [activeTab, setActiveTab] = useState<OmniTab>('terminal');
  
  // Terminal Logic
  const [termLines, setTermLines] = useState<string[]>([
    "Master Coda CLI v0.3.5",
    "Copyright (c) 2024 Master Coda Inc.",
    "",
    "user@mcoda:~/workspace $ npm run dev",
    "> master-coda@0.1.0 dev",
    "> vite",
    "",
    "  VITE v4.4.9  ready in 340 ms",
    "",
    "  ➜  Local:   http://localhost:5173/",
    "  ➜  Network: use --host to expose",
    ""
  ]);
  const [termInput, setTermInput] = useState('');
  const termEndRef = useRef<HTMLDivElement>(null);

  // Agent Log Logic
  const [agentLogs, setAgentLogs] = useState(MOCK_AGENT_LOGS);

  // Height Calculation based on spec
  // Hidden: 0px, Collapsed: 32px, Open: 300px, Maximized: 90vh
  const heightClass = {
    hidden: 'h-0 border-t-0 opacity-0 pointer-events-none',
    collapsed: 'h-[32px] border-t',
    open: 'h-[300px] border-t',
    maximized: 'h-[90vh] border-t',
  }[state];

  // Auto-scroll terminal
  useEffect(() => {
    if (activeTab === 'terminal' && state !== 'hidden' && state !== 'collapsed') {
      termEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [termLines, activeTab, state]);

  const handleTermSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!termInput.trim()) return;
    
    setTermLines(prev => [...prev, `user@mcoda:~/workspace $ ${termInput}`]);
    
    // Simulate simple commands
    if (termInput === 'clear') {
       setTimeout(() => setTermLines([]), 50);
    } else if (termInput === 'help') {
       setTermLines(prev => [...prev, "Available commands: help, clear, status, build, test"]);
    } else {
       // Mock response
       setTimeout(() => {
          setTermLines(prev => [...prev, `mcoda: command not found: ${termInput}`]);
       }, 200);
    }
    
    setTermInput('');
  };

  const toggleAgentLogCollapse = (id: string) => {
    setAgentLogs(prev => prev.map(log => 
      log.id === id ? { ...log, collapsed: !log.collapsed } : log
    ));
  };

  if (state === 'hidden') return null;

  return (
    <div 
      className={`fixed bottom-0 left-0 right-0 bg-slate-900/98 border-slate-700 flex flex-col transition-all duration-300 ease-in-out z-40 shadow-[0_-4px_30px_rgba(0,0,0,0.5)] backdrop-blur-sm ${heightClass}`}
    >
      {/* 1. Tab Bar / Controls (Sticky Top, 32px) */}
      <div 
        className="flex items-center justify-between px-2 h-[32px] bg-slate-800 border-b border-slate-700 select-none shrink-0"
        onDoubleClick={() => onStateChange(state === 'maximized' ? 'open' : 'maximized')}
      >
        {/* Left: Tabs */}
        <div className="flex items-center h-full space-x-1">
           <TabButton 
             active={activeTab === 'terminal'} 
             onClick={() => { setActiveTab('terminal'); if(state === 'collapsed') onStateChange('open'); }}
             icon={<TerminalIcon size={12} />} 
             label="Terminal" 
             statusColor="bg-slate-500"
           />
           <TabButton 
             active={activeTab === 'agent'} 
             onClick={() => { setActiveTab('agent'); if(state === 'collapsed') onStateChange('open'); }} 
             icon={<SparklesIcon size={12} />} 
             label="Agent Output" 
             statusColor="bg-emerald-500" // Active agent indicator
           />
           <TabButton 
             active={activeTab === 'server'} 
             onClick={() => { setActiveTab('server'); if(state === 'collapsed') onStateChange('open'); }} 
             icon={<ActivityIcon size={12} />} 
             label="Server Logs" 
             statusColor={null}
           />
        </div>

        {/* Right: Controls */}
        <div className="flex items-center space-x-1">
          {/* Clear Buffer (Context Sensitive) */}
          <button 
             onClick={() => activeTab === 'terminal' ? setTermLines([]) : null}
             className="w-6 h-6 flex items-center justify-center text-slate-500 hover:text-red-400 rounded hover:bg-slate-700 transition-colors" 
             title="Clear Output"
          >
             <TrashIcon size={12} />
          </button>

          <div className="w-px h-3 bg-slate-700 mx-1" />

          {/* Sizing Controls */}
          {state !== 'maximized' ? (
             <button 
                onClick={() => onStateChange('maximized')}
                className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-white rounded hover:bg-slate-700 transition-colors"
             >
                <ChevronUpIcon size={12} />
             </button>
          ) : (
             <button 
                onClick={() => onStateChange('open')}
                className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-white rounded hover:bg-slate-700 transition-colors"
             >
                <ChevronDownIcon size={12} />
             </button>
          )}
          
          <button 
             onClick={() => onStateChange(state === 'collapsed' ? 'hidden' : 'collapsed')}
             className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-white rounded hover:bg-slate-700 transition-colors"
          >
             {state === 'collapsed' ? <XIcon size={12} /> : <MinimizeIcon size={12} />}
          </button>
        </div>
      </div>

      {/* 2. Content Area */}
      {state !== 'collapsed' && (
        <div className="flex-1 overflow-hidden relative bg-[#0f1117]">
            
            {/* TERMINAL TAB */}
            {activeTab === 'terminal' && (
               <div className="absolute inset-0 p-3 font-mono text-[13px] leading-relaxed text-slate-300 overflow-y-auto custom-scrollbar flex flex-col" onClick={() => document.getElementById('term-input')?.focus()}>
                  {termLines.map((line, i) => (
                    <div key={i} className="whitespace-pre-wrap break-all min-h-[20px]">{line}</div>
                  ))}
                  
                  <form onSubmit={handleTermSubmit} className="flex items-center mt-1">
                     <span className="text-emerald-400 mr-2 shrink-0">user@mcoda:~/workspace $</span>
                     <input 
                       id="term-input"
                       type="text" 
                       value={termInput}
                       onChange={(e) => setTermInput(e.target.value)}
                       className="flex-1 bg-transparent border-none outline-none text-slate-100 caret-slate-100"
                       autoComplete="off"
                       autoFocus
                     />
                  </form>
                  <div ref={termEndRef} />
               </div>
            )}

            {/* AGENT OUTPUT TAB */}
            {activeTab === 'agent' && (
                <div className="absolute inset-0 overflow-y-auto custom-scrollbar">
                    {agentLogs.map((log) => (
                        <div key={log.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                            {/* Header Row */}
                            <div className="flex items-start px-3 py-2 space-x-3">
                                <span className="text-[10px] font-mono text-slate-600 pt-0.5 shrink-0">{log.timestamp}</span>
                                
                                {/* Icon */}
                                <div className="pt-0.5 shrink-0">
                                    {log.type === 'thought' && <SparklesIcon size={14} className="text-indigo-400" />}
                                    {log.type === 'command' && <TerminalIcon size={14} className="text-cyan-400" />}
                                    {log.type === 'error' && <XIcon size={14} className="text-red-500" />}
                                    {log.type === 'info' && <div className="w-3.5 h-3.5 rounded-full border border-slate-600" />}
                                    {log.type === 'success' && <div className="w-3.5 h-3.5 rounded-full bg-emerald-500/20 border border-emerald-500" />}
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between group cursor-pointer" onClick={() => log.details && toggleAgentLogCollapse(log.id)}>
                                        <span className={`text-xs font-mono ${
                                            log.type === 'error' ? 'text-red-400' : 
                                            log.type === 'command' ? 'text-cyan-300' :
                                            log.type === 'thought' ? 'text-indigo-300' : 'text-slate-300'
                                        }`}>
                                            {log.type === 'thought' ? '[THOUGHT] ' : 
                                             log.type === 'command' ? '[CMD] ' : 
                                             log.type === 'error' ? '[ERROR] ' : ''}
                                            {log.message}
                                        </span>
                                        {log.details && (
                                            <button className="text-slate-600 group-hover:text-slate-400">
                                                {log.collapsed ? <ChevronRightIcon size={12} /> : <ChevronDownIcon size={12} />}
                                            </button>
                                        )}
                                    </div>

                                    {/* Expanded Details */}
                                    {log.details && !log.collapsed && (
                                        <div className="mt-2 pl-2 border-l-2 border-slate-700 text-xs font-mono text-slate-400 whitespace-pre-wrap animate-in fade-in slide-in-from-top-1 duration-200">
                                            {log.details}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                    <div className="p-4 text-center">
                        <div className="inline-flex items-center px-3 py-1 rounded-full bg-slate-800/50 text-xs text-slate-500 animate-pulse">
                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-2"></span>
                            Agent Listening
                        </div>
                    </div>
                </div>
            )}

            {/* SERVER LOGS TAB */}
            {activeTab === 'server' && (
                <div className="absolute inset-0 p-3 font-mono text-xs text-slate-400 overflow-y-auto custom-scrollbar space-y-1">
                    {MOCK_SERVER_LOGS.map((line, idx) => (
                        <div key={idx} className="hover:text-slate-200 transition-colors cursor-text selection:bg-indigo-500/30">
                            {line}
                        </div>
                    ))}
                    <div className="w-2 h-4 bg-slate-600 animate-pulse" />
                </div>
            )}
        </div>
      )}
    </div>
  );
};

const TabButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string; statusColor: string | null }> = ({ active, onClick, icon, label, statusColor }) => (
  <button
    onClick={onClick}
    className={`flex items-center px-3 h-[24px] rounded text-xs font-medium transition-all ${
      active 
        ? 'bg-slate-700 text-white shadow-sm' 
        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
    }`}
  >
    <span className="mr-2 opacity-80">{icon}</span>
    {label}
    {statusColor && (
        <span className={`ml-2 w-1.5 h-1.5 rounded-full ${statusColor} ${active ? 'animate-pulse' : 'opacity-50'}`} />
    )}
  </button>
);

export default OmniDrawer;