
import React, { useState } from 'react';
import { TrainingExample } from '../types';
import Button from './Button';
import { 
  SparklesIcon, 
  CheckCircleIcon, 
  XCircleIcon, 
  CodeIcon, 
  TrashIcon, 
  ArrowRightIcon,
  ChevronRightIcon,
  RotateCwIcon
} from './Icons';

interface DatasetCuratorProps {
  examples: TrainingExample[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

const DatasetCurator: React.FC<DatasetCuratorProps> = ({ examples, onApprove, onReject }) => {
  const [selectedId, setSelectedId] = useState<string>(examples[0].id);
  const activeExample = examples.find(e => e.id === selectedId);

  return (
    <div className="flex h-[700px] border border-slate-800 rounded-3xl overflow-hidden bg-slate-900/40">
       
       {/* Left Pane: Queue */}
       <aside className="w-[300px] border-r border-slate-800 flex flex-col bg-slate-900/50">
          <div className="p-4 border-b border-slate-800 bg-slate-900/80">
             <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Correction Queue</h3>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
             {examples.map(ex => (
                <button
                   key={ex.id}
                   onClick={() => setSelectedId(ex.id)}
                   className={`w-full flex flex-col p-3 rounded-xl border transition-all text-left group ${
                      selectedId === ex.id 
                         ? 'bg-indigo-600/10 border-indigo-500/30' 
                         : 'bg-transparent border-transparent hover:bg-slate-800/50'
                   }`}
                >
                   <div className="flex items-center justify-between w-full mb-1">
                      <span className={`text-xs font-bold truncate ${selectedId === ex.id ? 'text-white' : 'text-slate-400'}`}>
                         {ex.prompt}
                      </span>
                      <span className="text-[8px] font-mono text-slate-600 shrink-0">{ex.timestamp}</span>
                   </div>
                   <div className="flex items-center justify-between w-full">
                      <div className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-tighter ${
                         ex.status === 'curated' ? 'text-emerald-400 bg-emerald-500/10' :
                         ex.status === 'discarded' ? 'text-slate-500 bg-slate-800' :
                         'text-amber-400 bg-amber-500/10'
                      }`}>
                         {ex.status}
                      </div>
                      <ChevronRightIcon size={12} className="text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity" />
                   </div>
                </button>
             ))}
          </div>
       </aside>

       {/* Right Pane: Reviewer */}
       <main className="flex-1 flex flex-col min-w-0 bg-[#0d1117]">
          {activeExample ? (
             <>
                <header className="h-12 border-b border-slate-800 px-6 flex items-center justify-between shrink-0 bg-slate-900/50">
                   <div className="flex items-center text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                      <SparklesIcon size={12} className="mr-2 text-indigo-400" />
                      RLHF Labeling Point
                   </div>
                   <div className="flex items-center space-x-3">
                      <button className="text-[10px] font-bold text-slate-500 hover:text-white uppercase transition-colors">Edit Pair</button>
                      <button className="text-[10px] font-bold text-red-400 hover:text-red-300 uppercase transition-colors">Discard</button>
                   </div>
                </header>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-8">
                   <div className="space-y-4">
                      <h4 className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Target Prompt</h4>
                      <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 font-mono text-xs text-white leading-relaxed italic shadow-inner">
                         "{activeExample.prompt}"
                      </div>
                   </div>

                   <div className="grid grid-cols-2 gap-6 h-[400px]">
                      <div className="flex flex-col space-y-3">
                         <h4 className="text-[10px] font-bold text-red-500 uppercase tracking-widest flex items-center">
                            <XCircleIcon size={12} className="mr-2" /> Rejected Output
                         </h4>
                         <div className="flex-1 bg-red-950/10 border border-red-900/30 rounded-2xl p-6 font-mono text-xs text-red-300 leading-relaxed overflow-y-auto custom-scrollbar">
                            <pre>{activeExample.rejectedOutput}</pre>
                         </div>
                      </div>
                      <div className="flex flex-col space-y-3">
                         <h4 className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest flex items-center">
                            <CheckCircleIcon size={12} className="mr-2" /> User Correction
                         </h4>
                         <div className="flex-1 bg-emerald-950/10 border border-emerald-900/30 rounded-2xl p-6 font-mono text-xs text-emerald-300 leading-relaxed overflow-y-auto custom-scrollbar shadow-lg shadow-emerald-900/10">
                            <pre>{activeExample.acceptedOutput}</pre>
                         </div>
                      </div>
                   </div>
                </div>

                <footer className="h-16 border-t border-slate-800 bg-slate-950/50 flex items-center justify-between px-8 shrink-0">
                   <div className="flex items-center text-[10px] text-slate-600 font-mono">
                      TOKEN_DELTA: -42% WASTE
                   </div>
                   <div className="flex items-center space-x-3">
                      <Button variant="secondary" size="sm" onClick={() => onReject(activeExample.id)}>Skip</Button>
                      <Button variant="primary" size="sm" icon={<CheckCircleIcon size={16}/>} onClick={() => onApprove(activeExample.id)}>Add to Dataset</Button>
                   </div>
                </footer>
             </>
          ) : (
             <div className="flex-1 flex flex-col items-center justify-center opacity-30 text-slate-600">
                <CodeIcon size={64} className="mb-4" />
                <p>Select an interaction to curate</p>
             </div>
          )}
       </main>
    </div>
  );
};

export default DatasetCurator;
