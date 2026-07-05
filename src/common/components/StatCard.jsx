import React from 'react';

const valueColors = {
  default: 'text-stone-800',
  primary: 'text-primary',
  warning: 'text-amber-600',
  success: 'text-green-700',
};

export default function StatCard({
  label,
  value,
  icon,
  color = 'default',
  className = '',
}) {
  return (
    <div className={`bg-white border border-stone-100 rounded-[24px] p-5 shadow-soft flex items-center justify-between gap-4 ${className}`}>
      <div>
        <p className="text-stone-400 text-xs font-bold">{label}</p>
        <h3 className={`text-2xl font-black mt-1 ${valueColors[color] || valueColors.default}`}>
          {value}
        </h3>
      </div>
      {icon && (
        <div className="w-11 h-11 rounded-2xl bg-rose-50 text-primary flex items-center justify-center">
          <span className="material-symbols-outlined text-[22px]">{icon}</span>
        </div>
      )}
    </div>
  );
}
