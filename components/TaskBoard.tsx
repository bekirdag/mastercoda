import React, { useState } from 'react';
import { Task } from '../types';
import { 
  MoreHorizontalIcon,
  ArrowUpIcon,
  UserIcon,
  CrownIcon,
  BookmarkIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  PlayIcon
} from './Icons';

interface TaskBoardProps {
  tasks: Task[];
  onExecuteTask?: (taskId: string) => void;
}

const COLUMN_CONFIG = [
  { id: 'pending', title: 'To Do', color: 'border-slate-500' },
  { id: 'in-progress', title: 'In Progress', color: 'border-indigo-500' },
  { id: 'review', title: 'Review', color: 'border-amber-500' },
  { id: 'qa', title: 'QA', color: 'border-purple-500' },
  { id: 'completed', title: 'Done', color: 'border-emerald-500' }
];

const TaskBoard: React.FC<TaskBoardProps> = ({ tasks, onExecuteTask }) => {
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);

  const getTasksByStatus = (status: string) => {
    if (status === 'pending') return tasks.filter(t => t.status === 'pending' || t.status === 'failed');
    return tasks.filter(t => t.status === status);
  };

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedTaskId(id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, status: string) => {
    e.preventDefault();
    // In a real app, this would bubble up an event to update state in Plan.tsx
    console.log(`Dropped ${draggedTaskId} into ${status}`);
    setDraggedTaskId(null);
  };

  return (
      <div className="flex-1 overflow-x-auto overflow-y-hidden p-6 h-full bg-slate-900">
        <div className="flex h-full space-x-4 min-w-[1200px]">
          {COLUMN_CONFIG.map(col => {
             const colTasks = getTasksByStatus(col.id);
             return (
              <div 
                key={col.id} 
                className="flex-1 flex flex-col min-w-[280px] max-w-xs h-full"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, col.id)}
              >
                {/* Column Header */}
                <div className={`flex items-center justify-between mb-3 pb-2 border-t-2 ${col.color} pt-2`}>
                   <div className="flex items-center space-x-2">
                      <span className="font-medium text-slate-300 text-sm">{col.title}</span>
                      <span className="bg-slate-800 text-slate-500 text-xs px-2 py-0.5 rounded-full font-mono">{colTasks.length}</span>
                   </div>
                   <button className="text-slate-600 hover:text-slate-400">
                      <MoreHorizontalIcon size={16} />
                   </button>
                </div>

                {/* Drop Zone / List */}
                <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-3 pb-10">
                   {colTasks.length === 0 ? (
                      <div className="h-32 border-2 border-dashed border-slate-800 rounded-lg flex items-center justify-center text-slate-600 text-xs">
                        No tasks
                      </div>
                   ) : (
                     colTasks.map(task => (
                       <TaskCard 
                         key={task.id} 
                         task={task} 
                         onDragStart={(e) => handleDragStart(e, task.id)}
                         onExecute={() => onExecuteTask && onExecuteTask(task.id)}
                       />
                     ))
                   )}
                </div>
              </div>
             );
          })}
        </div>
      </div>
  );
};

const TaskCard: React.FC<{ task: Task; onDragStart: (e: React.DragEvent) => void; onExecute: () => void }> = ({ task, onDragStart, onExecute }) => (
  <div 
    draggable
    onDragStart={onDragStart}
    className="bg-slate-800 p-3 rounded-md border border-slate-700 shadow-sm hover:shadow-md hover:-translate-y-0.5 hover:border-slate-600 transition-all cursor-move group select-none relative"
  >
    {/* Action Overlay for Execution */}
    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
       <button 
         onClick={(e) => { e.stopPropagation(); onExecute(); }}
         className="p-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded shadow-md"
         title="Start Work"
       >
         <PlayIcon size={12} fill="currentColor" />
       </button>
    </div>

    {/* Top Row */}
    <div className="flex items-start justify-between mb-2">
       <div className="flex items-center space-x-2">
           <TaskTypeIcon type={task.type} />
           <span className="font-mono text-[10px] text-slate-500 group-hover:text-indigo-400 transition-colors">{task.id}</span>
       </div>
       <div className={`flex items-center ${
         task.priority === 'high' ? 'text-red-400' : 
         task.priority === 'medium' ? 'text-amber-400' : 'text-slate-500'
       }`}>
         <ArrowUpIcon size={12} className={task.priority === 'low' ? 'rotate-180' : ''} />
       </div>
    </div>

    {/* Title */}
    <h4 className="text-sm font-medium text-slate-200 leading-snug mb-3 line-clamp-3 group-hover:text-white transition-colors">
      {task.title}
    </h4>

    {/* Bottom Row */}
    <div className="flex items-center justify-between mt-auto">
       <div className="flex items-center space-x-2">
          {/* Mock Tags */}
          <span className="text-[10px] px-1.5 py-0.5 bg-slate-700 text-slate-400 rounded">Backend</span>
       </div>

       <div className="flex items-center space-x-2">
         {task.assignee ? (
           <div className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-[10px] font-bold border border-indigo-500/30" title={`Assigned to ${task.assignee}`}>
              {task.assignee.charAt(0)}
           </div>
         ) : (
           <div className="w-5 h-5 rounded-full border border-slate-600 border-dashed flex items-center justify-center text-slate-600">
              <UserIcon size={10} />
           </div>
         )}
         {task.points && (
             <div className="h-5 min-w-[20px] px-1 rounded bg-slate-700 flex items-center justify-center text-[10px] text-slate-400 font-mono">
                {task.points}
             </div>
         )}
       </div>
    </div>
  </div>
);

const TaskTypeIcon: React.FC<{ type: string }> = ({ type }) => {
    switch (type) {
        case 'epic': return <CrownIcon size={12} className="text-purple-400" />;
        case 'story': return <BookmarkIcon size={12} className="text-emerald-400" />;
        case 'bug': return <AlertCircleIcon size={12} className="text-red-400" />;
        default: return <CheckCircleIcon size={12} className="text-blue-400" />;
    }
}

export default TaskBoard;