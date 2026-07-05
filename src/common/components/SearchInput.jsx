import React from 'react';

export default function SearchInput({
  value,
  onChange,
  placeholder = 'Ara...',
  className = '',
}) {
  return (
    <div className={`relative ${className}`}>
      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-[18px]">
        search
      </span>
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full pl-9 pr-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-bold focus:outline-none focus:border-primary text-stone-700 placeholder-stone-400"
      />
    </div>
  );
}
