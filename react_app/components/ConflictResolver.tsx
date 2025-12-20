import React, { useState } from 'react';
import { ConflictedFile } from '../types';
import { MOCK_CONFLICTS } from '../constants';
import MergeEditor from './MergeEditor';
import Button from './Button';
import { 
  AlertTriangleIcon, 
  FileTextIcon, 
  CheckCircleIcon, 
  ArrowRightIcon, 
  XCircleIcon,
  GitMergeIcon,
  CheckIcon
} from './Icons';

interface ConflictResolverProps {
  onBack?: () => void;
}

const ConflictResolver: React.FC<ConflictResolverProps> = ({ onBack }) => {
  const [files, setFiles] = useState<ConflictedFile[]>(MOCK_CONFLICTS);
  const [selectedFileId, setSelectedFileId] = useState<string>(files[0].id);
  const [isCommitting, setIsCommitting] = useState(false);

  const selectedFile = files.find(f => f.id === selectedFileId);
  const unresolvedCount = files.filter(f => f.status === 'unresolved').length;
  const progress = ((files.length - unresolvedCount) / files.length) * 100;

  const handleResolveFile = (id: string, newContent: string) => {
    // In a real app, this would detect if all conflict blocks are gone
    // For this mock, we assume the MergeEditor handles internal state, 
    // and if we were to 'save' the file, we'd mark it resolved here.
    // Simulating 'File Resolved' action:
    setFiles(prev => prev.map(f => f.id === id ? { ...f, status: 'resolved' } : f));
  };

  const handleCommit = async () => {
    setIsCommitting(true);
    await new Promise(r => setTimeout(r, 2000));
    // Navigate away or show success
    if (onBack) onBack();
  };

  return (
    <div className="flex flex-col h-screen bg-[#0f172a] text-slate-200 font-sans overflow-hidden">
        
        {/* 1. Conflict Header */}
        <div className="h-[50px] shrink-0 bg-red-950/30 border-b border-red-900/50 flex items-center justify-between px-6 backdrop-blur-sm">
            <div className="flex items-center space-x-3">
                <div className="bg-red-500/20 p-1.5 rounded-md border border-red-500/30 text-red-400">
                    <GitMergeIcon size={16} />
                </div>
                <div className="flex flex-col">
                    <span className="text-sm font-semibold text-red-100 leading-none mb-0.5">Merge Conflict Detected</span>
                    <span className="text-[10px] text-red-300/70 font-mono">Merging <strong>feature/retry-logic</strong> into <strong>main</strong></span>
                </div>
            </div>
            
            <div className="flex items-center space-x-4">
                <div className="flex flex-col items-end mr-2">
                    <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider mb-1">Resolution Progress</span>
                    <div className="w-32 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: `${progress}%` }} />
                    </div>
                </div>
                <Button variant="destructive" size="sm" onClick={onBack}>Abort Merge</Button>
            </div>
        </div>

        {/* 2. Main Content */}
        <div className="flex-1 flex overflow-hidden">
            
            {/* Sidebar: File List */}
            <div className="w-[260px] bg-slate-900 border-r border-slate-800 flex flex-col">
                <div className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-slate-900">
                    Conflicted Files ({files.length})
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {files.map(file => (
                        <div 
                            key={file.id}
                            onClick={() => setSelectedFileId(file.id)}
                            className={`flex items-center px-4 py-2.5 cursor-pointer border-l-2 transition-all group ${
                                file.id === selectedFileId 
                                ? 'bg-slate-800 border-indigo-500' 
                                : 'hover:bg-slate-800/50 border-transparent'
                            }`}
                        >
                            <div className="mr-3">
                                {file.status === 'resolved' ? (
                                    <CheckCircleIcon size={16} className="text-emerald-500" />
                                ) : (
                                    <div className="w-4 h-4 rounded-full border-2 border-red-500/50 group-hover:border-red-500 bg-red-500/10 flex items-center justify-center">
                                        <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className={`text-xs font-mono truncate ${file.id === selectedFileId ? 'text-white' : 'text-slate-400'}`}>
                                    {file.path.split('/').pop()}
                                </div>
                                <div className="text-[10px] text-slate-600 truncate">
                                    {file.path}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Editor Area */}
            <div className="flex-1 flex flex-col min-w-0 relative">
                {selectedFile ? (
                    <MergeEditor 
                        fileName={selectedFile.path}
                        content={selectedFile.content}
                        onResolve={(content) => handleResolveFile(selectedFile.id, content)}
                    />
                ) : (
                    <div className="flex items-center justify-center h-full text-slate-500">
                        Select a file to resolve.
                    </div>
                )}
                
                {/* Floating FAB for marking current file resolved manually if needed */}
                {selectedFile && selectedFile.status === 'unresolved' && (
                    <div className="absolute bottom-6 right-6">
                        <button 
                            onClick={() => handleResolveFile(selectedFile.id, '')}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/50 rounded-full px-4 py-3 flex items-center font-medium text-sm transition-transform hover:-translate-y-1 active:translate-y-0"
                        >
                            <CheckIcon size={16} className="mr-2" strokeWidth={3} />
                            Mark File Resolved
                        </button>
                    </div>
                )}
            </div>

        </div>

        {/* 3. Footer Actions */}
        <div className="h-[60px] bg-slate-800 border-t border-slate-700 shrink-0 flex items-center justify-end px-6 space-x-4">
            <div className="text-xs text-slate-500 mr-auto">
                {unresolvedCount === 0 ? 'All conflicts resolved.' : `${unresolvedCount} files remaining.`}
            </div>
            
            <Button variant="secondary" onClick={onBack}>Cancel</Button>
            <Button 
                variant="primary" 
                onClick={handleCommit}
                disabled={unresolvedCount > 0 || isCommitting}
                className={unresolvedCount === 0 ? 'animate-pulse-subtle bg-emerald-600 hover:bg-emerald-500' : ''}
            >
                {isCommitting ? 'Committing...' : unresolvedCount === 0 ? 'Commit Merge' : 'Continue'}
            </Button>
        </div>
    </div>
  );
};

export default ConflictResolver;
