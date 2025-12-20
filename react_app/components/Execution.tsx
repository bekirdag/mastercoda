import React, { useState, useEffect, useRef } from 'react';
import { Task } from '../types';
import Button from './Button';
import Badge from './Badge';
import { MOCK_TASKS } from '../constants';
import { 
  ArrowRightIcon, 
  ClockIcon, 
  CodeIcon, 
  CheckCircleIcon, 
  FileTextIcon, 
  PaperclipIcon, 
  MicIcon, 
  SendIcon, 
  TerminalIcon,
  ChevronDownIcon,
  PlayIcon,
  SparklesIcon
} from './Icons';

interface ExecutionProps {
  taskId: string | null;
  onBack: () => void;
}

const Execution: React.FC<ExecutionProps> = ({ taskId, onBack }) => {
  const [task, setTask] = useState<Task | null>(null);
  const [messages, setMessages] = useState<any[]>([
    { id: 1, role: 'system', text: 'Agent initialized. Connected to primary LLM.', timestamp: '10:42 AM' },
    { id: 2, role: 'agent', text: 'I am ready to help you with this task. I have loaded the project context.', timestamp: '10:42 AM' }
  ]);
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (taskId) {
      const found = MOCK_TASKS.find(t => t.id === taskId);
      setTask(found || null);
    }
  }, [taskId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const newMsg = { id: Date.now(), role: 'user', text: inputText, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setMessages(prev => [...prev, newMsg]);
    setInputText('');
    setIsProcessing(true);

    // Simulate Agent Thinking
    await new Promise(r => setTimeout(r, 800));
    setMessages(prev => [...prev, { 
      id: Date.now() + 1, 
      role: 'thought', 
      text: 'Analyzing request against current file structure...', 
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    }]);

    await new Promise(r => setTimeout(r, 1200));
    
    // Simulate Agent Response
    setMessages(prev => [...prev, { 
      id: Date.now() + 2, 
      role: 'agent', 
      text: `I've updated the implementation. Would you like to run the test suite now?`, 
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      action: { type: 'file_mod', file: 'src/auth/middleware.ts', diff: '+ const token = req.headers.authorization;' } 
    }]);
    
    setIsProcessing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      handleSendMessage();
    }
  };

  if (!task) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-500">
        <p>No task selected for execution.</p>
        <Button variant="secondary" className="mt-4" onClick={onBack}>Back to Plan</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-200 font-sans overflow-hidden">
      
      {/* 1. Header */}
      <header className="h-[60px] flex items-center justify-between px-6 border-b border-slate-700 bg-slate-900 shrink-0 z-20">
        <div className="flex items-center space-x-4">
          <button onClick={onBack} className="text-slate-400 hover:text-white transition-colors flex items-center text-sm font-medium">
            <ArrowRightIcon className="rotate-180 mr-2" size={16} />
            Back
          </button>
          <div className="h-6 w-px bg-slate-700 mx-2" />
          <div className="flex items-center space-x-3">
             <span className="font-mono text-slate-500 font-bold">{task.id}</span>
             <span className="font-semibold text-white truncate max-w-md">{task.title}</span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
           {/* Status */}
           <div className="flex items-center space-x-2">
              <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">Status</span>
              <Badge variant={task.status === 'in-progress' ? 'info' : 'neutral'}>{task.status}</Badge>
           </div>
           
           {/* Timer Mock */}
           <div className="flex items-center space-x-2 bg-slate-800 px-3 py-1.5 rounded border border-slate-700 font-mono text-sm text-indigo-400">
              <ClockIcon size={14} />
              <span>00:42:15</span>
           </div>

           <Button variant="secondary" size="sm" icon={<CodeIcon size={14} />}>
              Open in VS Code
           </Button>
        </div>
      </header>

      {/* 2. Main Split View */}
      <div className="flex-1 flex overflow-hidden">
         
         {/* Left Pane: Context */}
         <div className="w-[40%] flex flex-col border-r border-slate-700 bg-slate-900 overflow-y-auto custom-scrollbar">
            <div className="p-8 space-y-8">
               
               {/* Description */}
               <section>
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center">
                    <FileTextIcon size={14} className="mr-2" />
                    Description
                  </h3>
                  <div className="prose prose-invert prose-sm max-w-none text-slate-300 leading-relaxed">
                     <p>{task.description || "No description provided."}</p>
                  </div>
               </section>

               {/* Acceptance Criteria */}
               {task.acceptanceCriteria && task.acceptanceCriteria.length > 0 && (
                 <section>
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center">
                      <CheckCircleIcon size={14} className="mr-2" />
                      Acceptance Criteria
                    </h3>
                    <div className="space-y-3">
                       {task.acceptanceCriteria.map((ac) => (
                          <label key={ac.id} className="flex items-start space-x-3 group cursor-pointer">
                             <input type="checkbox" defaultChecked={ac.checked} className="mt-1 w-4 h-4 rounded border-slate-600 text-indigo-500 focus:ring-indigo-500 bg-slate-800" />
                             <span className={`text-sm group-hover:text-slate-200 transition-colors ${ac.checked ? 'text-slate-500 line-through' : 'text-slate-400'}`}>
                                {ac.label}
                             </span>
                          </label>
                       ))}
                    </div>
                 </section>
               )}

               {/* Attachments Mock */}
               <section>
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center">
                    <PaperclipIcon size={14} className="mr-2" />
                    Attachments
                  </h3>
                  <div className="flex flex-wrap gap-3">
                     <div className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-md flex items-center text-xs text-indigo-400 cursor-pointer hover:border-indigo-500 transition-colors">
                        <span className="w-2 h-2 rounded-full bg-purple-500 mr-2" />
                        Figma Mockups
                     </div>
                     <div className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-md flex items-center text-xs text-indigo-400 cursor-pointer hover:border-indigo-500 transition-colors">
                        <span className="w-2 h-2 rounded-full bg-slate-500 mr-2" />
                        API Spec (Swagger)
                     </div>
                  </div>
               </section>

            </div>
         </div>

         {/* Right Pane: Console */}
         <div className="flex-1 flex flex-col bg-slate-800 relative">
            
            {/* Console Header */}
            <div className="h-10 border-b border-slate-700 bg-slate-800 flex items-center justify-between px-4 shrink-0">
               <div className="flex items-center space-x-2 text-xs">
                  <span className="flex items-center text-slate-300 font-medium">
                     <SparklesIcon size={12} className="mr-2 text-indigo-400" />
                     Agent: Primary (OpenAI)
                  </span>
                  <span className="text-slate-600">|</span>
                  <span className="text-emerald-500 flex items-center">
                     <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />
                     Online
                  </span>
               </div>
            </div>

            {/* Stream Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
               {messages.map((msg) => (
                  <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} animate-in fade-in slide-in-from-bottom-2`}>
                     {msg.role === 'thought' ? (
                        <div className="w-full max-w-2xl">
                           <div className="flex items-center text-xs text-slate-500 mb-1">
                             <TerminalIcon size={12} className="mr-1" /> Thinking Process
                           </div>
                           <div className="bg-slate-900/50 border-l-2 border-indigo-500/50 p-3 text-sm text-slate-400 font-mono rounded-r">
                              {msg.text}
                           </div>
                        </div>
                     ) : (
                        <div className={`max-w-[85%] ${msg.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-slate-700 text-slate-200'} rounded-lg px-4 py-3 shadow-sm`}>
                           <div className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</div>
                           {msg.action && (
                              <div className="mt-3 bg-slate-900 rounded p-2 text-xs font-mono border border-slate-800">
                                 <div className="flex items-center text-slate-500 border-b border-slate-800 pb-2 mb-2">
                                    <FileTextIcon size={12} className="mr-2" />
                                    {msg.action.file}
                                 </div>
                                 <div className="text-emerald-400">{msg.action.diff}</div>
                              </div>
                           )}
                           <div className={`text-[10px] mt-1 text-right ${msg.role === 'user' ? 'text-indigo-200' : 'text-slate-500'}`}>{msg.timestamp}</div>
                        </div>
                     )}
                  </div>
               ))}
               {isProcessing && (
                  <div className="flex items-center space-x-1 text-indigo-400 p-2">
                     <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                     <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                     <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
               )}
               <div ref={chatEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-slate-700 bg-slate-800">
               <div className="relative">
                  <textarea
                     value={inputText}
                     onChange={(e) => setInputText(e.target.value)}
                     onKeyDown={handleKeyDown}
                     placeholder="Instruct the agent..."
                     className="w-full bg-slate-900 border border-slate-600 rounded-lg pl-4 pr-12 py-3 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none custom-scrollbar shadow-inner"
                     rows={3}
                  />
                  <div className="absolute bottom-3 right-3 flex items-center space-x-2">
                     <button className="p-1.5 text-slate-500 hover:text-white rounded hover:bg-slate-700 transition-colors" title="Voice Input">
                        <MicIcon size={16} />
                     </button>
                     <button className="p-1.5 text-slate-500 hover:text-white rounded hover:bg-slate-700 transition-colors" title="Attach File">
                        <PaperclipIcon size={16} />
                     </button>
                     <button 
                        onClick={handleSendMessage}
                        disabled={!inputText.trim() || isProcessing}
                        className={`p-1.5 rounded transition-all ${
                           inputText.trim() && !isProcessing
                           ? 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-md' 
                           : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                        }`}
                     >
                        <SendIcon size={16} />
                     </button>
                  </div>
               </div>
               <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500 font-medium">
                  <div className="flex items-center space-x-3">
                     <span>Model: GPT-4o</span>
                     <span>Context: 4k/128k</span>
                  </div>
                  <div className="flex items-center">
                     <span className="bg-slate-700 px-1.5 rounded text-slate-400 mr-1.5 border border-slate-600">⌘ + ⏎</span>
                     <span>to send</span>
                  </div>
               </div>
            </div>

         </div>
      </div>
    </div>
  );
};

export default Execution;