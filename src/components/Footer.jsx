import React from 'react';

export default function Footer({ setCurrentTab }) {
  return (
    <footer className="w-full py-12 px-6 md:px-12 bg-white border-t border-stone-200/60 mt-16 text-stone-600">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-10 items-start">
        {/* Brand section */}
        <div className="flex flex-col gap-4 max-w-xs">
          <div 
            onClick={() => setCurrentTab('home')} 
            className="flex items-center gap-2 cursor-pointer select-none active:scale-95 transition-all w-fit"
          >
            <img 
              alt="CraveDash" 
              className="h-8 w-8 object-contain" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCunmBa2Z-w7wmi2EaRd2bMI_kcEtLye08ui8Jcne9IWLdSWtvdm4qgwBNp7FK6ePYgO1GmFkGUQzPfMGKqA_DSqd3As4QQgCPjdova7gSMHy9h_14We2VGn3pwlJO5_BhLo0Dv1QRZqPf0IC1W9XZM3UKX_4Oqu8VBcOMHcZt-tghg5UYwBVjO4v5-J2Q4f9AWW9ceRqZYUfPsxbzm7wnqe9UWFJKWBZ5KmNCp9-Q6p1d9gM9NxdPH7YkiIWNyUAZNkS2sGpIV8Mo" 
            />
            <span className="text-lg font-black text-primary font-sans">CraveDash</span>
          </div>
          <p className="text-xs text-stone-500 leading-relaxed">
            Kalbinizin arzularını kapınıza getiriyoruz. Hızlı, taze, güvenilir ve her zaman lezzetli.
          </p>
        </div>

        {/* Links section */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-12 gap-y-6">
          <div className="flex flex-col gap-3 text-sm">
            <h4 className="font-bold text-stone-800 tracking-wider text-xs uppercase select-none">Şirket</h4>
            <a className="text-xs text-stone-500 hover:text-primary hover:underline transition-colors" href="#privacy">Gizlilik Politikası</a>
            <a className="text-xs text-stone-500 hover:text-primary hover:underline transition-colors" href="#terms">Hizmet Şartları</a>
            <a className="text-xs text-stone-500 hover:text-primary hover:underline transition-colors" href="#partners">İş Ortaklığı</a>
          </div>

          <div className="flex flex-col gap-3 text-sm">
            <h4 className="font-bold text-stone-800 tracking-wider text-xs uppercase select-none">Destek</h4>
            <a className="text-xs text-stone-500 hover:text-primary hover:underline transition-colors" href="#help">Yardım Merkezi</a>
            <a className="text-xs text-stone-500 hover:text-primary hover:underline transition-colors" href="#contact">Bize Ulaşın</a>
            <a className="text-xs text-stone-500 hover:text-primary hover:underline transition-colors" href="#faq">Sıkça Sorulanlar</a>
          </div>

          <div className="flex flex-col gap-3 text-sm col-span-2 sm:col-span-1">
            <h4 className="font-bold text-stone-800 tracking-wider text-xs uppercase select-none">Sosyal</h4>
            <div className="flex gap-4 mt-1">
              <span className="material-symbols-outlined text-stone-400 hover:text-primary cursor-pointer transition-all select-none text-[22px]">
                face_nod
              </span>
              <span className="material-symbols-outlined text-stone-400 hover:text-primary cursor-pointer transition-all select-none text-[22px]">
                share_reviews
              </span>
              <span className="material-symbols-outlined text-stone-400 hover:text-primary cursor-pointer transition-all select-none text-[22px]">
                language
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full h-[1px] bg-stone-200/50 my-8"></div>

      <div className="flex flex-col sm:flex-row justify-between items-center max-w-7xl mx-auto gap-4">
        <p className="text-stone-400 text-xs">
          © {new Date().getFullYear()} CraveDash Inc. Tüm hakları saklıdır.
        </p>
        <p className="text-stone-400 text-[11px] font-mono">
          Developed in Turkey | Premium Food Delivery UI
        </p>
      </div>
    </footer>
  );
}
