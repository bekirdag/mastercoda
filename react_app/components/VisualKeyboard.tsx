
import React from 'react';
import { Keybinding } from '../types';

interface VisualKeyboardProps {
  onKeyClick: (key: string) => void;
  activeKey: string | null;
  heatmapData: Keybinding[];
}

const VisualKeyboard: React.FC<VisualKeyboardProps> = ({ onKeyClick, activeKey, heatmapData }) => {
  // Rough QWERTY layout data
  const rows = [
    ['esc', 'f1', 'f2', 'f3', 'f4', 'f5', 'f6', 'f7', 'f8', 'f9', 'f10', 'f11', 'f12'],
    ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'backspace'],
    ['tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\'],
    ['caps', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'", 'enter'],
    ['shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', 'shift_r'],
    ['ctrl', 'alt', 'meta', 'space', 'meta_r', 'alt_r', 'ctrl_r']
  ];

  const getHeatColor = (key: string) => {
    const cleanKey = key.toLowerCase();
    const count = heatmapData.filter(k => k.key.toLowerCase().includes(cleanKey)).length;
    
    if (activeKey?.toLowerCase() === cleanKey) return '#6366f1';
    if (count === 0) return '#1e293b'; // Slate-800
    if (count < 2) return '#312e81'; // Indigo-950
    if (count < 5) return '#4338ca'; // Indigo-700
    return '#6366f1'; // Indigo-500
  };

  const getKeyLabel = (key: string) => {
     if (key === 'meta' || key === 'meta_r') return '⌘';
     if (key === 'alt' || key === 'alt_r') return '⌥';
     if (key === 'ctrl' || key === 'ctrl_r') return '⌃';
     if (key === 'shift' || key === 'shift_r') return '⇧';
     if (key === 'backspace') return '⌫';
     if (key === 'enter') return '↵';
     if (key === 'space') return ' ';
     return key.toUpperCase();
  };

  return (
    <div className="w-full flex flex-col space-y-1 select-none">
       {rows.map((row, ridx) => (
          <div key={ridx} className="flex justify-center space-x-1">
             {row.map(key => {
                const isSpecial = ['tab', 'caps', 'shift', 'ctrl', 'alt', 'meta', 'backspace', 'enter', 'space'].some(s => key.includes(s));
                const width = 
                  key === 'space' ? 'w-32' : 
                  key === 'enter' ? 'w-16' : 
                  key === 'backspace' ? 'w-14' :
                  key === 'tab' || key === 'caps' ? 'w-12' :
                  key === 'shift' || key === 'shift_r' ? 'w-16' :
                  isSpecial ? 'w-10' : 'w-7';

                return (
                   <div 
                      key={key}
                      onClick={() => onKeyClick(key.split('_')[0])}
                      style={{ backgroundColor: getHeatColor(key.split('_')[0]) }}
                      className={`${width} h-7 rounded border border-white/5 flex items-center justify-center text-[8px] font-bold text-white/70 cursor-pointer hover:border-white/30 hover:scale-105 active:scale-95 transition-all shadow-inner`}
                      title={`Key: ${key.toUpperCase()}`}
                   >
                      {getKeyLabel(key)}
                   </div>
                );
             })}
          </div>
       ))}
    </div>
  );
};

export default VisualKeyboard;
