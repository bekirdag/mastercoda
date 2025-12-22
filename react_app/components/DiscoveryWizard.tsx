import React, { useState, useEffect, useRef, useMemo } from 'react';
import { GoogleGenAI } from "@google/genai";
import { DiscoveryStep, RfpDraft, RfpSection } from '../types';
import { 
  SparklesIcon, 
  SendIcon, 
  RotateCwIcon, 
  CheckCircleIcon, 
  ShieldIcon, 
  ActivityIcon, 
  ZapIcon, 
  ChevronRightIcon, 
  FileTextIcon, 
  TerminalIcon,
  MicIcon,
  PaperclipIcon,
  AlertTriangleIcon,
  XIcon,
  LockIcon,
  Edit2Icon
} from './Icons';

type RfpView = 'home' | 'browse' | 'create';

const INITIAL_RFP: RfpDraft = {
  overview: { id: 'over', title: 'Project Overview', content: '', status: 'empty' },
  functional: { id: 'func', title: 'Functional Requirements', content: '', status: 'empty' },
  technical: { id: 'tech', title: 'Technical Constraints', content: '', status: 'empty' },
  budget: { id: 'budg', title: 'Budget & Timeline', content: '', status: 'empty' }
};

const buildRfpMarkdown = (draft: RfpDraft) => {
  const sections = [
    { title: 'Project Overview', content: draft.overview.content },
    { title: 'Functional Requirements', content: draft.functional.content },
    { title: 'Technical Constraints', content: draft.technical.content },
    { title: 'Budget & Timeline', content: draft.budget.content }
  ];

  const sectionText = sections
    .map(section => {
      const content = section.content.trim() ? section.content.trim() : 'TBD';
      return `## ${section.title}\n\n${content}`;
    })
    .join('\n\n');

  return `# Request for Proposal (RFP)\n\n${sectionText}\n`;
};

const DiscoveryWizard: React.FC = () => {
  const [view, setView] = useState<RfpView>('home');
  const [rfpPath, setRfpPath] = useState('');
  const [rfpMarkdown, setRfpMarkdown] = useState('');
  const [editorOpen, setEditorOpen] = useState(false);

  const [step, setStep] = useState<DiscoveryStep>('context');
  const [messages, setMessages] = useState<{ role: 'user' | 'agent' | 'thought', text: string }[]>([
    { role: 'agent', text: "Welcome to the RFP Builder. This chat will create your RFP file. Share as much detail as you can about goals, users, scope, constraints, timelines, and budget. I'll ask follow-up questions until the RFP is ready.\n\nTo start, what problem does this project solve and who is it for?" }
  ]);
  const [inputText, setInputText] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [rfp, setRfp] = useState<RfpDraft>(INITIAL_RFP);
  const [completeness, setCompleteness] = useState(10);
  const [conflicts, setConflicts] = useState<string[]>([]);
  const [rfpReady, setRfpReady] = useState(false);
  
  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isRfpReady = rfpReady || completeness >= 90;
  const draftMarkdown = useMemo(() => buildRfpMarkdown(rfp), [rfp]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (completeness >= 90) {
      setRfpReady(true);
    }
  }, [completeness]);

  useEffect(() => {
    if (completeness < 35) setStep('context');
    else if (completeness < 60) setStep('scope');
    else if (completeness < 85) setStep('technical');
    else setStep('finalization');
  }, [completeness]);

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
            Goal: Collect enough detail to finalize the RFP file. Ask focused follow-up questions until each section is complete.
            Tone: Professional, consultative, identifies ambiguity.
            If a user gives conflicting info, flag it.
            Output: Return a JSON object with 'architect_response' (string), 'thought' (string), 'rfp_updates' (object mapping rfp sections to new content if any), and 'rfp_ready' (boolean). Set rfp_ready true only when the RFP is ready to save.`,
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

      if (typeof result.rfp_ready === 'boolean') {
        setRfpReady(prev => prev || result.rfp_ready);
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

  const handleBrowseFile = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setRfpPath(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      setRfpMarkdown(typeof reader.result === 'string' ? reader.result : '');
    };
    reader.readAsText(file);
  };

  const openBrowseView = () => {
    setView('browse');
    setEditorOpen(false);
  };

  const openCreateView = () => {
    setView('create');
  };

  const openHomeView = () => {
    setView('home');
  };

  const handleReadyClick = () => {
    setRfpMarkdown(draftMarkdown);
    setRfpPath(rfpPath || 'rfp.md');
    openBrowseView();
  };

  const currentStepIndex = ['context', 'scope', 'technical', 'finalization'].indexOf(step);

  if (view === 'home') {
    return (
      <div className="flex flex-col h-full bg-[#0f172a] text-slate-200 overflow-hidden font-sans">
        <header className="h-16 border-b border-slate-800 bg-slate-900 flex items-center px-8">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center">
              <FileTextIcon size={16} className="text-indigo-400" />
            </div>
            <div>
              <div className="text-sm font-semibold text-white">RFP</div>
              <div className="text-xs text-slate-500">Browse an RFP file or create one with the AI architect.</div>
            </div>
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center px-6">
          <div className="max-w-4xl w-full">
            <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">RFP Workspace</h1>
            <p className="mt-3 text-slate-400 text-sm md:text-base max-w-2xl">
              Start from an existing markdown RFP or generate a new one by chatting with the architect. You can edit the file and preview it side by side.
            </p>

            <div className="mt-10 grid gap-6 md:grid-cols-2">
              <button
                onClick={openBrowseView}
                className="group w-full p-8 rounded-3xl border border-slate-800 bg-slate-900/60 hover:bg-slate-900 transition-all text-left shadow-xl hover:border-indigo-500/40"
              >
                <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center mb-5 group-hover:border-indigo-500/50">
                  <FileTextIcon size={18} className="text-indigo-400" />
                </div>
                <h2 className="text-lg font-semibold text-white">Browse RFP file</h2>
                <p className="mt-2 text-sm text-slate-400">Open an existing markdown RFP and review or edit it.</p>
              </button>

              <button
                onClick={openCreateView}
                className="group w-full p-8 rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900/70 to-slate-950/60 hover:from-indigo-600/10 hover:to-slate-950 transition-all text-left shadow-xl hover:border-indigo-500/40"
              >
                <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center mb-5 group-hover:shadow-[0_0_20px_rgba(99,102,241,0.4)]">
                  <SparklesIcon size={18} className="text-indigo-300" />
                </div>
                <h2 className="text-lg font-semibold text-white">Create RFP file</h2>
                <p className="mt-2 text-sm text-slate-400">Chat with the AI architect and generate a complete RFP draft.</p>
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (view === 'browse') {
    return (
      <div className="flex flex-col h-full bg-[#0f172a] text-slate-200 overflow-hidden font-sans">
        <header className="h-14 border-b border-slate-800 bg-slate-900 flex items-center px-6 justify-between">
          <button
            onClick={openHomeView}
            className="flex items-center text-xs text-slate-400 hover:text-white transition-colors"
          >
            <ChevronRightIcon size={14} className="mr-2 rotate-180" />
            Back
          </button>

          <div className="flex items-center space-x-3">
            <FileTextIcon size={16} className="text-indigo-400" />
            <div>
              <div className="text-sm font-semibold text-white">RFP File</div>
              <div className="text-[10px] text-slate-500 uppercase tracking-widest">Markdown preview + editor</div>
            </div>
          </div>

          <button
            onClick={() => setEditorOpen(prev => !prev)}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-md border border-slate-700 bg-slate-800 text-xs text-slate-300 hover:text-white hover:border-indigo-500/50 transition-all"
          >
            <Edit2Icon size={14} />
            <span>{editorOpen ? 'Hide editor' : 'Edit'}</span>
          </button>
        </header>

        <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/40">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">RFP File Path</span>
            <input
              value={rfpPath}
              onChange={(e) => setRfpPath(e.target.value)}
              placeholder="Select an RFP markdown file..."
              className="flex-1 min-w-[220px] px-3 py-2 rounded-md bg-slate-950 border border-slate-700 text-xs text-slate-200 font-mono focus:outline-none focus:border-indigo-500"
            />
            <button
              onClick={handleBrowseFile}
              className="px-4 py-2 rounded-md border border-slate-700 bg-slate-800 text-xs font-semibold text-slate-300 hover:text-white hover:border-indigo-500/50 transition-all"
            >
              Browse
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".md,.markdown,text/markdown"
              className="hidden"
              onChange={handleFileSelected}
            />
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          <div className={`grid h-full ${editorOpen ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
            {editorOpen && (
              <section className="border-r border-slate-800 bg-slate-900/40 flex flex-col">
                <div className="h-10 border-b border-slate-800 flex items-center justify-between px-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  Markdown Editor
                  <button
                    onClick={() => setEditorOpen(false)}
                    className="text-slate-500 hover:text-white transition-colors"
                    title="Collapse editor"
                  >
                    <XIcon size={12} />
                  </button>
                </div>
                <textarea
                  value={rfpMarkdown}
                  onChange={(e) => setRfpMarkdown(e.target.value)}
                  placeholder="Edit your RFP markdown here..."
                  className="flex-1 w-full bg-slate-950 text-slate-200 text-sm font-mono p-4 resize-none focus:outline-none"
                />
              </section>
            )}
            <section className="flex-1 overflow-y-auto custom-scrollbar p-8 lg:p-10">
              <div className="max-w-[900px] mx-auto">
                <MarkdownPreview content={rfpMarkdown} />
              </div>
            </section>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#0f172a] text-slate-200 overflow-hidden font-sans">
      {/* 1. Progress Stepper */}
      <header className="h-[60px] border-b border-slate-800 bg-slate-900 flex items-center px-8 shrink-0 z-30 justify-between">
         <div className="flex items-center space-x-6">
            <button
              onClick={openHomeView}
              className="flex items-center text-xs text-slate-400 hover:text-white transition-colors"
            >
              <ChevronRightIcon size={14} className="mr-2 rotate-180" />
              Back
            </button>
            <div className="text-[11px] font-bold uppercase tracking-widest text-slate-500">RFP Creation</div>
            <div className="hidden md:flex items-center space-x-8">
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
            {isRfpReady && (
              <div className="hidden md:flex items-center text-[10px] font-bold uppercase tracking-widest text-emerald-400">
                <CheckCircleIcon size={12} className="mr-2" />
                RFP Ready
              </div>
            )}
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

            <div className="border-b border-slate-800 bg-slate-900/40 px-5 py-4">
              <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500">How this page works</div>
              <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                This chat turns your answers into a complete RFP file. Share as much detail as possible about goals, users, features, constraints, timeline, budget, risks, and integrations. The agent will keep asking questions until it is confident the RFP is ready.
              </p>
              <div className="mt-3 flex flex-wrap gap-2 text-[9px] font-bold uppercase tracking-widest text-slate-500">
                <span className="px-2 py-1 rounded-full border border-slate-700 bg-slate-950">Goals</span>
                <span className="px-2 py-1 rounded-full border border-slate-700 bg-slate-950">Users</span>
                <span className="px-2 py-1 rounded-full border border-slate-700 bg-slate-950">Scope</span>
                <span className="px-2 py-1 rounded-full border border-slate-700 bg-slate-950">Constraints</span>
                <span className="px-2 py-1 rounded-full border border-slate-700 bg-slate-950">Timeline</span>
                <span className="px-2 py-1 rounded-full border border-slate-700 bg-slate-950">Budget</span>
              </div>
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
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSend();
                          }
                        }}
                        placeholder="Answer in detail... Include goals, users, constraints, timeline, and budget."
                        className="w-full bg-transparent border-none text-sm text-white placeholder-slate-600 focus:ring-0 px-4 py-3 resize-none h-24"
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
      <footer className="h-12 bg-slate-900 border-t border-slate-800 shrink-0 px-8 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-slate-500 z-30">
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
         <div className="flex items-center space-x-3">
           <button
             onClick={handleReadyClick}
             disabled={!isRfpReady}
             className={`px-4 py-2 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all ${
               isRfpReady
                 ? 'bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)]'
                 : 'bg-slate-800 text-slate-600 cursor-not-allowed'
             }`}
           >
             RFP file is ready
           </button>
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

const MarkdownPreview: React.FC<{ content: string }> = ({ content }) => {
  if (!content.trim()) {
    return (
      <div className="text-slate-600 italic">
        No RFP content loaded yet. Browse a markdown file or create one with the AI architect.
      </div>
    );
  }

  const lines = content.split('\n');
  const blocks: React.ReactNode[] = [];
  let listItems: string[] = [];

  const flushList = (key: string) => {
    if (!listItems.length) return;
    blocks.push(
      <ul key={`list-${key}`} className="list-disc pl-6 space-y-1 text-slate-300">
        {listItems.map((item, index) => (
          <li key={`list-${key}-${index}`}>{item}</li>
        ))}
      </ul>
    );
    listItems = [];
  };

  lines.forEach((line, index) => {
    if (line.startsWith('- ') || line.startsWith('* ')) {
      listItems.push(line.slice(2));
      return;
    }

    flushList(`${index}`);

    if (!line.trim()) {
      blocks.push(<div key={`spacer-${index}`} className="h-4" />);
      return;
    }

    if (line.startsWith('# ')) {
      blocks.push(
        <h1 key={`h1-${index}`} className="text-4xl font-bold text-white mb-6 border-b border-slate-800 pb-4">
          {line.replace('# ', '')}
        </h1>
      );
      return;
    }

    if (line.startsWith('## ')) {
      blocks.push(
        <h2 key={`h2-${index}`} className="text-2xl font-bold text-slate-100 mt-10 mb-4">
          {line.replace('## ', '')}
        </h2>
      );
      return;
    }

    if (line.startsWith('### ')) {
      blocks.push(
        <h3 key={`h3-${index}`} className="text-xl font-bold text-indigo-400 mt-8 mb-3">
          {line.replace('### ', '')}
        </h3>
      );
      return;
    }

    blocks.push(
      <p key={`p-${index}`} className="text-slate-300 leading-relaxed">
        {line}
      </p>
    );
  });

  flushList('end');

  return <article className="prose prose-invert prose-indigo max-w-none space-y-4">{blocks}</article>;
};

export default DiscoveryWizard;
