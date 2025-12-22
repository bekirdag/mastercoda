
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
/* Fix: Added missing RfpSection import to resolve compilation error on line 307. */
import { DiscoveryStep, RfpDraft, RfpSection } from '../types';
import { 
  SparklesIcon, 
  SendIcon, 
  RotateCwIcon, 
  CheckCircleIcon, 
  ShieldIcon, 
  ActivityIcon, 
  ZapIcon, 
  FileTextIcon, 
  TerminalIcon,
  MicIcon,
  PaperclipIcon,
  AlertTriangleIcon,
  XIcon,
  LockIcon
} from './Icons';

const INITIAL_RFP: RfpDraft = {
  overview: { id: 'over', title: 'Project Overview', content: '', status: 'empty' },
  functional: { id: 'func', title: 'Functional Requirements', content: '', status: 'empty' },
  technical: { id: 'tech', title: 'Technical Constraints', content: '', status: 'empty' },
  budget: { id: 'budg', title: 'Budget & Timeline', content: '', status: 'empty' }
};

type DiscoveryWizardProps = {
  onRfpReady?: (payload: { content: string }) => void;
  onBack?: () => void;
};

const buildRfpMarkdown = (draft: RfpDraft) => {
  const sections = [draft.overview, draft.functional, draft.technical, draft.budget];
  return [
    '# Request for Proposal (RFP)',
    ...sections.map((section) => `\n## ${section.title}\n${section.content.trim() || 'TBD'}`)
  ].join('\n');
};

const DiscoveryWizard: React.FC<DiscoveryWizardProps> = ({ onRfpReady, onBack }) => {
  const [step, setStep] = useState<DiscoveryStep>('context');
  const [messages, setMessages] = useState<{ role: 'user' | 'agent' | 'thought', text: string }[]>([
    { role: 'agent', text: "Welcome to the RFP creation chat. I'm your Senior Solutions Architect. Share as much detail as you can and I will ask follow-up questions until we have a complete RFP.\n\nTo start, can you describe the core problem this project solves and who the primary users are?" }
  ]);
  const [inputText, setInputText] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [rfp, setRfp] = useState<RfpDraft>(INITIAL_RFP);
  const [completeness, setCompleteness] = useState(15);
  const [conflicts, setConflicts] = useState<string[]>([]);
  const isRfpReady = completeness >= 90;
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userMsg = { role: 'user' as const, text: inputText };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsThinking(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: [
            { role: 'user', parts: [{ text: `Current RFP Draft: ${JSON.stringify(rfp)}. User says: ${userMsg.text}` }] }
        ],
        config: {
            systemInstruction: `You are a Senior Solutions Architect interviewing a user to build a professional RFP. 
            Goal: Identify core project context, scope, and technical constraints.
            Ask focused follow-up questions until the RFP has enough detail to finalize.
            Tone: Professional, consultative, identifies "Ambiguity Debt".
            If a user gives conflicting info, flag it.
            Output: Return a JSON object with 'architect_response' (string), 'thought' (string), and 'rfp_updates' (object mapping rfp sections to new content if any).`,
            responseMimeType: "application/json"
        }
      });

      const result = JSON.parse(response.text || '{}');
      
      if (result.thought) {
          setMessages(prev => [...prev, { role: 'thought', text: result.thought }]);
      }
      
      if (result.architect_response) {
          setMessages(prev => [...prev, { role: 'agent', text: result.architect_response }]);
      }

      if (result.rfp_updates) {
          setRfp(prev => {
              const next = { ...prev };
              Object.entries(result.rfp_updates).forEach(([section, content]) => {
                  if (next[section as keyof RfpDraft]) {
                      next[section as keyof RfpDraft].content += (next[section as keyof RfpDraft].content ? '\n' : '') + content;
                      next[section as keyof RfpDraft].status = 'drafting';
                  }
              });
              return next;
          });
          
          // Increment completeness
          setCompleteness(prev => Math.min(100, prev + 15));
      }

      // Check for conflicts simulation
      if (userMsg.text.toLowerCase().includes('simple') && userMsg.text.toLowerCase().includes('3d')) {
          setConflicts(['Complexity Mismatch: "Simple app" vs "3D Rendering" requirement.']);
      } else {
          setConflicts([]);
      }

    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'agent', text: "I encountered a processing error in the architecture enclave. Let's try that again." }]);
    } finally {
      setIsThinking(false);
    }
  };

  const handleRfpReady = () => {
    if (!onRfpReady || !isRfpReady) return;
    onRfpReady({ content: buildRfpMarkdown(rfp) });
  };

  const currentStepIndex = ['context', 'scope', 'technical', 'finalization'].indexOf(step);

  return (
    <div className="flex flex-col h-full bg-[#0f172a] text-slate-200 overflow-hidden font-sans">
      
      {/* 1. Progress Stepper */}
      <header className="h-[60px] border-b border-slate-800 bg-slate-900 flex items-center px-8 shrink-0 z-30 justify-between">
         <div className="flex items-center space-x-6">
            {onBack && (
               <button
                  onClick={onBack}
                  className="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-white transition-colors"
               >
                  <XIcon size={12} />
                  <span>Back</span>
               </button>
            )}
            <div className="flex items-center space-x-8">
               <StepItem active={step === 'context'} completed={currentStepIndex > 0} label="Context" />
               <StepDivider />
               <StepItem active={step === 'scope'} completed={currentStepIndex > 1} label="Scope" />
               <StepDivider />
               <StepItem active={step === 'technical'} completed={currentStepIndex > 2} label="Technical" />
               <StepDivider />
               <StepItem active={step === 'finalization'} completed={currentStepIndex > 3} label="Finalization" />
            </div>
         </div>

         <div className="flex items-center space-x-4">
            <div className="flex flex-col items-end">
               <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">RFP Completeness</span>
               <div className="flex items-center space-x-2">
                  <div className="w-32 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                     <div className="h-full bg-indigo-500 shadow-[0_0_10px_#6366f1] transition-all duration-1000" style={{ width: `${completeness}%` }} />
                  </div>
                  <span className="text-xs font-mono font-bold text-white">{completeness}%</span>
               </div>
            </div>
         </div>
      </header>

      {/* 2. Main content Split View */}
      <div className="flex-1 flex overflow-hidden">
         
         {/* LEFT: The Architect's Interview (40%) */}
         <aside className="w-[40%] border-r border-slate-800 bg-[#0f1117] flex flex-col shrink-0">
            <div className="h-10 border-b border-slate-800 bg-slate-900/50 flex items-center px-4 justify-between shrink-0">
               <div className="flex items-center text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  <SparklesIcon size={14} className="mr-2 text-indigo-400" />
                  Senior Solutions Architect
               </div>
               <div className="flex items-center text-emerald-500 animate-pulse">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2" />
                  <span className="text-[9px] font-bold uppercase">Ready</span>
               </div>
            </div>

            <div className="border-b border-slate-800 bg-slate-900/60 px-6 py-4 space-y-3">
               <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500">How this page works</div>
               <p className="text-xs text-slate-400 leading-relaxed">
                  This is the RFP creation chat. Share as much information as possible and the agent
                  will ask follow-up questions until the RFP is complete.
               </p>
               <ul className="text-[11px] text-slate-500 space-y-1">
                  <li>Include goals, users, scope, timeline, and budget.</li>
                  <li>Call out technical constraints, security, or compliance needs.</li>
                  <li>Answer follow-up questions so the draft can be finalized.</li>
               </ul>
            </div>

            {/* Chat History */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
               {messages.map((msg, i) => (
                  <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                     {msg.role === 'thought' ? (
                        <div className="w-full mb-2">
                           <div className="flex items-center text-[9px] font-bold text-slate-600 uppercase mb-1">
                              <TerminalIcon size={10} className="mr-1" /> Architect Logic
                           </div>
                           <div className="bg-slate-900/50 border-l-2 border-indigo-500/30 p-3 text-[11px] font-mono text-slate-500 rounded-r italic">
                              {msg.text}
                           </div>
                        </div>
                     ) : (
                        <div className={`max-w-[90%] p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                           msg.role === 'user' 
                           ? 'bg-indigo-600 text-white rounded-tr-none' 
                           : 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700'
                        }`}>
                           {msg.text}
                        </div>
                     )}
                  </div>
               ))}
               {isThinking && (
                  <div className="flex space-x-1 p-2">
                     <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" />
                     <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:200ms]" />
                     <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:400ms]" />
                  </div>
               )}
               <div ref={chatEndRef} />
            </div>

            {/* Input Footer */}
            <div className="p-6 bg-slate-900/50 border-t border-slate-800">
               {conflicts.length > 0 && (
                  <div className="mb-4 p-3 bg-red-950/20 border border-red-500/30 rounded-xl flex items-start space-x-3 animate-in shake">
                     <AlertTriangleIcon size={16} className="text-red-500 shrink-0 mt-0.5" />
                     <div className="text-xs text-red-400 font-bold uppercase tracking-tight">
                        Ambiguity Alert: {conflicts[0]}
                     </div>
                  </div>
               )}

               <div className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition duration-500" />
                  <div className="relative flex flex-col bg-slate-950 border border-slate-700 rounded-xl overflow-hidden shadow-inner">
                     <textarea 
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                        placeholder="Type your response... (e.g. 'This is for external customers.')"
                        className="w-full bg-transparent border-none text-sm text-white placeholder-slate-600 focus:ring-0 px-4 py-3 resize-none h-20"
                     />
                     <div className="h-10 bg-slate-900/50 flex items-center justify-between px-3 border-t border-slate-800">
                        <div className="flex items-center space-x-2">
                           <button className="p-1.5 text-slate-500 hover:text-white transition-colors"><MicIcon size={14}/></button>
                           <button className="p-1.5 text-slate-500 hover:text-white transition-colors"><PaperclipIcon size={14}/></button>
                        </div>
                        <button 
                           onClick={handleSend}
                           disabled={!inputText.trim() || isThinking}
                           className={`p-1.5 rounded-lg transition-all ${
                              inputText.trim() && !isThinking ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-800 text-slate-600'
                           }`}
                        >
                           <SendIcon size={16} fill="currentColor" />
                        </button>
                     </div>
                  </div>
               </div>
            </div>
         </aside>

         {/* RIGHT: Live Draft Preview (60%) */}
         <main className="flex-1 flex flex-col bg-[#0f172a] overflow-hidden">
            <header className="h-10 border-b border-slate-800 bg-slate-900/80 flex items-center px-6 justify-between shrink-0">
               <div className="flex items-center space-x-3">
                  <FileTextIcon size={14} className="text-slate-500" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Live RFP Draft Preview</span>
               </div>
               <div className="flex items-center space-x-4">
                  <button className="text-[10px] font-bold text-indigo-400 hover:text-white uppercase tracking-widest transition-all">Download .md</button>
               </div>
            </header>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-12 lg:p-20">
               <div className="max-w-[800px] mx-auto w-full space-y-16 animate-in fade-in duration-1000">
                  <h1 className="text-5xl font-extrabold text-white tracking-tighter border-b border-slate-800 pb-10">Request for Proposal (RFP)</h1>
                  
                  <RfpSectionDisplay section={rfp.overview} icon={<ActivityIcon size={20}/>} />
                  <RfpSectionDisplay section={rfp.functional} icon={<CheckCircleIcon size={20}/>} />
                  <RfpSectionDisplay section={rfp.technical} icon={<LockIcon size={20}/>} />
                  <RfpSectionDisplay section={rfp.budget} icon={<ZapIcon size={20}/>} />

                  <div className="h-32" /> {/* Bottom spacer */}
               </div>
            </div>
         </main>

      </div>

      {/* Global Status Bar */}
      <footer className="h-10 bg-slate-900 border-t border-slate-800 shrink-0 px-8 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-slate-500 z-30">
         <div className="flex items-center space-x-8">
            <div className="flex items-center">
               <RotateCwIcon size={12} className="mr-2 text-indigo-400" />
               ORCHESTRATOR: <span className="ml-2 text-emerald-500 uppercase">Interactive</span>
            </div>
            <div className="flex items-center">
               <ShieldIcon size={12} className="mr-2 text-indigo-400" />
               DATA_ENCLAVE: <span className="ml-2 text-slate-300">USER_LEVEL_SECURE</span>
            </div>
         </div>
         <div className="flex items-center space-x-4">
            {onRfpReady && (
               <button
                  onClick={handleRfpReady}
                  disabled={!isRfpReady}
                  className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all ${
                     isRfpReady
                        ? 'bg-emerald-500 text-slate-900 shadow-[0_0_16px_rgba(16,185,129,0.35)]'
                        : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  }`}
               >
                  RFP file is ready
               </button>
            )}
            <span className="text-slate-600 font-mono italic">AG-13_v4.2.1</span>
         </div>
      </footer>

    </div>
  );
};

// Sub-components

const StepItem: React.FC<{ active: boolean; completed: boolean; label: string }> = ({ active, completed, label }) => (
   <div className={`flex items-center transition-all ${active ? 'scale-105' : ''}`}>
      <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold mr-2 border transition-all ${
         completed ? 'bg-emerald-500 border-emerald-400 text-white shadow-[0_0_10px_rgba(16,185,129,0.5)]' :
         active ? 'bg-indigo-600 border-indigo-400 text-white shadow-[0_0_10px_rgba(99,102,241,0.5)]' :
         'bg-slate-800 border-slate-700 text-slate-500'
      }`}>
         {completed ? '✓' : ''}
      </div>
      <span className={`text-[11px] font-bold uppercase tracking-widest ${active ? 'text-white' : 'text-slate-500'}`}>{label}</span>
   </div>
);

const StepDivider = () => <div className="w-8 h-px bg-slate-800" />;

const RfpSectionDisplay: React.FC<{ section: RfpSection; icon: React.ReactNode }> = ({ section, icon }) => {
   const isEmpty = section.status === 'empty';
   
   return (
      <section className={`space-y-6 transition-all duration-1000 ${isEmpty ? 'opacity-30 blur-[1px]' : 'opacity-100 blur-0'}`}>
         <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-indigo-400">
               {icon}
            </div>
            <h2 className="text-xl font-bold text-white uppercase tracking-widest">{section.title}</h2>
         </div>
         
         <div className={`p-8 rounded-3xl border transition-all duration-1000 ${
            isEmpty ? 'bg-slate-900/50 border-dashed border-slate-800' : 'bg-slate-800/40 border-slate-700 shadow-xl'
         }`}>
            {isEmpty ? (
               <p className="text-sm text-slate-600 italic font-mono uppercase tracking-widest">
                  Waiting for data on {section.title.toLowerCase()}...
               </p>
            ) : (
               <div className="prose prose-invert prose-indigo max-w-none text-slate-300 leading-relaxed animate-in fade-in duration-700">
                  {section.content.split('\n').map((line, i) => (
                     <p key={i}>{line}</p>
                  ))}
               </div>
            )}
         </div>
      </section>
   );
};

export default DiscoveryWizard;
