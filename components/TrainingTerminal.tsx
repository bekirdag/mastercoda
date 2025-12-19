
import React, { useEffect, useRef } from 'react';
import { TrainingStatus } from '../types';
import { TerminalIcon, ActivityIcon, ZapIcon, RotateCwIcon } from './Icons';
import { LineChart, Line, ResponsiveContainer, YAxis, XAxis, Tooltip } from 'recharts';

interface TrainingTerminalProps {
  logs: string[];
  status: TrainingStatus;
}

const TrainingTerminal: React.FC<TrainingTerminalProps> = ({ logs, status }) => {
  const logEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  // Mock loss curve data based on iteration
  const lossData = logs.map((log, i) => ({
      iter: i,
      loss: 2.5 - (Math.log(i + 1) * 0.4) + (Math.random() * 0.1)
  })).filter(d => d.loss > 0).slice(-20);

  return (
    <div className="bg-[#0a0f1e] border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[400px] animate-in slide-in-from-bottom-6 duration-700">
       <header className="h-12 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center space-x-4">
             <TerminalIcon size={16} className="text-indigo-400" />
             <h3 className="text-xs font-bold text-slate-300 uppercase tracking-widest">Training Monitor</h3>
          </div>
          <div className="flex items-center space-x-4">
             <span className="text-[10px] font-mono text-slate-600">ISOLATED_GPU_PID: 1420</span>
             <div className="h-3 w-px bg-slate-800" />
             <div className="flex items-center space-x-2">
                <div className={`w-1.5 h-1.5 rounded-full ${status === 'running' ? 'bg-indigo-500 animate-pulse' : 'bg-emerald-500'}`} />
                <span className="text-[10px] font-bold text-slate-400 uppercase">{status}</span>
             </div>
          </div>
       </header>

       <div className="flex-1 flex overflow-hidden">
          {/* Logs View */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 font-mono text-[10px] text-slate-500 space-y-1.5 bg-[#0a0f1e]">
             {logs.map((log, i) => (
                <div key={i} className="animate-in fade-in slide-in-from-left-2 duration-300">
                   <span className="text-slate-700 mr-4">[{new Date().toLocaleTimeString([], { hour12: false })}]</span>
                   <span className={log.includes('[ERROR]') ? 'text-red-400' : log.includes('[SUCCESS]') ? 'text-emerald-400' : 'text-slate-400'}>
                      {log}
                   </span>
                </div>
             ))}
             {status === 'running' && <div className="animate-pulse text-indigo-500">_</div>}
             <div ref={logEndRef} />
          </div>

          {/* Real-time Loss Curve */}
          <div className="w-[300px] border-l border-slate-800 bg-slate-900/20 p-4 flex flex-col">
             <div className="text-[9px] font-bold text-slate-600 uppercase tracking-widest mb-4 flex items-center">
                <ActivityIcon size={12} className="mr-2 text-indigo-400" /> Convergence Curve (Loss)
             </div>
             <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                   <LineChart data={lossData}>
                      <YAxis hide domain={[0, 3]} />
                      <XAxis hide dataKey="iter" />
                      <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', fontSize: '10px' }} />
                      <Line type="monotone" dataKey="loss" stroke="#6366f1" strokeWidth={2} dot={false} isAnimationActive={false} />
                   </LineChart>
                </ResponsiveContainer>
             </div>
             <div className="mt-4 pt-4 border-t border-slate-800 grid grid-cols-2 gap-2">
                <div className="p-2 bg-slate-950 rounded-lg">
                   <div className="text-[8px] text-slate-600 uppercase font-bold">Accuracy</div>
                   <div className="text-xs font-bold text-white font-mono">92.4%</div>
                </div>
                <div className="p-2 bg-slate-950 rounded-lg">
                   <div className="text-[8px] text-slate-600 uppercase font-bold">Perplexity</div>
                   <div className="text-xs font-bold text-white font-mono">1.12</div>
                </div>
             </div>
          </div>
       </div>
    </div>
  );
};

export default TrainingTerminal;
