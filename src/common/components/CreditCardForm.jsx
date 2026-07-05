import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export default function CreditCardForm({
  cardNumber = '',
  cardName = '',
  cardExpiry = '',
  cardCVV = '',
  onChange,
  errors = {},
}) {
  const [cvvFocused, setCvvFocused] = useState(false);

  // ---- Formatting helpers ----
  const handleCardNumberChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '');
    let formatted = '';
    for (let i = 0; i < raw.length && i < 16; i++) {
      if (i > 0 && i % 4 === 0) formatted += ' ';
      formatted += raw[i];
    }
    onChange && onChange({ cardNumber: formatted, cardName, cardExpiry, cardCVV });
  };

  const handleExpiryChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '');
    let formatted = raw.substring(0, 2);
    let expiryError = '';

    if (raw.length > 2) {
      formatted += '/' + raw.substring(2, 4);
    }

    onChange && onChange({ cardNumber, cardName, cardExpiry: formatted, cardCVV });
  };

  const handleCVVChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '').substring(0, 3);
    onChange && onChange({ cardNumber, cardName, cardExpiry, cardCVV: raw });
  };

  const handleNameChange = (e) => {
    onChange && onChange({ cardNumber, cardName: e.target.value, cardExpiry, cardCVV });
  };

  // Displayed card number (masked when not focused)
  const displayNumber = cardNumber || '**** **** **** ****';
  const displayName = cardName || 'KART SAHİBİ';
  const displayExpiry = cardExpiry || '12/28';

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
      {/* ---- Left: Input Fields ---- */}
      <div className="space-y-4 text-left">
        {/* Card Name */}
        <div>
          <label className="block text-xs font-bold text-stone-500 mb-1">
            Kart Üzerindeki İsim
          </label>
          <input
            value={cardName}
            onChange={handleNameChange}
            placeholder="AD SOYAD"
            type="text"
            className={`w-full rounded-xl border bg-stone-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/5 py-3 px-4 text-sm font-semibold uppercase placeholder-stone-400 transition-colors ${
              errors.cardName
                ? 'border-rose-400 focus:border-rose-400'
                : 'border-stone-200/80 focus:border-primary'
            }`}
          />
          {errors.cardName && (
            <p className="mt-1 text-xs font-semibold text-rose-500 flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">error</span>
              {errors.cardName}
            </p>
          )}
        </div>

        {/* Card Number */}
        <div>
          <label className="block text-xs font-bold text-stone-500 mb-1">Kart Numarası</label>
          <input
            value={cardNumber}
            onChange={handleCardNumberChange}
            maxLength="19"
            placeholder="0000 0000 0000 0000"
            type="text"
            className={`w-full rounded-xl border bg-stone-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/5 py-3 px-4 text-sm font-semibold font-mono placeholder-stone-400 transition-colors ${
              errors.cardNumber
                ? 'border-rose-400 focus:border-rose-400'
                : 'border-stone-200/80 focus:border-primary'
            }`}
          />
          {errors.cardNumber && (
            <p className="mt-1 text-xs font-semibold text-rose-500 flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">error</span>
              {errors.cardNumber}
            </p>
          )}
        </div>

        {/* Expiry + CVV */}
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-xs font-bold text-stone-500 mb-1">Son Kul. Tarihi</label>
            <input
              value={cardExpiry}
              onChange={handleExpiryChange}
              maxLength="5"
              placeholder="AA/YY"
              type="text"
              className={`w-full rounded-xl border bg-stone-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/5 py-3 px-4 text-sm font-semibold placeholder-stone-400 transition-colors ${
                errors.cardExpiry
                  ? 'border-rose-400 focus:border-rose-400'
                  : 'border-stone-200/80 focus:border-primary'
              }`}
            />
            {errors.cardExpiry && (
              <p className="mt-1 text-xs font-semibold text-rose-500 flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">error</span>
                {errors.cardExpiry}
              </p>
            )}
          </div>
          <div className="flex-1">
            <label className="block text-xs font-bold text-stone-500 mb-1">CVV</label>
            <input
              value={cardCVV}
              onChange={handleCVVChange}
              onFocus={() => setCvvFocused(true)}
              onBlur={() => setCvvFocused(false)}
              maxLength="3"
              placeholder="***"
              type="password"
              className={`w-full rounded-xl border bg-stone-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/5 py-3 px-4 text-sm font-semibold placeholder-stone-400 transition-colors ${
                errors.cardCVV
                  ? 'border-rose-400 focus:border-rose-400'
                  : 'border-stone-200/80 focus:border-primary'
              }`}
            />
            {errors.cardCVV && (
              <p className="mt-1 text-xs font-semibold text-rose-500 flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">error</span>
                {errors.cardCVV}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ---- Right: 3D Card Preview ---- */}
      <div
        className="hidden md:flex items-center justify-center p-4 select-none"
        style={{ perspective: '1000px' }}
      >
        <motion.div
          style={{ transformStyle: 'preserve-3d', position: 'relative', width: 320, height: 190 }}
          animate={{ rotateY: cvvFocused ? 180 : 0 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        >
          {/* ---- FRONT FACE ---- */}
          <div
            style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
            className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary to-secondary p-6 shadow-xl text-white flex flex-col justify-between overflow-hidden"
          >
            {/* Watermark */}
            <div className="absolute top-5 right-5 font-black italic text-lg opacity-30 select-none">
              JetYemek
            </div>
            {/* Chip */}
            <div className="w-10 h-8 bg-gradient-to-r from-amber-300 to-amber-500 rounded-lg opacity-80 mt-1" />
            {/* Card Number */}
            <div className="text-lg font-mono tracking-widest mt-2 drop-shadow-sm">
              {displayNumber}
            </div>
            {/* Footer */}
            <div className="flex justify-between items-end">
              <div className="text-xs font-semibold tracking-wider uppercase truncate max-w-[160px]">
                {displayName}
              </div>
              <div className="text-right shrink-0">
                <p className="text-[9px] opacity-60 mb-0.5">VALID THRU</p>
                <p className="font-bold text-xs">{displayExpiry}</p>
              </div>
            </div>
          </div>

          {/* ---- BACK FACE ---- */}
          <div
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
            }}
            className="absolute inset-0 rounded-2xl bg-gradient-to-br from-stone-700 to-stone-900 shadow-xl text-white flex flex-col justify-between overflow-hidden"
          >
            {/* Magnetic stripe */}
            <div className="w-full h-12 bg-stone-950/80 mt-8" />
            {/* CVV stripe */}
            <div className="mx-5 mb-8">
              <p className="text-[10px] text-stone-400 mb-1 text-right font-semibold">CVV</p>
              <div className="bg-white rounded-md px-4 py-2 flex items-center justify-end">
                <span className="font-mono font-bold text-stone-800 text-base tracking-widest">
                  {cardCVV || '•••'}
                </span>
              </div>
            </div>
            {/* Watermark */}
            <div className="absolute bottom-3 left-5 font-black italic text-xs opacity-20 select-none">
              JetYemek
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/**
 * validateCardForm — Kart form doğrulaması.
 * @param {{ cardName, cardNumber, cardExpiry, cardCVV }} fields
 * @returns {{ isValid: boolean, errors: object }}
 */
export function validateCardForm({ cardName, cardNumber, cardExpiry, cardCVV }) {
  const errors = {};

  if (!cardName.trim()) {
    errors.cardName = 'Kart üzerindeki isim zorunludur.';
  }

  const cleanNum = cardNumber.replace(/\s/g, '');
  if (!cleanNum || cleanNum.length < 16) {
    errors.cardNumber = 'Geçerli bir 16 haneli kart numarası giriniz.';
  }

  if (!cardExpiry || cardExpiry.length < 5) {
    errors.cardExpiry = 'Son kullanma tarihi zorunludur (AA/YY).';
  } else {
    const [mm, yy] = cardExpiry.split('/').map(Number);
    if (mm < 1 || mm > 12) {
      errors.cardExpiry = 'Ay 1 ile 12 arasında olmalıdır.';
    } else if (yy < 26) {
      errors.cardExpiry = 'Yıl 26\'dan küçük olamaz.';
    }
  }

  if (!cardCVV || cardCVV.length < 3) {
    errors.cardCVV = 'CVV 3 haneli olmalıdır.';
  }

  return { isValid: Object.keys(errors).length === 0, errors };
}
