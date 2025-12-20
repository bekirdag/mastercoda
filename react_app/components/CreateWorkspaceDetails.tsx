import React, { useState, useEffect } from 'react';
import Button from './Button';
import { 
  CheckIcon,
  AlertCircleIcon,
  CheckCircleIcon
} from './Icons';

interface CreateWorkspaceDetailsProps {
  onBack: () => void;
  onNext: (details: { name: string; key: string; docdex: string; gitignore: boolean }) => void;
}

const CreateWorkspaceDetails: React.FC<CreateWorkspaceDetailsProps> = ({ onBack, onNext }) => {
  const [name, setName] = useState('');
  const [projectKey, setProjectKey] = useState('');
  const [docdexId, setDocdexId] = useState('');
  const [addToGitignore, setAddToGitignore] = useState(true);
  
  const [isKeyManuallyEdited, setIsKeyManuallyEdited] = useState(false);
  const [keyError, setKeyError] = useState<string | null>(null);

  // Auto-generate key from name
  useEffect(() => {
    if (!isKeyManuallyEdited) {
      const generated = name
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, '')
        .slice(0, 10);
      setProjectKey(generated);
      setKeyError(null);
    }
  }, [name, isKeyManuallyEdited]);

  const handleKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsKeyManuallyEdited(true);
    const val = e.target.value.toUpperCase();
    
    // Validation
    if (/[^A-Z0-9]/.test(val)) {
      setKeyError('Key must be A-Z and numbers only.');
    } else {
      setKeyError(null);
    }
    
    setProjectKey(val.slice(0, 10));
  };

  const isFormValid = name.trim().length > 0 && projectKey.length > 0 && !keyError;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900 text-slate-200 flex flex-col items-center justify-center font-sans p-4">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-slate-950 -z-10" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 -z-10 mix-blend-overlay" />

      {/* Main Container */}
      <div className="w-full max-w-[600px] bg-slate-800/50 border border-slate-700 rounded-xl shadow-2xl overflow-hidden backdrop-blur-md animate-in slide-in-from-right-4 duration-500 flex flex-col">
        
        {/* Header Section */}
        <div className="pt-10 pb-6 px-8 text-center border-b border-slate-700/50 bg-slate-800/30">
            <h1 className="text-2xl font-semibold text-white tracking-tight mb-2">Name your project</h1>
            <p className="text-slate-400 text-sm">This information helps organize your tasks and documentation.</p>
            
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
                    <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold shadow-[0_0_10px_rgba(99,102,241,0.5)]">2</div>
                    <span className="ml-2 text-sm font-medium text-white">Details</span>
                </div>
                <div className="w-8 h-px bg-slate-700" />
                <div className="flex items-center">
                    <div className="w-6 h-6 rounded-full bg-slate-700 text-slate-400 flex items-center justify-center text-xs font-bold">3</div>
                    <span className="ml-2 text-sm font-medium text-slate-500">Defaults</span>
                </div>
            </div>
        </div>

        {/* Form Content */}
        <div className="p-8 space-y-6">
            
            {/* Project Name */}
            <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Project Name
                </label>
                <input 
                    autoFocus
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. My Super App"
                    className="block w-full px-4 py-3 rounded-md bg-slate-950 border border-slate-700 text-slate-200 placeholder-slate-600 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                />
            </div>

            {/* Project Key & Docdex ID Grid */}
            <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1.5 relative">
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Project Key
                    </label>
                    <input 
                        type="text" 
                        value={projectKey}
                        onChange={handleKeyChange}
                        placeholder="MYSUPER"
                        className={`block w-full px-4 py-3 rounded-md bg-slate-950 border text-slate-200 placeholder-slate-600 font-mono text-sm focus:outline-none focus:ring-1 transition-colors ${
                            keyError 
                            ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500' 
                            : 'border-slate-700 focus:border-indigo-500 focus:ring-indigo-500'
                        }`}
                        maxLength={10}
                    />
                    {keyError && (
                        <div className="absolute top-full left-0 mt-1 flex items-center text-xs text-red-400 animate-in slide-in-from-top-1">
                            <AlertCircleIcon size={12} className="mr-1" />
                            {keyError}
                        </div>
                    )}
                </div>

                <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider flex justify-between">
                        <span>Docdex ID</span>
                        <span className="text-[10px] text-slate-600 font-normal lowercase">optional</span>
                    </label>
                    <input 
                        type="text" 
                        value={docdexId}
                        onChange={(e) => setDocdexId(e.target.value)}
                        placeholder="ddx-..."
                        className="block w-full px-4 py-3 rounded-md bg-slate-950 border border-slate-700 text-slate-200 placeholder-slate-600 font-mono text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
                    />
                </div>
            </div>

            {/* Gitignore Option */}
            <div 
                onClick={() => setAddToGitignore(!addToGitignore)}
                className="flex items-center p-3 -mx-3 rounded-lg hover:bg-slate-800/50 cursor-pointer transition-colors group select-none"
            >
                <div className={`w-5 h-5 rounded border flex items-center justify-center mr-3 transition-colors ${
                    addToGitignore 
                    ? 'bg-indigo-600 border-indigo-600 text-white' 
                    : 'bg-transparent border-slate-600 group-hover:border-slate-500'
                }`}>
                    {addToGitignore && <CheckIcon size={14} strokeWidth={3} />}
                </div>
                <div className="flex flex-col">
                    <span className="text-sm font-medium text-slate-200">Add <code className="font-mono text-xs bg-slate-900 px-1 py-0.5 rounded">.mcoda</code> to <code className="font-mono text-xs bg-slate-900 px-1 py-0.5 rounded">.gitignore</code></span>
                    <span className="text-xs text-slate-500 mt-0.5">Recommended. Keeps local config and logs out of version control.</span>
                </div>
            </div>

        </div>

        {/* Footer */}
        <div className="p-6 bg-slate-800/80 border-t border-slate-700 flex items-center justify-between mt-auto">
          <Button variant="ghost" onClick={onBack}>
            Back
          </Button>
          <Button 
            variant="primary" 
            onClick={() => onNext({ name, key: projectKey, docdex: docdexId, gitignore: addToGitignore })}
            disabled={!isFormValid}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateWorkspaceDetails;