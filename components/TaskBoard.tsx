import React, { useState } from 'react';
import { MOCK_TASKS } from '../constants';
import { Task } from '../types';
import Button from './Button';
import { 
  SearchIcon, 
  LayoutGridIcon, 
  ListIcon, 
  PlusIcon, 
  MoreHorizontalIcon,
  FilterIcon,
  UserIcon,
  ArrowUpIcon,
  ActivityIcon
} from './Icons';

const COLUMN_CONFIG = [
  { id: 'pending', title: 'To Do', color: 'border-slate-500' },
  { id: 'in-progress', title: 'In Progress', color: 'border-indigo-500' },
  { id: 'review', title: 'Review', color: 'border-amber-500' },
  { id: 'qa', title: 'QA', color: 'border-purple-500' },
  { id: 'completed', title: 'Done', color: 'border-emerald-500' }
];

const TaskBoard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
  const [searchQuery, setSearchQuery] = useState('');
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);

  // Filter Logic
  const filteredTasks = tasks.filter(t => 
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getTasksByStatus = (status: string) => {
    // Mapping internal status to column IDs if needed, currently they match roughly
    // MOCK_TASKS uses: pending, in-progress, completed, failed
    // Board needs: pending, in-progress, review, qa, completed
    // We'll treat 'failed' as 'pending' (backlog) for now or add logic
    if (status === 'pending') return filteredTasks.filter(t => t.status === 'pending' || t.status === 'failed');
    return filteredTasks.filter(t => t.status === status);
  };

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedTaskId(id);
    e.dataTransfer.effectAllowed = "move";
    // Optional: Set ghost image manually if needed
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, status: string) => {
    e.preventDefault();
    if (draggedTaskId) {
      setTasks(prev => prev.map(t => 
        t.id === draggedTaskId 
          ? { ...t, status: status as Task['status'] } // Type cast simplified for mock
          : t
      ));
      setDraggedTaskId(null);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 overflow-hidden">
      
      {/* Toolbar */}
      <div className="h-14 border-b border-slate-700 flex items-center justify-between px-6 bg-slate-900 shrink-0 z-10">
        {/* Left: Filters */}
        <div className="flex items-center space-x-4">
          <div className="relative">
             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                <SearchIcon size={14} />
             </div>
             <input 
               type="text" 
               placeholder="Filter tasks (e.g. tag:bug)..."
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="bg-slate-800 border border-slate-700 rounded-md py-1.5 pl-9 pr-3 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 w-64 transition-all"
             />
          </div>
          
          <div className="flex items-center space-x-2">
            <FilterPill label="My Tasks" active={false} />
            <FilterPill label="High Priority" active={false} />
            <FilterPill label="Unassigned" active={false} />
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center space-x-3">
          <div className="bg-slate-800 rounded p-0.5 flex border border-slate-700">
             <button className="p-1.5 rounded bg-slate-700 text-slate-200 shadow-sm"><LayoutGridIcon size={14} /></button>
             <button className="p-1.5 rounded text-slate-500 hover:text-slate-300"><ListIcon size={14} /></button>
             <button className="p-1.5 rounded text-slate-500 hover:text-slate-300"><ActivityIcon size={14} /></button>
          </div>
          <Button variant="primary" size="sm" icon={<PlusIcon size={14} />}>New Task</Button>
        </div>
      </div>

      {/* Board Canvas */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden p-6">
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
                       />
                     ))
                   )}
                </div>
              </div>
             );
          })}
        </div>
      </div>
    </div>
  );
};

const FilterPill: React.FC<{ label: string; active: boolean }> = ({ label, active }) => (
  <button className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
    active 
      ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' 
      : 'bg-slate-800 text-slate-400 border-slate-700 hover:border-slate-600 hover:text-slate-300'
  }`}>
    {label}
  </button>
);

const TaskCard: React.FC<{ task: Task; onDragStart: (e: React.DragEvent) => void }> = ({ task, onDragStart }) => (
  <div 
    draggable
    onDragStart={onDragStart}
    className="bg-slate-800 p-3 rounded-md border border-slate-700 shadow-sm hover:shadow-md hover:-translate-y-0.5 hover:border-slate-600 transition-all cursor-move group select-none"
  >
    {/* Top Row */}
    <div className="flex items-start justify-between mb-2">
       <span className="font-mono text-[10px] text-slate-500 group-hover:text-indigo-400 transition-colors">{task.id}</span>
       <div className={`flex items-center ${
         task.priority === 'high' ? 'text-red-400' : 
         task.priority === 'medium' ? 'text-amber-400' : 'text-slate-500'
       }`}>
         <ArrowUpIcon size={12} className={task.priority === 'low' ? 'rotate-180' : ''} />
       </div>
    </div>

    {/* Title */}
    <h4 className="text-sm font-medium text-slate-200 leading-snug mb-3 line-clamp-3">
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
         <div className="w-5 h-5 rounded-full bg-slate-700 flex items-center justify-center text-[10px] text-slate-400 font-mono">
            3
         </div>
       </div>
    </div>
  </div>
);

export default TaskBoard;