import React, { useState } from 'react';
import TaskBoard from './TaskBoard';
import BacklogList from './BacklogList';
import DependencyGraph from './DependencyGraph';
import RoadmapView from './RoadmapView';
import Button from './Button';
import { Task, PlanViewType } from '../types';
import { MOCK_TASKS } from '../constants';
import { 
  SearchIcon, 
  LayoutGridIcon, 
  ListIcon, 
  PlusIcon, 
  ActivityIcon,
  TrashIcon,
  Edit2Icon,
  UserIcon,
  CalendarIcon
} from './Icons';

interface PlanProps {
  onCreateTask?: () => void;
}

const Plan: React.FC<PlanProps> = ({ onCreateTask }) => {
  const [view, setView] = useState<PlanViewType>('list');
  const [tasks] = useState<Task[]>(MOCK_TASKS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTaskIds, setSelectedTaskIds] = useState<Set<string>>(new Set());

  // Handle Selection from children
  const handleSelectionChange = (ids: Set<string>) => {
    setSelectedTaskIds(ids);
  };

  const selectedCount = selectedTaskIds.size;
  const isSelectionMode = selectedCount > 0;

  // Filter Logic shared for both views
  const filteredTasks = tasks.filter(t => 
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-slate-900 overflow-hidden">
      
      {/* Toolbar - Transforms based on selection */}
      <div 
        className={`h-14 border-b flex items-center justify-between px-6 shrink-0 z-10 transition-colors duration-300 ${
          isSelectionMode 
            ? 'bg-indigo-900 border-indigo-800' 
            : 'bg-slate-900 border-slate-700'
        }`}
      >
        
        {/* Left: Actions or Filters */}
        <div className="flex items-center space-x-4">
          {isSelectionMode ? (
             <div className="flex items-center text-white font-medium animate-in fade-in slide-in-from-left-2">
                <span className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center text-xs font-bold mr-3">
                   {selectedCount}
                </span>
                <span>items selected</span>
                <div className="h-4 w-px bg-indigo-700 mx-4" />
                <button 
                  onClick={() => setSelectedTaskIds(new Set())}
                  className="text-indigo-300 hover:text-white text-sm transition-colors"
                >
                  Deselect
                </button>
             </div>
          ) : (
            <>
              <div className="relative">
                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <SearchIcon size={14} />
                 </div>
                 <input 
                   type="text" 
                   placeholder="Filter tasks..."
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                   className="bg-slate-800 border border-slate-700 rounded-md py-1.5 pl-9 pr-3 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 w-64 transition-all"
                 />
              </div>
              
              <div className="flex items-center space-x-2 hidden md:flex">
                <FilterPill label="My Tasks" active={false} />
                <FilterPill label="High Priority" active={false} />
              </div>
            </>
          )}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center space-x-3">
          {isSelectionMode ? (
             <div className="flex items-center space-x-2 animate-in fade-in slide-in-from-right-2">
                 <Button variant="secondary" size="sm" className="border-indigo-700 bg-indigo-800 text-indigo-100 hover:bg-indigo-700" icon={<Edit2Icon size={14} />}>
                   Edit
                 </Button>
                 <Button variant="secondary" size="sm" className="border-indigo-700 bg-indigo-800 text-indigo-100 hover:bg-indigo-700" icon={<UserIcon size={14} />}>
                   Assign
                 </Button>
                 <Button variant="destructive" size="sm" className="bg-indigo-800 border-indigo-700 hover:bg-red-600 hover:border-red-600" icon={<TrashIcon size={14} />}>
                   Delete
                 </Button>
             </div>
          ) : (
             <>
               <div className="bg-slate-800 rounded p-0.5 flex border border-slate-700">
                   <button 
                     onClick={() => setView('board')}
                     className={`p-1.5 rounded transition-colors ${
                       view === 'board' ? 'bg-slate-700 text-slate-200 shadow-sm' : 'text-slate-500 hover:text-slate-300'
                     }`}
                     title="Board View"
                   >
                     <LayoutGridIcon size={14} />
                   </button>
                   <button 
                     onClick={() => setView('list')}
                     className={`p-1.5 rounded transition-colors ${
                       view === 'list' ? 'bg-slate-700 text-slate-200 shadow-sm' : 'text-slate-500 hover:text-slate-300'
                     }`}
                     title="List View"
                   >
                     <ListIcon size={14} />
                   </button>
                   <button 
                     onClick={() => setView('graph')}
                     className={`p-1.5 rounded transition-colors ${
                       view === 'graph' ? 'bg-slate-700 text-slate-200 shadow-sm' : 'text-slate-500 hover:text-slate-300'
                     }`}
                     title="Graph View"
                   >
                     <ActivityIcon size={14} />
                   </button>
                   <button 
                     onClick={() => setView('roadmap')}
                     className={`p-1.5 rounded transition-colors ${
                       view === 'roadmap' ? 'bg-slate-700 text-slate-200 shadow-sm' : 'text-slate-500 hover:text-slate-300'
                     }`}
                     title="Roadmap View"
                   >
                     <CalendarIcon size={14} />
                   </button>
               </div>
               <Button 
                 variant="primary" 
                 size="sm" 
                 icon={<PlusIcon size={14} />}
                 onClick={onCreateTask}
               >
                 New Item
               </Button>
             </>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden relative">
         {view === 'board' ? (
           <TaskBoard tasks={filteredTasks} />
         ) : view === 'graph' ? (
           <DependencyGraph tasks={tasks} /> 
         ) : view === 'roadmap' ? (
            <RoadmapView tasks={filteredTasks} />
         ) : (
           <BacklogList 
              tasks={filteredTasks} 
              selectedIds={selectedTaskIds}
              onSelectionChange={handleSelectionChange}
           />
         )}
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

export default Plan;