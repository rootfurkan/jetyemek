import React from 'react';

export default function Button({ 
  children, 
  variant = 'primary', 
  onClick, 
  type = 'button', 
  className = '', 
  disabled = false 
}) {
  const baseStyle = 'h-11 px-5 rounded-xl text-xs font-black uppercase tracking-wide flex items-center justify-center gap-1.5 cursor-pointer transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none select-none';
  
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary-container shadow-sm shadow-primary/10',
    secondary: 'bg-stone-900 text-white hover:bg-black',
    outline: 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-50 hover:text-stone-900 shadow-sm',
    danger: 'bg-rose-50 border border-rose-100 hover:bg-rose-100 text-primary',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
