
import React, { useState, useRef, useMemo, useEffect } from 'react';
import { Task } from '../types';
import { 
  PlusIcon, 
  CalendarIcon, 
  FlagIcon, 
  ChevronRightIcon, 
  ChevronDownIcon,
  ZapIcon
} from './Icons';
import Button from './Button';

interface RoadmapViewProps {
  tasks: Task[];
  onTaskClick?: (taskId: string) => void;
}

const CELL_WIDTH = 40; // px per day
const ROW_HEIGHT = 48; // px

const RoadmapView: React.FC<RoadmapViewProps> = ({ tasks, onTaskClick }) => {
  const [timeScale, setTimeScale] = useState<'day' | 'week' | 'month'>('week');
  const [showProjections, setShowProjections] = useState(false);
  const leftPaneRef = useRef<HTMLDivElement>(null);
  const rightPaneRef = useRef<HTMLDivElement>(null);

  // --- Constants & Config ---
  // Using a fixed "Today" for demo consistency
  const TODAY = new Date();
  
  // Filter only Epics and items with dates
  const roadmapItems = useMemo(() => {
    return tasks.filter(t => t.type === 'epic' || (t.startDate && t.dueDate));
  }, [tasks]);

  // Determine Timeline Bounds
  const { minDate, maxDate, totalDays } = useMemo(() => {
    let min = new Date(TODAY);
    min.setDate(min.getDate() - 30); // Buffer before
    let max = new Date(TODAY);
    max.setDate(max.getDate() + 90); // Buffer after

    roadmapItems.forEach(t => {
      if (t.startDate) {
        const d = new Date(t.startDate);
        if (d < min) min = new Date(d);
      }
      if (t.dueDate) {
        const d = new Date(t.dueDate);
        if (d > max) max = new Date(d);
      }
      if (showProjections && t.projectedEnd) {
        const d = new Date(t.projectedEnd);
        if (d > max) max = new Date(d);
      }
    });

    // Add some padding
    min.setDate(min.getDate() - 7);
    max.setDate(max.getDate() + 14);

    const diffTime = Math.abs(max.getTime() - min.getTime());
    const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return { minDate: min, maxDate: max, totalDays };
  }, [roadmapItems, showProjections, TODAY]);

  // --- Helpers ---
  const getXForDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const diffTime = d.getTime() - minDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays * CELL_WIDTH;
  };

  const getWidthForDuration = (start: string, end: string) => {
    const d1 = new Date(start);
    const d2 = new Date(end);
    const diffTime = Math.abs(d2.getTime() - d1.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(diffDays * CELL_WIDTH, CELL_WIDTH); // Min 1 cell
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    // Sync Vertical Scrolling
    if (leftPaneRef.current && rightPaneRef.current) {
        if (e.currentTarget === leftPaneRef.current) {
            rightPaneRef.current.scrollTop = leftPaneRef.current.scrollTop;
        } else {
            leftPaneRef.current.scrollTop = rightPaneRef.current.scrollTop;
        }
    }
  };

  // Scroll to "Today" on mount
  useEffect(() => {
    if (rightPaneRef.current) {
      const todayX = getXForDate(TODAY.toISOString().split('T')[0]);
      rightPaneRef.current.scrollLeft = todayX - 300; // Center a bit
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col h-full bg-slate-900 border-t border-slate-800">
      
      {/* Roadmap Toolbar */}
      <div className="h-14 bg-slate-800/50 border-b border-slate-700 flex items-center justify-between px-6 shrink-0">
         <div className="flex items-center space-x-4">
            {/* Time Scale Switcher */}
            <div className="flex bg-slate-900 rounded p-0.5 border border-slate-700">
                {(['day', 'week', 'month'] as const).map((s) => (
                    <button 
                        key={s}
                        onClick={() => setTimeScale(s)}
                        className={`px-3 py-1 text-xs font-medium rounded transition-colors capitalize ${
                            timeScale === s ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
                        }`}
                    >
                        {s}
                    </button>
                ))}
            </div>

            <button 
                onClick={() => {
                    if (rightPaneRef.current) {
                        const todayX = getXForDate(TODAY.toISOString().split('T')[0]);
                        rightPaneRef.current.scrollTo({ left: todayX - 300, behavior: 'smooth' });
                    }
                }}
                className="text-xs font-medium text-slate-400 hover:text-white px-3 py-1.5 rounded border border-slate-700 hover:bg-slate-700 transition-colors"
            >
                Jump to Today
            </button>
         </div>

         <div className="flex items-center space-x-4">
            <div 
                onClick={() => setShowProjections(!showProjections)}
                className={`flex items-center px-3 py-1.5 rounded border cursor-pointer select-none transition-colors ${
                    showProjections 
                    ? 'bg-indigo-500/10 border-indigo-500 text-indigo-300' 
                    : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-600'
                }`}
            >
                <ZapIcon size={12} className={`mr-2 ${showProjections ? 'text-indigo-400' : 'text-slate-500'}`} />
                <span className="text-xs font-medium">AI Projections</span>
            </div>

            <Button variant="primary" size="sm" icon={<PlusIcon size={14} />}>Add Epic</Button>
         </div>
      </div>

      {/* Split Pane View */}
      <div className="flex-1 flex overflow-hidden">
         
         {/* LEFT PANE: List */}
         <div 
            ref={leftPaneRef}
            onScroll={handleScroll}
            className="w-[280px] flex flex-col border-r border-slate-700 bg-slate-800/30 overflow-y-auto overflow-x-hidden custom-scrollbar shrink-0"
         >
            {/* Header */}
            <div className="h-10 border-b border-slate-700 px-4 flex items-center text-xs font-bold text-slate-500 uppercase sticky top-0 bg-slate-900 z-10">
                Epics
            </div>
            
            {/* Rows */}
            <div className="flex-1">
                {roadmapItems.map(task => (
                    <div 
                        key={task.id} 
                        onClick={() => onTaskClick && onTaskClick(task.id)}
                        className="flex items-center px-4 border-b border-slate-800 hover:bg-slate-700/30 transition-colors group cursor-pointer"
                        style={{ height: ROW_HEIGHT }}
                    >
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mr-3" />
                        <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-slate-200 truncate">{task.title}</div>
                            <div className="flex items-center text-[10px] text-slate-500 mt-0.5">
                                <span className="font-mono mr-2">{task.id}</span>
                                {task.progress !== undefined && (
                                    <span className={task.progress === 100 ? 'text-emerald-400' : 'text-indigo-400'}>{task.progress}%</span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
         </div>

         {/* RIGHT PANE: Timeline */}
         <div 
            ref={rightPaneRef}
            onScroll={handleScroll}
            className="flex-1 flex flex-col overflow-auto custom-scrollbar relative bg-[#0f172a]"
         >
            <div style={{ width: totalDays * CELL_WIDTH, minWidth: '100%' }}>
                
                {/* Timeline Header */}
                <div className="h-10 border-b border-slate-700 sticky top-0 bg-slate-900 z-20 flex text-xs text-slate-500 font-mono select-none">
                    {Array.from({ length: totalDays }).map((_, i) => {
                        const d = new Date(minDate);
                        d.setDate(d.getDate() + i);
                        const isStartOfMonth = d.getDate() === 1;
                        const isWeekend = d.getDay() === 0 || d.getDay() === 6;
                        const isToday = d.toDateString() === TODAY.toDateString();

                        return (
                            <div 
                                key={i} 
                                style={{ width: CELL_WIDTH }} 
                                className={`shrink-0 border-r border-slate-800/50 flex flex-col justify-end pb-1 items-center relative ${
                                    isWeekend ? 'bg-slate-800/20' : ''
                                }`}
                            >
                                {isStartOfMonth && (
                                    <span className="absolute top-1 left-1 font-bold text-slate-300 whitespace-nowrap z-10">
                                        {d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                    </span>
                                )}
                                {isToday && (
                                    <div className="absolute inset-x-0 bottom-0 top-6 bg-red-500/5 border-x border-red-500/20 pointer-events-none" />
                                )}
                                <span className={isToday ? 'text-red-400 font-bold' : ''}>{d.getDate()}</span>
                            </div>
                        );
                    })}
                </div>

                {/* Timeline Grid Body */}
                <div className="relative">
                    {/* Background Grid Lines */}
                    <div className="absolute inset-0 flex pointer-events-none">
                        {Array.from({ length: totalDays }).map((_, i) => {
                             const d = new Date(minDate);
                             d.setDate(d.getDate() + i);
                             const isWeekend = d.getDay() === 0 || d.getDay() === 6;
                             const isToday = d.toDateString() === TODAY.toDateString();
                             return (
                                <div 
                                    key={i} 
                                    style={{ width: CELL_WIDTH }} 
                                    className={`shrink-0 border-r border-slate-800/30 h-full ${
                                        isWeekend ? 'bg-slate-800/10' : ''
                                    } ${isToday ? 'border-r-red-500/30' : ''}`} 
                                >
                                    {isToday && <div className="h-full w-px bg-red-500/50 absolute left-1/2" />}
                                </div>
                             )
                        })}
                    </div>

                    {/* Bars */}
                    {roadmapItems.map((task, idx) => {
                        if (!task.startDate || !task.dueDate) return <div key={task.id} style={{ height: ROW_HEIGHT }} />;
                        
                        const x = getXForDate(task.startDate);
                        const width = getWidthForDuration(task.startDate, task.dueDate);
                        
                        // AI Projection
                        const projWidth = task.projectedEnd 
                             ? getWidthForDuration(task.startDate, task.projectedEnd) 
                             : width;
                        
                        return (
                            <div 
                                key={task.id} 
                                style={{ height: ROW_HEIGHT }} 
                                className="relative border-b border-slate-800/30 flex items-center group"
                            >
                                {/* Ghost Bar (Projection) */}
                                {showProjections && task.projectedEnd && (
                                    <div 
                                        className="absolute h-5 top-1/2 -translate-y-1/2 rounded bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjMWUyOTNiIi8+CjxwYXRoIGQ9Ik0wIDRMNCAwIiBzdHJva2U9IiM2MzY2ZjEiIHN0cm9rZS13aWR0aD0iMSIvPgo8L3N2Zz4=')] opacity-50 border border-indigo-500/30"
                                        style={{ left: x, width: projWidth }}
                                        title={`Projected End: ${task.projectedEnd}`}
                                    />
                                )}

                                {/* Main Bar */}
                                <div 
                                    onClick={() => onTaskClick && onTaskClick(task.id)}
                                    className={`absolute h-6 top-1/2 -translate-y-1/2 rounded shadow-sm flex items-center overflow-hidden transition-all hover:brightness-110 cursor-pointer ${
                                        task.progress === 100 ? 'bg-emerald-600' : 'bg-indigo-600'
                                    }`}
                                    style={{ left: x, width: width }}
                                >
                                    {/* Progress Fill (Darker shade overlay) */}
                                    <div 
                                        className="h-full bg-black/20 absolute left-0 top-0" 
                                        style={{ width: `${task.progress || 0}%` }}
                                    />
                                    
                                    {/* Label inside bar if wide enough */}
                                    {width > 100 && (
                                        <span className="relative z-10 text-[10px] font-medium text-white px-2 truncate drop-shadow-md">
                                            {task.title}
                                        </span>
                                    )}

                                    {/* Tooltip on Hover */}
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-50 whitespace-nowrap">
                                        <div className="bg-slate-800 text-slate-200 text-xs rounded shadow-xl border border-slate-700 p-2">
                                            <div className="font-bold mb-1">{task.title}</div>
                                            <div className="text-slate-400 font-mono text-[10px]">
                                                {task.startDate} → {task.dueDate}
                                            </div>
                                            <div className="mt-1 flex items-center">
                                                <div className="flex-1 h-1 bg-slate-700 rounded-full overflow-hidden mr-2 w-16">
                                                    <div className="h-full bg-indigo-500" style={{ width: `${task.progress || 0}%` }} />
                                                </div>
                                                <span>{task.progress}%</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Milestone Flag for Epics */}
                                {task.type === 'epic' && (
                                    <div 
                                        className="absolute top-1/2 -translate-y-1/2 -ml-1.5 text-emerald-500 z-10 filter drop-shadow-lg"
                                        style={{ left: x + width }}
                                    >
                                        <FlagIcon size={12} fill="currentColor" />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default RoadmapView;
