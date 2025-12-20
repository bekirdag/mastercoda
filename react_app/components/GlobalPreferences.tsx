import React, { useState, useEffect, useMemo } from 'react';
import Button from './Button';
import Badge from './Badge';
import { 
  SettingsIcon, 
  SparklesIcon, 
  CodeIcon, 
  ShieldIcon, 
  RotateCwIcon, 
  GlobeIcon, 
  ChevronRightIcon, 
  SearchIcon, 
  // Fix: Removed MonitorIcon from import since it is not exported from Icons.tsx and a local Proxy is used instead
  ActivityIcon,
  LockIcon,
  TrashIcon,
  CheckCircleIcon,
  AlertTriangleIcon,
  RefreshCwIcon,
  ChevronDownIcon
} from './Icons';

type SettingCategory = 'general' | 'appearance' | 'editor' | 'accessibility' | 'notifications' | 'sync';

const THEMES = [
  { id: 'dracula', name: 'Dracula', color: '#282a36', accent: '#bd93f9' },
  { id: 'nord', name: 'Nordic', color: '#2e3440', accent: '#88c0d0' },
  { id: 'cyber', name: 'Cyber Cyan', color: '#020617', accent: '#22d3ee' },
  { id: 'slate', name: 'Slate Prime', color: '#0f172a', accent: '#6366f1' },
];

const GlobalPreferences: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<SettingCategory>('general');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [lastSynced, setLastSynced] = useState('2 mins ago');

  // Preferences State
  const [prefs, setPrefs] = useState({
    language: 'English',
    startup: 'dashboard',
    telemetry: true,
    themeMode: 'dark',
    activeTheme: 'slate',
    zenMode: false,
    fontFamily: 'JetBrains Mono, Menlo',
    fontSize: 14,
    ligatures: true,
    wordWrap: true,
    zoom: 100,
    reducedMotion: false,
    highContrast: false,
    screenReader: false,
    dnd: false,
    sound: true
  });

  const handlePrefChange = (key: string, value: any) => {
    setPrefs(prev => ({ ...prev, [key]: value }));
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 600);
  };

  const categories: { id: SettingCategory; label: string; icon: React.ReactNode }[] = [
    { id: 'general', label: 'General', icon: <SettingsIcon size={14} /> },
    { id: 'appearance', label: 'Appearance', icon: <SparklesIcon size={14} /> },
    { id: 'editor', label: 'Editor', icon: <CodeIcon size={14} /> },
    { id: 'accessibility', label: 'Accessibility', icon: <ActivityIcon size={14} /> },
    { id: 'notifications', label: 'Notifications', icon: <GlobeIcon size={14} /> },
    { id: 'sync', label: 'Cloud Sync', icon: <RotateCwIcon size={14} /> },
  ];

  const filteredCategories = categories.filter(c => 
    c.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-full bg-[#0f172a] text-slate-200 overflow-hidden font-sans">
      
      {/* 1. Navigation Sidebar */}
      <aside className="w-[280px] border-r border-slate-800 bg-slate-900/40 flex flex-col shrink-0">
        <div className="p-6 border-b border-slate-800 bg-slate-900/50">
          <div className="relative group">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={14} />
            <input 
              type="text" 
              placeholder="Search settings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-xs text-white focus:border-indigo-500 outline-none transition-all"
            />
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-1">
          {filteredCategories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`w-full flex items-center px-4 py-3 rounded-xl transition-all group ${
                activeCategory === cat.id 
                  ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 shadow-lg' 
                  : 'text-slate-500 hover:bg-slate-800 hover:text-slate-300 border border-transparent'
              }`}
            >
              <span className={`mr-3 transition-transform group-hover:scale-110 ${activeCategory === cat.id ? 'text-indigo-400' : 'text-slate-600'}`}>
                {cat.icon}
              </span>
              <span className="text-sm font-bold tracking-tight">{cat.label}</span>
              {activeCategory === cat.id && (
                <div className="ml-auto w-1 h-4 bg-indigo-500 rounded-full animate-in slide-in-from-right-1" />
              )}
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-slate-800 bg-slate-900/50">
           <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">
              <span>Environment State</span>
              <div className="flex items-center text-emerald-500">
                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2 animate-pulse" />
                 SYNCED
              </div>
           </div>
           <button className="w-full py-2 bg-slate-800 border border-slate-700 rounded-lg text-[10px] font-bold text-slate-400 hover:text-white transition-all uppercase tracking-tighter flex items-center justify-center">
              <CodeIcon size={12} className="mr-2" /> Open settings.json
           </button>
        </div>
      </aside>

      {/* 2. Main Content Stage */}
      <main className="flex-1 overflow-y-auto custom-scrollbar bg-[#0d1117]">
         <div className="max-w-[800px] mx-auto p-12 space-y-12 animate-in fade-in duration-500">
            
            {/* Context Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-8">
               <div className="space-y-1">
                  <h2 className="text-3xl font-bold text-white tracking-tight capitalize">
                    {activeCategory} Preferences
                  </h2>
                  <p className="text-slate-500 text-sm">Configure your personal application environment and behavior.</p>
               </div>
               {isSaving && (
                 <div className="flex items-center text-xs font-mono text-indigo-400 font-bold bg-indigo-900/20 px-3 py-1.5 rounded-full border border-indigo-500/30 animate-pulse">
                    <RefreshCwIcon size={12} className="animate-spin mr-2" />
                    AUTOSAVING...
                 </div>
               )}
            </div>

            <div className="space-y-10 pb-20">
               {activeCategory === 'general' && (
                  <>
                     <SettingSection title="Localization">
                        <SettingField label="App Language" desc="Select your preferred display language for the UI.">
                           <select 
                              value={prefs.language} 
                              onChange={(e) => handlePrefChange('language', e.target.value)}
                              className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-300 focus:border-indigo-500 outline-none w-48"
                           >
                              <option>English</option>
                              <option>Spanish</option>
                              <option>German</option>
                              <option>Japanese</option>
                           </select>
                        </SettingField>
                     </SettingSection>

                     <SettingSection title="Startup Behavior">
                        <SettingField label="Default View" desc="Choose what you see first when launching Master Coda.">
                           <div className="flex flex-col space-y-2">
                              <RadioOption label="Restore Last Session" active={prefs.startup === 'restore'} onClick={() => handlePrefChange('startup', 'restore')} />
                              <RadioOption label="Open Dashboard" active={prefs.startup === 'dashboard'} onClick={() => handlePrefChange('startup', 'dashboard')} />
                              <RadioOption label="Open Empty Workspace" active={prefs.startup === 'empty'} onClick={() => handlePrefChange('startup', 'empty')} />
                           </div>
                        </SettingField>
                     </SettingSection>

                     <SettingSection title="Privacy & Telemetry">
                        <ToggleSetting 
                           label="Anonymous Usage Reports" 
                           desc="Help us optimize performance by sharing non-sensitive usage metadata."
                           checked={prefs.telemetry}
                           onChange={(v) => handlePrefChange('telemetry', v)}
                        />
                     </SettingSection>
                  </>
               )}

               {activeCategory === 'appearance' && (
                  <>
                     <SettingSection title="Theme Engine">
                        <SettingField label="Interface Mode" desc="Switch between light, dark, or system preferences.">
                           <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 w-fit">
                              {['light', 'dark', 'system'].map(m => (
                                 <button
                                    key={m}
                                    onClick={() => handlePrefChange('themeMode', m)}
                                    className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all ${
                                       prefs.themeMode === m ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'
                                    }`}
                                 >
                                    {m}
                                 </button>
                              ))}
                           </div>
                        </SettingField>

                        <div className="space-y-4 pt-4">
                           <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Active Skin</label>
                           <div className="grid grid-cols-2 gap-4">
                              {THEMES.map(theme => (
                                 <button
                                    key={theme.id}
                                    onClick={() => handlePrefChange('activeTheme', theme.id)}
                                    className={`p-4 rounded-2xl border-2 text-left transition-all relative overflow-hidden group ${
                                       prefs.activeTheme === theme.id ? 'border-indigo-500 bg-slate-800 shadow-xl' : 'border-slate-800 bg-slate-900/50 hover:border-slate-700'
                                    }`}
                                 >
                                    <div className="flex items-center space-x-3 relative z-10">
                                       <div className="w-8 h-8 rounded-lg shadow-inner flex items-center justify-center text-xs" style={{ backgroundColor: theme.color }}>
                                          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: theme.accent }} />
                                       </div>
                                       <span className={`text-sm font-bold ${prefs.activeTheme === theme.id ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`}>
                                          {theme.name}
                                       </span>
                                    </div>
                                    {prefs.activeTheme === theme.id && (
                                       <div className="absolute right-3 top-1/2 -translate-y-1/2 text-indigo-500">
                                          <CheckCircleIcon size={20} />
                                       </div>
                                    )}
                                 </button>
                              ))}
                           </div>
                        </div>
                     </SettingSection>

                     <SettingSection title="Productivity Mode">
                        <ToggleSetting 
                           label="Zen Mode" 
                           desc="Hides project toolbars and navigation sidebars by default while editing."
                           checked={prefs.zenMode}
                           onChange={(v) => handlePrefChange('zenMode', v)}
                        />
                     </SettingSection>
                  </>
               )}

               {activeCategory === 'editor' && (
                  <>
                     <SettingSection title="Typography Defaults">
                        <SettingField label="Font Family" desc="Comma-separated list of monospace fonts.">
                           <input 
                              type="text" 
                              value={prefs.fontFamily}
                              onChange={(e) => handlePrefChange('fontFamily', e.target.value)}
                              className="w-full max-w-sm bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-sm text-indigo-300 font-mono focus:border-indigo-500 outline-none"
                           />
                        </SettingField>

                        <SettingField label="Font Size" desc={`Base size for code elements: ${prefs.fontSize}px`}>
                           <div className="flex items-center space-x-4 w-full max-w-sm">
                              <input 
                                 type="range" min="10" max="24" step="1" 
                                 value={prefs.fontSize}
                                 onChange={(e) => handlePrefChange('fontSize', parseInt(e.target.value))}
                                 className="flex-1 accent-indigo-500" 
                              />
                              <div className="w-10 text-center font-mono text-xs text-white">{prefs.fontSize}</div>
                           </div>
                        </SettingField>
                     </SettingSection>

                     <SettingSection title="Formatting">
                        <ToggleSetting 
                           label="Font Ligatures" 
                           desc="Enables glyph combinations for operators (e.g. =>, !=)."
                           checked={prefs.ligatures}
                           onChange={(v) => handlePrefChange('ligatures', v)}
                        />
                        <ToggleSetting 
                           label="Word Wrap" 
                           desc="Automatically wraps long lines of code based on viewport width."
                           checked={prefs.wordWrap}
                           onChange={(v) => handlePrefChange('wordWrap', v)}
                        />
                     </SettingSection>
                  </>
               )}

               {activeCategory === 'accessibility' && (
                  <>
                     <SettingSection title="Visual Aids">
                        <SettingField label="Interface Scaling" desc={`Current Zoom: ${prefs.zoom}%`}>
                           <div className="flex items-center space-x-4 w-full max-w-sm">
                              <input 
                                 type="range" min="80" max="200" step="10" 
                                 value={prefs.zoom}
                                 onChange={(e) => handlePrefChange('zoom', parseInt(e.target.value))}
                                 className="flex-1 accent-indigo-500" 
                              />
                              <div className="w-12 text-center font-mono text-xs text-white">{prefs.zoom}%</div>
                           </div>
                        </SettingField>

                        <ToggleSetting 
                           label="Reduced Motion" 
                           desc="Disables high-framerate transitions and background animations."
                           checked={prefs.reducedMotion}
                           onChange={(v) => handlePrefChange('reducedMotion', v)}
                        />
                        <ToggleSetting 
                           label="High Contrast Colors" 
                           desc="Enforces WCAG AAA compliance across all theme variations."
                           checked={prefs.highContrast}
                           onChange={(v) => handlePrefChange('highContrast', v)}
                        />
                        <ToggleSetting 
                           label="Screen Reader Mode" 
                           desc="Simplifies the DOM structure and enables aggressive ARIA labeling."
                           checked={prefs.screenReader}
                           onChange={(v) => handlePrefChange('screenReader', v)}
                        />
                     </SettingSection>
                  </>
               )}

               {activeCategory === 'sync' && (
                  <>
                     <SettingSection title="Account Synchronization">
                        <div className="bg-indigo-900/10 border border-indigo-500/20 rounded-2xl p-6 flex items-start space-x-4">
                           <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center shrink-0 shadow-lg shadow-indigo-900/50">
                              <RotateCwIcon size={24} className="text-white animate-spin-slow" />
                           </div>
                           <div className="flex-1 space-y-1">
                              <h4 className="text-sm font-bold text-white uppercase tracking-wider">Cloud Engine Active</h4>
                              <p className="text-xs text-indigo-200/60 leading-relaxed">
                                 Your preferences are currently synced to <strong className="text-indigo-300">alice@mastercoda.com</strong>. Changes on this machine will reflect across your Windows and Linux nodes automatically.
                              </p>
                              <div className="pt-2 flex items-center text-[10px] font-mono text-slate-500">
                                 LAST_SYNC: {lastSynced.toUpperCase()}
                              </div>
                           </div>
                           <Button variant="secondary" size="sm">Force Push</Button>
                        </div>
                     </SettingSection>

                     <SettingSection title="Device Registry">
                        <div className="space-y-3">
                           <DeviceItem name="MacBook Pro (M3)" status="Current Device" icon={<MonitorIconProxy size={14}/>} />
                           <DeviceItem name="Engineering-WS-01" status="Last seen 4h ago" icon={<ActivityIcon size={14}/>} />
                        </div>
                     </SettingSection>

                     <section className="bg-red-950/10 border border-red-500/20 rounded-2xl p-6 space-y-4">
                        <div className="flex items-center text-red-400 text-xs font-bold uppercase tracking-widest">
                           <AlertTriangleIcon size={16} className="mr-2" />
                           Conflict Management
                        </div>
                        <p className="text-xs text-slate-400">If cloud settings differ from local state, a prompt will appear on next launch.</p>
                        <button className="text-xs font-bold text-red-400 hover:text-red-300 underline uppercase tracking-tighter">Reset Remote Profile</button>
                     </section>
                  </>
               )}
            </div>

            {/* Global Actions Footer */}
            <div className="pt-10 border-t border-slate-800 flex items-center justify-between">
               <button className="text-xs font-bold text-slate-600 hover:text-red-400 transition-colors uppercase tracking-widest flex items-center">
                  <TrashIcon size={14} className="mr-2" /> Reset all categories to default
               </button>
               <div className="flex items-center space-x-4">
                  <span className="text-[10px] text-slate-700 font-mono">SYSTEM_BUILD: 24.2.1-X</span>
               </div>
            </div>
         </div>
      </main>

    </div>
  );
};

// Sub-components

const SettingSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
   <section className="space-y-6">
      <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] border-b border-slate-800 pb-2">{title}</h3>
      <div className="space-y-6">
         {children}
      </div>
   </section>
);

const SettingField: React.FC<{ label: string; desc: string; children: React.ReactNode }> = ({ label, desc, children }) => (
   <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 group">
      <div className="max-w-md">
         <div className="text-sm font-bold text-slate-200 group-hover:text-indigo-300 transition-colors">{label}</div>
         <p className="text-xs text-slate-500 mt-1 leading-relaxed">{desc}</p>
      </div>
      <div className="shrink-0">
         {children}
      </div>
   </div>
);

const ToggleSetting: React.FC<{ label: string; desc: string; checked: boolean; onChange: (v: boolean) => void }> = ({ label, desc, checked, onChange }) => (
   <div 
      onClick={() => onChange(!checked)}
      className="flex items-start justify-between gap-6 group cursor-pointer p-3 -mx-3 rounded-xl hover:bg-slate-800/30 transition-all"
   >
      <div className="max-w-md">
         <div className="text-sm font-bold text-slate-200 group-hover:text-indigo-300 transition-colors">{label}</div>
         <p className="text-xs text-slate-500 mt-1 leading-relaxed">{desc}</p>
      </div>
      <div className={`w-12 h-6 rounded-full p-1 transition-all duration-300 relative shrink-0 mt-1 ${checked ? 'bg-indigo-600' : 'bg-slate-700'}`}>
         <div className={`w-4 h-4 bg-white rounded-full shadow-lg transition-transform duration-300 ${checked ? 'translate-x-6' : 'translate-x-0'}`} />
      </div>
   </div>
);

const RadioOption: React.FC<{ label: string; active: boolean; onClick: () => void }> = ({ label, active, onClick }) => (
   <div 
      onClick={onClick}
      className="flex items-center space-x-3 cursor-pointer group"
   >
      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${active ? 'border-indigo-500 bg-indigo-500/10' : 'border-slate-700 group-hover:border-slate-500'}`}>
         {active && <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 shadow-[0_0_8px_#6366f1]" />}
      </div>
      <span className={`text-xs ${active ? 'text-white font-bold' : 'text-slate-400 group-hover:text-slate-200'}`}>{label}</span>
   </div>
);

const DeviceItem: React.FC<{ name: string; status: string; icon: React.ReactNode }> = ({ name, status, icon }) => (
   <div className="flex items-center justify-between p-4 bg-slate-900 border border-slate-800 rounded-xl hover:border-slate-700 transition-all group">
      <div className="flex items-center space-x-4">
         <div className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-400 group-hover:text-indigo-400 transition-colors">
            {icon}
         </div>
         <div>
            <div className="text-xs font-bold text-slate-200">{name}</div>
            <div className="text-[10px] text-slate-500 font-mono uppercase">{status}</div>
         </div>
      </div>
      <button className="text-[10px] font-bold text-slate-600 hover:text-red-400 uppercase tracking-widest transition-colors">Disconnect</button>
   </div>
);

const MonitorIconProxy: React.FC<any> = (props) => (
   <svg
     xmlns="http://www.w3.org/2000/svg"
     width={props.size || 20}
     height={props.size || 20}
     viewBox="0 0 24 24"
     fill="none"
     stroke="currentColor"
     strokeWidth="2"
     strokeLinecap="round"
     strokeLinejoin="round"
     {...props}
   >
     <rect width="20" height="14" x="2" y="3" rx="2" />
     <line x1="8" x2="16" y1="21" y2="21" />
     <line x1="12" x2="12" y1="17" y2="21" />
   </svg>
);

export default GlobalPreferences;
