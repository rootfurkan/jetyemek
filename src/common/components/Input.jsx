import React from 'react';

export default function Input({
  label,
  type = 'text',
  placeholder = '',
  value,
  onChange,
  required = false,
  className = '',
  icon,
  ...props
}) {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1.5">
          {label} {required && <span className="text-primary">*</span>}
        </label>
      )}
      <div className="relative w-full">
        {icon && (
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 text-[18px]">
            {icon}
          </span>
        )}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          className={`w-full bg-white border border-stone-200/80 rounded-xl py-2.5 text-xs font-bold focus:outline-none focus:ring-4 focus:ring-primary/5 text-stone-700 placeholder-stone-400 transition-all ${
            icon ? 'pl-10 pr-4' : 'px-4'
          }`}
          {...props}
        />
      </div>
    </div>
  );
}
