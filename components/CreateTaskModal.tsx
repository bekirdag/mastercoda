import React, { useState, useEffect, useRef } from 'react';
import Button from './Button';
import { TaskType, TaskStatus } from '../types';
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
  TagIcon,
  HashIcon,
  CheckIcon
} from './Icons';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (task: any) => void;
}

const CreateTaskModal: React.FC<CreateTaskModalProps> = ({ isOpen, onClose, onCreate }) => {
  // Form State
  const [type, setType] = useState<TaskType>('task');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>('pending');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [points, setPoints] = useState<number | string>('');
  const [assignee, setAssignee] = useState<string>('');
  const [createAnother, setCreateAnother] = useState(false);

  // UI State
  const [isAiRefining, setIsAiRefining] = useState(false);
  const [showDiscardAlert, setShowDiscardAlert] = useState(false);

  // Refs
  const titleInputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Draft Saving / Loading
  useEffect(() => {
    if (isOpen) {
      const savedDraft = localStorage.getItem('mcoda_task_draft');
      if (savedDraft) {
        try {
          const parsed = JSON.parse(savedDraft);
          setTitle(parsed.title || '');
          setDescription(parsed.description || '');
          setType(parsed.type || 'task');
        } catch (e) { console.error('Failed to load draft'); }
      }
      // Focus title on open
      setTimeout(() => titleInputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Save Draft on change
  useEffect(() => {
    if (isOpen) {
      const draft = { title, description, type };
      localStorage.setItem('mcoda_task_draft', JSON.stringify(draft));
    }
  }, [title, description, type, isOpen]);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        if (title || description) {
           if (showDiscardAlert) {
             handleClose(); // Force close confirmed
           } else {
             setShowDiscardAlert(true); // First warning
           }
        } else {
          handleClose();
        }
      }

      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        handleSubmit();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, title, description, showDiscardAlert]);

  const handleClose = () => {
    setShowDiscardAlert(false);
    onClose();
  };

  const handleSubmit = () => {
    if (!title.trim()) return;

    const newTask = {
      id: `NEW-${Math.floor(Math.random() * 1000)}`,
      title,
      type,
      status,
      priority,
      points: Number(points) || undefined,
      assignee: assignee || undefined,
      updatedAt: 'Just now'
    };

    console.log('Creating task:', newTask);
    // In a real app, this would be an async API call
    
    // Clear draft
    localStorage.removeItem('mcoda_task_draft');
    
    if (createAnother) {
      setTitle('');
      setDescription('');
      // Keep other properties
      // Show toast ideally
    } else {
      onCreate(newTask);
      onClose();
      // Reset form
      setTitle('');
      setDescription('');
    }
  };

  // AI Actions
  const handleAiRefine = async () => {
    if (!title) return;
    setIsAiRefining(true);
    
    // Simulate AI Latency
    await new Promise(r => setTimeout(r, 1500));
    
    const enhancedDesc = `
### Summary
${title}

### Acceptance Criteria
- [ ] Implementation satisfies functional requirements.
- [ ] Unit tests added with >80% coverage.
- [ ] UI matches design specs (see attached Figma).

### Technical Notes
- Consider using the \`useStream\` hook for data fetching.
- Ensure proper error handling for 500 status codes.
    `.trim();

    setDescription(prev => prev ? `${prev}\n\n${enhancedDesc}` : enhancedDesc);
    setIsAiRefining(false);
  };

  const handleGenerateSubtasks = async () => {
    setIsAiRefining(true);
    await new Promise(r => setTimeout(r, 1000));
    const subtasks = `
- [ ] Setup scaffold
- [ ] Implement core logic
- [ ] Add integration tests
- [ ] Update documentation
    `.trim();
    setDescription(prev => prev ? `${prev}\n${subtasks}` : subtasks);
    setIsAiRefining(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center pt-[10vh]" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        onClick={handleClose}
      />

      {/* Modal Container */}
      <div 
        ref={modalRef}
        className="relative w-[800px] max-h-[85vh] flex flex-col bg-slate-800 rounded-xl shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-slate-700 overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 ring-1 ring-white/10"
      >
        {/* Glow Effect */}
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50" />

        {/* 1. Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700/50 bg-slate-800">
           <div className="flex items-center space-x-4">
              {/* Type Selector */}
              <div className="relative group">
                 <button className="flex items-center space-x-2 text-slate-300 hover:text-white transition-colors bg-slate-700/50 hover:bg-slate-700 px-3 py-1.5 rounded-md border border-slate-600/50">
                    <TaskTypeIcon type={type} />
                    <span className="text-sm font-medium capitalize">{type}</span>
                    <ChevronDownIcon size={12} className="opacity-50" />
                 </button>
                 {/* Mock Dropdown */}
                 <div className="absolute top-full left-0 mt-1 w-32 bg-slate-800 border border-slate-700 rounded shadow-xl py-1 hidden group-hover:block z-50">
                    {['task', 'story', 'bug', 'epic'].map((t) => (
                       <button 
                         key={t}
                         onClick={() => setType(t as TaskType)}
                         className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white flex items-center space-x-2"
                       >
                          <TaskTypeIcon type={t as TaskType} />
                          <span className="capitalize">{t}</span>
                       </button>
                    ))}
                 </div>
              </div>

              {/* Parent Context */}
              <div className="flex items-center text-sm text-slate-500">
                 <span className="mr-2">in</span>
                 <button className="hover:text-indigo-400 transition-colors border-b border-dashed border-slate-600 hover:border-indigo-400 pb-0.5">
                    No Epic
                 </button>
              </div>
           </div>

           <button 
             onClick={handleClose}
             className="text-slate-500 hover:text-slate-200 transition-colors p-1"
             title="Close (Esc)"
           >
              <XIcon size={20} />
           </button>
        </div>

        {/* 2. Main Input */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
           
           {/* Title */}
           <input
              ref={titleInputRef}
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              className="w-full bg-transparent text-xl font-semibold text-white placeholder-slate-500 border-none outline-none focus:ring-0 p-0"
              autoComplete="off"
           />

           {/* Description Editor */}
           <div className="relative min-h-[150px] group">
              <textarea
                 value={description}
                 onChange={(e) => setDescription(e.target.value)}
                 placeholder="Describe the requirements... (Type / for commands)"
                 className={`w-full h-full min-h-[150px] bg-transparent text-sm text-slate-300 placeholder-slate-600 border-none outline-none focus:ring-0 resize-none font-mono leading-relaxed transition-all ${isAiRefining ? 'opacity-50' : ''}`}
              />
              {isAiRefining && (
                 <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <SparklesIcon className="text-indigo-400 animate-spin" size={24} />
                 </div>
              )}
           </div>

           {/* 3. Properties Bar */}
           <div className="flex flex-wrap items-center gap-3 bg-slate-900/50 p-3 rounded-lg border border-slate-800">
              
              {/* Status */}
              <div className="flex items-center space-x-2">
                 <label className="text-[10px] uppercase font-bold text-slate-500">Status</label>
                 <button className="px-2 py-1 rounded bg-slate-800 border border-slate-700 text-xs text-slate-300 hover:border-slate-600 flex items-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-500 mr-2" />
                    <span className="capitalize">{status}</span>
                 </button>
              </div>
              <div className="w-px h-4 bg-slate-700" />

              {/* Priority */}
              <div className="flex items-center space-x-2">
                 <label className="text-[10px] uppercase font-bold text-slate-500">Priority</label>
                 <button 
                    onClick={() => setPriority(priority === 'medium' ? 'high' : priority === 'high' ? 'low' : 'medium')}
                    className="px-2 py-1 rounded bg-slate-800 border border-slate-700 text-xs text-slate-300 hover:border-slate-600 flex items-center"
                 >
                    <ArrowUpIcon size={12} className={`mr-1.5 ${priority === 'high' ? 'text-red-400' : priority === 'medium' ? 'text-amber-400' : 'text-slate-400 rotate-180'}`} />
                    <span className="capitalize">{priority}</span>
                 </button>
              </div>
              <div className="w-px h-4 bg-slate-700" />

              {/* Assignee */}
              <div className="flex items-center space-x-2">
                 <label className="text-[10px] uppercase font-bold text-slate-500">Assignee</label>
                 <button className="px-2 py-1 rounded bg-slate-800 border border-slate-700 text-xs text-slate-300 hover:border-slate-600 flex items-center group">
                    <UserIcon size={12} className="mr-1.5 text-slate-500 group-hover:text-indigo-400" />
                    <span>{assignee || 'Unassigned'}</span>
                 </button>
              </div>
              <div className="w-px h-4 bg-slate-700" />

              {/* Estimate */}
              <div className="flex items-center space-x-2">
                 <label className="text-[10px] uppercase font-bold text-slate-500">Pts</label>
                 <input 
                   type="number" 
                   value={points}
                   onChange={(e) => setPoints(e.target.value)}
                   className="w-12 bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs text-slate-300 focus:border-indigo-500 outline-none"
                   placeholder="-"
                 />
              </div>

           </div>
        </div>

        {/* 4. AI Assistant Panel */}
        <div className="px-6 py-3 bg-gradient-to-r from-indigo-900/20 to-purple-900/20 border-y border-indigo-500/20 flex items-center justify-between">
           <div className="flex items-center space-x-3">
              <span className="text-xs font-semibold text-indigo-400 flex items-center">
                 <SparklesIcon size={12} className="mr-1.5" />
                 AI Assistant
              </span>
              <button 
                onClick={handleAiRefine}
                disabled={isAiRefining}
                className="px-3 py-1 rounded-full bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 text-xs border border-indigo-500/30 transition-colors"
              >
                ✨ AI Refine
              </button>
              <button 
                onClick={handleGenerateSubtasks}
                disabled={isAiRefining}
                className="px-3 py-1 rounded-full bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 text-xs border border-purple-500/30 transition-colors"
              >
                🧩 Subtasks
              </button>
              <button 
                disabled={isAiRefining}
                className="px-3 py-1 rounded-full bg-slate-700/50 hover:bg-slate-700 text-slate-400 text-xs border border-slate-600/50 transition-colors"
              >
                🧪 Test Cases
              </button>
           </div>
        </div>

        {/* 5. Footer */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-800 border-t border-slate-700">
           
           <div 
             onClick={() => setCreateAnother(!createAnother)}
             className="flex items-center space-x-2 cursor-pointer select-none group"
           >
              <div className={`w-9 h-5 rounded-full relative transition-colors ${createAnother ? 'bg-indigo-600' : 'bg-slate-600'}`}>
                 <div className={`absolute top-1 w-3 h-3 bg-white rounded-full shadow-sm transition-transform ${createAnother ? 'left-5' : 'left-1'}`} />
              </div>
              <span className="text-xs text-slate-400 group-hover:text-slate-300">Create another</span>
           </div>

           <div className="flex items-center space-x-3">
              {showDiscardAlert && (
                 <span className="text-xs text-red-400 mr-2 animate-in fade-in">Unsaved changes. Press Esc again to discard.</span>
              )}
              <Button variant="ghost" onClick={handleClose}>
                 Cancel
              </Button>
              <Button 
                variant="primary" 
                onClick={handleSubmit}
                disabled={!title.trim()}
                className={title.trim() ? 'animate-pulse-subtle' : 'opacity-50'}
              >
                 Create Task <span className="ml-2 opacity-50 font-normal text-[10px]">⌘↵</span>
              </Button>
           </div>
        </div>

      </div>
    </div>
  );
};

const TaskTypeIcon: React.FC<{ type: TaskType }> = ({ type }) => {
    switch (type) {
        case 'epic': return <CrownIcon size={14} className="text-purple-400" />;
        case 'story': return <BookmarkIcon size={14} className="text-emerald-400" />;
        case 'bug': return <AlertCircleIcon size={14} className="text-red-400" />;
        default: return <CheckIcon size={14} className="text-blue-400" />;
    }
}

export default CreateTaskModal;