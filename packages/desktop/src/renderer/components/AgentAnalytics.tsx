
import React, { useState, useMemo } from 'react';
import { 
  BarChart, Bar, 
  LineChart, Line, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area
} from 'recharts';
import { MOCK_AGENT_USAGE, MOCK_DAILY_COSTS } from '../constants';
import { AgentUsageData, DailyUsageStat } from '../types';
import Button from './Button';
import Badge from './Badge';
import { 
  ActivityIcon, 
  ZapIcon, 
  CloudIcon, 
  ShieldIcon, 
  ChevronRightIcon,
  SparklesIcon,
  ChevronDownIcon,
  FilterIcon,
  SearchIcon,
  RotateCwIcon,
  ArrowRightIcon,
  LockIcon,
  HardDriveIcon
} from './Icons';
import { GoogleGenAI } from "@google/genai";

const TrendingUpIconProxy: React.FC<any> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={props.size || 20}
    height={props.size || 20}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);

const AgentAnalytics: React.FC = () => {
  const [activeMetric, setActiveMetric] = useState<'tokens' | 'requests' | 'cost'>('cost');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiTips, setAiTips] = useState<string[]>([
    "Switch 'Documentation Bot' to gpt-3.5-turbo. It performs equally well on this task type but costs 10x less.",
    "Localhost Opportunity: You spent $5 testing generic logic. Try Llama-3-Local for initial drafts.",
    "Context Waste: 'Refactor Bot' is re-reading the same 50 files every request. Enable Caching?"
  ]);

  const filteredUsage = useMemo(() => {
    return MOCK_AGENT_USAGE.filter(a => 
      a.agentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.model.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const totalCost = MOCK_AGENT_USAGE.reduce((acc, curr) => acc + curr.cost, 0);
  const forecastCost = totalCost * 1.35; // Mock forecast logic
  const isOverBudget = forecastCost > 50; // Mock threshold

  const handleAiAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Analyze this AI fleet usage data and provide 3 ultra-concise, high-density optimization tips to reduce API costs without losing quality: ${JSON.stringify(MOCK_AGENT_USAGE)}`
      });
      if (response.text) {
        setAiTips(response.text.split('\n').filter(line => line.length > 5).slice(0, 3));
      }
    } catch (e) {
      console.error("AI Analysis failed", e);
    }
    setIsAnalyzing(false);
  };

  return (
    <div className="p-8 max-w-[1400px] mx-auto space-y-10 animate-in fade-in duration-500 pb-32 bg-[#0f172a]">
      
      {/* 1. Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-white tracking-tight">Agent Analytics & ROI</h1>
          <p className="text-slate-400 mt-1">Financial intelligence for your autonomous workforce</p>
        </div>
        <div className="flex items-center space-x-3">
           <Button variant="secondary" size="sm" icon={<LockIcon size={14}/>} onClick={() => { const evt = new CustomEvent('app-navigate', { detail: '/extensions/models' }); window.dispatchEvent(evt); }}>Manage Limits</Button>
           <Button variant="primary" size="sm" icon={<RotateCwIcon size={14}/>}>Fetch Live Billing</Button>
        </div>
      </div>

      {/* 2. ROI Hero Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <HeroCard 
            label="Total Cost (MTD)" 
            value={`$${totalCost.toFixed(2)}`} 
            trend="+12%" 
            trendPositive={false}
            sub={<span>Forecast: <strong className={isOverBudget ? 'text-red-400' : 'text-emerald-400'}>${forecastCost.toFixed(2)}</strong></span>}
            icon={<ZapIcon size={24} className="text-amber-400" />}
            progress={isOverBudget ? 85 : 45}
            progressColor={isOverBudget ? 'bg-red-500' : 'bg-indigo-500'}
         />
         <HeroCard 
            label="Productivity Gain" 
            value="~14 Hours" 
            sub="Based on 4,500 lines generated"
            icon={<TrendingUpIconProxy size={24} className="text-emerald-400" />}
         />
         <HeroCard 
            label="Net ROI" 
            value="Positive (15x)" 
            sub="Cost $45 vs. $700 labor (est)"
            icon={<ActivityIcon size={24} className="text-indigo-400" />}
            highlight="indigo"
         />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         
         {/* 3. Main Usage Charts (Left) */}
         <div className="lg:col-span-2 space-y-8">
            <section className="bg-slate-800/40 border border-slate-700 rounded-3xl p-8 flex flex-col h-[450px] shadow-2xl">
               <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center space-x-4">
                     <h2 className="text-sm font-bold text-white uppercase tracking-widest flex items-center">
                        <ActivityIcon size={16} className="mr-2 text-indigo-400" />
                        Usage Distribution
                     </h2>
                  </div>
                  <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800">
                     {(['cost', 'tokens', 'requests'] as const).map(m => (
                        <button
                           key={m}
                           onClick={() => setActiveMetric(m)}
                           className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all ${
                              activeMetric === m ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'
                           }`}
                        >
                           {m}
                        </button>
                     ))}
                  </div>
               </div>
               
               <div className="flex-1 min-h-0">
                  <ResponsiveContainer width="100%" height="100%">
                     <AreaChart data={MOCK_DAILY_COSTS}>
                        <defs>
                           <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                           </linearGradient>
                        </defs>
                        <XAxis dataKey="date" stroke="#475569" fontSize={10} axisLine={false} tickLine={false} />
                        <YAxis stroke="#475569" fontSize={10} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px', fontSize: '12px' }} />
                        <Area type="monotone" dataKey={activeMetric} stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorCost)" />
                     </AreaChart>
                  </ResponsiveContainer>
               </div>
            </section>

            {/* Detailed Table */}
            <section className="bg-slate-800/40 border border-slate-700 rounded-3xl overflow-hidden shadow-2xl">
               <header className="px-8 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em]">Fleet Expenditure Breakdown</h3>
                  <div className="relative group">
                     <SearchIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" />
                     <input 
                        type="text" 
                        placeholder="Filter agents..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white focus:border-indigo-500 outline-none w-48 transition-all"
                     />
                  </div>
               </header>
               <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-900/50 border-b border-slate-800 text-[10px] font-bold text-slate-600 uppercase tracking-widest">
                     <tr>
                        <th className="px-8 py-3">Agent Persona</th>
                        <th className="px-6 py-3">Model</th>
                        <th className="px-6 py-3 text-right">Tokens Out</th>
                        <th className="px-6 py-3 text-right">Avg Latency</th>
                        <th className="px-8 py-3 text-right">Cost</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                     {filteredUsage.map(agent => (
                        <tr key={agent.id} className="group hover:bg-slate-800/60 transition-colors cursor-default">
                           <td className="px-8 py-4">
                              <div className="flex items-center">
                                 <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform mr-3">
                                    <SparklesIcon size={14} />
                                 </div>
                                 <span className="text-sm font-bold text-slate-200 group-hover:text-white transition-colors">{agent.agentName}</span>
                              </div>
                           </td>
                           <td className="px-6 py-4">
                              <Badge variant="neutral">{agent.model}</Badge>
                           </td>
                           <td className="px-6 py-4 text-right font-mono text-xs text-slate-400">
                              {(agent.tokensOut / 1000).toFixed(1)}k
                           </td>
                           <td className="px-6 py-4 text-right font-mono text-xs text-slate-500">
                              {agent.avgLatency}
                           </td>
                           <td className="px-8 py-4 text-right">
                              <span className="text-sm font-bold text-white font-mono">${agent.cost.toFixed(2)}</span>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </section>
         </div>

         {/* 4. Optimization Recommendations (Right) */}
         <aside className="space-y-8">
            <section className="bg-indigo-900/10 border border-indigo-500/20 rounded-3xl p-8 space-y-6 shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                  <SparklesIcon size={120} className="text-indigo-400" />
               </div>
               
               <div className="flex items-center justify-between relative z-10">
                  <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-widest flex items-center">
                     <SparklesIcon size={16} className="mr-2 animate-pulse" />
                     Optimization Audit
                  </h3>
                  <button onClick={handleAiAnalyze} disabled={isAnalyzing} className="text-indigo-500 hover:text-white transition-colors">
                     <RotateCwIcon size={14} className={isAnalyzing ? 'animate-spin' : ''} />
                  </button>
               </div>

               <div className="space-y-4 relative z-10">
                  {aiTips.map((tip, idx) => (
                     <div key={idx} className="flex items-start p-4 bg-slate-900/60 rounded-2xl border border-indigo-500/10 group hover:border-indigo-500/30 transition-all cursor-pointer">
                        <div className="w-6 h-6 rounded-full bg-indigo-600/20 flex items-center justify-center shrink-0 mr-4 text-indigo-400 font-bold text-[10px]">
                           {idx + 1}
                        </div>
                        <p className="text-xs text-indigo-100/80 leading-relaxed font-light">{tip}</p>
                     </div>
                  ))}
               </div>

               <Button variant="primary" className="w-full h-12 bg-indigo-600 border-none shadow-lg shadow-indigo-900/40 uppercase font-bold tracking-widest">
                  Apply Recommendations
               </Button>
            </section>

            <section className="bg-slate-800/40 border border-slate-700 rounded-3xl p-8 space-y-6">
               <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center">
                  <ActivityIcon size={16} className="mr-2 text-indigo-400" />
                  Efficiency Heatmap
               </h3>
               <div className="grid grid-cols-2 gap-4">
                  <HeatCard label="Model Efficiency" value="HIGH" color="text-emerald-400" />
                  <HeatCard label="Parallelism" value="OPT" color="text-emerald-400" />
                  <HeatCard label="Context Usage" value="HIGH" color="text-amber-400" />
                  <HeatCard label="Latency" value="MED" color="text-amber-400" />
               </div>
               <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800">
                  <div className="text-[10px] font-bold text-slate-600 uppercase mb-4 tracking-widest">Provider distribution</div>
                  <div className="flex h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                     <div className="h-full bg-indigo-500 w-[65%]" title="Google Vertex" />
                     <div className="h-full bg-emerald-500 w-[20%]" title="Anthropic" />
                     <div className="h-full bg-blue-500 w-[10%]" title="OpenAI" />
                     <div className="h-full bg-slate-600 w-[5%]" title="Other" />
                  </div>
                  <div className="mt-4 flex items-center justify-between text-[8px] font-bold text-slate-500 uppercase">
                     <div className="flex items-center"><div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mr-1.5"/> GOOGLE</div>
                     <div className="flex items-center"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"/> ANTHROPIC</div>
                     <div className="flex items-center"><div className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-1.5"/> OPENAI</div>
                  </div>
               </div>
            </section>
         </aside>

      </div>

      {/* Global Status Bar Overlay */}
      <footer className="h-10 shrink-0 bg-slate-900 border-t border-slate-800 px-8 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-slate-500 z-30 fixed bottom-0 left-0 right-0">
         <div className="flex items-center space-x-12">
            <div className="flex items-center">
               <ShieldIcon size={14} className="mr-2 text-indigo-400" />
               FISCAL_GOVERNANCE: <span className="ml-2 text-emerald-500">ENFORCED</span>
            </div>
            <div className="flex items-center">
               <RotateCwIcon size={14} className="mr-2 text-indigo-400" />
               LAST_UPDATE: <span className="ml-2 text-slate-300 font-mono">10:45:01 AM</span>
            </div>
         </div>
         <div className="flex items-center space-x-6">
            <span className="text-slate-700 font-mono italic">AG-10_v4.2.1-ROI</span>
         </div>
      </footer>
    </div>
  );
};

const HeroCard: React.FC<{ 
   label: string; 
   value: string; 
   trend?: string; 
   trendPositive?: boolean; 
   sub: React.ReactNode; 
   icon: React.ReactNode; 
   highlight?: string;
   progress?: number;
   progressColor?: string;
}> = ({ label, value, trend, trendPositive, sub, icon, highlight, progress, progressColor }) => (
   <div className={`p-6 rounded-3xl border transition-all duration-300 group hover:-translate-y-1 shadow-sm hover:shadow-2xl relative overflow-hidden ${
      highlight === 'indigo' ? 'bg-indigo-600 text-white border-indigo-500 shadow-indigo-900/30' : 'bg-slate-800 border-slate-700 hover:border-slate-600'
   }`}>
      {highlight !== 'indigo' && (
         <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-bl-full -mr-8 -mt-8" />
      )}
      <div className="flex items-start justify-between mb-4">
         <div className={`p-2.5 rounded-xl border transition-transform group-hover:scale-110 ${
            highlight === 'indigo' ? 'bg-white/10 border-white/20 text-white' : 'bg-slate-900 border-slate-700'
         }`}>
            {icon}
         </div>
         {trend && (
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
               trendPositive ? 'text-emerald-400 bg-emerald-400/5 border-emerald-400/20' : 'text-red-400 bg-red-400/5 border-red-400/20'
            }`}>
               {trend}
            </span>
         )}
      </div>
      <div className="space-y-1">
         <div className={`text-[10px] font-bold uppercase tracking-widest ${highlight === 'indigo' ? 'text-indigo-200' : 'text-slate-500'}`}>{label}</div>
         <div className="text-3xl font-bold tracking-tight">{value}</div>
         <div className={`text-[10px] mt-2 font-medium ${highlight === 'indigo' ? 'text-indigo-100/70' : 'text-slate-500'}`}>{sub}</div>
      </div>
      {progress !== undefined && (
         <div className="mt-6 space-y-1.5">
            <div className="h-1 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-700/50">
               <div className={`h-full transition-all duration-1000 ${progressColor || 'bg-indigo-500'}`} style={{ width: `${progress}%` }} />
            </div>
         </div>
      )}
   </div>
);

const HeatCard: React.FC<{ label: string; value: string; color: string }> = ({ label, value, color }) => (
   <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex flex-col items-center justify-center space-y-1 group hover:border-slate-600 transition-all">
      <span className="text-[8px] font-bold text-slate-600 uppercase tracking-tighter">{label}</span>
      <span className={`text-xs font-black font-mono ${color}`}>{value}</span>
   </div>
);

export default AgentAnalytics;
