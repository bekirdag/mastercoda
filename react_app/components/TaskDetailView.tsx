
import React, { useState, useEffect, useRef } from 'react';
import { Task, TaskType } from '../types';
import { MOCK_TASKS } from '../constants';
import Button from './Button';
import Badge from './Badge';
import { 
  XIcon, 
  CrownIcon, 
  BookmarkIcon, 
  CheckCircleIcon, 
  AlertCircleIcon, 
  SparklesIcon,
  ChevronDownIcon,
  UserIcon,
  ArrowUpIcon,
  CalendarIcon,
  TagIcon,
  ClipboardIcon,
  MoreVerticalIcon,
  MaximizeIcon,
  MinimizeIcon,
  PlayIcon,
  ClockIcon,
  FileTextIcon,
  GitCommitIcon,
  MessageSquareIcon,
  ActivityIcon
} from './Icons';

interface TaskDetailViewProps {
  taskId: string | null;
  onClose: () => void;
  onExecute: (id: string) => void;
}

type Tab = 'comments' | 'history' | 'git';

const TaskDetailView: React.FC<TaskDetailViewProps> = ({ taskId, onClose, onExecute }) => {
  const [task, setTask] = useState<Task | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('comments');
  const [isMaximized, setIsMaximized] = useState(false);
  const [isAiRefining, setIsAiRefining] = useState(false);
  const [commentText, setCommentText] = useState('');

  useEffect(() => {
    if (taskId) {
      const found = MOCK_TASKS.find(t => t.id === taskId);
      setTask(found || null);
    } else {
      setTask(null);
    }
  }, [taskId]);

  if (!taskId) return null;

  const handleAiRefine = async () => {
    setIsAiRefining(true);
    await new Promise(r => setTimeout(r, 1500));
    if (task) {
       setTask({
         ...task,
         description: `${task.description}\n\n### AI Refined Requirements\n1. Ensure compliance with RBAC v2 standards.\n2. Add logging for failed validation attempts.`
       });
    }
    setIsAiRefining(false);
  };

  const copyBranchName = () => {
    if (!task) return;
    const branch = `feature/${task.id.toLowerCase()}-${task.title.toLowerCase().replace(/\s+/g, '-')}`;
    navigator.clipboard.writeText(branch);
    // In a real app: show toast
    alert(`Copied: ${branch}`);
  };

  const completedAC = task?.acceptanceCriteria?.filter(ac => ac.checked).length || 0;
  const totalAC = task?.acceptanceCriteria?.length || 0;
  const acProgress = totalAC > 0 ? (completedAC / totalAC) * 100 : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end font-sans pointer-events-none" role="dialog" aria-modal="true">
       {/* Backdrop */}
       <div 
         className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm animate-in fade-in duration-300 pointer-events-auto"
         onClick={onClose}
       />

       {/* Panel */}
       <div 
         className={`relative h-full bg-[#0f172a] shadow-2xl border-l border-slate-800 transition-all duration-300 ease-in-out pointer-events-auto flex flex-col animate-in slide-in-from-right-full ${
           isMaximized ? 'w-full' : 'w-[900px]'
         }`}
       >
          {/* Header (Sticky) */}
          <header className="h-[60px] flex items-center justify-between px-6 border-b border-slate-800 bg-[#0f172a] shrink-0 z-20">
             <div className="flex items-center space-x-4">
                <div className="flex items-center text-slate-500 text-xs font-mono">
                   <TaskTypeIcon type={task?.type || 'task'} size={14} className="mr-2" />
                   <span>{task?.id}</span>
                </div>
                {task?.parentId && (
                   <>
                      <div className="h-4 w-px bg-slate-800" />
                      <button className="text-slate-500 hover:text-indigo-400 text-xs transition-colors flex items-center">
                         <span className="mr-1">Parent:</span>
                         <span className="font-mono text-indigo-300/80">{task.parentId}</span>
                      </button>
                   </>
                )}
             </div>

             <div className="flex items-center space-x-2">
                <button className="p-2 text-slate-500 hover:text-slate-200 rounded hover:bg-slate-800 transition-colors" title="Copy Link">
                   <ClipboardIcon size={16} />
                </button>
                <button className="p-2 text-slate-500 hover:text-slate-200 rounded hover:bg-slate-800 transition-colors" title="Options">
                   <MoreVerticalIcon size={16} />
                </button>
                <div className="w-px h-6 bg-slate-800 mx-2" />
                <button 
                  onClick={() => setIsMaximized(!isMaximized)}
                  className="p-2 text-slate-500 hover:text-slate-200 rounded hover:bg-slate-800 transition-colors"
                >
                   {isMaximized ? <MinimizeIcon size={18} /> : <MaximizeIcon size={18} />}
                </button>
                <button 
                   onClick={onClose}
                   className="p-2 text-slate-500 hover:text-red-400 rounded hover:bg-red-500/10 transition-colors"
                >
                   <XIcon size={22} />
                </button>
             </div>
          </header>

          {/* Body Scrollable */}
          <div className="flex-1 flex overflow-hidden">
             
             {/* Left Column: Content */}
             <div className="flex-1 overflow-y-auto custom-scrollbar p-8 bg-[#0f172a]">
                <div className="max-w-3xl mx-auto space-y-10">
                   
                   {/* Title Area */}
                   <div className="group relative">
                      <h1 className="text-3xl font-bold text-white tracking-tight outline-none focus:ring-1 focus:ring-indigo-500/30 p-1 -m-1 rounded">
                         {task?.title}
                      </h1>
                   </div>

                   {/* Description Area */}
                   <section>
                      <div className="flex items-center justify-between mb-4">
                         <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center">
                            <FileTextIcon size={14} className="mr-2" />
                            Description
                         </h2>
                         <button 
                            onClick={handleAiRefine}
                            disabled={isAiRefining}
                            className="text-[10px] bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded border border-indigo-500/30 flex items-center transition-all"
                         >
                            {isAiRefining ? <ClockIcon size={10} className="animate-spin mr-1.5" /> : <SparklesIcon size={10} className="mr-1.5" />}
                            ✨ Refine with AI
                         </button>
                      </div>
                      
                      <div className="prose prose-invert prose-indigo max-w-none">
                         {task?.description ? (
                            <div className="text-slate-300 leading-relaxed whitespace-pre-wrap text-sm">
                               {task.description}
                            </div>
                         ) : (
                            <div className="text-slate-600 italic text-sm cursor-pointer hover:text-slate-400">Add a description...</div>
                         )}
                      </div>
                   </section>

                   {/* Acceptance Criteria */}
                   {task?.acceptanceCriteria && (
                      <section className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
                         <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Acceptance Criteria</h2>
                            <div className="text-[10px] font-mono text-slate-400">
                               {completedAC} / {totalAC} Completed
                            </div>
                         </div>
                         
                         {/* Progress Bar */}
                         <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden mb-6">
                            <div className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)] transition-all duration-700" style={{ width: `${acProgress}%` }} />
                         </div>

                         <div className="space-y-3">
                            {task.acceptanceCriteria.map((ac) => (
                               <div key={ac.id} className="flex items-start group">
                                  <div className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center cursor-pointer transition-colors ${
                                     ac.checked ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-600 bg-slate-800 group-hover:border-slate-500'
                                  }`}>
                                     {ac.checked && <CheckCircleIcon size={10} />}
                                  </div>
                                  <span className={`ml-3 text-sm transition-colors ${ac.checked ? 'text-slate-500 line-through' : 'text-slate-300 group-hover:text-white'}`}>
                                     {ac.label}
                                  </span>
                               </div>
                            ))}
                         </div>
                      </section>
                   )}

                   {/* Activity Feed */}
                   <section className="pt-4">
                      <div className="flex items-center border-b border-slate-800 mb-6 space-x-6">
                         <TabButton active={activeTab === 'comments'} onClick={() => setActiveTab('comments')} icon={<MessageSquareIcon size={14} />} label="Comments" />
                         <TabButton active={activeTab === 'history'} onClick={() => setActiveTab('history')} icon={<ActivityIcon size={14} />} label="History" />
                         <TabButton active={activeTab === 'git'} onClick={() => setActiveTab('git')} icon={<GitCommitIcon size={14} />} label="Git" />
                      </div>

                      <div className="space-y-6">
                         {activeTab === 'comments' && (
                            <>
                               {/* Input */}
                               <div className="flex items-start space-x-3">
                                  <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold text-white shrink-0">A</div>
                                  <div className="flex-1 relative">
                                     <textarea 
                                        value={commentText}
                                        onChange={(e) => setCommentText(e.target.value)}
                                        placeholder="Add a comment..."
                                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-3 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                                        rows={2}
                                     />
                                     <div className="mt-2 flex justify-end">
                                        <Button variant="primary" size="sm" disabled={!commentText}>Send</Button>
                                     </div>
                                  </div>
                               </div>

                               {/* Mock List */}
                               <div className="space-y-6 pl-11">
                                  <CommentEntry user="Sarah" time="2h ago" text="I've started the audit. Found some legacy headers that need updating." />
                                  <CommentEntry user="Alex" time="1h ago" text="Great, let's track those in a separate story if they block the main flow." />
                               </div>
                            </>
                         )}

                         {activeTab === 'history' && (
                            <div className="space-y-4 font-mono text-xs text-slate-500">
                               <div className="flex items-center space-x-2">
                                  <span className="text-emerald-500">●</span>
                                  <span>Sarah changed status from <strong>To Do</strong> to <strong>In Progress</strong></span>
                                  <span className="opacity-40">2h ago</span>
                               </div>
                               <div className="flex items-center space-x-2">
                                  <span className="text-blue-500">●</span>
                                  <span>Sarah assigned this task to herself</span>
                                  <span className="opacity-40">3h ago</span>
                               </div>
                            </div>
                         )}

                         {activeTab === 'git' && (
                             <div className="space-y-3">
                                <div className="p-3 bg-slate-900/50 border border-slate-800 rounded-lg group hover:border-slate-700 transition-colors cursor-pointer">
                                   <div className="flex items-center justify-between mb-2">
                                      <div className="flex items-center text-xs font-bold text-indigo-400">
                                         <GitCommitIcon size={12} className="mr-1.5" />
                                         c9f1a2
                                      </div>
                                      <span className="text-[10px] text-slate-500">2h ago</span>
                                   </div>
                                   <p className="text-xs text-slate-300 truncate">feat: initial auth middleware scaffold</p>
                                </div>
                             </div>
                         )}
                      </div>
                   </section>
                </div>
             </div>

             {/* Right Column: Sidebar */}
             <div className="w-[320px] border-l border-slate-800 bg-[#0f172a] overflow-y-auto custom-scrollbar">
                
                {/* Primary Action */}
                <div className="p-6 border-b border-slate-800">
                   <Button 
                      variant="primary" 
                      className="w-full h-12 shadow-[0_0_20px_rgba(79,70,229,0.2)]" 
                      icon={<PlayIcon size={16} fill="currentColor" />}
                      onClick={() => task && onExecute(task.id)}
                   >
                      Execute Task
                   </Button>
                </div>

                {/* Properties Grid */}
                <div className="p-6 space-y-6">
                   <Property label="Status">
                      <div className="flex items-center justify-between bg-slate-900 border border-slate-800 rounded px-3 py-2 cursor-pointer hover:border-slate-700 transition-colors">
                         <div className="flex items-center">
                            <div className="w-2 h-2 rounded-full bg-indigo-500 mr-2" />
                            <span className="text-xs font-medium uppercase tracking-wider text-slate-200">{task?.status.replace('-', ' ')}</span>
                         </div>
                         <ChevronDownIcon size={14} className="text-slate-500" />
                      </div>
                   </Property>

                   <div className="grid grid-cols-2 gap-6">
                      <Property label="Assignee">
                         <div className="flex items-center space-x-2 hover:bg-slate-800/50 p-1 -m-1 rounded transition-colors cursor-pointer">
                            {task?.assignee ? (
                               <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-[10px] font-bold text-white border border-indigo-500/50">
                                  {task.assignee[0]}
                               </div>
                            ) : (
                               <div className="w-6 h-6 rounded-full border border-slate-700 flex items-center justify-center text-slate-500">
                                  <UserIcon size={12} />
                               </div>
                            )}
                            <span className="text-xs text-slate-300 truncate">{task?.assignee || 'Unassigned'}</span>
                         </div>
                      </Property>

                      <Property label="Priority">
                         <div className="flex items-center space-x-2 text-xs font-medium cursor-pointer hover:bg-slate-800/50 p-1 -m-1 rounded transition-colors">
                            <ArrowUpIcon size={14} className={
                               task?.priority === 'high' ? 'text-red-400' : 
                               task?.priority === 'medium' ? 'text-amber-400' : 'text-blue-400 rotate-180'
                            } />
                            <span className="text-slate-300 capitalize">{task?.priority}</span>
                         </div>
                      </Property>
                   </div>

                   <div className="grid grid-cols-2 gap-6">
                      <Property label="Estimate">
                         <div className="flex items-center space-x-2 bg-slate-900 border border-slate-800 rounded px-3 py-1.5 text-xs text-slate-300 font-mono">
                            {task?.points || '-'} pts
                         </div>
                      </Property>
                      <Property label="Due Date">
                         <div className="flex items-center space-x-2 text-xs text-slate-400 hover:text-white cursor-pointer transition-colors">
                            <CalendarIcon size={14} />
                            <span>{task?.dueDate || 'None'}</span>
                         </div>
                      </Property>
                   </div>

                   <Property label="Tags">
                      <div className="flex flex-wrap gap-2">
                         <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] text-slate-400 hover:border-indigo-500 transition-colors cursor-default">Backend</span>
                         <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] text-slate-400 hover:border-indigo-500 transition-colors cursor-default">Security</span>
                         <button className="w-5 h-5 rounded border border-dashed border-slate-700 flex items-center justify-center text-slate-600 hover:text-white transition-colors">
                            <span className="text-xs font-bold">+</span>
                         </button>
                      </div>
                   </Property>
                </div>

                {/* Development Section */}
                <div className="p-6 border-t border-slate-800 space-y-4">
                   <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Development</h3>
                   
                   <div className="space-y-3">
                      <button 
                        onClick={copyBranchName}
                        className="w-full flex items-center justify-between p-3 bg-slate-900 border border-slate-800 rounded-lg hover:bg-slate-800 transition-all group"
                      >
                         <div className="flex flex-col items-start min-w-0">
                            <span className="text-[9px] font-bold text-slate-500 uppercase mb-1">Feature Branch</span>
                            <span className="text-xs font-mono text-indigo-400 truncate w-full">feature/{task?.id.toLowerCase()}...</span>
                         </div>
                         <ClipboardIcon size={14} className="text-slate-600 group-hover:text-white ml-2" />
                      </button>

                      <div className="flex items-center justify-between p-3 bg-slate-900 border border-slate-800 rounded-lg">
                         <div className="flex flex-col items-start">
                            <span className="text-[9px] font-bold text-slate-500 uppercase mb-1">Pull Request</span>
                            <span className="text-xs text-slate-400">Not linked</span>
                         </div>
                         <button className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300">CREATE</button>
                      </div>
                   </div>
                </div>

             </div>
          </div>
       </div>
    </div>
  );
};

const TaskTypeIcon: React.FC<{ type: TaskType; size?: number; className?: string }> = ({ type, size = 16, className = "" }) => {
   switch (type) {
      case 'epic': return <CrownIcon size={size} className={`text-purple-400 ${className}`} />;
      case 'story': return <BookmarkIcon size={size} className={`text-emerald-400 ${className}`} />;
      case 'bug': return <AlertCircleIcon size={size} className={`text-red-400 ${className}`} />;
      default: return <CheckCircleIcon size={size} className={`text-blue-400 ${className}`} />;
   }
};

const Property: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
   <div className="space-y-2">
      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{label}</label>
      {children}
   </div>
);

const TabButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ active, onClick, icon, label }) => (
   <button 
      onClick={onClick}
      className={`pb-3 flex items-center transition-all border-b-2 ${
         active ? 'border-indigo-500 text-white' : 'border-transparent text-slate-500 hover:text-slate-300'
      }`}
   >
      <span className="mr-2 opacity-70">{icon}</span>
      <span className="text-xs font-bold uppercase tracking-wider">{label}</span>
   </button>
);

const CommentEntry: React.FC<{ user: string; time: string; text: string }> = ({ user, time, text }) => (
   <div className="space-y-2 group">
      <div className="flex items-center space-x-2">
         <span className="text-xs font-bold text-slate-200">{user}</span>
         <span className="text-[10px] text-slate-600">{time}</span>
      </div>
      <p className="text-sm text-slate-400 leading-relaxed bg-slate-900/30 p-2 rounded group-hover:bg-slate-900/50 transition-colors">
         {text}
      </p>
   </div>
);

export default TaskDetailView;
