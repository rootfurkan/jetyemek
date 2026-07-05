import React from "react";

export default function OverviewStatsGrid({ coreStats }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {coreStats.map((stat, idx) => (
        <div
          key={idx}
          className="bg-white p-5 rounded-[24px] shadow-soft border border-stone-100 flex flex-col justify-between hover:scale-[1.02] transition-all cursor-pointer hover:border-primary/25"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="p-2.5 bg-rose-50 text-primary rounded-xl">
              <span className="material-symbols-outlined text-[20px]">
                {stat.icon}
              </span>
            </div>

            <div
              className={`flex items-center gap-0.5 text-xs font-bold ${
                stat.isPositive ? "text-green-600" : "text-primary"
              }`}
            >
              <span className="material-symbols-outlined text-[15px]">
                {stat.isPositive ? "trending_up" : "trending_down"}
              </span>
              {stat.change}
            </div>
          </div>

          <div>
            <p className="text-stone-400 font-bold text-xs tracking-wide">
              {stat.title}
            </p>
            <h3 className="text-2xl font-black text-stone-800 tracking-tight mt-1">
              {stat.value}
            </h3>
            <p className="text-[10px] text-stone-400 font-semibold mt-1">
              {stat.desc}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
