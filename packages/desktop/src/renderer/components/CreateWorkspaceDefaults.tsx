import React, { useState } from 'react';
import Button from './Button';
import { 
  SparklesIcon, 
  CheckCircleIcon, 
  ZapIcon,
  ShieldIcon,
  ActivityIcon,
  ChevronDownIcon,
  CloudIcon,
  ServerIcon
} from './Icons';

interface CreateWorkspaceDefaultsProps {
  onBack: () => void;
  onNext: (data: { agentId: string; qaProfile: string }) => void;
  projectSummary: {
    name?: string;
    path?: string;
    key?: string;
    docdex?: string;
    gitignore?: boolean;
  };
}

interface Agent {
  id: string;
  name: string;
  provider: 'openai' | 'anthropic' | 'ollama';
  icon: React.ReactNode;
}

const AGENTS: Agent[] = [
  { id: 'openai-gpt4o', name: 'OpenAI GPT-4o', provider: 'openai', icon: <CloudIcon size={16} /> },
  { id: 'claude-3-sonnet', name: 'Claude 3.5 Sonnet', provider: 'anthropic', icon: <CloudIcon size={16} /> },
  { id: 'llama-3', name: 'Llama 3 Local', provider: 'ollama', icon: <ServerIcon size={16} /> },
];

const CreateWorkspaceDefaults: React.FC<CreateWorkspaceDefaultsProps> = ({ onBack, onNext, projectSummary }) => {
  const [selectedAgentId, setSelectedAgentId] = useState<string>('openai-gpt4o');
  const [qaProfile, setQaProfile] = useState<'unit' | 'integration' | 'manual'>('unit');

  const selectedAgent = AGENTS.find(a => a.id === selectedAgentId);

  const handleInitialize = () => {
    onNext({ agentId: selectedAgentId, qaProfile });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900 text-slate-200 flex flex-col items-center justify-center font-sans p-4">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-slate-950 -z-10" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 -z-10 mix-blend-overlay" />

      {/* Main Container */}
      <div className="w-full max-w-[600px] bg-slate-800/50 border border-slate-700 rounded-xl shadow-2xl overflow-hidden backdrop-blur-md animate-in slide-in-from-right-4 duration-500 flex flex-col max-h-[90vh]">
        
        {/* Header Section */}
        <div className="pt-10 pb-6 px-8 text-center border-b border-slate-700/50 bg-slate-800/30 shrink-0">
            <h1 className="text-2xl font-semibold text-white tracking-tight mb-2">How should we work?</h1>
            <p className="text-slate-400 text-sm">Choose the default AI model and testing strategy for this workspace.</p>
            
            {/* Stepper */}
            <div className="flex items-center justify-center space-x-4 mt-6 mb-2">
                <div className="flex items-center">
                    <div className="w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center shadow-[0_0_10px_rgba(16,185,129,0.3)]">
                       <CheckCircleIcon size={14} />
                    </div>
                    <span className="ml-2 text-sm font-medium text-emerald-400">Location</span>
                </div>
                <div className="w-8 h-px bg-slate-700" />
                <div className="flex items-center">
                    <div className="w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center shadow-[0_0_10px_rgba(16,185,129,0.3)]">
                       <CheckCircleIcon size={14} />
                    </div>
                    <span className="ml-2 text-sm font-medium text-emerald-400">Details</span>
                </div>
                <div className="w-8 h-px bg-slate-700" />
                <div className="flex items-center">
                    <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold shadow-[0_0_10px_rgba(99,102,241,0.5)]">3</div>
                    <span className="ml-2 text-sm font-medium text-white">Defaults</span>
                </div>
            </div>
        </div>

        {/* Content Section */}
        <div className="p-8 space-y-8 overflow-y-auto custom-scrollbar">
            
            {/* Agent Selection */}
            <div className="space-y-3">
                <label className="flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    <span>Default Agent</span>
                    <span className="text-[10px] bg-indigo-500/10 text-indigo-400 px-1.5 py-0.5 rounded border border-indigo-500/20">Planning & Code</span>
                </label>
                
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                        <SparklesIcon size={18} />
                    </div>
                    <select
                        value={selectedAgentId}
                        onChange={(e) => setSelectedAgentId(e.target.value)}
                        className="block w-full pl-10 pr-10 py-3 rounded-md bg-slate-950 border border-slate-700 text-slate-200 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 appearance-none transition-colors cursor-pointer hover:border-slate-600"
                    >
                        {AGENTS.map(agent => (
                            <option key={agent.id} value={agent.id}>{agent.name} {agent.id === 'openai-gpt4o' ? '(Global Default)' : ''}</option>
                        ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-500">
                        <ChevronDownIcon size={16} />
                    </div>
                </div>
                <p className="text-xs text-slate-500">
                    Used for planning and coding tasks unless a specific agent is requested via CLI.
                </p>
            </div>

            {/* QA Profile Selection */}
            <div className="space-y-3">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    QA Profile
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <QaOption 
                        active={qaProfile === 'unit'} 
                        onClick={() => setQaProfile('unit')}
                        icon={<ZapIcon size={20} />}
                        title="Unit Tests"
                        subtitle="Fast (npm test)"
                    />
                    <QaOption 
                        active={qaProfile === 'integration'} 
                        onClick={() => setQaProfile('integration')}
                        icon={<ShieldIcon size={20} />}
                        title="Integration"
                        subtitle="Thorough (e2e)"
                    />
                    <QaOption 
                        active={qaProfile === 'manual'} 
                        onClick={() => setQaProfile('manual')}
                        icon={<ActivityIcon size={20} />}
                        title="Manual Only"
                        subtitle="No runner"
                    />
                </div>
            </div>

            {/* Summary Review */}
            <div className="space-y-3 pt-2">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Review Configuration
                </label>
                <div className="bg-slate-950 rounded-lg border border-slate-800 p-4 font-mono text-xs space-y-2 text-slate-400">
                    <div className="flex justify-between">
                        <span className="text-slate-600">PATH:</span>
                        <span className="text-slate-300 truncate max-w-[280px] text-right" title={projectSummary.path}>{projectSummary.path}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-slate-600">PROJECT:</span>
                        <span className="text-slate-300">{projectSummary.name} <span className="text-slate-600">({projectSummary.key})</span></span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-slate-600">AGENT:</span>
                        <span className="text-indigo-400">{selectedAgent?.name}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-slate-600">STRATEGY:</span>
                        <span className="text-slate-300 capitalize">{qaProfile}</span>
                    </div>
                </div>
            </div>

        </div>

        {/* Footer */}
        <div className="p-6 bg-slate-800/80 border-t border-slate-700 flex items-center justify-between mt-auto shrink-0">
          <Button variant="ghost" onClick={onBack}>
            Back
          </Button>
          <Button 
            variant="primary" 
            onClick={handleInitialize}
            className="min-w-[140px]"
          >
            Initialize Project
          </Button>
        </div>
      </div>
    </div>
  );
};

const QaOption: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; title: string; subtitle: string }> = ({ active, onClick, icon, title, subtitle }) => (
    <div 
        onClick={onClick}
        className={`relative flex flex-col items-center justify-center p-3 rounded-lg border cursor-pointer transition-all duration-200 select-none ${
            active 
            ? 'bg-indigo-600/10 border-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.15)]' 
            : 'bg-slate-800/40 border-slate-700 hover:border-slate-600 text-slate-400 hover:text-slate-200'
        }`}
    >
        {active && (
            <div className="absolute top-2 right-2 text-indigo-500">
                <CheckCircleIcon size={14} />
            </div>
        )}
        <div className={`mb-2 ${active ? 'text-indigo-400' : 'text-slate-500'}`}>{icon}</div>
        <div className="text-sm font-medium">{title}</div>
        <div className={`text-[10px] mt-0.5 ${active ? 'text-indigo-300/70' : 'text-slate-600'}`}>{subtitle}</div>
    </div>
);

export default CreateWorkspaceDefaults;