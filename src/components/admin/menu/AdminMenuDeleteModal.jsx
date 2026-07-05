import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Ürün silme işleminden önce onay alır.
export default function AdminMenuDeleteModal({ isOpen, onClose, onConfirm }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="absolute inset-0 backdrop-blur-sm bg-black/50"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-sm bg-white rounded-2xl shadow-xl overflow-hidden"
          >
            <div className="p-6 text-center">
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <span className="material-symbols-outlined text-4xl text-red-600">
                  delete
                </span>
              </div>

              <h3 className="text-xl font-bold text-stone-800 mb-2">
                Ürünü Sil
              </h3>
              <p className="text-sm text-stone-500 mb-6">
                Bu ürünü menüden kaldırmak istediğinize emin misiniz? Bu işlem
                geri alınamaz.
              </p>

              <div className="flex gap-3 w-full">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold text-sm rounded-xl transition-all cursor-pointer"
                >
                  İptal
                </button>
                <button
                  onClick={onConfirm}
                  className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-xl transition-all shadow-md hover:shadow-lg cursor-pointer"
                >
                  Evet, Sil
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
