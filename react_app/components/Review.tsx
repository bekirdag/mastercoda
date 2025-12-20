import React, { useState } from 'react';
import { MOCK_FILE_CHANGES } from '../constants';
import DiffViewer from './DiffViewer';
import Button from './Button';
import { 
  CheckSquareIcon, 
  GitCommitIcon, 
  TrashIcon, 
  EyeIcon, 
  FileTextIcon, 
  ArrowRightIcon, 
  CheckCircleIcon, 
  CodeIcon,
  DiffIcon
} from './Icons';
import { FileChange } from '../types';

const Review: React.FC = () => {
  const [files, setFiles] = useState<FileChange[]>(MOCK_FILE_CHANGES);
  const [selectedFileId, setSelectedFileId] = useState<string>(files[0].id);
  const [commitMessage, setCommitMessage] = useState('feat: implement updated button styles and loader component');
  
  const selectedFile = files.find(f => f.id === selectedFileId);

  const handleToggleSelect = (id: string) => {
    setFiles(files.map(f => f.id === id ? { ...f, selected: !f.selected } : f));
  };

  const handleMarkViewed = () => {
     if (!selectedFile) return;
     setFiles(files.map(f => f.id === selectedFileId ? { ...f, viewed: true } : f));
     
     // Auto select next unviewed
     const nextIndex = files.findIndex(f => f.id === selectedFileId) + 1;
     if (nextIndex < files.length) {
         setSelectedFileId(files[nextIndex].id);
     }
  };

  const stats = {
      added: files.reduce((acc, f) => acc + f.additions, 0),
      deleted: files.reduce((acc, f) => acc + f.deletions, 0),
      filesCount: files.length
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 overflow-hidden">
        
        {/* 1. Review Header */}
        <div className="h-[50px] shrink-0 border-b border-slate-700 bg-slate-900 flex items-center justify-between px-4">
            <div className="flex items-center space-x-4">
               <span className="text-white font-semibold flex items-center">
                  <DiffIcon className="mr-2 text-indigo-400" size={18} />
                  Reviewing {stats.filesCount} Files
               </span>
               <div className="flex items-center space-x-2 text-sm font-mono">
                  <span className="text-emerald-400">+{stats.added}</span>
                  <span className="text-slate-600">/</span>
                  <span className="text-red-400">-{stats.deleted}</span>
               </div>
            </div>

            <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" icon={<CodeIcon size={14} />}>Ignore Whitespace</Button>
                <Button variant="destructive" size="sm" icon={<TrashIcon size={14} />}>Discard All</Button>
            </div>
        </div>

        {/* 2. Main Content Split */}
        <div className="flex-1 flex overflow-hidden">
            
            {/* Left: File Explorer */}
            <div className="w-[280px] bg-slate-800 border-r border-slate-700 flex flex-col">
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    <div className="px-4 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-slate-800 sticky top-0">
                        Staged Changes
                    </div>
                    {files.map(file => (
                        <div 
                           key={file.id}
                           onClick={() => setSelectedFileId(file.id)}
                           className={`flex items-center px-3 py-2 cursor-pointer transition-colors border-l-2 ${
                               file.id === selectedFileId 
                               ? 'bg-slate-700 border-indigo-500' 
                               : 'hover:bg-slate-700/50 border-transparent'
                           } ${file.viewed ? 'opacity-60 hover:opacity-100' : ''}`}
                        >
                            <div className="mr-3" onClick={(e) => { e.stopPropagation(); handleToggleSelect(file.id); }}>
                                {file.selected 
                                    ? <CheckSquareIcon className="text-indigo-400" size={16} /> 
                                    : <div className="w-4 h-4 border border-slate-500 rounded hover:border-slate-300" />
                                }
                            </div>
                            
                            <div className={`w-5 h-5 shrink-0 flex items-center justify-center rounded text-[10px] font-bold mr-2 ${
                                file.status === 'modified' ? 'text-blue-400 bg-blue-500/10' :
                                file.status === 'added' ? 'text-emerald-400 bg-emerald-500/10' :
                                'text-red-400 bg-red-500/10'
                            }`}>
                                {file.status === 'modified' ? 'M' : file.status === 'added' ? 'A' : 'D'}
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className={`text-xs truncate ${file.id === selectedFileId ? 'text-white' : 'text-slate-300'}`}>
                                    {file.path.split('/').pop()}
                                </div>
                                <div className="text-[10px] text-slate-500 truncate font-mono">
                                    {file.path}
                                </div>
                            </div>

                            {file.viewed && <EyeIcon size={12} className="text-slate-500 ml-2" />}
                        </div>
                    ))}
                </div>
            </div>

            {/* Right: Diff Editor */}
            <div className="flex-1 flex flex-col bg-[#0f1117] relative">
                 {selectedFile ? (
                     <>
                        <DiffViewer 
                            original={selectedFile.contentOriginal} 
                            modified={selectedFile.contentModified} 
                        />
                        {/* Overlay Actions */}
                        {!selectedFile.viewed && (
                            <div className="absolute bottom-4 right-8 z-10">
                                <Button 
                                    onClick={handleMarkViewed}
                                    variant="primary" 
                                    className="shadow-lg shadow-indigo-500/20"
                                    icon={<EyeIcon size={16} />}
                                >
                                    Mark Viewed (Space)
                                </Button>
                            </div>
                        )}
                     </>
                 ) : (
                     <div className="flex items-center justify-center h-full text-slate-500">
                         Select a file to review changes.
                     </div>
                 )}
            </div>

        </div>

        {/* 3. Footer: Commit */}
        <div className="h-[80px] shrink-0 bg-slate-800 border-t border-slate-700 px-6 flex items-center justify-between">
             <div className="flex-1 max-w-3xl mr-6">
                 <label className="text-[10px] font-bold text-slate-500 uppercase mb-1 block">Commit Message (AI Generated)</label>
                 <div className="relative">
                    <input 
                        type="text" 
                        value={commitMessage}
                        onChange={(e) => setCommitMessage(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
                    />
                 </div>
             </div>

             <div className="flex items-center space-x-3 mt-4">
                 <Button variant="secondary">Keep Uncommitted</Button>
                 <Button 
                    variant="primary" 
                    icon={<GitCommitIcon size={16} />}
                    disabled={files.filter(f => f.selected).length === 0}
                 >
                    Commit Changes
                 </Button>
             </div>
        </div>

    </div>
  );
};

export default Review;
