
import React, { useState, useMemo, useEffect } from 'react';
import { ApiEndpoint, ApiMethod, ApiParameter } from '../types';
import { MOCK_API_ENDPOINTS } from '../constants';
import Button from './Button';
import Badge from './Badge';
import { 
  SearchIcon, 
  ChevronRightIcon, 
  ChevronDownIcon, 
  GlobeIcon, 
  LockIcon, 
  ShieldIcon, 
  ActivityIcon, 
  CodeIcon, 
  SendIcon, 
  TrashIcon, 
  RotateCwIcon,
  HelpCircleIcon,
  XIcon,
  CheckCircleIcon,
  AlertTriangleIcon,
  SparklesIcon
} from './Icons';
import { GoogleGenAI } from '@google/genai';

const ApiExplorer: React.FC = () => {
  const [endpoints] = useState<ApiEndpoint[]>(MOCK_API_ENDPOINTS);
  const [selectedId, setSelectedId] = useState<string>(MOCK_API_ENDPOINTS[0].id);
  const [server, setServer] = useState('Localhost:3000');
  const [isAuth, setIsAuth] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Request State
  const [pathParams, setPathParams] = useState<Record<string, string>>({});
  const [queryParams, setQueryParams] = useState<Record<string, string>>({});
  const [requestBody, setRequestBody] = useState('');
  
  // Response State
  const [isSending, setIsSending] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'body' | 'headers' | 'curl'>('body');

  const selectedEndpoint = useMemo(() => endpoints.find(e => e.id === selectedId)!, [endpoints, selectedId]);

  // Sync initial params on endpoint change
  useEffect(() => {
    const p: Record<string, string> = {};
    const q: Record<string, string> = {};
    selectedEndpoint.parameters.forEach(param => {
      if (param.in === 'path') p[param.name] = param.example || '';
      if (param.in === 'query') q[param.name] = param.example || '';
    });
    setPathParams(p);
    setQueryParams(q);
    setRequestBody(selectedEndpoint.requestBody?.schema || '');
    setResponse(null);
    setAiInsight(null);
  }, [selectedEndpoint]);

  const previewUrl = useMemo(() => {
    let url = selectedEndpoint.path;
    Object.entries(pathParams).forEach(([k, v]) => {
      url = url.replace(`{${k}}`, v || `{${k}}`);
    });
    const qs = new URLSearchParams(queryParams).toString();
    return `${url}${qs ? '?' + qs : ''}`;
  }, [selectedEndpoint, pathParams, queryParams]);

  const handleSend = async () => {
    setIsSending(true);
    setResponse(null);
    setAiInsight(null);

    // Simulation delay
    await new Promise(r => setTimeout(r, 1200));

    // Mock response generation
    const isError = Math.random() > 0.8;
    const mockData = isError 
      ? { error: "Validation Failed", code: "INVALID_FIELD", message: "Parameter 'email' must be a valid email address." }
      : { 
          id: pathParams['id'] || "usr_7890", 
          name: "Alex Dev", 
          email: "alex@mastercoda.io", 
          role: "architect",
          status: "active",
          created_at: "2024-01-15T10:42:00Z"
        };

    const res = {
      status: isError ? 400 : 200,
      statusText: isError ? "Bad Request" : "OK",
      time: "142ms",
      size: isError ? "0.4kb" : "1.2kb",
      data: mockData,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
        "X-Request-ID": Math.random().toString(36).substring(7)
      }
    };

    setResponse(res);
    setIsSending(false);

    // Call Gemini for AI Insight if error or significant result
    if (isError) {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const aiResponse = await ai.models.generateContent({
           model: 'gemini-3-flash-preview',
           contents: `Explain why this API request might have failed based on the response: ${JSON.stringify(mockData)}. The endpoint was ${selectedEndpoint.method} ${selectedEndpoint.path}. Provide a one-sentence high-density developer insight.`
        });
        setAiInsight(aiResponse.text || null);
      } catch (e) {
        console.error("AI Insight failed", e);
      }
    }
  };

  const filteredEndpoints = endpoints.filter(e => 
    e.summary.toLowerCase().includes(searchQuery.toLowerCase()) || 
    e.path.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-[#0f172a] text-slate-200 overflow-hidden font-sans">
      
      {/* 1. Environment Bar */}
      <header className="h-[50px] bg-slate-800 border-b border-slate-700 shrink-0 flex items-center justify-between px-6 z-30 shadow-lg">
         <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-3">
               <GlobeIcon className="text-indigo-400" size={18} />
               <select 
                 value={server}
                 onChange={(e) => setServer(e.target.value)}
                 className="bg-transparent border-none text-xs font-bold text-white outline-none cursor-pointer hover:text-indigo-300 transition-colors"
               >
                  <option>Production (api.mastercoda.com)</option>
                  <option>Staging (staging-api.mcoda.io)</option>
                  <option>Localhost:3000</option>
                  <option>Mock Server (Simulated)</option>
               </select>
            </div>

            <div className="h-4 w-px bg-slate-700" />

            <button 
              onClick={() => setIsAuth(!isAuth)}
              className={`flex items-center space-x-2 px-3 py-1 rounded-full border transition-all ${
                isAuth ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-slate-700/30 border-slate-600 text-slate-500'
              }`}
            >
               {isAuth ? <LockIcon size={12} /> : <ShieldIcon size={12} />}
               <span className="text-[10px] font-bold uppercase tracking-widest">{isAuth ? 'Authenticated' : 'Public Access'}</span>
            </button>
         </div>

         <div className="flex items-center space-x-4">
            <span className="text-[10px] text-slate-600 font-mono">SPEC_VERSION: v3.1.0</span>
            <Button variant="ghost" size="sm" icon={<CodeIcon size={14}/>}>Edit Spec</Button>
         </div>
      </header>

      {/* 2. Main Content Split */}
      <div className="flex-1 flex overflow-hidden">
         
         {/* LEFT: Endpoint Navigation */}
         <aside className="w-[300px] border-r border-slate-800 bg-slate-900/40 flex flex-col shrink-0">
            <div className="p-4 border-b border-slate-800">
               <div className="relative group">
                  <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={14} />
                  <input 
                    type="text" 
                    placeholder="Filter endpoints..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white focus:border-indigo-500 outline-none"
                  />
               </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
               {/* Simplified tags grouping logic */}
               {Array.from(new Set(endpoints.map(e => e.tag))).map(tag => (
                  <div key={tag} className="mb-4">
                     <h3 className="px-3 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center">
                        <ChevronDownIcon size={10} className="mr-2" />
                        {tag}
                     </h3>
                     <div className="space-y-0.5">
                        {filteredEndpoints.filter(e => e.tag === tag).map(e => (
                           <button
                              key={e.id}
                              onClick={() => setSelectedId(e.id)}
                              className={`w-full flex items-center px-3 py-2 rounded-lg transition-all text-left group ${
                                 selectedId === e.id 
                                    ? 'bg-indigo-600/10 text-indigo-300 border border-indigo-500/30' 
                                    : 'bg-transparent hover:bg-slate-800/50 text-slate-400'
                              }`}
                           >
                              <MethodBadge method={e.method} />
                              <span className={`ml-3 text-xs font-medium truncate ${selectedId === e.id ? 'text-white' : 'text-slate-400'}`}>
                                 {e.path}
                              </span>
                           </button>
                        ))}
                     </div>
                  </div>
               ))}
            </div>
         </aside>

         {/* CENTER: Request Builder */}
         <main className="flex-1 flex flex-col min-w-0 bg-[#0f172a] overflow-hidden">
            <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
               <div className="max-w-3xl mx-auto space-y-10 animate-in fade-in duration-500">
                  
                  {/* Endpoint Header */}
                  <section className="space-y-4">
                     <div className="flex items-center space-x-3">
                        <MethodBadge method={selectedEndpoint.method} large />
                        <h1 className="text-3xl font-bold text-white tracking-tight">{selectedEndpoint.path}</h1>
                     </div>
                     <p className="text-slate-400 leading-relaxed">{selectedEndpoint.summary}</p>
                     <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl font-mono text-sm flex items-center space-x-2 text-slate-500">
                        <span className="text-emerald-500 font-bold">{selectedEndpoint.method}</span>
                        <span className="opacity-50">{server}</span>
                        <span className="text-indigo-400">{previewUrl}</span>
                     </div>
                  </section>

                  {/* Parameters */}
                  {selectedEndpoint.parameters.length > 0 && (
                     <section className="space-y-6">
                        <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] border-b border-slate-800 pb-2">Parameters</h2>
                        <div className="space-y-4">
                           {selectedEndpoint.parameters.map(param => (
                              <div key={param.name} className="flex flex-col md:flex-row md:items-center gap-4 group">
                                 <div className="w-48 shrink-0">
                                    <div className="flex items-center space-x-2">
                                       <span className="text-sm font-bold text-slate-200">{param.name}</span>
                                       {param.required && <span className="text-[9px] text-red-500 font-bold">*</span>}
                                    </div>
                                    <div className="text-[10px] text-slate-500 font-mono uppercase tracking-tighter">{param.in} • {param.type}</div>
                                 </div>
                                 <div className="flex-1">
                                    <input 
                                       type="text" 
                                       value={(param.in === 'path' ? pathParams[param.name] : queryParams[param.name]) || ''}
                                       onChange={(e) => {
                                          if (param.in === 'path') setPathParams({...pathParams, [param.name]: e.target.value});
                                          else setQueryParams({...queryParams, [param.name]: e.target.value});
                                       }}
                                       className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:border-indigo-500 outline-none transition-colors"
                                       placeholder={param.description}
                                    />
                                 </div>
                              </div>
                           ))}
                        </div>
                     </section>
                  )}

                  {/* Request Body */}
                  {selectedEndpoint.requestBody && (
                     <section className="space-y-4">
                        <div className="flex items-center justify-between">
                           <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Request Body</h2>
                           <Badge variant="info">JSON</Badge>
                        </div>
                        <div className="relative group">
                           <div className="absolute -inset-0.5 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-xl blur opacity-25 group-focus-within:opacity-50 transition duration-1000"></div>
                           <textarea 
                              value={requestBody}
                              onChange={(e) => setRequestBody(e.target.value)}
                              className="relative w-full h-[250px] bg-slate-950 border border-slate-700 rounded-xl p-6 text-sm font-mono leading-relaxed text-indigo-300 focus:outline-none focus:border-indigo-500 transition-all custom-scrollbar"
                              spellCheck={false}
                           />
                           <button className="absolute top-4 right-4 text-[10px] font-bold text-slate-600 hover:text-white uppercase tracking-widest">Pre-fill Example</button>
                        </div>
                     </section>
                  )}

                  <div className="pt-6 border-t border-slate-800">
                     <Button 
                       variant="primary" 
                       className="w-full h-14 text-base shadow-[0_0_30px_rgba(79,70,229,0.3)]" 
                       onClick={handleSend}
                       disabled={isSending}
                       icon={isSending ? <RotateCwIcon size={20} className="animate-spin" /> : <SendIcon size={20} />}
                     >
                        {isSending ? 'Sending Request...' : 'Send Request'}
                     </Button>
                  </div>

               </div>
            </div>
         </main>

         {/* RIGHT: Response Console */}
         <aside className="w-[450px] border-l border-slate-800 bg-[#0f1117] flex flex-col shrink-0 relative">
            {/* Loading Bar Strip */}
            {isSending && (
               <div className="absolute top-0 left-0 right-0 h-1 bg-indigo-500 z-50 overflow-hidden">
                  <div className="h-full bg-white/30 animate-[slide-in-from-left-2_1s_infinite]" style={{ width: '40%' }} />
               </div>
            )}

            <div className="h-14 border-b border-slate-800 bg-slate-900/50 flex items-center px-6 justify-between shrink-0">
               <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Response Output</span>
               {response && (
                  <div className="flex items-center space-x-4">
                     <div className="flex items-center space-x-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${response.status >= 400 ? 'bg-red-500' : 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]'}`} />
                        <span className={`text-xs font-bold ${response.status >= 400 ? 'text-red-400' : 'text-emerald-400'}`}>{response.status} {response.statusText}</span>
                     </div>
                     <span className="text-[10px] font-mono text-slate-600 uppercase">{response.time} • {response.size}</span>
                  </div>
               )}
            </div>

            <div className="flex-1 flex flex-col overflow-hidden">
               {response ? (
                  <>
                     <div className="flex border-b border-slate-800 shrink-0">
                        <ResponseTab active={activeTab === 'body'} onClick={() => setActiveTab('body')} label="Body" />
                        <ResponseTab active={activeTab === 'headers'} onClick={() => setActiveTab('headers')} label="Headers" />
                        <ResponseTab active={activeTab === 'curl'} onClick={() => setActiveTab('curl')} label="cURL" />
                     </div>

                     <div className="flex-1 overflow-auto custom-scrollbar p-6 bg-[#0d1117]">
                        {activeTab === 'body' && (
                           <pre className="text-xs font-mono text-indigo-300/90 leading-relaxed selection:bg-indigo-500/30">
                              {JSON.stringify(response.data, null, 2)}
                           </pre>
                        )}
                        {activeTab === 'headers' && (
                           <div className="space-y-2">
                              {Object.entries(response.headers).map(([k, v]) => (
                                 <div key={k} className="flex border-b border-slate-800/50 pb-2">
                                    <span className="text-[10px] font-bold text-slate-500 w-32 shrink-0">{k}:</span>
                                    <span className="text-[10px] font-mono text-slate-300">{String(v)}</span>
                                 </div>
                              ))}
                           </div>
                        )}
                        {activeTab === 'curl' && (
                           <pre className="text-xs font-mono text-emerald-400/80 whitespace-pre-wrap">
                              curl -X {selectedEndpoint.method} "{server}{previewUrl}" \
                              {"\n"}  -H "Content-Type: application/json" \
                              {isAuth ? "\n  -H \"Authorization: Bearer <TOKEN>\"" : ""}
                           </pre>
                        )}
                     </div>

                     {/* AI Insight Footer */}
                     {aiInsight && (
                        <div className="p-6 bg-indigo-900/10 border-t border-indigo-500/20 animate-in slide-in-from-bottom-4 duration-500">
                           <div className="flex items-center text-indigo-400 text-[10px] font-bold uppercase tracking-widest mb-3">
                              <SparklesIcon size={12} className="mr-2 animate-pulse" />
                              AI Diagnostics
                           </div>
                           <p className="text-xs text-indigo-200/80 leading-relaxed italic">
                              "{aiInsight}"
                           </p>
                           <button className="mt-4 text-[10px] font-bold text-indigo-400 uppercase tracking-tighter hover:text-indigo-300">Open Validation Rules &rsaquo;</button>
                        </div>
                     )}
                  </>
               ) : (
                  <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4 opacity-20">
                     <ActivityIcon size={64} className="text-slate-600" />
                     <p className="text-sm font-bold uppercase tracking-widest">Execute a request to view output</p>
                  </div>
               )}
            </div>
            
            <div className="h-[50px] border-t border-slate-800 bg-slate-900 shrink-0 flex items-center justify-between px-6">
               <div className="flex items-center space-x-3">
                  <button className="p-1.5 text-slate-600 hover:text-white transition-colors" title="Copy Output"><ActivityIcon size={14}/></button>
                  <button className="p-1.5 text-slate-600 hover:text-white transition-colors" title="Save as Mock"><RotateCwIcon size={14}/></button>
               </div>
               <div className="text-[10px] text-slate-600 font-mono">NODE_EXEC_v1.2</div>
            </div>
         </aside>

      </div>
    </div>
  );
};

// Sub-components

const MethodBadge: React.FC<{ method: ApiMethod; large?: boolean }> = ({ method, large }) => {
   const colors = {
      GET: 'bg-blue-600/10 text-blue-400 border-blue-500/20',
      POST: 'bg-emerald-600/10 text-emerald-400 border-emerald-500/20',
      PUT: 'bg-amber-600/10 text-amber-400 border-amber-500/20',
      DELETE: 'bg-red-600/10 text-red-400 border-red-500/20',
      PATCH: 'bg-purple-600/10 text-purple-400 border-purple-500/20'
   };

   return (
      <span className={`inline-flex items-center justify-center font-bold font-mono border rounded ${large ? 'px-3 py-1.5 text-sm' : 'w-10 py-0.5 text-[9px]'} ${colors[method]}`}>
         {method}
      </span>
   );
};

const ResponseTab: React.FC<{ active: boolean; onClick: () => void; label: string }> = ({ active, onClick, label }) => (
   <button 
      onClick={onClick}
      className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-widest transition-all relative ${
         active ? 'text-white bg-slate-800/40' : 'text-slate-500 hover:text-slate-300'
      }`}
   >
      {label}
      {active && <div className="absolute bottom-0 inset-x-0 h-0.5 bg-indigo-500" />}
   </button>
);

export default ApiExplorer;
