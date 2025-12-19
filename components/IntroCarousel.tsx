import React, { useState } from 'react';
import Button from './Button';
import { TerminalIcon, SparklesIcon, GitBranchIcon, ActivityIcon, CheckCircleIcon } from './Icons';

interface IntroCarouselProps {
  onFinish: () => void;
}

const IntroCarousel: React.FC<IntroCarouselProps> = ({ onFinish }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 'architecture',
      title: "The Power of CLI, The Ease of UI",
      body: "Master Coda is a visual control plane for the mcoda toolkit. We handle the visualization; the CLI handles the heavy lifting.",
      renderGraphic: () => (
        <div className="relative w-64 h-64 flex items-center justify-center">
            {/* Background Glow */}
            <div className="absolute inset-0 bg-indigo-500/10 blur-3xl rounded-full" />
            
            {/* Center Core (CLI) */}
            <div className="relative z-10 bg-slate-900 border border-slate-700 p-6 rounded-lg shadow-2xl transform rotate-3 transition-transform duration-700 hover:rotate-0">
                <div className="flex items-center space-x-2 mb-2 border-b border-slate-800 pb-2">
                    <div className="w-2 h-2 rounded-full bg-red-500/50" />
                    <div className="w-2 h-2 rounded-full bg-amber-500/50" />
                    <div className="w-2 h-2 rounded-full bg-emerald-500/50" />
                </div>
                <div className="space-y-1">
                    <div className="h-2 w-24 bg-slate-700/50 rounded" />
                    <div className="h-2 w-16 bg-slate-700/50 rounded" />
                    <div className="flex items-center text-emerald-500 mt-2">
                        <TerminalIcon size={24} />
                        <span className="text-[10px] font-mono ml-2 text-slate-400">./mcoda core</span>
                    </div>
                </div>
            </div>

            {/* Outer Shell (UI) */}
            <div className="absolute inset-0 border border-indigo-500/30 rounded-xl transform -rotate-6 z-0 scale-110 flex items-end justify-end p-4">
                <div className="text-[10px] font-mono text-indigo-400 opacity-50">UI_LAYER_ACTIVE</div>
            </div>
            
            {/* Connection Lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30">
                <circle cx="50%" cy="50%" r="40%" fill="none" stroke="currentColor" strokeDasharray="4 4" className="text-slate-600 animate-[spin_10s_linear_infinite]" />
            </svg>
        </div>
      )
    },
    {
      id: 'plan',
      title: "Plan with Context",
      body: "Import RFPs and generate structured Epics and Tasks automatically using local agents.",
      renderGraphic: () => (
        <div className="relative w-64 h-64 flex items-center justify-center">
           <div className="absolute inset-0 bg-emerald-500/5 blur-3xl rounded-full" />
           
           <div className="grid grid-cols-2 gap-3 w-48 relative z-10">
              {/* Kanban Col 1 */}
              <div className="bg-slate-800/80 border border-slate-700 rounded p-2 flex flex-col gap-2">
                  <div className="h-1.5 w-12 bg-slate-600 rounded opacity-50" />
                  <div className="bg-slate-700 h-10 rounded border border-slate-600/50" />
                  <div className="bg-slate-700 h-10 rounded border border-slate-600/50" />
              </div>
              
              {/* Kanban Col 2 */}
              <div className="bg-slate-800/80 border border-slate-700 rounded p-2 flex flex-col gap-2 mt-4">
                   <div className="h-1.5 w-12 bg-slate-600 rounded opacity-50" />
                   <div className="bg-indigo-900/30 h-16 rounded border border-indigo-500/30 flex items-center justify-center relative overflow-hidden">
                       <SparklesIcon className="text-indigo-400 animate-pulse" size={20} />
                       <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 to-transparent" />
                   </div>
              </div>
           </div>
        </div>
      )
    },
    {
      id: 'work',
      title: "Execute & Review",
      body: "Run implementation agents, review diffs, and execute QA tests without leaving the app.",
      renderGraphic: () => (
        <div className="relative w-64 h-64 flex items-center justify-center">
            <div className="absolute inset-0 bg-indigo-500/5 blur-3xl rounded-full" />
            
            <div className="relative z-10 flex flex-col items-center">
                <div className="flex items-center space-x-6">
                    {/* Terminal Node */}
                    <div className="w-16 h-16 bg-slate-800 rounded-lg border border-slate-600 flex items-center justify-center shadow-lg">
                        <TerminalIcon className="text-slate-400" size={24} />
                    </div>
                    
                    {/* Arrow */}
                    <ActivityIcon className="text-slate-600" size={20} />
                    
                    {/* Git Node */}
                    <div className="w-16 h-16 bg-slate-800 rounded-lg border border-indigo-500 flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                        <GitBranchIcon className="text-indigo-400" size={24} />
                    </div>
                </div>
                
                {/* Success Indicator */}
                <div className="mt-6 flex items-center bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-full">
                    <CheckCircleIcon className="text-emerald-500 mr-2" size={16} />
                    <span className="text-xs font-mono text-emerald-400">TESTS_PASSED</span>
                </div>
            </div>
        </div>
      )
    }
  ];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(curr => curr + 1);
    } else {
      onFinish();
    }
  };

  const handleBack = () => {
    if (currentSlide > 0) {
      setCurrentSlide(curr => curr - 1);
    }
  };

  const content = slides[currentSlide];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900 text-slate-200 flex flex-col items-center justify-center font-sans">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800 via-slate-900 to-slate-950 -z-10" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 -z-10 mix-blend-overlay" />

      <div className="w-full max-w-4xl flex flex-col items-center p-8 animate-in fade-in duration-700 slide-in-from-bottom-4">
        
        {/* Graphic Area (60% visual weight) */}
        <div className="h-72 flex items-center justify-center mb-8">
           {content.renderGraphic()}
        </div>

        {/* Text Area (30% visual weight) */}
        <div className="text-center max-w-xl space-y-4 mb-12 min-h-[140px]">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white bg-clip-text text-transparent bg-gradient-to-br from-white to-slate-400 pb-1">
            {content.title}
          </h1>
          <p className="text-lg text-slate-400 leading-relaxed font-light">
            {content.body}
          </p>
        </div>

        {/* Footer Area */}
        <div className="w-full max-w-2xl flex items-center justify-between border-t border-slate-800 pt-8">
            {/* Back Button / Spacer */}
            <div className="w-32">
                {currentSlide > 0 ? (
                    <Button variant="ghost" onClick={handleBack} className="text-slate-500 hover:text-slate-300">Back</Button>
                ) : (
                    <Button variant="ghost" className="text-slate-600 hover:text-slate-500" onClick={onFinish}>Skip Setup</Button>
                )}
            </div>

            {/* Dots */}
            <div className="flex space-x-3">
                {slides.map((_, idx) => (
                    <button 
                        key={idx}
                        onClick={() => setCurrentSlide(idx)}
                        className={`h-1.5 rounded-full transition-all duration-500 ease-out ${
                            idx === currentSlide ? 'w-10 bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]' : 'w-2 bg-slate-700 hover:bg-slate-600'
                        }`}
                        aria-label={`Go to slide ${idx + 1}`}
                    />
                ))}
            </div>

            {/* Next Button */}
            <div className="w-32 flex justify-end">
                <Button 
                    variant="primary" 
                    onClick={handleNext}
                    className={`${currentSlide === slides.length - 1 ? "bg-indigo-600 hover:bg-indigo-500 shadow-[0_0_20px_rgba(79,70,229,0.3)] w-full" : ""}`}
                >
                    {currentSlide === slides.length - 1 ? 'Get Started' : 'Next'}
                </Button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default IntroCarousel;