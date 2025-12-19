
import React, { useState, useMemo } from 'react';
import { FineTuningJob, TrainingExample, ModelVersion, TrainingStatus } from '../types';
import { MOCK_TRAINING_EXAMPLES, MOCK_MODEL_VERSIONS } from '../constants';
import Button from './Button';
import Badge from './Badge';
import DatasetCurator from './DatasetCurator';
import TrainingTerminal from './TrainingTerminal';
import { 
  SparklesIcon, 
  ActivityIcon, 
  RotateCwIcon, 
  ShieldIcon, 
  ZapIcon, 
  TerminalIcon, 
  SearchIcon, 
  PlusIcon, 
  ChevronRightIcon, 
  ChevronDownIcon, 
  CheckCircleIcon, 
  AlertTriangleIcon, 
  DatabaseIcon,
  PlayIcon,
  TrashIcon,
  RotateCwIcon as RefreshIcon,
  LockIcon,
  CodeIcon,
  HistoryIcon,
  HardDriveIcon
} from './Icons';

const AgentTraining: React.FC = () => {
  const [activeJob, setActiveJob] = useState<FineTuningJob | null>(null);
  const [examples, setExamples] = useState<TrainingExample[]>(MOCK_TRAINING_EXAMPLES);
  const [models, setModels] = useState<ModelVersion[]>(MOCK_MODEL_VERSIONS);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'curator' | 'registry'>('dashboard');

  const stats = {
    pending: examples.filter(e => e.status === 'pending').length,
    curated: examples.filter(e => e.status === 'curated').length,
    totalSessions: 12,
    mtdCost: 14.20
  };

  const handleLaunchJob = async () => {
    if (stats.curated < 5) {
        alert("Fine-tuning requires at least 5 curated examples for this simulation.");
        return;
    }

    const newJob: FineTuningJob = {
      id: `FT-${Date.now()}`,
      status: 'running',
      progress: 0,
      currentLoss: 2.45,
      epochs: 3,
      eta: '45m',
      logs: ['[INFO] Initializing LoRA adapter...', '[INFO] Loading dataset from local cache...']
    };
    
    setActiveJob(newJob);

    // Simulation loop
    let progress = 0;
    const interval = setInterval(() => {
        progress += 5;
        setActiveJob(prev => prev ? {
            ...prev,
            progress,
            currentLoss: Math.max(0.2, prev.currentLoss - (Math.random() * 0.15)),
            logs: [...prev.logs, `[STEP] Epoch 1/3: Iteration ${progress*10} - loss: ${(prev.currentLoss - 0.05).toFixed(4)}`]
        } : null);

        if (progress >= 100) {
            clearInterval(interval);
            setActiveJob(prev => prev ? { ...prev, status: 'completed' } : null);
            // Add new model version on complete
            const newModel: ModelVersion = {
                id: `mv-${Date.now()}`,
                tag: 'v1.3-patch',
                baseModel: 'Llama 3 8B',
                datasetSize: stats.curated,
                accuracy: 96.1,
                status: 'active',
                createdAt: 'Just now',
                cost: 0.85
            };
            setModels(prev => [newModel, ...prev.map(m => ({ ...m, status: 'archived' as const }))]);
        }
    }, 1000);
  };

  return (
    <div className="flex flex-col h-full bg-[#0f172a] text-slate-200 overflow-hidden font-sans">
      
      {/* Header Toolbar */}
      <header className="h-[64px] border-b border-slate-800 bg-slate-900/50 backdrop-blur shrink-0 flex items-center justify-between px-8 z-30 shadow-lg">
         <div className="flex items-center space-x-6">
            <div className="flex items-center">
               <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center mr-4">
                  <SparklesIcon size={24} className="text-indigo-400" />
               </div>
               <div>
                  <h1 className="text-xl font-bold text-white tracking-tight">Intelligence Loop (RLHF)</h1>
                  <p className="text-[10px] text-slate-500 font-mono uppercase">AUTONOMOUS_TUNER_v1.0</p>
               </div>
            </div>
            
            <div className="h-6 w-px bg-slate-800" />

            <div className="flex bg-slate-800 rounded p-1 border border-slate-700">
               <TabBtn active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} label="Tuning Hub" />
               <TabBtn active={activeTab === 'curator'} onClick={() => setActiveTab('curator')} label="Labeling Station" badge={stats.pending} />
               <TabBtn active={activeTab === 'registry'} onClick={() => setActiveTab('registry')} label="Model Artifacts" />
            </div>
         </div>

         <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-[10px] font-bold text-slate-500 uppercase">
               <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
               GPU_ACCEL: ACTIVE
            </div>
            <Button variant="primary" size="sm" icon={<PlusIcon size={14}/>}>Manual Entry</Button>
         </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto custom-scrollbar p-8">
         <div className="max-w-[1200px] mx-auto space-y-10 animate-in fade-in duration-500">
            
            {activeTab === 'dashboard' && (
               <>
                  {/* Hero Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                     <StatCard label="Dataset Health" value={`${stats.curated} Examples`} sub="Verified for training" icon={<DatabaseIcon size={20}/>} color="indigo" />
                     <StatCard label="Negative Signals" value={stats.pending.toString()} sub="Requiring human edit" icon={<AlertTriangleIcon size={20}/>} color="red" />
                     <StatCard label="MTD Compute Cost" value={`$${stats.mtdCost.toFixed(2)}`} sub="Budget: $50.00" icon={<ZapIcon size={20}/>} color="amber" />
                     <StatCard label="Model Drift" value="Low" sub="Accuracy within 2%" icon={<ActivityIcon size={20}/>} color="emerald" />
                  </div>

                  {/* Active Fine-Tuning Job or Launch CTA */}
                  <div className="bg-slate-800 border-2 border-slate-700 rounded-3xl overflow-hidden shadow-2xl relative">
                     {activeJob ? (
                        <div className="p-8 space-y-8 animate-in zoom-in-95 duration-500">
                           <div className="flex items-start justify-between">
                              <div className="space-y-1">
                                 <h2 className="text-2xl font-bold text-white tracking-tight flex items-center">
                                    Fine-Tuning Active: {activeJob.id}
                                    <div className="ml-4 flex space-x-1">
                                       <div className="w-1 h-3 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                       <div className="w-1 h-3 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '200ms' }} />
                                       <div className="w-1 h-3 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: '400ms' }} />
                                    </div>
                                 </h2>
                                 <p className="text-slate-400">Injecting company coding standards into baseline Llama 3 weights.</p>
                              </div>
                              <div className="text-right">
                                 <div className="text-[10px] font-bold text-slate-500 uppercase mb-1">Estimated Completion</div>
                                 <div className="text-xl font-bold text-white font-mono">{activeJob.eta}</div>
                              </div>
                           </div>

                           <div className="space-y-4">
                              <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-widest">
                                 <span className="text-indigo-400">Current Loss: {activeJob.currentLoss.toFixed(4)}</span>
                                 <span className="text-slate-500">{activeJob.progress}% COMPLETE</span>
                              </div>
                              <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-700 shadow-inner">
                                 <div className="h-full bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.5)] transition-all duration-500" style={{ width: `${activeJob.progress}%` }} />
                              </div>
                           </div>

                           <div className="grid grid-cols-3 gap-8 pt-4">
                              <MetaEntry label="Base Model" value="meta-llama/Llama-3-8B" />
                              <MetaEntry label="Dataset Source" value="Curated RLHF Feed (v2)" />
                              <MetaEntry label="Method" value="LoRA (Rank=8, Alpha=16)" />
                           </div>
                        </div>
                     ) : (
                        <div className="p-12 flex flex-col items-center justify-center text-center space-y-6">
                           <div className="w-20 h-20 rounded-full bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center shadow-inner">
                              <RefreshIcon size={40} className="text-indigo-400" />
                           </div>
                           <div className="space-y-2 max-w-xl">
                              <h2 className="text-2xl font-bold text-white">Start New Fine-Tuning Run</h2>
                              <p className="text-slate-400 leading-relaxed">
                                 You have <strong className="text-white">{stats.curated} curated examples</strong> ready. Launching a job will create a specialized model version tuned to your specific patterns and corrections.
                              </p>
                           </div>
                           <div className="grid grid-cols-2 gap-3 w-full max-w-md">
                              <Button variant="secondary" onClick={() => setActiveTab('curator')}>Review Pending Items ({stats.pending})</Button>
                              <Button variant="primary" onClick={handleLaunchJob} icon={<PlayIcon size={14} fill="currentColor"/>}>Launch Run</Button>
                           </div>
                        </div>
                     )}
                  </div>

                  {activeJob && <TrainingTerminal logs={activeJob.logs} status={activeJob.status} />}
               </>
            )}

            {activeTab === 'curator' && (
               <DatasetCurator 
                  examples={examples} 
                  onApprove={(id) => setExamples(prev => prev.map(e => e.id === id ? { ...e, status: 'curated' } : e))}
                  onReject={(id) => setExamples(prev => prev.map(e => e.id === id ? { ...e, status: 'discarded' } : e))}
               />
            )}

            {activeTab === 'registry' && (
               <div className="space-y-6">
                  <div className="flex items-center justify-between px-2">
                     <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Model Version Control</h2>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                     {models.map(m => (
                        <ModelCard key={m.id} model={m} />
                     ))}
                  </div>
               </div>
            )}

         </div>
      </main>

      {/* Global Status Footer */}
      <footer className="h-10 bg-slate-900 border-t border-slate-800 shrink-0 px-8 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-slate-500 z-30">
         <div className="flex items-center space-x-12">
            <div className="flex items-center">
               <ActivityIcon size={12} className="mr-2 text-indigo-400" />
               RLHF_ENGINE: <span className="ml-2 text-emerald-500">ACTIVE</span>
            </div>
            <div className="flex items-center">
               <HardDriveIcon size={12} className="mr-2 text-indigo-400" />
               VRAM_USAGE: <span className="ml-2 text-slate-300 font-mono">14.2 GB / 24 GB</span>
            </div>
         </div>
         <div className="flex items-center space-x-4">
            <span className="text-slate-600 font-mono">DEEP_LINK: /AG-11</span>
            <div className="h-3 w-px bg-slate-800" />
            <div className="flex items-center text-indigo-400">
               <ShieldIcon size={12} className="mr-2" />
               SECURE_TRAINING_ACTIVE
            </div>
         </div>
      </footer>

    </div>
  );
};

// Sub-components

const TabBtn: React.FC<{ active: boolean; onClick: () => void; label: string; badge?: number }> = ({ active, onClick, label, badge }) => (
   <button 
      onClick={onClick}
      className={`px-4 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all relative flex items-center ${
         active ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'
      }`}
   >
      {label}
      {badge !== undefined && badge > 0 && (
         <span className="ml-2 bg-red-600 text-white px-1.5 rounded-full text-[8px]">{badge}</span>
      )}
   </button>
);

const StatCard: React.FC<{ label: string; value: string; sub: string; icon: React.ReactNode; color: string }> = ({ label, value, sub, icon, color }) => (
   <div className="bg-slate-800/40 border border-slate-700/50 p-5 rounded-3xl group hover:border-slate-600 transition-all shadow-sm">
      <div className="flex items-center text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-3 group-hover:text-slate-400">
         <span className={`mr-2 text-${color}-400`}>{icon}</span>
         {label}
      </div>
      <div className="text-2xl font-bold text-white tracking-tight mb-1">{value}</div>
      <div className="text-[10px] text-slate-600 font-medium uppercase tracking-tighter">{sub}</div>
   </div>
);

const ModelCard: React.FC<{ model: ModelVersion }> = ({ model }) => (
   <div className={`p-6 rounded-2xl border transition-all flex items-center justify-between group ${model.status === 'active' ? 'bg-indigo-900/10 border-indigo-500/40 shadow-xl' : 'bg-slate-800/40 border-slate-800 opacity-60'}`}>
      <div className="flex items-center space-x-6">
         <div className={`p-3 rounded-xl ${model.status === 'active' ? 'bg-indigo-600 text-white shadow-[0_0_15px_rgba(99,102,241,0.5)]' : 'bg-slate-900 border border-slate-700 text-slate-600'}`}>
            <BoxIconProxy size={24} />
         </div>
         <div className="space-y-1">
            <div className="flex items-center space-x-3">
               <h3 className="text-lg font-bold text-white group-hover:text-indigo-200 transition-colors">{model.tag}</h3>
               {model.status === 'active' && <Badge variant="success">IN USE</Badge>}
            </div>
            <div className="flex items-center space-x-4 text-[10px] font-mono text-slate-500 uppercase font-bold">
               <span>Base: {model.baseModel}</span>
               <span>•</span>
               <span>{model.datasetSize} Items</span>
               <span>•</span>
               <span>Accuracy: <strong className="text-emerald-400">{model.accuracy}%</strong></span>
            </div>
         </div>
      </div>

      <div className="flex items-center space-x-3">
         <div className="text-right mr-6">
            <div className="text-[10px] font-bold text-slate-500 uppercase mb-1">Cost incurred</div>
            <div className="text-sm font-bold text-white font-mono">${model.cost.toFixed(2)}</div>
         </div>
         {model.status !== 'active' ? (
            <Button variant="primary" size="sm">Deploy Fleet</Button>
         ) : (
            <Button variant="secondary" size="sm">Rollback</Button>
         )}
         <button className="p-2 text-slate-600 hover:text-white transition-colors"><MoreVerticalIconProxy size={18} /></button>
      </div>
   </div>
);

const MetaEntry: React.FC<{ label: string; value: string }> = ({ label, value }) => (
   <div className="space-y-1">
      <div className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">{label}</div>
      <div className="text-sm font-medium text-slate-300 truncate">{value}</div>
   </div>
);

// Proxies
const BoxIconProxy: React.FC<any> = (props) => (
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
    <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
    <path d="m3.3 7 8.7 5 8.7-5" />
    <path d="M12 22V12" />
  </svg>
);

const MoreVerticalIconProxy: React.FC<any> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={props.size || 20}
    height={props.size || 20}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="12" cy="12" r="1" />
    <circle cx="12" cy="5" r="1" />
    <circle cx="12" cy="19" r="1" />
  </svg>
);

export default AgentTraining;
