import React, { useState } from 'react';
import Button from './Button';
import { 
  SparklesIcon, 
  CloudIcon, 
  ServerIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  LoaderIcon,
  ZapIcon
} from './Icons';

interface ConnectAgentProps {
  onBack: () => void;
  onNext: () => void;
}

type Provider = 'openai' | 'anthropic' | 'ollama';
type Status = 'idle' | 'testing' | 'success' | 'error';

const ConnectAgent: React.FC<ConnectAgentProps> = ({ onBack, onNext }) => {
  const [provider, setProvider] = useState<Provider>('openai');
  const [apiKey, setApiKey] = useState('');
  const [baseUrl, setBaseUrl] = useState('http://localhost:11434');
  const [model, setModel] = useState('');
  const [agentName, setAgentName] = useState('primary-agent');
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleTest = async () => {
    // Basic validation
    if (provider !== 'ollama' && !apiKey) {
      setErrorMsg('API Key is required');
      setStatus('error');
      return;
    }

    setStatus('testing');
    setErrorMsg('');

    // Simulate mcoda test-agent delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Simulate outcome
    if (provider === 'ollama' && !baseUrl) {
      setStatus('error');
      setErrorMsg('Connection refused: ensure ollama serve is running');
    } else {
      setStatus('success');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900 text-slate-200 flex flex-col items-center justify-center font-sans p-4">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-slate-950 -z-10" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 -z-10 mix-blend-overlay" />

      {/* Main Container */}
      <div className="w-full max-w-[600px] bg-slate-800/50 border border-slate-700 rounded-xl shadow-2xl overflow-hidden backdrop-blur-md animate-in slide-in-from-right-4 duration-500 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="pt-8 pb-6 px-8 text-center border-b border-slate-700/50 bg-slate-800/30">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mx-auto mb-4 border border-indigo-500/20">
            <SparklesIcon size={24} />
          </div>
          <h1 className="text-2xl font-semibold text-white tracking-tight">Connect First Agent</h1>
          <p className="text-slate-400 mt-2 text-sm">
            Master Coda requires an LLM backend to function. Credentials are stored encrypted locally.
          </p>
        </div>

        {/* Provider Tabs */}
        <div className="grid grid-cols-3 p-2 bg-slate-900/50 border-b border-slate-700/50">
           <ProviderTab 
             active={provider === 'openai'} 
             onClick={() => { setProvider('openai'); setStatus('idle'); }} 
             label="OpenAI" 
             icon={<CloudIcon size={16} />}
           />
           <ProviderTab 
             active={provider === 'anthropic'} 
             onClick={() => { setProvider('anthropic'); setStatus('idle'); }} 
             label="Anthropic" 
             icon={<CloudIcon size={16} />} 
           />
           <ProviderTab 
             active={provider === 'ollama'} 
             onClick={() => { setProvider('ollama'); setStatus('idle'); }} 
             label="Ollama" 
             icon={<ServerIcon size={16} />} 
           />
        </div>

        {/* Form Area */}
        <div className="p-8 space-y-6 flex-1 overflow-y-auto custom-scrollbar">
           
           {/* Agent Name */}
           <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Agent Name</label>
              <input 
                type="text" 
                value={agentName}
                onChange={(e) => setAgentName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors placeholder-slate-600"
              />
           </div>

           {provider === 'ollama' ? (
             <>
               <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Base URL</label>
                  <input 
                    type="text" 
                    value={baseUrl}
                    onChange={(e) => setBaseUrl(e.target.value)}
                    placeholder="http://localhost:11434"
                    className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors font-mono"
                  />
               </div>
               <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Model Name</label>
                  <input 
                    type="text" 
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    placeholder="e.g. llama3, mistral"
                    className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors font-mono"
                  />
                  <p className="text-[10px] text-amber-500 flex items-center pt-1">
                    <AlertCircleIcon size={10} className="mr-1" />
                    Ensure Ollama is running separately via `ollama serve`
                  </p>
               </div>
             </>
           ) : (
             <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {provider === 'openai' ? 'OpenAI' : 'Anthropic'} API Key
                </label>
                <input 
                  type="password" 
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="sk-..."
                  className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors font-mono"
                />
                <p className="text-[10px] text-slate-500 flex items-center pt-1">
                  <span className="mr-1">Key is encrypted using the master key generated in step 4.</span>
                </p>
             </div>
           )}

           {/* Test Action */}
           <div className="pt-2">
             <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-300">Connection Status</span>
                {status === 'success' && <span className="text-xs font-mono text-emerald-400">LATENCY: 120ms</span>}
             </div>
             
             {status === 'error' && (
                <div className="mb-3 flex items-center p-3 bg-red-500/10 border border-red-500/20 rounded text-xs text-red-400 animate-in fade-in">
                  <AlertCircleIcon size={16} className="mr-2 shrink-0" />
                  {errorMsg}
                </div>
             )}

             <Button 
               variant="secondary" 
               className={`w-full justify-between group ${status === 'success' ? 'border-emerald-500/50 bg-emerald-500/5 text-emerald-400 hover:bg-emerald-500/10' : ''}`}
               onClick={handleTest}
               disabled={status === 'testing' || status === 'success'}
             >
               <span className="flex items-center">
                 {status === 'testing' ? <LoaderIcon className="animate-spin mr-2" /> : <ZapIcon className="mr-2" size={16} />}
                 {status === 'testing' ? 'Pinging Provider...' : status === 'success' ? 'Agent Connected' : 'Test Connection'}
               </span>
               {status === 'success' && <CheckCircleIcon size={18} />}
             </Button>
           </div>

        </div>

        {/* Footer */}
        <div className="p-6 bg-slate-800/80 border-t border-slate-700 flex items-center justify-between mt-auto">
          <Button variant="ghost" onClick={onBack}>
            Back
          </Button>
          <Button 
            variant="primary" 
            onClick={onNext}
            disabled={status !== 'success'}
            className={status === 'success' ? 'animate-pulse-subtle' : ''}
          >
            Next Step
          </Button>
        </div>
      </div>
    </div>
  );
};

const ProviderTab: React.FC<{ active: boolean; onClick: () => void; label: string; icon: React.ReactNode }> = ({ active, onClick, label, icon }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center justify-center py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
      active 
        ? 'bg-indigo-600/10 border border-indigo-500 text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.15)]' 
        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-transparent'
    }`}
  >
    <div className="mb-1 opacity-80">{icon}</div>
    {label}
  </button>
);

export default ConnectAgent;