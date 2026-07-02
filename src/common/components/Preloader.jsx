import React from 'react';

export default function Preloader() {
  return (
    <div className="flex items-center justify-center min-h-[400px] w-full">
      <div className="flex flex-col items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-white animate-bounce shadow-md shadow-primary/10">
          <span className="material-symbols-outlined text-[24px]">fastfood</span>
        </div>
        <p className="text-xs font-bold text-stone-400 uppercase tracking-widest animate-pulse">CraveDash Yükleniyor...</p>
      </div>
    </div>
  );
}
