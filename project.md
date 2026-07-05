# 🏗️ JetYemek - Mimari ve Geliştirici Günlüğü

Bu doküman, JetYemek projesinin kaputunun altındaki mimari kararları, state yönetimi yaklaşımlarını, karşılaşılan teknik zorlukları ve gelecekteki yol haritasını detaylandırmak amacıyla hazırlanmıştır.

## 📂 Modüler Klasör Düzeni (Folder Structure)

Proje, sürdürülebilirliği ve ölçeklenebilirliği artırmak adına "Feature-Sliced" (Özellik Odaklı) ve "Role-Based" (Rol Odaklı) bir yapıda kurgulanmıştır:

```text
jetyemek/
 ├── public/                         # Statik dosyalar ve dışarıdan erişilen fontlar
 │    └── fonts/                     # PDF çıktıları için yüklenecek font dosyaları
 ├── src/                            # Uygulamanın ana kaynak kodları
 │    ├── app/                       # Redux store ve rootReducer yapılandırması
 │    │    ├── store.js              # Redux store kurulum dosyası
 │    │    └── rootReducer.js        # Tüm slice reducerlarını tek yerde birleştirir
 │    ├── common/                    # Paneller arasında ortak kullanılan yardımcı yapı
 │    │    ├── components/           # Ortak UI parçaları: Modal, Toast, Button, Pagination, StatCard
 │    │    ├── hooks/                # Ortak React hook dosyaları
 │    │    └── utils/                # Formatlama ve kampanya yardımcı fonksiyonları
 │    ├── components/                # Panel içi büyük component grupları
 │    │    ├── admin/                # Restoran/admin tarafında kullanılan yönetim componentleri
 │    │    │    ├── menu/            # Restoran menü yönetimi modal ve ürün kartları
 │    │    │    └── platform/        # Platform admin sekmeleri, tabloları, harita ve hookları
 │    │    └── restaurant/           # Restoran paneline özel sipariş ve finans componentleri
 │    ├── features/                  # Redux Toolkit slice dosyaları
 │    │    ├── auth/                 # Kullanıcı oturumu, rol, adres ve favoriler
 │    │    ├── campaigns/            # Kampanya/kupon state yapısı
 │    │    ├── cart/                 # Sepet ürünleri ve miktar işlemleri
 │    │    ├── couriers/             # Kurye state yapısı
 │    │    ├── finance/              # Finans kayıtları ve komisyon/teslimat ücreti state yapısı
 │    │    ├── menu/                 # Restoran ürünleri, ürün ekleme/silme/güncelleme state yapısı
 │    │    ├── orders/               # Aktif, geçmiş ve platform siparişleri
 │    │    ├── restaurants/          # Restoran listesi, durum ve komisyon bilgileri
 │    │    └── reviews/              # Yorumlar, yorum ekleme ve restoran cevabı işlemleri
 │    ├── layouts/                   # Role göre ana sayfa iskeletleri
 │    │    ├── AdminLayout.jsx       # Admin panel sidebar/header düzeni
 │    │    ├── CustomerLayout.jsx    # Müşteri panel üst menü ve içerik düzeni
 │    │    └── RestaurantLayout.jsx  # Restoran panel sidebar/header düzeni
 │    ├── panels/                    # Route karşılığı olan sayfa dosyaları
 │    │    ├── admin/                # Platform admin sayfaları
 │    │    │    └── pages/           # Admin route sayfaları: restoranlar, kullanıcılar, siparişler, finans
 │    │    ├── auth/                 # Login ve register sayfaları
 │    │    ├── customer/             # Müşteri tarafı sayfa ve componentleri
 │    │    │    ├── components/      # Müşteri tarafı özel componentler: ürün seçenek modalı
 │    │    │    └── pages/           # Anasayfa, sepet, profil, restoran menüsü
 │    │    └── restaurant/           # Restoran panel sayfaları
 │    │         └── pages/           # Dashboard, siparişler, menü, yorumlar, finans, ayarlar
 │    ├── routes/                    # React Router route tanımları ve rol koruması
 │    ├── services/                  # Axios API katmanı
 │    │    └── api.js                # db.json/json-server istek fonksiyonları
 │    ├── App.jsx                    # Provider, Router ve başlangıç veri yükleme akışı
 │    ├── main.jsx                   # React uygulamasının DOM'a bağlandığı giriş dosyası
 │    └── data.jsx                   # Eski/statik başlangıç verileri; bazı kategori ve seed verileri
 ├── db.json                         # json-server veritabanı: users, restaurants, menuItems, orders, reviews
 ├── .env                            # API adresi gibi ortam değişkenleri
 ├── .env.example                    # Örnek env dosyası
 ├── index.html                      # Vite HTML giriş dosyası
 ├── package.json                    # Scriptler ve npm bağımlılıkları
 ├── vite.config.js                  # Vite yapılandırması
 ├── README.md                       # Projenin kısa kullanım/kurulum açıklaması
 └── project.md                      # Mimari notlar ve geliştirici dokümantasyonu
```

## 🧠 State Yönetimi (Redux Toolkit)

Uygulamanın kalbi olan **Redux Toolkit**, verilerin merkezi ve tutarlı bir şekilde yönetilmesini sağlar:
- **Merkezi Yükleme (`AppDataLoader`):** Uygulama ilk açıldığında genel verileri (restoranlar, menüler), kullanıcı giriş yaptığında ise role özel verileri (adresler, geçmiş/aktif siparişler, favoriler) asenkron thunk/API fonksiyonlarıyla çeker ve state'e yükler.
- **Slice Görev Dağılımı:**
  - `authSlice`: Oturum durumu, role bilgisi, favori restoranlar ve adresler.
  - `cartSlice`: Sepetteki ürünler, toplam tutar hesaplamaları ve kişiselleştirilmiş (opsiyonlu) ürünlerin varyasyon kontrolü.
  - `ordersSlice`: Sipariş takibi; "Aktif", "Geçmiş" ve admin için "Platform" siparişlerinin ayrıştırılması.
  - `menu/restaurants/reviews/finance`: Domain bazlı verilerin izolasyonu.

## 🗄️ Veri Akışı ve Veritabanı (db.json)

Backend simülasyonu için `json-server` kullanılmıştır. Veritabanı tasarımı NoSQL esnekliğinde kurgulanmıştır:
- **`users`**: Kullanıcı rolleri (`customer`, `restaurant`, `admin`) tek bir koleksiyonda tutulur.
- **`menuItems`**: Her ürünün `extraOptions` adında dinamik bir dizisi vardır. Bu dizi, `ProductCustomizeModal` içerisindeki tekli (radio) veya çoklu (checkbox) seçim mantığını (hamur tipi, ekstra malzeme, boyut) besler.
- **`orders`**: Müşteri ID'si, restoran ID'si ve sepet detaylarının yanında, anlık statü (`Hazırlanıyor`, `Kurye Yola Çıktı`) durumlarını barındırır.

## 🚧 Karşılaşılan Teknik Zorluklar ve Çözümler

1. **Native Modalların (window.confirm) Kısıtlamaları:**
   - *Sorun:* Tarayıcının varsayılan uyarı pencereleri temanın bütünlüğünü bozuyordu ve kullanıcı deneyimi açısından zayıftı.
   - *Çözüm:* Framer Motion kullanılarak `Modal.jsx` ve `ConfirmModal.jsx` bileşenleri sıfırdan yazıldı. Hesap silme, sepeti boşaltma ve kupon onayları gibi kritik işlemler bu estetik modallara bağlandı.

2. **Karmaşık Ürün Kişiselleştirmesi ve Sepet ID Çakışması:**
   - *Sorun:* Müşteri aynı hamburgeri bir kez "Acılı", bir kez "Acısız" eklediğinde sepette miktar 2 olarak birleşiyordu.
   - *Çözüm:* `ProductCustomizeModal` içinde, seçilen opsiyonların isimleri birleştirilerek (`id: burger1-Acili-Ketcap`) benzersiz varyasyon ID'leri üretildi. Böylece farklı opsiyonlu aynı ürünler sepette ayrı satırlar olarak listelendi.

3. **SPA'larda Sayfa Değişiminde Scroll Problemi:**
   - *Sorun:* React Router ile sayfa değiştirildiğinde, kullanıcı bir önceki sayfanın kaldığı scroll pozisyonunda kalıyordu (sayfanın ortasında açılması).
   - *Çözüm:* `App.jsx` içerisine `ScrollToTop` hook'u entegre edilerek `pathname` her değiştiğinde `window.scrollTo(0, 0)` tetiklendi.

4. **Yorum ve Sipariş Sıralamaları (Sorting):**
   - *Sorun:* JSON Server varsayılan olarak verileri eklenme sırasına göre döndürüyordu.
   - *Çözüm:* Redux'a veri aktarılmadan önce veya arayüzde listelenirken JavaScript ile zaman damgası karşılaştırması (`new Date(b.createdAt) - new Date(a.createdAt)`) yapılarak "En Yeni" sıralama mantığı uygulandı. Puan bazlı filtreler için ayrı state'ler (`activeSort`) kullanıldı.

## 🚀 Yol Haritası (Roadmap) / Gelecek Özellikler

- [ ] **Canlı Takip (WebSockets):** Kurye konumunun harita üzerinde anlık olarak izlenmesi.
- [ ] **Gelişmiş Analitik Sayfaları:** Admin ve restoran panellerinde Chart.js / Recharts ile görsel gelir ve sipariş istatistikleri.
- [ ] **Push Notifications:** Sipariş durumu değiştiğinde tarayıcı bildirimlerinin (Service Workers) gönderilmesi.
- [ ] **Dark Mode Desteği:** Tailwind CSS'in dark mode özellikleri kullanılarak gece/gündüz teması entegrasyonu.
- [ ] **Gerçek Backend Entegrasyonu:** JSON Server'ın Node.js / Express veya NestJS tabanlı gerçek bir REST/GraphQL API ile değiştirilmesi.
