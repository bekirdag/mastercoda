
import React, { useState, useEffect } from 'react';
import { ThemeDefinition, IconPack } from '../types';
import { MOCK_THEMES, MOCK_ICON_SETS } from '../constants';
import Button from './Button';
import { 
  RotateCwIcon, 
  SaveIcon, 
  ChevronDownIcon, 
  ActivityIcon, 
  SearchIcon, 
  GridIcon, 
  CheckCircleIcon,
  AlertTriangleIcon,
  CodeIcon,
  TerminalIcon,
  ChevronRightIcon
} from './Icons';

const ThemeStudio: React.FC = () => {
  const [activeTheme, setActiveTheme] = useState<ThemeDefinition>(MOCK_THEMES[0]);
  const [activeIcons, setActiveIcons] = useState<IconPack>(MOCK_ICON_SETS[0]);
  const [simulationFilter, setSimulationFilter] = useState<'none' | 'protanopia' | 'deuteranopia'>('none');
  const [isSaving, setIsSaving] = useState(false);

  // Update theme colors handler
  const updateColor = (group: 'colors' | 'syntax', key: string, value: string) => {
    setActiveTheme(prev => ({
      ...prev,
      [group]: { ...prev[group as keyof ThemeDefinition], [key]: value }
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(r => setTimeout(r, 1000));
    setIsSaving(false);
  };

  const getContrastRatio = (bg: string, fg: string) => {
    // Simplified contrast indicator for UI
    return "4.5 (AA)";
  };

  return (
    <div className="flex flex-col h-full bg-[#0f172a] text-slate-200 overflow-hidden font-sans relative">
      
      {/* 1. Floating Glass Toolbar */}
      <header className="h-[64px] border-b border-slate-800 bg-slate-900/50 backdrop-blur shrink-0 flex items-center justify-between px-8 z-30 sticky top-0">
         <div className="flex items-center space-x-6">
            <div className="flex items-center">
               <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 mr-3 shadow-lg" />
               <h1 className="text-xl font-bold text-white tracking-tight">Theme & Icon Studio</h1>
            </div>

            <div className="h-6 w-px bg-slate-800" />

            <div className="flex items-center space-x-4">
               {/* Theme Dropdown */}
               <div className="flex flex-col">
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest leading-none mb-1">Base Theme</span>
                  <select 
                     className="bg-transparent border-none text-xs font-bold text-indigo-400 outline-none p-0 cursor-pointer"
                     value={activeTheme.id}
                     onChange={(e) => {
                        const found = MOCK_THEMES.find(t => t.id === e.target.value);
                        if (found) setActiveTheme(found);
                     }}
                  >
                     {MOCK_THEMES.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
               </div>

               {/* Icon Pack Dropdown */}
               <div className="flex flex-col">
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest leading-none mb-1">Icon Pack</span>
                  <select 
                     className="bg-transparent border-none text-xs font-bold text-indigo-400 outline-none p-0 cursor-pointer"
                     value={activeIcons.id}
                     onChange={(e) => {
                        const found = MOCK_ICON_SETS.find(i => i.id === e.target.value);
                        if (found) setActiveIcons(found);
                     }}
                  >
                     {MOCK_ICON_SETS.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
                  </select>
               </div>
            </div>
         </div>

         <div className="flex items-center space-x-3">
            <Button variant="secondary" size="sm" icon={<RotateCwIcon size={14} />}>Reset</Button>
            <Button 
               variant="primary" 
               size="sm" 
               icon={isSaving ? <RotateCwIcon size={14} className="animate-spin" /> : <SaveIcon size={14} />}
               onClick={handleSave}
               disabled={isSaving}
            >
               {isSaving ? 'Saving...' : 'Save Remix'}
            </Button>
         </div>
      </header>

      {/* 2. Main Studio Split Area */}
      <div className="flex-1 flex overflow-hidden">
         
         {/* LEFT: Controls (300px) */}
         <aside className="w-[320px] border-r border-slate-800 bg-slate-900/30 flex flex-col shrink-0">
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-10">
               
               {/* Group: Global Colors */}
               <section className="space-y-4">
                  <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Global Palette</h3>
                  <div className="space-y-3">
                     <ColorInput label="Background" value={activeTheme.colors.background} onChange={val => updateColor('colors', 'background', val)} />
                     <ColorInput label="Foreground" value={activeTheme.colors.foreground} onChange={val => updateColor('colors', 'foreground', val)} badge={getContrastRatio(activeTheme.colors.background, activeTheme.colors.foreground)} />
                     <ColorInput label="Accent" value={activeTheme.colors.accent} onChange={val => updateColor('colors', 'accent', val)} />
                     <ColorInput label="Borders" value={activeTheme.colors.border} onChange={val => updateColor('colors', 'border', val)} />
                  </div>
               </section>

               {/* Group: Syntax Highlighting */}
               <section className="space-y-4">
                  <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Syntax Tokens</h3>
                  <div className="space-y-3">
                     <ColorInput label="Keywords" value={activeTheme.syntax.keyword} onChange={val => updateColor('syntax', 'keyword', val)} />
                     <ColorInput label="Strings" value={activeTheme.syntax.string} onChange={val => updateColor('syntax', 'string', val)} />
                     <ColorInput label="Functions" value={activeTheme.syntax.function} onChange={val => updateColor('syntax', 'function', val)} />
                     <ColorInput label="Comments" value={activeTheme.syntax.comment} onChange={val => updateColor('syntax', 'comment', val)} />
                  </div>
               </section>

               {/* Group: Typography */}
               <section className="space-y-4">
                  <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Typography</h3>
                  <div className="space-y-4">
                     <div className="space-y-1.5">
                        <label className="text-xs text-slate-400 font-medium">Font Family</label>
                        <select className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1.5 text-xs text-slate-300 outline-none focus:border-indigo-500 font-mono">
                           <option>JetBrains Mono</option>
                           <option>Fira Code</option>
                           <option>Inter</option>
                           <option>Roboto Mono</option>
                        </select>
                     </div>
                     <div className="space-y-1.5">
                        <div className="flex justify-between text-xs text-slate-400">
                           <span>Size</span>
                           <span className="font-mono text-indigo-400">{activeTheme.typography.fontSize}px</span>
                        </div>
                        <input type="range" min="10" max="24" className="w-full accent-indigo-500" defaultValue={activeTheme.typography.fontSize} />
                     </div>
                  </div>
               </section>

               {/* Group: Accessibility Simulation */}
               <section className="bg-indigo-900/10 border border-indigo-500/20 rounded-xl p-4 space-y-4">
                  <div className="flex items-center space-x-2">
                     <ActivityIcon size={14} className="text-indigo-400" />
                     <h3 className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest">A11y Inspector</h3>
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] text-slate-500 font-bold uppercase">Vision Simulation</label>
                     <select 
                        className="w-full bg-slate-950/50 border border-indigo-500/20 rounded px-2 py-1 text-xs text-slate-300 outline-none"
                        value={simulationFilter}
                        onChange={(e) => setSimulationFilter(e.target.value as any)}
                     >
                        <option value="none">None (Standard)</option>
                        <option value="protanopia">Protanopia</option>
                        <option value="deuteranopia">Deuteranopia</option>
                     </select>
                  </div>
               </section>

            </div>
         </aside>

         {/* RIGHT: Live Preview (Fluid) */}
         <main className="flex-1 bg-slate-950 p-8 flex items-center justify-center relative overflow-hidden">
            {/* Simulation Filter Overlay */}
            <div className={`absolute inset-0 z-40 pointer-events-none transition-all duration-500 ${
               simulationFilter === 'protanopia' ? 'grayscale brightness-125' : 
               simulationFilter === 'deuteranopia' ? 'sepia hue-rotate-180 brightness-90' : ''
            }`} />

            <div 
               className="w-full max-w-[900px] aspect-video bg-white/5 rounded-2xl border shadow-2xl overflow-hidden flex animate-in zoom-in-95 duration-700"
               style={{ 
                  borderColor: activeTheme.colors.border,
                  backgroundColor: activeTheme.colors.background,
                  color: activeTheme.colors.foreground,
                  fontFamily: activeTheme.typography.fontFamily
               }}
            >
               {/* Mock Sidebar */}
               <div 
                  className="w-16 border-r flex flex-col items-center py-4 space-y-6 shrink-0"
                  style={{ backgroundColor: activeTheme.colors.sidebar, borderColor: activeTheme.colors.border }}
               >
                  <div className="w-8 h-8 rounded bg-indigo-500" />
                  <div className="space-y-4 opacity-50">
                     <div className="w-6 h-6 rounded bg-slate-700" />
                     <div className="w-6 h-6 rounded bg-slate-700" />
                     <div className="w-6 h-6 rounded bg-slate-700" />
                  </div>
               </div>

               {/* Mock Code Editor */}
               <div className="flex-1 flex flex-col">
                  {/* Tabs */}
                  <div className="h-8 border-b flex items-center px-4 space-x-2" style={{ borderColor: activeTheme.colors.border, backgroundColor: activeTheme.colors.sidebar }}>
                     <div className="flex items-center px-3 h-full border-t border-indigo-500 bg-slate-800 text-[10px] font-mono" style={{ backgroundColor: activeTheme.colors.background }}>
                        app.tsx
                     </div>
                     <div className="text-[10px] text-slate-500 font-mono">constants.ts</div>
                  </div>

                  {/* Lines */}
                  <div className="flex-1 p-6 font-mono text-sm leading-relaxed overflow-hidden">
                     <div className="flex items-start">
                        <span className="w-8 shrink-0 text-slate-600 select-none text-[10px] pr-2 text-right">1</span>
                        <div className="flex-1">
                           <span style={{ color: activeTheme.syntax.keyword }}>import</span> React <span style={{ color: activeTheme.syntax.keyword }}>from</span> <span style={{ color: activeTheme.syntax.string }}>'react'</span>;
                        </div>
                     </div>
                     <div className="flex items-start">
                        <span className="w-8 shrink-0 text-slate-600 select-none text-[10px] pr-2 text-right">2</span>
                        <div className="flex-1">
                           <span style={{ color: activeTheme.syntax.comment }}>// Initializing primary UI context</span>
                        </div>
                     </div>
                     <div className="flex items-start">
                        <span className="w-8 shrink-0 text-slate-600 select-none text-[10px] pr-2 text-right">3</span>
                        <div className="flex-1">
                           <span style={{ color: activeTheme.syntax.keyword }}>export const</span> <span style={{ color: activeTheme.syntax.function }}>App</span> = () =&gt; {"{"}
                        </div>
                     </div>
                     <div className="flex items-start">
                        <span className="w-8 shrink-0 text-slate-600 select-none text-[10px] pr-2 text-right">4</span>
                        <div className="flex-1 pl-4">
                           <span style={{ color: activeTheme.syntax.keyword }}>const</span> [state, setState] = <span style={{ color: activeTheme.syntax.function }}>useState</span>();
                        </div>
                     </div>
                     <div className="flex items-start">
                        <span className="w-8 shrink-0 text-slate-600 select-none text-[10px] pr-2 text-right">5</span>
                        <div className="flex-1 pl-4">
                           <span style={{ color: activeTheme.syntax.keyword }}>return</span> (
                        </div>
                     </div>
                     <div className="flex items-start">
                        <span className="w-8 shrink-0 text-slate-600 select-none text-[10px] pr-2 text-right">6</span>
                        <div className="flex-1 pl-8">
                           &lt;<span style={{ color: activeTheme.syntax.keyword }}>div</span> <span style={{ color: activeTheme.syntax.function }}>className</span>=<span style={{ color: activeTheme.syntax.string }}>"bg-slate-900"</span>&gt;
                        </div>
                     </div>
                     <div className="flex items-start">
                        <span className="w-8 shrink-0 text-slate-600 select-none text-[10px] pr-2 text-right">7</span>
                        <div className="flex-1 pl-12">
                           Hello World
                        </div>
                     </div>
                     <div className="flex items-start">
                        <span className="w-8 shrink-0 text-slate-600 select-none text-[10px] pr-2 text-right">8</span>
                        <div className="flex-1 pl-8">
                           &lt;/<span style={{ color: activeTheme.syntax.keyword }}>div</span>&gt;
                        </div>
                     </div>
                     <div className="flex items-start">
                        <span className="w-8 shrink-0 text-slate-600 select-none text-[10px] pr-2 text-right">9</span>
                        <div className="flex-1 pl-4">
                           );
                        </div>
                     </div>
                     <div className="flex items-start">
                        <span className="w-8 shrink-0 text-slate-600 select-none text-[10px] pr-2 text-right">10</span>
                        <div className="flex-1">
                           {"}"};
                        </div>
                     </div>
                  </div>

                  {/* Mock Terminal */}
                  <div className="h-24 border-t p-3 font-mono text-[10px]" style={{ backgroundColor: activeTheme.colors.terminal, borderColor: activeTheme.colors.border }}>
                     <div className="text-emerald-500">user@mcoda:~/workspace $ <span className="text-white">npm run dev</span></div>
                     <div className="text-slate-500">Starting Master Coda dev server...</div>
                     <div className="text-indigo-400">Ready in 340ms.</div>
                     <div className="animate-pulse">_</div>
                  </div>
               </div>
            </div>

            {/* Hint Overlay */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-slate-900/80 border border-slate-800 rounded-full text-[10px] text-slate-500 font-bold uppercase tracking-widest pointer-events-none">
               Real-time Sandbox Preview
            </div>
         </main>

      </div>
    </div>
  );
};

const ColorInput: React.FC<{ label: string; value: string; onChange: (val: string) => void; badge?: string }> = ({ label, value, onChange, badge }) => (
   <div className="flex items-center justify-between group">
      <div className="flex flex-col">
         <span className="text-xs font-medium text-slate-300">{label}</span>
         {badge && <span className="text-[9px] font-bold text-emerald-500 mt-0.5">{badge}</span>}
      </div>
      <div className="flex items-center space-x-2">
         <input 
            type="text" 
            value={value} 
            onChange={(e) => onChange(e.target.value)}
            className="w-16 bg-transparent border-none text-[10px] font-mono text-right focus:ring-0 text-slate-500" 
         />
         <div 
            className="w-8 h-8 rounded border border-slate-700 relative overflow-hidden cursor-pointer hover:scale-110 transition-transform shadow-inner"
            style={{ backgroundColor: value }}
         >
            <input 
               type="color" 
               value={value} 
               onChange={(e) => onChange(e.target.value)}
               className="absolute inset-0 opacity-0 w-full h-full cursor-pointer" 
            />
         </div>
      </div>
   </div>
);

export default ThemeStudio;
