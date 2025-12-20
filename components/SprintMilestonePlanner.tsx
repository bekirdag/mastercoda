
import React, { useState, useMemo, useEffect } from 'react';
import { Task, Milestone, Sprint } from '../types';
import { MOCK_TASKS, MOCK_MILESTONES, MOCK_SPRINTS } from '../constants';
import Button from './Button';
import Badge from './Badge';
import { 
  CalendarIcon, 
  FlagIcon, 
  PlusIcon, 
  SparklesIcon, 
  ZapIcon, 
  AlertTriangleIcon, 
  CheckCircleIcon, 
  ChevronRightIcon, 
  ChevronDownIcon, 
  SearchIcon, 
  FilterIcon, 
  HistoryIcon, 
  ArrowRightIcon, 
  LockIcon,
  ActivityIcon,
  RotateCwIcon,
  /* Fix: Added missing ShieldIcon import */
  ShieldIcon
} from './Icons';
import { GoogleGenAI } from "@google/genai";

const SprintMilestonePlanner: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
  const [milestones, setMilestones] = useState<Milestone[]>(MOCK_MILESTONES);
  const [sprints, setSprints] = useState<Sprint[]>(MOCK_SPRINTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSmartFilling, setIsSmartFilling] = useState(false);
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [hoveredSprintId, setHoveredSprintId] = useState<string | null>(null);

  // Derived Data
  const unassignedTasks = useMemo(() => {
    return tasks.filter(t => !t.sprintId && t.status !== 'completed' && t.title.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [tasks, searchQuery]);

  const handleDragStart = (id: string) => setDraggedTaskId(id);

  const handleDrop = (sprintId: string | null) => {
    if (!draggedTaskId) return;
    setTasks(prev => prev.map(t => t.id === draggedTaskId ? { ...t, sprintId } : t));
    setDraggedTaskId(null);
    setHoveredSprintId(null);
  };

  const handleSmartFill = async () => {
    setIsSmartFilling(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      // In a real app, we'd send the actual backlog and capacity to the model
      const prompt = `Organize the following unassigned tasks into the available future sprints based on priority and effort: ${JSON.stringify(unassignedTasks.slice(0, 10))}. Available Sprints: ${JSON.stringify(sprints.filter(s => s.status !== 'completed'))}. 
      Ensure dependencies are respected. Return a JSON object mapping task IDs to sprint IDs.`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: { responseMimeType: "application/json" }
      });

      const mappings = JSON.parse(response.text || '{}');
      
      // Simulate Tetris stacking animation delay
      await new Promise(r => setTimeout(r, 1500));

      setTasks(prev => prev.map(t => {
        if (mappings[t.id]) return { ...t, sprintId: mappings[t.id] };
        return t;
      }));
    } catch (e) {
      console.error("Smart fill failed", e);
    } finally {
      setIsSmartFilling(false);
    }
  };

  const calculateSprintLoad = (sprintId: string) => {
    const sprintTasks = tasks.filter(t => t.sprintId === sprintId);
    const used = sprintTasks.reduce((acc, t) => acc + (t.points || 0), 0);
    const sprint = sprints.find(s => s.id === sprintId);
    const capacity = sprint?.capacity || 40;
    return { used, capacity, percent: (used / capacity) * 100 };
  };

  return (
    <div className="flex flex-col h-full bg-[#020617] text-slate-200 overflow-hidden font-sans">
      
      {/* 1. Milestone Stepper Ribbon */}
      <nav className="h-[64px] border-b border-slate-800 bg-slate-900/50 backdrop-blur shrink-0 flex items-center px-8 z-30 gap-8 overflow-x-auto custom-scrollbar no-scrollbar">
         <div className="flex items-center shrink-0">
            <FlagIcon size={20} className="text-indigo-400 mr-3" />
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Milestone Roadmap</span>
         </div>
         <div className="flex items-center space-x-12">
            {milestones.map((m, idx) => (
               <div key={m.id} className="flex items-center group cursor-pointer">
                  <div className={`flex flex-col items-center relative ${m.status === 'active' ? 'opacity-100' : 'opacity-40 hover:opacity-100 transition-opacity'}`}>
                     <div className={`w-3 h-3 rounded-full border-2 mb-1 ${m.status === 'active' ? 'bg-indigo-500 border-indigo-400 shadow-[0_0_10px_#6366f1]' : 'border-slate-700'}`} />
                     <span className="text-[11px] font-bold text-white uppercase whitespace-nowrap">{m.title}</span>
                     <span className="text-[9px] font-mono text-slate-500">{m.targetDate}</span>
                  </div>
                  {idx < milestones.length - 1 && (
                     <div className="mx-6 h-px w-12 bg-slate-800" />
                  )}
               </div>
            ))}
            <button className="flex items-center text-slate-600 hover:text-white transition-colors">
               <PlusIcon size={14} className="mr-1" />
               <span className="text-[10px] font-bold uppercase">Add Version</span>
            </button>
         </div>
      </header>

      {/* 2. Content Workspace */}
      <div className="flex-1 flex overflow-hidden">
         
         {/* LEFT PANE: Unassigned Backlog */}
         <aside className="w-[350px] border-r border-slate-800 bg-slate-900/30 flex flex-col shrink-0">
            <div className="p-4 border-b border-slate-800 bg-slate-900/50 flex flex-col space-y-4">
               <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center">
                     <ListTreeIconProxy size={14} className="mr-2" />
                     Task Reservoir
                  </span>
                  <Badge variant="neutral">{unassignedTasks.length}</Badge>
               </div>
               <div className="relative">
                  <SearchIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" />
                  <input 
                    type="text" 
                    placeholder="Search backlog..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-300 focus:border-indigo-500 outline-none transition-all"
                  />
               </div>
            </div>

            <div 
              className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-3"
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(null)}
            >
               {unassignedTasks.map(task => (
                  <DraggableTask key={task.id} task={task} onDragStart={() => handleDragStart(task.id)} />
               ))}
               {unassignedTasks.length === 0 && (
                  <div className="py-20 text-center opacity-20">
                     <CheckCircleIcon size={48} className="mx-auto mb-4" />
                     <p className="text-xs uppercase font-bold tracking-widest">Backlog Depleted</p>
                  </div>
               )}
            </div>

            <div className="p-4 border-t border-slate-800 bg-slate-900/50">
               <Button 
                  variant="primary" 
                  className="w-full h-10 shadow-lg shadow-indigo-900/20 group"
                  onClick={handleSmartFill}
                  disabled={isSmartFilling || unassignedTasks.length === 0}
               >
                  {isSmartFilling ? (
                    <><RotateCwIcon size={14} className="animate-spin mr-2" /> REASONING...</>
                  ) : (
                    <><SparklesIcon size={14} className="mr-2 group-hover:animate-pulse" /> AI Smart Fill</>
                  )}
               </Button>
            </div>
         </aside>

         {/* RIGHT PANE: Sprints / Timeline */}
         <main className="flex-1 flex flex-col bg-[#020617] overflow-hidden">
            <header className="h-10 border-b border-slate-800 bg-slate-950 flex items-center px-6 justify-between shrink-0">
               <div className="flex items-center space-x-6 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  <div className="flex items-center"><CalendarIcon size={12} className="mr-2 text-indigo-400" /> Iteration Timeline</div>
                  <div className="flex items-center"><ActivityIcon size={12} className="mr-2 text-emerald-400" /> Velocity: 42pts / Sprint</div>
               </div>
               <div className="flex items-center space-x-4">
                  <button className="text-[10px] font-bold text-slate-500 hover:text-white transition-all uppercase tracking-tighter">View Gantt Table</button>
               </div>
            </header>

            <div className="flex-1 overflow-x-auto overflow-y-hidden custom-scrollbar bg-[#0d1117]/30 flex p-6 gap-6">
               {sprints.map(sprint => {
                  const load = calculateSprintLoad(sprint.id);
                  const isOver = load.used > load.capacity;
                  const sprintTasks = tasks.filter(t => t.sprintId === sprint.id);

                  return (
                    <div 
                      key={sprint.id}
                      onDragOver={(e) => { e.preventDefault(); setHoveredSprintId(sprint.id); }}
                      onDragLeave={() => setHoveredSprintId(null)}
                      onDrop={() => handleDrop(sprint.id)}
                      className={`w-[320px] flex flex-col h-full bg-slate-900/40 border-2 rounded-3xl transition-all duration-300 overflow-hidden shrink-0 ${
                         hoveredSprintId === sprint.id ? 'border-indigo-500 bg-indigo-900/5 ring-1 ring-indigo-500/20 scale-[1.02]' : 'border-slate-800'
                      }`}
                    >
                       <div className="p-5 border-b border-slate-800 bg-slate-900/50">
                          <div className="flex items-start justify-between mb-4">
                             <div>
                                <h3 className="text-sm font-bold text-white uppercase tracking-widest">{sprint.title}</h3>
                                <p className="text-[10px] font-mono text-slate-500 mt-1">{sprint.startDate} - {sprint.endDate}</p>
                             </div>
                             <Badge variant={sprint.status === 'active' ? 'success' : sprint.status === 'completed' ? 'neutral' : 'info'}>
                                {sprint.status.toUpperCase()}
                             </Badge>
                          </div>

                          <div className="space-y-2">
                             <div className="flex items-center justify-between text-[9px] font-bold uppercase">
                                <span className={isOver ? 'text-red-400' : 'text-slate-500'}>Load: {load.used} / {load.capacity} pts</span>
                                <span className={isOver ? 'text-red-400' : 'text-indigo-400'}>{Math.round(load.percent)}%</span>
                             </div>
                             <div className="h-1.5 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-700">
                                <div 
                                  className={`h-full transition-all duration-700 ${isOver ? 'bg-red-500 animate-pulse shadow-[0_0_10px_#ef4444]' : 'bg-indigo-500 shadow-[0_0_10px_#6366f1]'}`} 
                                  style={{ width: `${Math.min(100, load.percent)}%` }} 
                                />
                             </div>
                             {isOver && (
                                <div className="pt-2 flex items-center text-[9px] text-red-400 font-bold uppercase animate-in slide-in-from-top-1">
                                   <AlertTriangleIcon size={12} className="mr-1.5" /> OVER CAPACITY
                                </div>
                             )}
                          </div>
                       </div>

                       <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-3">
                          {sprintTasks.map(task => (
                             <DraggableTask key={task.id} task={task} onDragStart={() => handleDragStart(task.id)} minimal />
                          ))}
                          {sprintTasks.length === 0 && (
                             <div className="h-full flex items-center justify-center text-slate-700 italic text-[10px] uppercase tracking-widest text-center px-8">
                                Drag tasks here or use Smart Fill
                             </div>
                          )}
                       </div>
                       
                       <div className="p-3 bg-slate-900/80 border-t border-slate-800 flex items-center justify-between">
                          <button className="p-1 text-slate-600 hover:text-white transition-colors"><RotateCwIcon size={14}/></button>
                          <button className="text-[9px] font-bold text-indigo-400 hover:text-indigo-300 uppercase tracking-widest">Go to active sprint &rsaquo;</button>
                       </div>
                    </div>
                  );
               })}
               
               <button className="w-12 h-full flex flex-col items-center justify-center border-2 border-dashed border-slate-800 rounded-3xl hover:bg-slate-800/30 transition-all group shrink-0">
                  <PlusIcon size={24} className="text-slate-700 group-hover:text-indigo-400 transition-colors" />
                  <div className="vertical-text text-[10px] font-bold text-slate-700 group-hover:text-slate-400 uppercase tracking-widest mt-6">Create Sprint</div>
               </button>
            </div>
         </main>

      </div>

      {/* Global Status Bar */}
      <footer className="h-10 bg-slate-900 border-t border-slate-800 shrink-0 px-8 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-slate-500 z-40 relative">
         <div className="flex items-center space-x-12">
            <div className="flex items-center">
               <RotateCwIcon size={12} className="mr-2 text-indigo-400" />
               PLANNING_STATE: <span className="ml-2 text-indigo-300">STABLE</span>
            </div>
            <div className="flex items-center">
               <ShieldIcon size={12} className="mr-2 text-indigo-400" />
               CONSTRAINTS: <span className="ml-2 text-emerald-500 uppercase">Enforced</span>
            </div>
         </div>
         <div className="flex items-center space-x-4">
            <span className="text-slate-700 font-mono">NODE_HASH: SCHED_V42</span>
            <div className="h-3 w-px bg-slate-800" />
            <div className="flex items-center text-indigo-400">
               <LockIcon size={12} className="mr-2" />
               AUTO_SAVE: ON
            </div>
         </div>
      </footer>

      {/* Dependency Visual Overlay (Pseudo-implementation) */}
      <div className="pointer-events-none fixed inset-0 z-50">
         {/* In a real implementation, we would render SVG paths between dependent tasks here */}
      </div>

    </div>
  );
};

// Sub-components

const DraggableTask: React.FC<{ task: Task; onDragStart: () => void; minimal?: boolean }> = ({ task, onDragStart, minimal }) => (
   <div 
      draggable
      onDragStart={onDragStart}
      className={`p-3 rounded-2xl border bg-slate-800/80 border-slate-700 transition-all cursor-grab active:cursor-grabbing group hover:border-indigo-500 shadow-sm hover:shadow-[0_0_15px_rgba(99,102,241,0.15)] ${task.priority === 'high' ? 'border-l-4 border-l-red-500' : ''}`}
   >
      <div className="flex items-center justify-between mb-2">
         <span className="text-[9px] font-mono font-bold text-slate-500 group-hover:text-indigo-400 transition-colors">{task.id}</span>
         <div className="flex items-center space-x-2">
            {task.type === 'bug' && <AlertTriangleIcon size={10} className="text-red-400" />}
            <span className="text-[10px] font-mono font-bold text-indigo-300">{task.points || '?'}</span>
         </div>
      </div>
      <h4 className="text-xs font-bold text-slate-200 leading-snug line-clamp-2">{task.title}</h4>
      {!minimal && (
         <div className="mt-3 pt-3 border-t border-slate-700/50 flex items-center justify-between">
            <div className="flex -space-x-1">
               <div className="w-4 h-4 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-[7px] text-slate-500">
                  {task.assignee ? task.assignee[0] : '?'}
               </div>
            </div>
            <div className="text-[8px] font-bold text-slate-600 uppercase tracking-widest">
               {task.status.replace('-', ' ')}
            </div>
         </div>
      )}
   </div>
);

const ListTreeIconProxy: React.FC<any> = (props) => (
   <svg
     xmlns="http://www.w3.org/2000/svg"
     width={props.size || 20}
     height={props.size || 20}
     viewBox="0 0 24 24"
     fill="none"
     stroke="currentColor"
     strokeWidth="2"
     strokeLinecap="round"
     strokeLinejoin="round"
     {...props}
   >
     <path d="M21 12h-8" />
     <path d="M21 6h-8" />
     <path d="M21 18h-8" />
     <path d="M3 6v4c0 1.1.9 2 2 2h3" />
     <path d="M3 10v6c0 1.1.9 2 2 2h3" />
   </svg>
 );

export default SprintMilestonePlanner;
