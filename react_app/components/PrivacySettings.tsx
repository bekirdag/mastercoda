import React, { useState } from 'react';
import Button from './Button';
import { 
  ShieldIcon, 
  CheckCircleIcon, 
  XCircleIcon, 
  LoaderIcon
} from './Icons';

interface PrivacySettingsProps {
  onBack: () => void;
  onNext: () => void;
}

const PrivacySettings: React.FC<PrivacySettingsProps> = ({ onBack, onNext }) => {
  const [telemetryEnabled, setTelemetryEnabled] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleComplete = async () => {
    setIsCompleting(true);
    // Simulate saving preference
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Show success state
    setShowSuccess(true);
    
    // Wait for animation before proceeding
    await new Promise(resolve => setTimeout(resolve, 1200));
    onNext();
  };

  if (showSuccess) {
    return (
        <div className="fixed inset-0 z-50 bg-slate-900 flex items-center justify-center font-sans">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-900 to-slate-950 -z-10" />
            <div className="flex flex-col items-center animate-in zoom-in duration-500 p-8">
                <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(16,185,129,0.5)] mb-8">
                    <CheckCircleIcon size={48} className="text-white drop-shadow-md" />
                </div>
                <h2 className="text-3xl font-bold text-white tracking-tight">Setup Complete</h2>
                <p className="text-slate-400 mt-3 text-lg">Initializing Master Coda Workspace...</p>
                <div className="mt-8 flex space-x-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}/>
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}/>
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}/>
                </div>
            </div>
        </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-900 text-slate-200 flex flex-col items-center justify-center font-sans p-4">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-slate-950 -z-10" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 -z-10 mix-blend-overlay" />

      {/* Main Container */}
      <div className="w-full max-w-[600px] bg-slate-800/50 border border-slate-700 rounded-xl shadow-2xl overflow-hidden backdrop-blur-md animate-in slide-in-from-right-4 duration-500">
        
        {/* Header */}
        <div className="pt-10 pb-6 px-8 text-center border-b border-slate-700/50 bg-slate-800/30">
          <div className="w-20 h-20 rounded-full bg-indigo-500/10 text-indigo-400 flex items-center justify-center mx-auto mb-6 border border-indigo-500/20 shadow-[0_0_30px_rgba(99,102,241,0.15)]">
            <ShieldIcon size={40} />
          </div>
          <h1 className="text-2xl font-semibold text-white tracking-tight">Help Improve Master Coda</h1>
          <p className="text-slate-400 mt-3 text-sm leading-relaxed max-w-md mx-auto">
             We collect anonymous usage data to understand performance and costs. No code or prompts ever leave your machine.
          </p>
        </div>

        {/* Toggle Section */}
        <div className="p-8">
            <div 
              onClick={() => setTelemetryEnabled(!telemetryEnabled)}
              className={`flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 group ${
                telemetryEnabled 
                  ? 'bg-indigo-600/10 border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.15)]' 
                  : 'bg-slate-800/40 border-slate-700 hover:border-slate-600'
              }`}
            >
                <div className="flex flex-col">
                    <span className={`font-semibold transition-colors ${telemetryEnabled ? 'text-indigo-200' : 'text-slate-200'}`}>Share Anonymous Usage Data</span>
                    <span className="text-xs text-slate-400 mt-1">Helps us detect crashes and optimize large builds.</span>
                </div>

                {/* Switch Control */}
                <div className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ease-in-out relative ${telemetryEnabled ? 'bg-indigo-500' : 'bg-slate-700'}`}>
                    <div className={`absolute top-1 bg-white w-4 h-4 rounded-full shadow-sm transition-all duration-300 ease-in-out ${telemetryEnabled ? 'left-7' : 'left-1'}`} />
                </div>
            </div>
        </div>

        {/* Data Policy Grid */}
        <div className="px-8 pb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Safe to Collect */}
            <div className="space-y-3">
                <h3 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2">
                    What We Collect
                </h3>
                <ul className="space-y-2">
                    <PolicyItem text="Command run counts" type="allowed" />
                    <PolicyItem text="Token usage & costs" type="allowed" />
                    <PolicyItem text="Error codes & crash dumps" type="allowed" />
                    <PolicyItem text="Performance metrics (latency)" type="allowed" />
                </ul>
            </div>

            {/* Strictly Private */}
            <div className="space-y-3">
                <h3 className="text-xs font-semibold text-red-400 uppercase tracking-wider mb-2">
                    Strictly Private
                </h3>
                <ul className="space-y-2">
                    <PolicyItem text="Your source code" type="forbidden" />
                    <PolicyItem text="Prompts & agent responses" type="forbidden" />
                    <PolicyItem text="API keys & credentials" type="forbidden" />
                    <PolicyItem text="File paths or PII" type="forbidden" />
                </ul>
            </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-slate-800/80 border-t border-slate-700 flex items-center justify-between">
          <Button variant="ghost" onClick={onBack} disabled={isCompleting}>
            Back
          </Button>
          <Button 
            variant="primary" 
            onClick={handleComplete}
            disabled={isCompleting}
          >
            {isCompleting ? (
                <span className="flex items-center">
                    <LoaderIcon className="animate-spin mr-2" size={16} />
                    Saving...
                </span>
            ) : "Complete Setup"}
          </Button>
        </div>
      </div>
    </div>
  );
};

const PolicyItem: React.FC<{ text: string; type: 'allowed' | 'forbidden' }> = ({ text, type }) => (
    <li className="text-sm text-slate-400 flex items-start">
        {type === 'allowed' ? (
            <CheckCircleIcon size={14} className="text-emerald-500 mt-0.5 mr-2 shrink-0" />
        ) : (
            <XCircleIcon size={14} className="text-red-500 mt-0.5 mr-2 shrink-0" />
        )}
        <span className={type === 'forbidden' ? 'text-slate-500' : 'text-slate-300'}>{text}</span>
    </li>
);

export default PrivacySettings;