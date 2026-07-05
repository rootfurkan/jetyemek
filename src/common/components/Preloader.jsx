import React from "react";

export default function Preloader({ fullscreen = false }) {
  return (
    <div
      className={`flex items-center justify-center w-full ${
        fullscreen
          ? "fixed inset-0 z-[70] bg-stone-50/90 backdrop-blur-md"
          : "min-h-[400px]"
      }`}
    >
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-[24px] brand-gradient-bg flex items-center justify-center text-white shadow-xl shadow-primary/20 animate-bounce">
            <span className="material-symbols-outlined text-[32px]">
              fastfood
            </span>
          </div>
          <span className="absolute -right-1 -top-1 w-4 h-4 rounded-full bg-white border-4 border-primary animate-ping"></span>
        </div>
        <div className="text-center">
          <p className="text-2xl font-black text-primary tracking-tight">
            JetYemek
          </p>
          <p className="text-[11px] font-bold text-stone-400 uppercase tracking-[0.24em] animate-pulse">
            Yükleniyor...
          </p>
        </div>
      </div>
    </div>
  );
}
