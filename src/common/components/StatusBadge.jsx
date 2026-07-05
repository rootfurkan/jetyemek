import React from 'react';

const statusClasses = {
  success: 'bg-green-50 text-green-700 border-green-200',
  warning: 'bg-amber-50 text-amber-700 border-amber-200',
  danger: 'bg-rose-50 text-primary border-rose-200',
  neutral: 'bg-stone-50 text-stone-600 border-stone-200',
};

function getVariantFromStatus(status) {
  if (status === 'Onay Bekliyor' || status === 'Beklemede') return 'warning';
  if (status === 'Reddedildi' || status === 'İptal Edildi' || status === 'Pasif') return 'danger';
  if (status === 'Yayında' || status === 'Aktif' || status === 'Tamamlandı') return 'success';
  return 'neutral';
}

export default function StatusBadge({ children, status, variant, className = '' }) {
  const badgeVariant = variant || getVariantFromStatus(status || children);

  return (
    <span className={`px-2.5 py-0.5 rounded-full border text-[9px] font-black inline-flex items-center gap-1 ${statusClasses[badgeVariant] || statusClasses.neutral} ${className}`}>
      {children || status}
    </span>
  );
}
