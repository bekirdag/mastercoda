import React, { useState } from 'react';
import { CheckCircleIcon, ListTreeIcon, XIcon } from './Icons';

type OrderStatus = 'none' | 'partial' | 'complete';

type OrderCheckpoint = {
  id: string;
  label: string;
  status: 'complete' | 'incomplete';
};

const STATUS_COPY: Record<OrderStatus, string> = {
  none: 'No tasks have been ordered yet. Click the below button to order tasks automatically.',
  partial: 'Tasks are partially ordered but not completed. Click the button below to finish ordering.',
  complete: 'Tasks ordering is completed. You can re-order them if you like.'
};

const OrderTasks: React.FC = () => {
  const [status] = useState<OrderStatus>('none');
  const [checkpoints] = useState<OrderCheckpoint[]>([
    { id: 'priority', label: 'Priority sequence', status: 'incomplete' },
    { id: 'dependencies', label: 'Dependency pass', status: 'incomplete' }
  ]);

  const handleOrderTasks = () => {
    const evt = new CustomEvent('app-navigate', { detail: '/tasks/board' });
    window.dispatchEvent(evt);
  };

  return (
    <div className="flex flex-col h-full bg-[#0f172a] text-slate-200">
      <header className="border-b border-slate-800 bg-slate-900/60 px-8 py-6">
        <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Project Design</div>
        <h1 className="mt-2 text-3xl font-semibold text-white">Order Tasks</h1>
        <p className="mt-2 text-sm text-slate-400 max-w-2xl">
          Let Mcoda automatically order tasks based on priority and dependencies.
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
                    <div className="text-xs font-bold uppercase tracking-widest text-slate-500">Ordering status</div>
                    <h2 className="text-xl font-semibold text-white mt-1">Task sequencing</h2>
                  </div>
                </div>
                <p className="mt-4 text-sm text-slate-400 leading-relaxed">
                  {STATUS_COPY[status]}
                </p>
              </div>
              <button
                onClick={handleOrderTasks}
                className="shrink-0 px-5 py-2.5 rounded-xl bg-emerald-500 text-slate-900 text-sm font-semibold hover:bg-emerald-400 transition-colors"
              >
                Order tasks
              </button>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-8">
            <div className="text-xs font-bold uppercase tracking-widest text-slate-500">Checkpoints</div>
            <div className="mt-4 space-y-3">
              {checkpoints.map((checkpoint) => (
                <div
                  key={checkpoint.id}
                  className="w-full flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/70 px-4 py-3 text-left"
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
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTasks;
