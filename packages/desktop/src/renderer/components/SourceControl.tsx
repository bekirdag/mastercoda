import React, { useState, useMemo } from 'react';
import { GitCommit, GitRef } from '../types';
import { MOCK_COMMITS, MOCK_BRANCHES } from '../constants';
import Button from './Button';
import Badge from './Badge';
import { 
  GitBranchIcon, 
  GitCommitIcon, 
  GitMergeIcon, 
  TagIcon, 
  CloudDownloadIcon, 
  CloudUploadIcon,
  RotateCwIcon,
  RefreshCwIcon,
  MoreVerticalIcon,
  LockIcon,
  SearchIcon,
  ArrowRightIcon,
  FileTextIcon,
  UserIcon,
  ClockIcon,
  AlertTriangleIcon
} from './Icons';

interface SourceControlProps {
  onConflictSimulate?: () => void;
}

const SourceControl: React.FC<SourceControlProps> = ({ onConflictSimulate }) => {
  const [commits, setCommits] = useState<GitCommit[]>(MOCK_COMMITS);
  const [branches, setBranches] = useState<GitRef[]>(MOCK_BRANCHES);
  const [selectedCommitId, setSelectedCommitId] = useState<string | null>(commits[0].id);
  const [isSyncing, setIsSyncing] = useState(false);

  const selectedCommit = commits.find(c => c.id === selectedCommitId);
  const activeBranch = branches.find(b => b.active);

  const handleSync = async () => {
    setIsSyncing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    // Simulate updating unpushed commits
    setCommits(prev => prev.map(c => c.status === 'unpushed' ? { ...c, status: 'pushed' } : c));
    setIsSyncing(false);
  };

  const handleCheckout = (branchId: string) => {
    setBranches(prev => prev.map(b => ({
      ...b,
      active: b.id === branchId
    })));
  };

  // --- Graph Rendering Helpers ---
  const renderGraph = () => {
    const ROW_HEIGHT = 48; // px
    const COL_WIDTH = 20; // px
    const X_OFFSET = 20;
    const Y_OFFSET = 24; // Half row height

    return (
      <svg className="absolute inset-0 pointer-events-none w-full h-full overflow-visible">
        {commits.map((commit, i) => {
           // Draw lines to parents
           return commit.parents.map(parentId => {
              const parentIndex = commits.findIndex(c => c.id === parentId);
              if (parentIndex === -1) return null;
              
              const parent = commits[parentIndex];
              const startX = X_OFFSET + commit.column! * COL_WIDTH;
              const startY = Y_OFFSET + i * ROW_HEIGHT;
              const endX = X_OFFSET + parent.column! * COL_WIDTH;
              const endY = Y_OFFSET + parentIndex * ROW_HEIGHT;

              // Bezier Curve
              const cp1y = startY + ROW_HEIGHT / 2;
              const cp2y = endY - ROW_HEIGHT / 2;

              return (
                <path 
                   key={`${commit.id}-${parent.id}`}
                   d={`M ${startX} ${startY} C ${startX} ${cp1y}, ${endX} ${cp2y}, ${endX} ${endY}`}
                   stroke={commit.color}
                   strokeWidth="2"
                   fill="none"
                   opacity="0.8"
                />
              );
           });
        })}
        {/* Draw Dots on top */}
        {commits.map((commit, i) => {
            const cx = X_OFFSET + commit.column! * COL_WIDTH;
            const cy = Y_OFFSET + i * ROW_HEIGHT;
            return (
               <g key={commit.id}>
                 <circle cx={cx} cy={cy} r="5" fill="#0f172a" stroke={commit.color} strokeWidth="2" />
                 {commit.isHead && (
                    <circle cx={cx} cy={cy} r="2" fill="white" />
                 )}
               </g>
            );
        })}
      </svg>
    );
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-200 font-sans overflow-hidden">
        
        {/* 1. Toolbar */}
        <div className="h-[50px] shrink-0 border-b border-slate-700 bg-slate-900 flex items-center justify-between px-4 z-20 relative">
            
            {/* Branch Switcher */}
            <div className="flex items-center space-x-4">
                <button className="flex items-center space-x-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded border border-slate-700 hover:border-indigo-500 transition-colors group">
                    <GitBranchIcon size={16} className="text-indigo-400" />
                    <span className="font-semibold text-sm text-white group-hover:text-indigo-200">{activeBranch?.name}</span>
                </button>
                
                <div className="h-6 w-px bg-slate-700" />

                {/* Sync Status */}
                <div className="flex items-center space-x-3 text-xs font-mono text-slate-400">
                    <div className="flex items-center" title="Commits behind remote">
                       <CloudDownloadIcon size={14} className="mr-1" />
                       <span>1</span>
                    </div>
                    <div className="flex items-center" title="Commits ahead of remote">
                       <CloudUploadIcon size={14} className="mr-1" />
                       <span className={commits.some(c => c.status === 'unpushed') ? 'text-amber-400' : ''}>
                          {commits.filter(c => c.status === 'unpushed').length}
                       </span>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2">
                {onConflictSimulate && (
                    <Button 
                       variant="ghost" 
                       size="sm" 
                       className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                       onClick={onConflictSimulate}
                       icon={<AlertTriangleIcon size={14} />}
                    >
                       Simulate Conflict
                    </Button>
                )}
                <Button 
                   variant="secondary" 
                   size="sm" 
                   icon={<RefreshCwIcon size={14} />} 
                   title="Fetch from origin"
                >
                   Fetch
                </Button>
                <Button 
                   variant="primary" 
                   size="sm" 
                   onClick={handleSync}
                   disabled={isSyncing}
                >
                   {isSyncing ? (
                      <span className="flex items-center"><RotateCwIcon size={14} className="animate-spin mr-2" /> Syncing...</span>
                   ) : (
                      <span className="flex items-center"><CloudUploadIcon size={14} className="mr-2" /> Sync Changes</span>
                   )}
                </Button>
            </div>
        </div>

        {/* 2. Main Layout */}
        <div className="flex-1 flex overflow-hidden">
            
            {/* Left Pane: Refs */}
            <div className="w-[220px] bg-slate-800 border-r border-slate-700 flex flex-col">
                <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-4">
                    
                    {/* Local Branches */}
                    <div>
                        <div className="px-2 py-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider flex justify-between items-center group">
                            <span>Local Branches</span>
                            <button className="opacity-0 group-hover:opacity-100 hover:text-white">+</button>
                        </div>
                        <div className="mt-1 space-y-0.5">
                            {branches.filter(b => b.type === 'local').map(branch => (
                                <div 
                                   key={branch.id} 
                                   onDoubleClick={() => handleCheckout(branch.id)}
                                   className={`flex items-center px-2 py-1.5 rounded cursor-pointer transition-colors ${
                                       branch.active ? 'bg-indigo-500/10 text-indigo-300' : 'hover:bg-slate-700 text-slate-300'
                                   }`}
                                >
                                   <GitBranchIcon size={14} className={`mr-2 ${branch.active ? 'text-indigo-400' : 'text-slate-500'}`} />
                                   <span className="text-xs truncate flex-1">{branch.name}</span>
                                   {branch.active && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Remotes */}
                    <div>
                        <div className="px-2 py-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                            Remotes
                        </div>
                        <div className="mt-1 space-y-0.5">
                            {branches.filter(b => b.type === 'remote').map(remote => (
                                <div key={remote.id} className="flex items-center px-2 py-1.5 rounded cursor-pointer hover:bg-slate-700 text-slate-400">
                                   <LockIcon size={12} className="mr-2 opacity-50" />
                                   <span className="text-xs truncate flex-1">{remote.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Tags */}
                    <div>
                        <div className="px-2 py-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                            Tags
                        </div>
                        <div className="mt-1 space-y-0.5">
                            {branches.filter(b => b.type === 'tag').map(tag => (
                                <div key={tag.id} className="flex items-center px-2 py-1.5 rounded cursor-pointer hover:bg-slate-700 text-slate-400">
                                   <TagIcon size={12} className="mr-2 opacity-50" />
                                   <span className="text-xs truncate flex-1">{tag.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Center Pane: Graph & Commits */}
            <div className="flex-1 flex flex-col bg-[#0f172a] overflow-hidden relative">
                
                {/* Header Row */}
                <div className="flex items-center h-8 bg-slate-900 border-b border-slate-800 px-4 text-[10px] text-slate-500 uppercase font-mono tracking-wider sticky top-0 z-30">
                    <div className="w-[100px] shrink-0">Graph</div>
                    <div className="flex-1 min-w-[200px]">Description</div>
                    <div className="w-[120px]">Author</div>
                    <div className="w-[80px]">Hash</div>
                    <div className="w-[80px] text-right">Date</div>
                </div>

                {/* Commit List Container */}
                <div className="flex-1 overflow-y-auto custom-scrollbar relative">
                    
                    {/* SVG Graph Layer */}
                    <div className="absolute top-0 left-0 w-[100px] h-full z-10 pointer-events-none">
                         {renderGraph()}
                    </div>

                    {/* Rows */}
                    {commits.map((commit, i) => (
                        <div 
                           key={commit.id}
                           onClick={() => setSelectedCommitId(commit.id)}
                           className={`relative flex items-center h-[48px] border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors cursor-pointer group ${
                               selectedCommitId === commit.id ? 'bg-indigo-900/20' : ''
                           }`}
                        >
                            {/* Graph Spacer */}
                            <div className="w-[100px] shrink-0" />

                            {/* Message */}
                            <div className="flex-1 min-w-[200px] pr-4 flex items-center">
                                {commit.status === 'unpushed' && (
                                   <div className="mr-2" title="Unpushed">
                                      <CloudUploadIcon size={12} className="text-amber-500" />
                                   </div>
                                )}
                                <span className={`text-sm truncate ${
                                    selectedCommitId === commit.id ? 'text-white' : 'text-slate-300'
                                }`}>
                                    {commit.message}
                                </span>
                                {/* Branch Labels inline if head */}
                                {branches.filter(b => b.commitId === commit.id).map(b => (
                                   <span key={b.id} className={`ml-2 px-1.5 py-0.5 text-[9px] rounded font-mono border ${
                                       b.active 
                                       ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                                       : b.type === 'remote' 
                                       ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                                       : 'bg-slate-700 text-slate-400 border-slate-600'
                                   }`}>
                                      {b.name}
                                   </span>
                                ))}
                            </div>

                            {/* Author */}
                            <div className="w-[120px] flex items-center text-xs text-slate-400">
                                <div className="w-5 h-5 rounded-full bg-slate-700 flex items-center justify-center text-[9px] mr-2">
                                   {commit.author[0]}
                                </div>
                                <span className="truncate">{commit.author}</span>
                            </div>

                            {/* Hash */}
                            <div className="w-[80px] font-mono text-xs text-slate-500 group-hover:text-indigo-400 transition-colors">
                                {commit.id}
                            </div>

                            {/* Date */}
                            <div className="w-[80px] text-right pr-4 text-xs text-slate-500">
                                {commit.date}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right Pane: Commit Details */}
            <div className="w-[320px] bg-slate-800 border-l border-slate-700 flex flex-col">
                {selectedCommit ? (
                   <>
                      {/* Commit Header */}
                      <div className="p-4 border-b border-slate-700 bg-slate-800">
                         <div className="flex items-start justify-between mb-2">
                             <div className="text-lg font-semibold text-white leading-snug">
                                {selectedCommit.message}
                             </div>
                         </div>
                         <div className="flex items-center justify-between text-xs text-slate-400 mt-2">
                             <div className="flex items-center">
                                <UserIcon size={12} className="mr-1.5" />
                                {selectedCommit.author}
                             </div>
                             <div className="flex items-center">
                                <ClockIcon size={12} className="mr-1.5" />
                                {selectedCommit.date}
                             </div>
                         </div>
                         <div className="mt-3 flex items-center space-x-2">
                            <span className="font-mono text-xs bg-slate-900 px-2 py-1 rounded text-indigo-300 border border-slate-700 select-all">
                                {selectedCommit.id}
                            </span>
                            <span className="text-xs text-slate-500">
                               Parent: <span className="font-mono text-slate-400 hover:text-white cursor-pointer">{selectedCommit.parents[0] || 'None'}</span>
                            </span>
                         </div>
                      </div>

                      {/* File Stats List */}
                      <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
                          <div className="px-2 py-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                              Changed Files (4)
                          </div>
                          
                          {/* Mock Changed Files */}
                          <FileListItem name="src/components/App.tsx" added={12} deleted={4} />
                          <FileListItem name="src/types.ts" added={5} deleted={0} />
                          <FileListItem name="package.json" added={1} deleted={1} />
                          <FileListItem name="README.md" added={24} deleted={10} />
                          
                      </div>
                      
                      {/* Actions */}
                      <div className="p-4 border-t border-slate-700 bg-slate-800">
                         <Button variant="secondary" className="w-full justify-center">
                            Revert Commit
                         </Button>
                      </div>
                   </>
                ) : (
                   <div className="flex flex-col items-center justify-center h-full text-slate-500 p-8 text-center">
                       <GitCommitIcon size={32} className="mb-3 opacity-50" />
                       <p>Select a commit to view details</p>
                   </div>
                )}
            </div>

        </div>
    </div>
  );
};

const FileListItem: React.FC<{ name: string; added: number; deleted: number }> = ({ name, added, deleted }) => {
    // Simple bar visualization
    const total = added + deleted;
    const addedPct = (added / total) * 100;
    
    return (
        <div className="group flex items-center justify-between p-2 rounded hover:bg-slate-700 cursor-pointer transition-colors">
            <div className="flex items-center min-w-0 flex-1">
                <FileTextIcon size={14} className="text-slate-500 mr-2 shrink-0 group-hover:text-white" />
                <span className="text-xs text-slate-300 truncate group-hover:text-white">{name}</span>
            </div>
            <div className="flex items-center ml-3 shrink-0">
                <div className="flex h-1.5 w-12 bg-slate-900 rounded overflow-hidden mr-2">
                    <div className="bg-emerald-500" style={{ width: `${addedPct}%` }} />
                    <div className="bg-red-500 flex-1" />
                </div>
                <span className="text-[10px] font-mono text-slate-500 w-8 text-right">
                    {total}
                </span>
            </div>
        </div>
    );
};

export default SourceControl;
