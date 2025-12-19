import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  size = 'md', 
  icon, 
  children, 
  className = '', 
  ...props 
}) => {
  const baseClasses = "inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-slate-900 rounded-[4px]";
  
  const variants = {
    primary: "bg-indigo-600 hover:bg-indigo-500 text-white focus:ring-indigo-500",
    secondary: "border border-slate-600 hover:border-slate-500 text-slate-200 hover:bg-slate-800 focus:ring-slate-500",
    ghost: "text-slate-400 hover:text-white hover:bg-slate-800 focus:ring-slate-500",
    destructive: "text-red-400 hover:text-white hover:bg-red-600 focus:ring-red-500",
  };

  const sizes = {
    sm: "h-7 px-3 text-xs",
    md: "h-9 px-4 text-sm",
    lg: "h-11 px-6 text-base",
  };

  return (
    <button 
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {icon && <span className="mr-2 -ml-1">{icon}</span>}
      {children}
    </button>
  );
};

export default Button;