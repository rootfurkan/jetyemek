import React from "react";

export default function AdminSectionHeader({ title, description, children }) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h3 className="text-base font-extrabold text-stone-400 uppercase tracking-wider">
          {title}
        </h3>
        {description && (
          <p className="text-stone-500 text-xs font-semibold mt-1">
            {description}
          </p>
        )}
      </div>
      {children}
    </div>
  );
}
