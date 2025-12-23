import React, { useState } from 'react';
import { CheckCircleIcon, ListTreeIcon, XIcon } from './Icons';

type TaskStatus = 'none' | 'partial' | 'complete';

type TaskCheckpoint = {
  id: string;
  label: string;
  status: 'complete' | 'incomplete';
  path: string;
};

const STATUS_COPY: Record<TaskStatus, string> = {
  none: 'No tasks have been created yet. Click the below button to start creating tasks.',
  partial: 'Tasks are partially generated but not completed. Click on continue button below to create the rest of the tasks.',
  complete: 'Tasks creation is completed. You can recreate them if you like.'
};

const ProjectDesignTasks: React.FC = () => {
  const [status] = useState<TaskStatus>('none');
  const [checkpoints] = useState<TaskCheckpoint[]>([
    { id: 'list', label: 'List tasks', status: 'incomplete', path: '/plan' },
    { id: 'order', label: 'Order tasks', status: 'incomplete', path: '/project/tasks/order' }
  ]);

  const handleCreateTasks = () => {
    const evt = new CustomEvent('app-navigate', { detail: '/project/backlog/generator' });
    window.dispatchEvent(evt);
  };

  return (
    <div className="flex flex-col h-full bg-[#0f172a] text-slate-200">
      <header className="border-b border-slate-800 bg-slate-900/60 px-8 py-6">
        <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Project Design</div>
        <h1 className="mt-2 text-3xl font-semibold text-white">Tasks</h1>
        <p className="mt-2 text-sm text-slate-400 max-w-2xl">
          Review task creation progress for this project and create tasks when ready.
        </p>
      </header>

      <div className="flex-1 overflow-y-auto custom-scrollbar px-8 py-10">
        <div className="max-w-3xl space-y-8">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-8">
            <div className="flex items-start justify-between gap-6">
              <div>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-300">
                    <ListTreeIcon size={18} />
                  </div>
                  <div>
                    <div className="text-xs font-bold uppercase tracking-widest text-slate-500">Tasks backlog</div>
                    <h2 className="text-xl font-semibold text-white mt-1">Creation status</h2>
                  </div>
                </div>
                <p className="mt-4 text-sm text-slate-400 leading-relaxed">
                  {STATUS_COPY[status]}
                </p>
              </div>
              <button
                onClick={handleCreateTasks}
                className="shrink-0 px-5 py-2.5 rounded-xl bg-emerald-500 text-slate-900 text-sm font-semibold hover:bg-emerald-400 transition-colors"
              >
                Create tasks
              </button>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-8">
            <div className="text-xs font-bold uppercase tracking-widest text-slate-500">Checkpoints</div>
            <div className="mt-4 space-y-3">
              {checkpoints.map((checkpoint) => (
                <button
                  key={checkpoint.id}
                  onClick={() => {
                    const evt = new CustomEvent('app-navigate', { detail: checkpoint.path });
                    window.dispatchEvent(evt);
                  }}
                  className="w-full flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/70 px-4 py-3 text-left hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${
                      checkpoint.status === 'complete'
                        ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                        : 'border-red-500/30 bg-red-500/10 text-red-300'
                    }`}>
                      {checkpoint.status === 'complete' ? <CheckCircleIcon size={16} /> : <XIcon size={16} />}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-100">{checkpoint.label}</div>
                      <div className={`text-xs ${
                        checkpoint.status === 'complete' ? 'text-emerald-400' : 'text-red-300'
                      }`}>
                        {checkpoint.status === 'complete' ? 'Completed' : 'Not completed'}
                      </div>
                    </div>
                  </div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    Open
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDesignTasks;
