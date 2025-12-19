import React, { useState, useEffect, useRef } from 'react';
import Button from './Button';
import { 
  FolderIcon, 
  CheckCircleIcon, 
  AlertCircleIcon, 
  LoaderIcon,
  XCircleIcon,
  GitBranchIcon,
  ChevronRightIcon
} from './Icons';

interface CreateWorkspaceLocationProps {
  onBack: () => void;
  onNext: (path: string) => void;
}

type ValidationStatus = 'idle' | 'validating' | 'valid' | 'invalid';

const CreateWorkspaceLocation: React.FC<CreateWorkspaceLocationProps> = ({ onBack, onNext }) => {
  const [path, setPath] = useState('');
  const [status, setStatus] = useState<ValidationStatus>('idle');
  const [feedback, setFeedback] = useState<{ type: 'error' | 'success' | 'info'; message: string } | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Focus input on mount
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleBrowse = () => {
    // Simulate Native Dialog selection
    const mockPaths = [
      '/Users/alex/dev/new-platform',
      '/Users/alex/work/secret-project',
      '/Users/alex/repos/my-library'
    ];
    const randomPath = mockPaths[Math.floor(Math.random() * mockPaths.length)];
    setPath(randomPath);
  };

  const validatePath = async (currentPath: string) => {
    if (!currentPath.trim()) {
      setStatus('idle');
      setFeedback(null);
      return;
    }

    setStatus('validating');
    
    // Simulate fs check latency
    await new Promise(resolve => setTimeout(resolve, 600));

    // Mock Validation Logic
    const p = currentPath.toLowerCase();

    if (p.includes('legacy-api')) {
      setStatus('invalid');
      setFeedback({ 
        type: 'error', 
        message: 'Error: This folder is already a Master Coda workspace.' 
      });
      return;
    }

    if (p.includes('root') || p.includes('system')) {
        setStatus('invalid');
        setFeedback({ 
          type: 'error', 
          message: 'Error: No write access to this location. Permission denied.' 
        });
        return;
    }

    if (p.includes('repo') || p.includes('library')) {
        setStatus('valid');
        setFeedback({ 
          type: 'info', 
          message: 'Git repository detected. Safe to initialize.' 
        });
        return;
    }

    setStatus('valid');
    setFeedback({ 
        type: 'success', 
        message: 'New folder will be created.' 
    });
  };

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    
    // Reset if empty
    if (!path) {
        setStatus('idle');
        setFeedback(null);
        return;
    }

    debounceRef.current = setTimeout(() => {
      validatePath(path);
    }, 500);

    return () => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [path]);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900 text-slate-200 flex flex-col items-center justify-center font-sans p-4">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-slate-950 -z-10" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 -z-10 mix-blend-overlay" />

      {/* Main Container */}
      <div className="w-full max-w-[600px] bg-slate-800/50 border border-slate-700 rounded-xl shadow-2xl overflow-hidden backdrop-blur-md animate-in slide-in-from-right-4 duration-500 flex flex-col">
        
        {/* Header Section */}
        <div className="pt-10 pb-6 px-8 text-center border-b border-slate-700/50 bg-slate-800/30">
            <h1 className="text-2xl font-semibold text-white tracking-tight mb-2">Create New Workspace</h1>
            
            {/* Stepper */}
            <div className="flex items-center justify-center space-x-4 mt-6 mb-2">
                <div className="flex items-center">
                    <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold shadow-[0_0_10px_rgba(99,102,241,0.5)]">1</div>
                    <span className="ml-2 text-sm font-medium text-white">Location</span>
                </div>
                <div className="w-8 h-px bg-slate-700" />
                <div className="flex items-center">
                    <div className="w-6 h-6 rounded-full bg-slate-700 text-slate-400 flex items-center justify-center text-xs font-bold">2</div>
                    <span className="ml-2 text-sm font-medium text-slate-500">Details</span>
                </div>
                <div className="w-8 h-px bg-slate-700" />
                <div className="flex items-center">
                    <div className="w-6 h-6 rounded-full bg-slate-700 text-slate-400 flex items-center justify-center text-xs font-bold">3</div>
                    <span className="ml-2 text-sm font-medium text-slate-500">Defaults</span>
                </div>
            </div>
        </div>

        {/* Content Section */}
        <div className="p-8">
            <div className="text-center mb-8">
                <h2 className="text-lg font-medium text-white">Where should this project live?</h2>
                <p className="text-slate-400 text-sm mt-1 max-w-sm mx-auto">
                    Select an empty folder or an existing code repository. We will create a <span className="font-mono text-indigo-300 bg-indigo-500/10 px-1 rounded">.mcoda</span> directory inside it.
                </p>
            </div>

            {/* Input Group */}
            <div className="space-y-4">
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Workspace Path
                </label>
                <div className="flex shadow-sm rounded-md transition-all duration-300 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-1 focus-within:ring-offset-slate-800">
                    <input 
                        ref={inputRef}
                        type="text" 
                        value={path}
                        onChange={(e) => setPath(e.target.value)}
                        placeholder="/absolute/path/to/project"
                        className="flex-1 min-w-0 block w-full px-4 py-3 rounded-l-md bg-slate-950 border border-r-0 border-slate-700 text-slate-200 placeholder-slate-600 font-mono text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                        spellCheck={false}
                    />
                    <button 
                        onClick={handleBrowse}
                        className="inline-flex items-center px-4 py-3 border border-l-0 border-slate-700 rounded-r-md bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white font-medium text-sm transition-colors"
                    >
                        <FolderIcon size={18} className="mr-2" />
                        Browse
                    </button>
                </div>

                {/* Validation Feedback */}
                <div className="min-h-[40px] flex items-start">
                    {status === 'validating' && (
                        <div className="flex items-center text-sm text-slate-400 animate-pulse">
                            <LoaderIcon className="animate-spin mr-2" size={16} />
                            Verifying path permissions...
                        </div>
                    )}

                    {status === 'idle' && (
                         <div className="text-sm text-slate-500">Please select a directory.</div>
                    )}

                    {status === 'valid' && feedback && (
                        <div className={`flex items-center text-sm ${feedback.type === 'info' ? 'text-indigo-400' : 'text-emerald-400'} animate-in slide-in-from-top-1`}>
                            {feedback.type === 'info' ? <GitBranchIcon size={16} className="mr-2" /> : <CheckCircleIcon size={16} className="mr-2" />}
                            {feedback.message}
                        </div>
                    )}

                    {status === 'invalid' && feedback && (
                        <div className="flex items-center text-sm text-red-400 animate-in slide-in-from-top-1">
                            <XCircleIcon size={16} className="mr-2" />
                            {feedback.message}
                            {feedback.message.includes('already') && (
                                <button className="ml-2 underline hover:text-red-300">Open this project instead?</button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-slate-800/80 border-t border-slate-700 flex items-center justify-between mt-auto">
          <Button variant="ghost" onClick={onBack}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={() => onNext(path)}
            disabled={status !== 'valid'}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateWorkspaceLocation;