import React, { useState } from 'react';
import { OmniDrawerState, OmniTab } from '../types';
import { TerminalIcon, SparklesIcon, ActivityIcon, ChevronUpIcon, ChevronDownIcon } from './Icons';
import { AGENT_THOUGHTS, MOCK_LOGS } from '../constants';

interface OmniDrawerProps {
  state: OmniDrawerState;
  onStateChange: (state: OmniDrawerState) => void;
}

const OmniDrawer: React.FC<OmniDrawerProps> = ({ state, onStateChange }) => {
  const [activeTab, setActiveTab] = useState<OmniTab>('terminal');

  const heightClass = {
    hidden: 'h-0 border-t-0',
    peek: 'h-[320px] border-t',
    maximized: 'h-[85vh] border-t',
  }[state];

  const toggleState = () => {
    if (state === 'hidden') onStateChange('peek');
    else if (state === 'peek') onStateChange('hidden');
    else onStateChange('peek');
  };

  const maximize = (e: React.MouseEvent) => {
    e.stopPropagation();
    onStateChange(state === 'maximized' ? 'peek' : 'maximized');
  };

  return (
    <div 
      className={`fixed bottom-0 left-0 right-0 bg-slate-900 border-slate-700 flex flex-col transition-all duration-300 ease-out z-30 shadow-[0_-4px_20px_rgba(0,0,0,0.5)] ${heightClass}`}
    >
      {/* Header / Tabs */}
      {state !== 'hidden' && (
        <div 
          className="flex items-center justify-between px-4 h-10 bg-slate-800 border-b border-slate-700 select-none cursor-pointer"
          onClick={() => onStateChange(state === 'peek' ? 'hidden' : 'peek')}
        >
          <div className="flex items-center space-x-1 h-full" onClick={(e) => e.stopPropagation()}>
            <TabButton 
              active={activeTab === 'terminal'} 
              onClick={() => setActiveTab('terminal')} 
              icon={<TerminalIcon size={14} />} 
              label="Terminal" 
            />
            <TabButton 
              active={activeTab === 'thoughts'} 
              onClick={() => setActiveTab('thoughts')} 
              icon={<SparklesIcon size={14} />} 
              label="Agent Thoughts" 
            />
            <TabButton 
              active={activeTab === 'history'} 
              onClick={() => setActiveTab('history')} 
              icon={<ActivityIcon size={14} />} 
              label="History" 
            />
          </div>
          
          <div className="flex items-center space-x-2 text-slate-400">
            <button onClick={maximize} className="p-1 hover:text-white hover:bg-slate-700 rounded transition-colors">
              {state === 'maximized' ? <ChevronDownIcon size={16} /> : <ChevronUpIcon size={16} />}
            </button>
            <button onClick={() => onStateChange('hidden')} className="p-1 hover:text-white hover:bg-slate-700 rounded transition-colors">
               <ChevronDownIcon size={16} className="rotate-0" />
            </button>
          </div>
        </div>
      )}

      {/* Content Area */}
      <div className="flex-1 overflow-hidden relative">
        <div className="absolute inset-0 p-4 font-mono text-sm overflow-auto custom-scrollbar">
          {activeTab === 'terminal' && (
             <div className="space-y-1">
               {MOCK_LOGS.map((log) => (
                 <div key={log.id} className="flex items-start space-x-3 group hover:bg-slate-800/50 p-0.5 rounded">
                   <span className="text-slate-500 shrink-0 w-20 text-xs">{log.timestamp}</span>
                   <span className={`text-xs uppercase font-bold w-16 shrink-0 ${
                     log.level === 'error' ? 'text-red-500' :
                     log.level === 'warn' ? 'text-amber-500' :
                     log.level === 'success' ? 'text-emerald-500' :
                     'text-blue-500'
                   }`}>{log.level}</span>
                   <span className="text-slate-300 break-all">{log.message}</span>
                 </div>
               ))}
               <div className="flex items-center pt-2 text-slate-400">
                  <span className="text-indigo-400 mr-2">➜</span>
                  <span className="text-slate-500">~/master-coda</span>
                  <div className="w-2 h-4 bg-slate-500 animate-pulse ml-2"></div>
               </div>
             </div>
          )}

          {activeTab === 'thoughts' && (
            <div className="text-slate-300 whitespace-pre-wrap leading-relaxed">
              <span className="text-indigo-400 font-bold mb-2 block">AI Agent Active</span>
              {AGENT_THOUGHTS}
            </div>
          )}

          {activeTab === 'history' && (
             <div className="text-slate-400">
               <div className="flex items-center py-1"><span className="w-8 text-slate-600">101</span> <span>git status</span></div>
               <div className="flex items-center py-1"><span className="w-8 text-slate-600">102</span> <span>npm run dev</span></div>
               <div className="flex items-center py-1"><span className="w-8 text-slate-600">103</span> <span>docker-compose up -d</span></div>
               <div className="flex items-center py-1"><span className="w-8 text-slate-600">104</span> <span>mcoda audit --fix</span></div>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

const TabButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`flex items-center px-3 h-full border-b-2 text-xs font-medium transition-colors ${
      active 
        ? 'border-indigo-500 text-indigo-400 bg-slate-800' 
        : 'border-transparent text-slate-500 hover:text-slate-200 hover:bg-slate-700/50'
    }`}
  >
    <span className="mr-2">{icon}</span>
    {label}
  </button>
);

export default OmniDrawer;