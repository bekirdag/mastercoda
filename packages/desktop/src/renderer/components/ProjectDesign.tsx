import React from 'react';
import { AlertTriangleIcon, CheckCircleIcon, FileTextIcon, ListTreeIcon } from './Icons';

type DesignItem = {
  id: string;
  label: string;
  exists: boolean;
  path?: string;
  detail?: string;
  actionPath?: string;
  actionLabel?: string;
};

const DESIGN_ITEMS: DesignItem[] = [
  { id: 'rfp', label: 'RFP file', exists: true, path: 'docs/rfp.md', actionPath: '/agents/discovery', actionLabel: 'Open' },
  { id: 'pdr', label: 'PDR file', exists: false, actionPath: '/agents/signoff', actionLabel: 'Open' },
  { id: 'sds', label: 'SDS file', exists: false, actionPath: '/agents/structural-templates', actionLabel: 'Open' },
  { id: 'openapi', label: 'OpenAPI YAML', exists: true, path: 'openapi/mcoda.yaml', actionPath: '/agents/openyaml', actionLabel: 'Open' },
  { id: 'tasks', label: 'Tasks backlog', exists: false, actionPath: '/workspace/design/tasks', actionLabel: 'Open' }
];

const ProjectDesign: React.FC = () => {
  const navigateTo = (path: string) => {
    const evt = new CustomEvent('app-navigate', { detail: path });
    window.dispatchEvent(evt);
  };

  return (
    <div className="flex flex-col h-full bg-[#0f172a] text-slate-200">
      <header className="border-b border-slate-800 bg-slate-900/60 px-8 py-6">
        <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Project Design</div>
        <h1 className="mt-2 text-3xl font-semibold text-white">Design Health</h1>
        <p className="mt-2 text-sm text-slate-400 max-w-2xl">
          Review the project design artifacts and ensure each milestone file exists before moving forward.
        </p>
      </header>

      <div className="flex-1 overflow-y-auto custom-scrollbar px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {DESIGN_ITEMS.map((item) => (
            <div
              key={item.id}
              className={`rounded-2xl border p-5 transition-all shadow-sm ${
                item.exists
                  ? 'border-emerald-500/30 bg-emerald-500/5'
                  : 'border-red-500/30 bg-red-500/5'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
                    item.exists
                      ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                      : 'border-red-500/30 bg-red-500/10 text-red-300'
                  }`}>
                    {item.exists ? <CheckCircleIcon size={18} /> : <AlertTriangleIcon size={18} />}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-100">{item.label}</div>
                    {item.exists ? (
                      <div className="mt-1 text-xs text-slate-400 font-mono">
                        {item.path || item.detail || 'Ready'}
                      </div>
                    ) : (
                      <div className="mt-1 text-xs text-red-300">
                        These need to be created.
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3 text-slate-500">
                  {item.actionPath && (
                    <button
                      onClick={() => navigateTo(item.actionPath || '')}
                      className="text-[10px] font-bold uppercase tracking-widest text-indigo-300 hover:text-white transition-colors"
                    >
                      {item.actionLabel || 'Open'}
                    </button>
                  )}
                  {item.id === 'tasks' ? <ListTreeIcon size={16} /> : <FileTextIcon size={16} />}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectDesign;
