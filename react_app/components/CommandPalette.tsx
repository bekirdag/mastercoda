import React, { useEffect, useState } from 'react';
import { SearchIcon, TerminalIcon, FileTextIcon, SettingsIcon, CommandIcon } from './Icons';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]" role="dialog">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-2xl bg-slate-800 rounded-lg shadow-2xl border border-slate-700 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
        <div className="flex items-center px-4 py-3 border-b border-slate-700">
          <SearchIcon className="text-slate-400 w-5 h-5 mr-3" />
          <input
            autoFocus
            type="text"
            placeholder="Type a command or search..."
            className="flex-1 bg-transparent border-none outline-none text-slate-200 placeholder-slate-500 text-lg"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="flex items-center space-x-1">
             <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-xs font-mono font-medium text-slate-400 bg-slate-700 rounded border border-slate-600">ESC</kbd>
          </div>
        </div>
        
        <div className="max-h-[60vh] overflow-y-auto p-2">
          <div className="px-2 py-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Suggested</div>
          <CommandItem icon={<TerminalIcon size={16} />} label="Run Test Suite" shortcut="⌘T" />
          <CommandItem icon={<FileTextIcon size={16} />} label="Search Files" shortcut="⌘P" />
          <CommandItem icon={<SettingsIcon size={16} />} label="Open Settings" shortcut="⌘," />
          <div className="px-2 py-1.5 mt-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Recent</div>
          <CommandItem icon={<CommandIcon size={16} />} label="Deploy to Staging" />
          <CommandItem icon={<CommandIcon size={16} />} label="Restart Server" />
        </div>
        
        <div className="px-4 py-2 bg-slate-850 border-t border-slate-700 flex justify-between items-center text-xs text-slate-500">
          <span><strong className="text-indigo-400">Master Coda</strong> Command Line</span>
          <span className="flex items-center"><span className="mr-1">Select</span> ↵</span>
        </div>
      </div>
    </div>
  );
};

const CommandItem: React.FC<{ icon: React.ReactNode; label: string; shortcut?: string }> = ({ icon, label, shortcut }) => (
  <button className="w-full flex items-center justify-between px-3 py-2.5 text-left text-slate-300 hover:bg-indigo-600 hover:text-white rounded-md group transition-colors">
    <div className="flex items-center">
      <span className="text-slate-400 group-hover:text-white transition-colors">{icon}</span>
      <span className="ml-3 font-medium">{label}</span>
    </div>
    {shortcut && (
      <span className="text-xs font-mono text-slate-500 group-hover:text-indigo-200">{shortcut}</span>
    )}
  </button>
);

export default CommandPalette;