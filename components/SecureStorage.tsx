import React, { useState, useEffect } from 'react';
import Button from './Button';
import { 
  LockIcon, 
  KeyIcon, 
  LoaderIcon, 
  CheckCircleIcon,
  AlertCircleIcon,
  RefreshCwIcon
} from './Icons';

interface SecureStorageProps {
  onBack: () => void;
  onNext: () => void;
}

type StorageStatus = 'checking' | 'missing' | 'found' | 'generating' | 'success' | 'error';

const SecureStorage: React.FC<SecureStorageProps> = ({ onBack, onNext }) => {
  const [status, setStatus] = useState<StorageStatus>('checking');
  const [errorMsg, setErrorMsg] = useState('');
  
  const KEY_PATH = '~/.mcoda/key';

  // Simulate initial check
  useEffect(() => {
    const checkKey = async () => {
      await new Promise(resolve => setTimeout(resolve, 800));
      // For first run experience, we assume it's missing.
      setStatus('missing');
    };
    checkKey();
  }, []);

  const handleGenerate = async () => {
    setStatus('generating');
    setErrorMsg('');

    try {
      // Simulate crypto generation and disk write
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Random fail chance for "robustness" testing (commented out for prod)
      // if (Math.random() > 0.9) throw new Error("Permission denied: EACCES");

      setStatus('success');
    } catch (err) {
      setStatus('error');
      setErrorMsg('Failed to write key file. Check permissions for ~/.mcoda');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900 text-slate-200 flex flex-col items-center justify-center font-sans p-4">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-slate-950 -z-10" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 -z-10 mix-blend-overlay" />

      {/* Main Container */}
      <div className="w-full max-w-[600px] bg-slate-800/50 border border-slate-700 rounded-xl shadow-2xl overflow-hidden backdrop-blur-md animate-in slide-in-from-right-4 duration-500">
        
        {/* Header Section */}
        <div className="pt-10 pb-6 px-8 flex flex-col items-center text-center">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 transition-all duration-700 ${
            status === 'success' 
              ? 'bg-emerald-500/10 text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.2)]' 
              : status === 'generating'
              ? 'bg-indigo-500/10 text-indigo-400 animate-pulse'
              : 'bg-slate-700/30 text-slate-400'
          }`}>
             {status === 'success' ? (
               <LockIcon size={40} className="animate-in zoom-in duration-500" />
             ) : (
               <LockIcon size={40} />
             )}
          </div>
          
          <h1 className="text-2xl font-semibold text-white tracking-tight mb-3">Secure Credential Storage</h1>
          <p className="text-slate-400 text-sm leading-relaxed max-w-md">
            Master Coda stores your API keys (OpenAI, Github, etc.) in a local encrypted database. 
            We need to generate a master encryption key to secure this data.
          </p>
          
          <div className="mt-4 flex items-center px-3 py-1.5 rounded-full bg-slate-900/50 border border-slate-700/50">
             <span className="w-2 h-2 rounded-full bg-indigo-500 mr-2 animate-pulse"></span>
             <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Local Only • No Cloud Sync</span>
          </div>
        </div>

        {/* Action Panel */}
        <div className="px-8 pb-8">
          <div className="bg-slate-900/40 border border-slate-700/50 rounded-lg p-6 space-y-6">
             
             {/* Path Display */}
             <div className="flex flex-col space-y-2">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Master Key Location</label>
                <div className="flex items-center justify-between bg-slate-950 rounded border border-slate-800 px-4 py-3 font-mono text-sm text-slate-300">
                   <span>{KEY_PATH}</span>
                   {status === 'success' && (
                     <span className="flex items-center text-emerald-500 text-xs font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 animate-in fade-in">
                       GENERATED
                     </span>
                   )}
                   {status === 'missing' && (
                     <span className="text-slate-600 text-xs">MISSING</span>
                   )}
                   {status === 'found' && (
                     <span className="text-amber-500 text-xs">EXISTS</span>
                   )}
                </div>
             </div>

             {/* Dynamic Content based on Status */}
             <div className="flex justify-center pt-2">
               {status === 'checking' && (
                 <div className="text-slate-500 text-sm flex items-center">
                   <LoaderIcon className="animate-spin mr-2" size={16} />
                   Checking environment...
                 </div>
               )}

               {(status === 'missing' || status === 'error') && (
                 <div className="w-full">
                   {status === 'error' && (
                     <div className="flex items-center text-red-400 text-sm bg-red-500/10 p-3 rounded mb-4 border border-red-500/20">
                       <AlertCircleIcon size={16} className="mr-2" />
                       {errorMsg}
                     </div>
                   )}
                   <Button 
                    variant="primary" 
                    className="w-full h-12 text-base shadow-[0_0_20px_rgba(79,70,229,0.15)]" 
                    onClick={handleGenerate}
                    icon={<KeyIcon size={18} />}
                   >
                     Generate Master Key
                   </Button>
                 </div>
               )}

               {status === 'generating' && (
                 <div className="w-full flex flex-col items-center justify-center py-2 space-y-3">
                    <LoaderIcon className="animate-spin text-indigo-500" size={24} />
                    <span className="text-sm text-indigo-300 font-medium">Generating 32-byte entropy...</span>
                 </div>
               )}

               {status === 'success' && (
                 <div className="w-full flex items-center justify-center py-2 bg-emerald-500/5 rounded border border-emerald-500/10">
                    <CheckCircleIcon className="text-emerald-500 mr-2" size={20} />
                    <span className="text-emerald-400 font-medium">Encryption Active</span>
                 </div>
               )}

               {status === 'found' && (
                 <div className="w-full flex flex-col space-y-3">
                   <div className="text-amber-400 text-sm bg-amber-500/10 p-3 rounded border border-amber-500/20 text-center">
                     Existing key detected. Regenerating will invalidate all stored secrets.
                   </div>
                   <div className="grid grid-cols-2 gap-3">
                     <Button variant="secondary" onClick={() => setStatus('success')}>Use Existing</Button>
                     <Button variant="destructive" onClick={handleGenerate}>Regenerate</Button>
                   </div>
                 </div>
               )}
             </div>

          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-6 bg-slate-800/80 border-t border-slate-700 flex items-center justify-between">
          <Button variant="ghost" onClick={onBack} disabled={status === 'generating'}>
            Back
          </Button>
          <Button 
            variant="primary" 
            onClick={onNext}
            disabled={status !== 'success'}
            className={status === 'success' ? 'animate-pulse-subtle' : ''}
          >
            Next
          </Button>
        </div>

      </div>
    </div>
  );
};

export default SecureStorage;
