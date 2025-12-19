import React, { useState, useEffect } from 'react';
import Button from './Button';
import { 
  PackageIcon, 
  TerminalIcon, 
  CheckCircleIcon, 
  XCircleIcon, 
  LoaderIcon, 
  AlertCircleIcon 
} from './Icons';

interface CliConfigProps {
  onBack: () => void;
  onNext: () => void;
}

const CliConfig: React.FC<CliConfigProps> = ({ onBack, onNext }) => {
  const [selected, setSelected] = useState<'bundled' | 'system'>('bundled');
  const [verifying, setVerifying] = useState(false);
  const [verificationState, setVerificationState] = useState<'compatible' | 'incompatible' | 'not-found' | null>(null);

  // Mock constants
  const REQUIRED_VERSION = '^0.3.0';
  const BUNDLED_VERSION = 'v0.3.5';
  const SYSTEM_VERSION = 'v0.3.2'; // Simulated found version
  const SYSTEM_PATH = '/usr/local/bin/mcoda';
  const BUNDLED_PATH = '/opt/Master Coda/resources/bin/mcoda';

  useEffect(() => {
    // Run verification effect when selection changes
    const verify = async () => {
      setVerifying(true);
      setVerificationState(null);

      // Simulate shell command delay
      await new Promise(resolve => setTimeout(resolve, 600));

      if (selected === 'bundled') {
        setVerificationState('compatible');
      } else {
        // Simulate checking system binary
        // Randomly simulate success for this demo, or hardcode success
        setVerificationState('compatible'); 
      }
      setVerifying(false);
    };

    verify();
  }, [selected]);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900 text-slate-200 flex flex-col items-center justify-center font-sans p-4">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-slate-950 -z-10" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 -z-10 mix-blend-overlay" />

      {/* Main Container */}
      <div className="w-full max-w-2xl bg-slate-800/50 border border-slate-700 rounded-xl shadow-2xl overflow-hidden backdrop-blur-md animate-in slide-in-from-right-4 duration-500">
        
        {/* Header */}
        <div className="p-8 text-center border-b border-slate-700/50 bg-slate-800/30">
          <h1 className="text-2xl font-semibold text-white tracking-tight">Configure CLI Engine</h1>
          <p className="text-slate-400 mt-2 text-sm max-w-md mx-auto">
            Master Coda uses the <span className="font-mono text-indigo-300 bg-indigo-500/10 px-1 py-0.5 rounded">mcoda</span> command-line tool to execute tasks. Which version should we use?
          </p>
        </div>

        {/* Selection Area */}
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Option A: Bundled */}
          <div 
            onClick={() => setSelected('bundled')}
            className={`relative p-6 rounded-lg border-2 cursor-pointer transition-all duration-200 group ${
              selected === 'bundled' 
                ? 'bg-indigo-600/10 border-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.15)]' 
                : 'bg-slate-800/40 border-slate-700 hover:border-slate-600 hover:bg-slate-800'
            }`}
          >
            {selected === 'bundled' && (
              <div className="absolute top-3 right-3 text-indigo-500">
                <CheckCircleIcon size={20} />
              </div>
            )}
            <div className="w-12 h-12 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <PackageIcon size={24} />
            </div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-semibold text-slate-100">Bundled Binary</h3>
              <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">Recommended</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed mb-4">
              The version shipped with this app. Guaranteed compatibility and automatic updates.
            </p>
            <div className="text-xs font-mono text-slate-500 bg-slate-900/50 px-2 py-1.5 rounded border border-slate-700/50">
              Version: {BUNDLED_VERSION}
            </div>
          </div>

          {/* Option B: System */}
          <div 
            onClick={() => setSelected('system')}
            className={`relative p-6 rounded-lg border-2 cursor-pointer transition-all duration-200 group ${
              selected === 'system' 
                ? 'bg-indigo-600/10 border-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.15)]' 
                : 'bg-slate-800/40 border-slate-700 hover:border-slate-600 hover:bg-slate-800'
            }`}
          >
             {selected === 'system' && (
              <div className="absolute top-3 right-3 text-indigo-500">
                <CheckCircleIcon size={20} />
              </div>
            )}
            <div className="w-12 h-12 rounded-lg bg-slate-700/50 text-slate-300 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <TerminalIcon size={24} />
            </div>
            <div className="flex items-center justify-between mb-1">
               <h3 className="font-semibold text-slate-100">System Binary</h3>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed mb-4">
              Use the <span className="font-mono text-xs">mcoda</span> installed in your global <span className="font-mono text-xs">$PATH</span>. Useful for dev builds.
            </p>
            <div className="text-xs font-mono text-slate-500 bg-slate-900/50 px-2 py-1.5 rounded border border-slate-700/50 flex justify-between">
              <span>Detected: {SYSTEM_VERSION}</span>
            </div>
          </div>
        </div>

        {/* Verification Panel */}
        <div className="px-8 pb-8">
           <div className="bg-slate-900/50 border border-slate-700/50 rounded-lg p-4 flex items-center justify-between">
              <div className="flex flex-col">
                 <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Resolved Path</span>
                 <span className="font-mono text-sm text-slate-300 truncate max-w-sm">
                    {selected === 'bundled' ? BUNDLED_PATH : SYSTEM_PATH}
                 </span>
              </div>
              <div className="flex items-center">
                 {verifying ? (
                   <div className="flex items-center text-indigo-400 text-xs font-medium bg-indigo-500/10 px-3 py-1.5 rounded-full border border-indigo-500/20">
                      <LoaderIcon size={14} className="animate-spin mr-2" />
                      Verifying...
                   </div>
                 ) : verificationState === 'compatible' ? (
                   <div className="flex items-center text-emerald-400 text-xs font-medium bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20 animate-in zoom-in duration-300">
                      <CheckCircleIcon size={14} className="mr-2" />
                      Compatible
                   </div>
                 ) : (
                   <div className="flex items-center text-red-400 text-xs font-medium bg-red-500/10 px-3 py-1.5 rounded-full border border-red-500/20 animate-in zoom-in duration-300">
                      <AlertCircleIcon size={14} className="mr-2" />
                      Incompatible
                   </div>
                 )}
              </div>
           </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-slate-800/80 border-t border-slate-700 flex items-center justify-between">
          <Button variant="ghost" onClick={onBack}>
            Back
          </Button>
          <Button 
            variant="primary" 
            onClick={onNext}
            disabled={verifying || verificationState !== 'compatible'}
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CliConfig;