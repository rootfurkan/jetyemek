import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';

export default function OrderSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Extract order details from navigation state if available
  const orderDetails = location.state || {
    restaurant: "Gourmet Burger House",
    total: 245.00,
    orderId: "VH-" + (Math.floor(Math.random() * 9000) + 1000)
  };

  // SVG drawing configuration for green checkmark
  const draw = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { delay: 0.2, type: "spring", duration: 0.8, bounce: 0 },
        opacity: { delay: 0.2, duration: 0.01 }
      }
    }
  };

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center py-12 px-4 text-center animate-fade-in select-none">
      {/* Animated Checkmark Canvas Container */}
      <div className="relative mb-8 flex items-center justify-center">
        {/* Soft shadow glow */}
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1.1, opacity: 0.2 }}
          transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
          className="absolute w-28 h-28 bg-emerald-400 rounded-full blur-2xl"
        />
        
        {/* Pulsing Outer Ring */}
        <motion.div 
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", damping: 15, stiffness: 100 }}
          className="w-24 h-24 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center z-10"
        >
          {/* SVG Animated Tick */}
          <svg
            className="w-12 h-12 text-emerald-500"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <motion.path
              d="M20 6L9 17L4 12"
              variants={draw}
              initial="hidden"
              animate="visible"
            />
          </svg>
        </motion.div>
      </div>

      {/* Hero Headings */}
      <motion.h1 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, type: "spring", damping: 20 }}
        className="text-3xl font-extrabold text-stone-800 tracking-tight"
      >
        Siparişiniz Başarıyla Alındı!
      </motion.h1>
      
      <motion.p 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, type: "spring", damping: 20 }}
        className="text-sm text-stone-500 max-w-sm mt-3 leading-relaxed"
      >
        Lezzetli siparişiniz mutfağa iletildi ve hazırlanmaya başladı. Kuryemiz en kısa sürede kapınızda olacaktır.
      </motion.p>

      {/* Summary Card (Glassmorphism layout) */}
      <motion.div 
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6, type: "spring", damping: 20 }}
        className="mt-10 bg-white rounded-[32px] border border-stone-100 p-6 shadow-xl shadow-stone-100/40 w-full max-w-sm text-left space-y-4"
      >
        <p className="text-xs font-black text-stone-400 uppercase tracking-widest border-b border-stone-50 pb-2.5">Sipariş Özeti</p>
        <div className="flex justify-between items-center text-xs">
          <span className="text-stone-500 font-semibold">Sipariş Kodu</span>
          <span className="font-extrabold text-stone-800">{orderDetails.orderId}</span>
        </div>
        <div className="flex justify-between items-center text-xs">
          <span className="text-stone-500 font-semibold">Restoran</span>
          <span className="font-extrabold text-stone-800">{orderDetails.restaurant}</span>
        </div>
        <div className="flex justify-between items-center text-xs">
          <span className="text-stone-500 font-semibold">Toplam Ödeme</span>
          <span className="font-extrabold text-primary text-sm">₺{orderDetails.total}</span>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div 
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7, type: "spring", damping: 20 }}
        className="flex flex-col sm:flex-row gap-3 mt-10 w-full max-w-sm"
      >
        <button
          onClick={() => navigate('/profile')}
          className="flex-1 py-3.5 bg-primary hover:bg-secondary text-white font-extrabold text-xs rounded-full shadow-md active:scale-95 transition-all cursor-pointer border-none"
        >
          Siparişlerime Git
        </button>
        <button
          onClick={() => navigate('/')}
          className="flex-1 py-3.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-extrabold text-xs rounded-full active:scale-95 transition-all cursor-pointer border border-stone-200/20"
        >
          Ana Sayfaya Dön
        </button>
      </motion.div>
    </div>
  );
}
