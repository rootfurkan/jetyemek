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

## 🧰 Kullanılan Teknolojiler

Bu proje aşağıdaki temel teknoloji ve kütüphaneler kullanılarak geliştirilmiştir:

- **React** (Vite ile) — UI kütüphanesi ve bileşen tabanlı geliştirme.
- **Redux Toolkit** — Merkezi state yönetimi, feature slice yapısı ve asenkron thunk'lar.
- **React Router** — Route yönetimi ve rol bazlı yönlendirme.
- **Tailwind CSS** — Hızlı stil üretimi ve tema kontrolü.
- **Framer Motion / motion** — UI animasyonları ve geçişler (Modal, Toast vb.).
- **Axios** — API istekleri için HTTP istemcisi (`src/services/api.js`).
- **json-server** — Geliştirme/demo amaçlı sahte REST API (`db.json`).
- **jsPDF** — Rapor/finans PDF çıktıları oluşturmak için.
- **Diğer yardımcı kütüphaneler**: `lucide-react` (ikonlar), küçük yardımcı paketler ve Tailwind eklentileri.

Geliştirme araçları ve script'ler proje kökünde `package.json` içinde tanımlıdır (`dev`, `server`, `build`, vb.).

## 🚀 Yol Haritası (Roadmap) / Gelecek Özellikler

- [ ] **Canlı Takip (WebSockets):** Kurye konumunun harita üzerinde anlık olarak izlenmesi.
- [ ] **Gelişmiş Analitik Sayfaları:** Admin ve restoran panellerinde Chart.js / Recharts ile görsel gelir ve sipariş istatistikleri.
- [ ] **Push Notifications:** Sipariş durumu değiştiğinde tarayıcı bildirimlerinin (Service Workers) gönderilmesi.
- [ ] **Dark Mode Desteği:** Tailwind CSS'in dark mode özellikleri kullanılarak gece/gündüz teması entegrasyonu.
- [ ] **Gerçek Backend Entegrasyonu:** JSON Server'ın Node.js / Express veya NestJS tabanlı gerçek bir REST/GraphQL API ile değiştirilmesi.
