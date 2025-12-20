
import React, { useState, useEffect } from 'react';
import { MilestoneData, MilestoneAssumption, MilestoneOutlineItem } from '../types';
import { MOCK_MILESTONE } from '../constants';
import Button from './Button';
import Badge from './Badge';
// Added missing SendIcon import
import { 
  CheckCircleIcon, 
  AlertTriangleIcon, 
  SparklesIcon, 
  ArrowRightIcon, 
  ChevronRightIcon, 
  ChevronDownIcon, 
  RotateCwIcon, 
  TrashIcon, 
  Edit2Icon, 
  HelpCircleIcon, 
  MessageSquareIcon,
  ShieldIcon,
  LockIcon,
  ActivityIcon,
  FileTextIcon,
  TerminalIcon,
  XIcon,
  SendIcon
} from './Icons';
import { GoogleGenAI } from "@google/genai";

const MilestoneApproval: React.FC = () => {
  const [data, setData] = useState<MilestoneData>(MOCK_MILESTONE);
  const [isApproved, setIsApproved] = useState(false);
  const [isAsking, setIsAsking] = useState(false);
  const [isRedrafting, setIsRedrafting] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'agent', text: string }[]>([]);
  const [aiThinking, setAiThinking] = useState(false);

  const handleApprove = async () => {
    setIsApproved(true);
    // Persist to "Project State"
    console.log("Milestone approved and persisted.");
    // Advancement logic here
  };

  const handleAskQuestion = async () => {
    if (!chatMessage.trim()) return;
    
    const userMsg = { role: 'user' as const, text: chatMessage };
    setChatHistory(prev => [...prev, userMsg]);
    setChatMessage('');
    setAiThinking(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Context: Approval phase for ${data.title}. Stage: ${data.stage}. Assumptions: ${JSON.stringify(data.assumptions)}. User question: ${userMsg.text}. Provide a concise, professional architect response.`,
        config: { systemInstruction: "You are Architect Prime, a senior system architect. Be precise and high-density." }
      });
      setChatHistory(prev => [...prev, { role: 'agent', text: response.text || "I cannot clarify this point currently." }]);
    } catch (e) {
      setChatHistory(prev => [...prev, { role: 'agent', text: "Connection error in clarifying enclave." }]);
    }
    setAiThinking(false);
  };

  const handleToggleAssumption = (id: string) => {
    setData(prev => ({
      ...prev,
      assumptions: prev.assumptions.map(a => a.id === id ? { ...a, isVerified: !a.isVerified } : a)
    }));
  };

  return (
    <div className="flex flex-col h-full bg-[#0f172a] text-slate-200 overflow-hidden font-sans items-center relative">
      
      {/* 1. Header & Stage Breadcrumb */}
      <header className="w-full h-14 border-b border-slate-800 bg-slate-900/50 backdrop-blur shrink-0 flex items-center justify-between px-8 z-30">
         <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3">
               <div className="p-1.5 rounded bg-indigo-600/20 text-indigo-400">
                  <ShieldIcon size={18} />
               </div>
               <h1 className="text-sm font-bold text-white uppercase tracking-[0.2em]">Milestone Approval</h1>
            </div>
            <div className="flex items-center space-x-3 text-xs font-mono text-slate-500">
               <span className={data.stage === 'rfp_pdr' ? 'text-indigo-400 font-bold' : ''}>RFP</span>
               <ArrowRightIcon size={10} className="text-slate-700" />
               <span className={data.stage === 'rfp_pdr' ? 'text-indigo-400 font-bold animate-pulse' : ''}>PDR</span>
               <ArrowRightIcon size={10} className="text-slate-700" />
               <span className="opacity-30">SDS</span>
            </div>
         </div>
         <Badge variant={isApproved ? 'success' : 'warning'}>
            {isApproved ? 'SIGNED_OFF' : 'AWAITING_VERIFICATION'}
         </Badge>
      </header>

      {/* 2. Main Center Content Scrollable */}
      <main className="flex-1 w-full max-w-[900px] overflow-y-auto custom-scrollbar p-12 space-y-12 relative">
         
         {/* Digital Stamp Overlay */}
         {isApproved && (
            <div className="absolute top-40 left-1/2 -translate-x-1/2 z-50 pointer-events-none animate-in zoom-in duration-300 flex flex-col items-center">
                <div className="border-8 border-emerald-500/40 rounded-full p-8 rotate-12 bg-emerald-500/5 backdrop-blur-sm shadow-[0_0_50px_rgba(16,185,129,0.2)]">
                   <div className="text-6xl font-black text-emerald-500 opacity-60 uppercase tracking-tighter">APPROVED</div>
                   <div className="text-xs text-center text-emerald-400 font-mono mt-1 font-bold">NODE: {new Date().toLocaleDateString()}</div>
                </div>
            </div>
         )}

         {/* Introduction Header */}
         <section className={`space-y-3 text-center transition-all duration-700 ${isApproved ? 'opacity-50 grayscale scale-95' : ''}`}>
            <h2 className="text-4xl font-bold text-white tracking-tight">{data.title}</h2>
            <p className="text-slate-400 max-w-xl mx-auto leading-relaxed">
               I have synthesized the requirements from the Discovery phase. Below is my proposed technical direction. 
               Please verify my core assumptions before I generate the full PDR.
            </p>
         </section>

         {/* Section: Executive Summary / Assumptions */}
         <section className={`space-y-6 transition-all duration-700 ${isApproved ? 'opacity-30 pointer-events-none' : ''}`}>
            <div className="flex items-center justify-between">
               <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center">
                  <SparklesIcon size={14} className="mr-2 text-indigo-400" />
                  Agent's Summary of Understanding
               </h3>
               <span className="text-[9px] font-mono text-slate-600 uppercase">Verification Required: {data.assumptions.filter(a => !a.isVerified).length}</span>
            </div>

            <div className="bg-slate-800 border border-slate-700 rounded-3xl overflow-hidden shadow-2xl">
               <div className="divide-y divide-slate-700/50">
                  {data.assumptions.map((ass) => (
                     <div 
                        key={ass.id} 
                        onClick={() => handleToggleAssumption(ass.id)}
                        className={`flex items-start p-5 transition-all cursor-pointer group hover:bg-slate-750 ${ass.isVerified ? 'bg-slate-800/20' : 'bg-indigo-900/5 ring-1 ring-indigo-500/10'}`}
                     >
                        <div className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                           ass.isVerified ? 'bg-emerald-500 border-emerald-500 text-white shadow-[0_0_10px_#10b981]' : 'border-slate-600 bg-slate-900 group-hover:border-indigo-400'
                        }`}>
                           {ass.isVerified && <CheckCircleIcon size={12} />}
                        </div>
                        <div className="ml-5 flex-1 min-w-0">
                           <p className={`text-sm leading-relaxed transition-colors ${ass.isVerified ? 'text-slate-300' : 'text-white font-medium'}`}>{ass.text}</p>
                        </div>
                        <button className="ml-4 opacity-0 group-hover:opacity-100 transition-opacity p-1 text-slate-500 hover:text-white">
                           <Edit2Icon size={14} />
                        </button>
                     </div>
                  ))}
               </div>
            </div>
         </section>

         {/* Section: Proposed Outline (Reorderable List Mock) */}
         <section className={`space-y-6 transition-all duration-700 ${isApproved ? 'opacity-30 pointer-events-none' : ''}`}>
            <div className="flex items-center justify-between">
               <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center">
                  <ActivityIcon size={14} className="mr-2 text-indigo-400" />
                  Proposed Document Map (PDR)
               </h3>
               <button className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 transition-colors uppercase">Edit Hierarchy &rsaquo;</button>
            </div>

            <div className="bg-slate-800/40 border border-slate-700 rounded-3xl p-6 shadow-inner space-y-2">
               {data.proposedOutline.map(item => (
                  <div key={item.id} className="space-y-1">
                     <div className="flex items-center justify-between p-3 bg-slate-900/50 border border-slate-800 rounded-xl group hover:border-slate-600 cursor-grab active:cursor-grabbing">
                        <div className="flex items-center">
                           <ChevronDownIcon size={12} className="mr-3 text-slate-600" />
                           <span className="text-sm font-bold text-slate-200">{item.label}</span>
                        </div>
                        <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-all">
                           <button className="p-1 hover:text-red-400"><TrashIcon size={14}/></button>
                           <button className="p-1 hover:text-white"><ActivityIcon size={14}/></button>
                        </div>
                     </div>
                     {item.children?.map(child => (
                        <div key={child.id} className="ml-8 p-2.5 bg-slate-900/30 border border-slate-800/50 rounded-lg flex items-center text-xs text-slate-400 hover:text-white hover:border-indigo-500/20 transition-all cursor-pointer">
                           <div className="w-1 h-1 rounded-full bg-slate-700 mr-3" />
                           {child.label}
                        </div>
                     ))}
                  </div>
               ))}
            </div>
         </section>

         {/* Clarification Chat Box */}
         <section className={`space-y-4 pt-10 border-t border-slate-800 ${isApproved ? 'hidden' : ''}`}>
            <div className="flex items-center justify-between mb-4">
               <h4 className="text-[10px] font-bold text-indigo-400 uppercase tracking-[0.2em] flex items-center">
                  <MessageSquareIcon size={14} className="mr-2" />
                  Architectural Clarification
               </h4>
               <span className="text-[9px] font-mono text-slate-600">ISOLATED_THREAD_V1</span>
            </div>

            <div className="space-y-4 max-h-60 overflow-y-auto custom-scrollbar pr-4">
               {chatHistory.map((m, i) => (
                  <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`}>
                     <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-xs leading-relaxed ${
                        m.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-slate-800 border border-slate-700 text-slate-300 rounded-tl-none'
                     }`}>
                        {m.text}
                     </div>
                  </div>
               ))}
               {aiThinking && (
                  <div className="flex space-x-1 p-2">
                     <div className="w-1 h-1 bg-indigo-500 rounded-full animate-bounce" />
                     <div className="w-1 h-1 bg-indigo-500 rounded-full animate-bounce [animation-delay:200ms]" />
                     <div className="w-1 h-1 bg-indigo-500 rounded-full animate-bounce [animation-delay:400ms]" />
                  </div>
               )}
            </div>

            <div className="relative group">
               <input 
                  type="text" 
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAskQuestion()}
                  placeholder="Ask for clarification on a specific point..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-4 pr-12 py-3 text-sm text-white focus:border-indigo-500 outline-none transition-all shadow-inner"
               />
               <button 
                  onClick={handleAskQuestion}
                  disabled={!chatMessage.trim() || aiThinking}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-indigo-400 hover:text-white transition-all disabled:opacity-30"
               >
                  <SendIcon size={18} fill="currentColor" />
               </button>
            </div>
         </section>
         
         <div className="h-32" />
      </main>

      {/* 3. Decision Action Footer (Sticky) */}
      <footer className="w-full h-24 border-t border-slate-800 bg-slate-900/80 backdrop-blur shrink-0 flex items-center justify-center z-40 px-8">
         <div className="max-w-4xl w-full flex items-center justify-between">
            <div className="flex flex-col">
               <div className="flex items-center space-x-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  <LockIcon size={12} className="text-indigo-400" />
                  Downstream Documents Locked
               </div>
               <p className="text-[10px] text-slate-600 mt-1 italic">Sign-off required to advance to SDS generation.</p>
            </div>

            <div className="flex items-center space-x-4">
               {isApproved ? (
                  <Button 
                     variant="primary" 
                     className="px-12 h-14 text-base shadow-[0_0_30px_rgba(79,70,229,0.4)] animate-in zoom-in"
                     onClick={() => { const evt = new CustomEvent('app-navigate', { detail: '/docs/edit/pdr-new' }); window.dispatchEvent(evt); }}
                  >
                     Generate Next Draft
                     <ChevronRightIcon size={18} className="ml-3" />
                  </Button>
               ) : (
                  <>
                     <Button variant="ghost" className="text-slate-400 hover:text-white hover:bg-slate-800 h-12 px-6">
                        Request Redraft (AG-13)
                     </Button>
                     <Button 
                        variant="primary" 
                        disabled={data.assumptions.some(a => !a.isVerified)}
                        className={`px-12 h-14 text-base font-bold uppercase tracking-widest transition-all ${
                           data.assumptions.every(a => a.isVerified) 
                              ? 'bg-emerald-600 hover:bg-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.4)] animate-pulse-subtle' 
                              : 'bg-slate-700 text-slate-500 cursor-not-allowed grayscale'
                        }`}
                        onClick={handleApprove}
                     >
                        Confirm & Sign Off
                     </Button>
                  </>
               )}
            </div>
         </div>
      </footer>

      {/* Persistence Info Footer Bar */}
      <footer className="h-8 w-full bg-slate-950 border-t border-slate-800 flex items-center px-8 justify-between text-[9px] font-bold text-slate-600 uppercase font-mono tracking-widest shrink-0">
         <div className="flex items-center">
            <RotateCwIcon size={10} className="mr-2" />
            STAMP_ID: MCODA_SIG_842X
         </div>
         <div className="flex items-center">
            USER_ID: ALEX_ARCHITECT
            <div className="h-2 w-px bg-slate-800 mx-3" />
            IP: 192.168.1.42
         </div>
      </footer>
    </div>
  );
};

export default MilestoneApproval;
