import React from 'react';

interface BadgeProps {
  variant: 'success' | 'warning' | 'error' | 'info' | 'neutral';
  children: React.ReactNode;
}

const Badge: React.FC<BadgeProps> = ({ variant, children }) => {
  const styles = {
    success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    warning: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    error: "bg-red-500/10 text-red-400 border-red-500/20",
    info: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    neutral: "bg-slate-700 text-slate-300 border-slate-600",
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-mono border ${styles[variant]}`}>
      {children}
    </span>
  );
};

export default Badge;