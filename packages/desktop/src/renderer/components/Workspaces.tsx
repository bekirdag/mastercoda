import React, { useState } from 'react';
import { ClockIcon, FolderIcon, PlusIcon, XIcon } from './Icons';

type Workspace = {
  id: string;
  name: string;
  path: string;
  lastOpened: string;
  color: string;
  broken?: boolean;
};

type WorkspacesProps = {
  onOpenWorkspace: (path: string) => void;
  onAddWorkspace: () => void;
};

const Workspaces: React.FC<WorkspacesProps> = ({ onOpenWorkspace, onAddWorkspace }) => {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([
    { id: '1', name: 'master-coda-v1', path: '~/dev/master-coda-v1', lastOpened: '2 hours ago', color: 'indigo' },
    { id: '2', name: 'analytics-service', path: '~/work/analytics-service', lastOpened: '5 hours ago', color: 'emerald' },
    { id: '3', name: 'legacy-api', path: '~/work/legacy-api', lastOpened: '2 days ago', color: 'amber' },
    { id: '4', name: 'lost-project', path: '~/dev/missing-project', lastOpened: '1 week ago', color: 'slate', broken: true }
  ]);

  const removeWorkspace = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setWorkspaces(prev => prev.filter(workspace => workspace.id !== id));
  };

  return (
    <div className="flex flex-col h-full bg-[#0f172a] text-slate-200 overflow-hidden">
      <header className="border-b border-slate-800 bg-slate-900/60 px-8 py-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Workspace Hub</div>
            <h1 className="text-3xl font-semibold text-white mt-2">Workspaces</h1>
            <p className="text-sm text-slate-400 mt-2 max-w-xl">
              Switch between existing workspaces or add a new one in seconds.
            </p>
          </div>
          <button
            onClick={onAddWorkspace}
            className="flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold shadow-[0_0_20px_rgba(79,70,229,0.35)] hover:bg-indigo-500 transition-colors"
          >
            <PlusIcon size={16} />
            <span>Add a workspace</span>
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto custom-scrollbar px-8 py-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Your workspaces</h2>
          {workspaces.length > 0 && (
            <button
              onClick={() => setWorkspaces([])}
              className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
            >
              Clear list
            </button>
          )}
        </div>

        {workspaces.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-56 border-2 border-dashed border-slate-800 rounded-2xl text-slate-500">
            <FolderIcon size={32} className="mb-3 opacity-50" />
            <p className="text-sm">No workspaces yet. Add one to get started.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {workspaces.map((workspace) => (
              <div
                key={workspace.id}
                onClick={() => onOpenWorkspace(workspace.path)}
                className="group flex items-center justify-between p-4 bg-slate-900/40 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl cursor-pointer transition-all"
              >
                <div className="flex items-center min-w-0">
                  <div className={`w-10 h-10 rounded-lg bg-${workspace.color}-500/20 text-${workspace.color}-400 flex items-center justify-center mr-4 border border-${workspace.color}-500/20 shrink-0`}>
                    {workspace.broken ? (
                      <XIcon size={16} className="opacity-70" />
                    ) : (
                      <span className="font-bold text-sm">{workspace.name.substring(0, 2).toUpperCase()}</span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3 className={`font-medium truncate transition-colors ${workspace.broken ? 'text-slate-400 line-through decoration-slate-600 decoration-2' : 'text-slate-200 group-hover:text-white'}`}>
                      {workspace.name}
                    </h3>
                    <p className="text-xs text-slate-500 truncate font-mono">{workspace.path}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-6 shrink-0 pl-4">
                  <div className="flex items-center text-xs text-slate-500">
                    <ClockIcon size={12} className="mr-1.5" />
                    {workspace.lastOpened}
                  </div>
                  <button
                    onClick={(e) => removeWorkspace(e, workspace.id)}
                    className="p-1.5 text-slate-600 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors opacity-0 group-hover:opacity-100"
                    title="Remove from list"
                  >
                    <XIcon size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Workspaces;
