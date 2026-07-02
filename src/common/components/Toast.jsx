import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const ToastContext = createContext(null);

let toastId = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(({ message, type = 'success', duration = 3500 }) => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      {/* Toast Stack */}
      <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-3 pointer-events-none" style={{ maxWidth: 360 }}>
        <AnimatePresence>
          {toasts.map((toast) => (
            <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({ toast, onRemove }) {
  const config = {
    success: {
      icon: 'check_circle',
      bg: 'bg-white',
      border: 'border-green-200',
      iconColor: 'text-green-500',
      bar: 'bg-green-400',
    },
    error: {
      icon: 'error',
      bg: 'bg-white',
      border: 'border-rose-200',
      iconColor: 'text-rose-500',
      bar: 'bg-rose-400',
    },
    info: {
      icon: 'info',
      bg: 'bg-white',
      border: 'border-blue-200',
      iconColor: 'text-blue-500',
      bar: 'bg-blue-400',
    },
    warning: {
      icon: 'warning',
      bg: 'bg-white',
      border: 'border-amber-200',
      iconColor: 'text-amber-500',
      bar: 'bg-amber-400',
    },
  };

  const c = config[toast.type] || config.info;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 60, scale: 0.92 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 60, scale: 0.92 }}
      transition={{ type: 'spring', damping: 22, stiffness: 300 }}
      className={`pointer-events-auto relative overflow-hidden rounded-2xl shadow-xl border ${c.bg} ${c.border} flex items-start gap-3 p-4 pr-10 min-w-[280px]`}
    >
      {/* Colored left bar */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${c.bar} rounded-l-2xl`} />

      <span
        className={`material-symbols-outlined text-[22px] shrink-0 mt-0.5 ${c.iconColor}`}
        style={{ fontVariationSettings: "'FILL' 1" }}
      >
        {c.icon}
      </span>

      <p className="text-sm font-semibold text-stone-800 leading-snug flex-1">{toast.message}</p>

      <button
        onClick={() => onRemove(toast.id)}
        className="absolute top-3 right-3 text-stone-400 hover:text-stone-600 transition-colors cursor-pointer"
      >
        <span className="material-symbols-outlined text-[16px]">close</span>
      </button>
    </motion.div>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx.addToast;
}
