
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
  // Fix: Removed TrendingUpIconProxy from import as it is defined locally and not exported from Icons.tsx
  // Fix: Added ChevronRightIcon to imports from Icons.tsx
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
                        Usage Trends
                     </h2>
                     <div className="flex bg-slate-900 rounded-lg p-1 border border-slate-700">
                        {(['tokens', 'requests', 'cost'] as const).map(m => (
                           <button
                              key={m}
                              onClick={() => setActiveMetric(m)}
                              className={`px-3 py-1 rounded text-[10px] font-bold uppercase transition-all ${
                                 activeMetric === m ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'
                              }`}
                           >
                              {m}
                           </button>
                        ))}
                     </div>
                  </div>
                  <div className="text-[10px] font-mono text-slate-500 uppercase">Data current as of 10 mins ago</div>
               </div>
               
               <div className="flex-1 min-h-0">
                  <ResponsiveContainer width="100%" height="100%">
                     <AreaChart data={MOCK_DAILY_COSTS} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                           <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                           </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                        <XAxis dataKey="date" stroke="#475569" fontSize={10} axisLine={false} tickLine={false} />
                        <YAxis stroke="#475569" fontSize={10} axisLine={false} tickLine={false} />
                        <Tooltip 
                           contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px', fontSize: '12px' }}
                           itemStyle={{ color: '#fff' }}
                        />
                        <Area type="monotone" dataKey={activeMetric} stroke="#6366f1" fillOpacity={1} fill="url(#colorMetric)" strokeWidth={3} />
                     </AreaChart>
                  </ResponsiveContainer>
               </div>
            </section>

            {/* Cost Breakdown Table */}
            <section className="bg-slate-800/40 border border-slate-700 rounded-3xl overflow-hidden shadow-xl">
               <header className="p-6 border-b border-slate-700 bg-slate-900/50 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center">
                     <HardDriveIcon size={16} className="mr-2 text-indigo-400" />
                     Cost Breakdown by Agent
                  </h3>
                  <div className="relative">
                     <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={12} />
                     <input 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search fleet..."
                        className="bg-slate-950 border border-slate-700 rounded-lg pl-8 pr-3 py-1 text-xs text-white focus:border-indigo-500 outline-none w-48"
                     />
                  </div>
               </header>
               <div className="overflow-x-auto custom-scrollbar">
                  <table className="w-full text-left border-collapse">
                     <thead>
                        <tr className="bg-slate-950/50 text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-800">
                           <th className="px-6 py-3">Agent Entity</th>
                           <th className="px-6 py-3">Model</th>
                           <th className="px-6 py-3 text-right">Calls</th>
                           <th className="px-6 py-3 text-right">Tokens (In/Out)</th>
                           <th className="px-6 py-3 text-right">Cost</th>
                           <th className="px-6 py-3 text-right">Avg Latency</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-800/50">
                        {filteredUsage.map(agent => (
                           <tr key={agent.id} className="group hover:bg-slate-800/50 transition-colors">
                              <td className="px-6 py-4">
                                 <div className="flex items-center space-x-3">
                                    <div className="w-2 h-2 rounded-full bg-indigo-500" />
                                    <span className="text-xs font-bold text-slate-200">{agent.agentName}</span>
                                 </div>
                              </td>
                              <td className="px-6 py-4">
                                 <Badge variant="neutral">{agent.model}</Badge>
                              </td>
                              <td className="px-6 py-4 text-right font-mono text-xs text-slate-400">{agent.calls}</td>
                              <td className="px-6 py-4 text-right font-mono text-[10px] text-slate-500">
                                 {Math.round(agent.tokensIn/1000000)}M / {Math.round(agent.tokensOut/1000000)}M
                              </td>
                              <td className="px-6 py-4 text-right">
                                 <span className={`text-xs font-bold font-mono ${agent.cost > 10 ? 'text-amber-400' : 'text-emerald-400'}`}>
                                    ${agent.cost.toFixed(2)}
                                 </span>
                              </td>
                              <td className="px-6 py-4 text-right font-mono text-[10px] text-slate-500">{agent.avgLatency}</td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </section>
         </div>

         {/* 4. Optimization Tips Sidebar (Right) */}
         <aside className="space-y-6">
            <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 shadow-2xl flex flex-col h-full sticky top-24">
               <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xs font-bold text-white uppercase tracking-widest flex items-center">
                     <SparklesIcon size={16} className="mr-2 text-indigo-400" />
                     Optimization Enclave
                  </h3>
                  <button 
                     onClick={handleAiAnalyze}
                     disabled={isAnalyzing}
                     className="p-1.5 hover:bg-slate-700 rounded transition-colors text-indigo-400"
                  >
                     <RotateCwIcon size={16} className={isAnalyzing ? 'animate-spin' : ''} />
                  </button>
               </div>

               <div className="space-y-4 flex-1">
                  {aiTips.map((tip, i) => (
                     <div key={i} className="p-4 bg-slate-900 border border-slate-800 rounded-2xl group hover:border-indigo-500/30 transition-all animate-in slide-in-from-right-4" style={{ animationDelay: `${i * 150}ms` }}>
                        <div className="flex items-start gap-4">
                           <div className="mt-1 shrink-0">
                              <ZapIcon size={16} className="text-amber-400 group-hover:scale-110 transition-transform" />
                           </div>
                           <p className="text-xs text-slate-300 leading-relaxed font-light italic">"{tip}"</p>
                        </div>
                        <div className="mt-4 flex justify-end">
                           <button className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 uppercase tracking-widest flex items-center">
                              Implement Fix <ChevronRightIcon size={12} className="ml-1" />
                           </button>
                        </div>
                     </div>
                  ))}
               </div>

               <div className="mt-8 pt-6 border-t border-slate-700 space-y-4">
                  <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                     <span>Estimated Savings</span>
                     <span className="text-emerald-400">~$12.50 / mo</span>
                  </div>
                  <Button variant="primary" className="w-full text-[10px] uppercase font-bold tracking-widest shadow-lg shadow-indigo-900/20" onClick={handleAiAnalyze}>
                     {isAnalyzing ? 'Reasoning...' : 'Deep Audit Performance'}
                  </Button>
               </div>
            </div>
         </aside>
      </div>

      {/* Global Status Footer */}
      <footer className="h-10 bg-slate-900 border-t border-slate-800 shrink-0 px-8 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-slate-500 z-30 shadow-[0_-4px_20px_rgba(0,0,0,0.5)] fixed bottom-0 left-0 right-0">
         <div className="flex items-center space-x-12">
            <div className="flex items-center">
               <ActivityIcon size={12} className="mr-2 text-indigo-400" />
               COST_PRECISION: <span className="ml-2 text-emerald-500">EXACT_MATCH</span>
            </div>
            <div className="flex items-center">
               <RotateCwIcon size={12} className="mr-2 text-indigo-400" />
               UPDATE_LATENCY: <span className="ml-2 text-slate-300 font-mono">10 MINS</span>
            </div>
         </div>
         <div className="flex items-center space-x-6">
            <div className="flex items-center text-indigo-400">
               <ShieldIcon size={12} className="mr-2" />
               ENCLAVE_PROXY_PROTECTION: ACTIVE
            </div>
            <div className="h-3 w-px bg-slate-800" />
            <span className="text-slate-700 font-mono">v4.2.1-stable</span>
         </div>
      </footer>
    </div>
  );
};

// Internal Sub-components

const HeroCard: React.FC<{ 
  label: string; 
  value: string; 
  sub: React.ReactNode; 
  icon: React.ReactNode; 
  trend?: string; 
  trendPositive?: boolean;
  progress?: number;
  progressColor?: string;
  highlight?: 'indigo' | 'emerald' | 'amber';
}> = ({ label, value, sub, icon, trend, trendPositive, progress, progressColor = 'bg-indigo-500', highlight }) => (
   <div className={`bg-slate-800 border-2 rounded-3xl p-8 shadow-sm relative overflow-hidden group transition-all duration-300 ${highlight === 'indigo' ? 'border-indigo-500/20' : 'border-slate-700 hover:border-slate-600'}`}>
      <div className="flex items-start justify-between mb-6">
         <div className="flex items-center text-slate-500 text-[10px] font-bold uppercase tracking-widest">
            <span className="mr-3 p-2 rounded-xl bg-slate-900 border border-slate-700 group-hover:scale-110 transition-transform">
               {icon}
            </span>
            {label}
         </div>
         {trend && (
            <div className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono border ${
               trendPositive ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'
            }`}>
               {trend}
            </div>
         )}
      </div>
      <div className="text-4xl font-bold text-white tracking-tight mb-2">{value}</div>
      <div className="text-xs text-slate-500 font-medium uppercase tracking-tight">{sub}</div>
      
      {progress !== undefined && (
         <div className="mt-6 h-1 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
            <div className={`h-full transition-all duration-1000 ${progressColor} ${progress > 80 ? 'animate-pulse' : ''}`} style={{ width: `${progress}%` }} />
         </div>
      )}
   </div>
);

export default AgentAnalytics;
