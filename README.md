# 🚀 JetYemek

<div align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Redux_Toolkit-593D88?style=for-the-badge&logo=redux&logoColor=white" alt="Redux" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind" />
  <img src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" alt="Vite" />
  <img src="https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white" alt="Framer Motion" />
  <img src="https://img.shields.io/badge/JSON_Server-333333?style=for-the-badge&logo=json&logoColor=white" alt="JSON Server" />
</div>

<br />

JetYemek, kullanıcıların kolayca yemek siparişi verebileceği, restoranların kendi menülerini ve siparişlerini yönetebileceği ve yöneticilerin tüm platformu denetleyebileceği **üç yönlü (Müşteri, Restoran, Admin)**, modern ve tam donanımlı bir yemek sipariş platformudur.

## 🌟 Projenin Amacı ve Çözdüğü Problem
Geleneksel yemek sipariş sistemlerinin karmaşık arayüzlerinden sıyrılarak; kullanıcılara en hızlı ve estetik deneyimi sunmak, restoran işletmecilerine ise esnek ürün kişiselleştirme (opsiyon, ekstra malzeme, porsiyon) imkânı tanıyarak operasyonel süreçlerini dijitalleştirmek hedeflenmiştir. 

## ✨ Öne Çıkan Özellikler

*   **👥 Çoklu Rol Yönetimi (Multi-Role):** Müşteri, Restoran ve Admin panelleri tek bir Single Page Application (SPA) üzerinde güvenli bir şekilde ayrıştırılmıştır.
*   **🍔 Gelişmiş Ürün Kişiselleştirme:** `ProductCustomizeModal` ile ürünlere özel (zorunlu/opsiyonel) seçimler yapılabilir; gramaj, ekstra malzeme, hamur tipi gibi seçenekler anlık olarak fiyata yansır.
*   **🔍 Akıllı Arama & Filtreleme:** Kullanıcı deneyimini artırmak için **Debounce** destekli anlık arama (restoran ve ürün bazlı) ve **Tag (Etiket)** bazlı gelişmiş filtreleme mekanizması.
*   **🛒 Dinamik Sepet ve Sipariş Yönetimi:** Redux Toolkit ile anlık state yönetimi, sepete eklenen aynı ürünlerin farklı varyasyonlarının (ID manipülasyonu ile) ayrı ayrı tutulabilmesi.
*   **💬 Gerçek Zamanlı Geri Bildirim:** Yerleşik tarayıcı uyarıları (`window.confirm`) yerine, platformun tasarım diline uygun estetik, animasyonlu `ConfirmModal` ve `Toast` bildirimleri.
*   **⏱️ Zaman Damgalı Akıllı Sıralamalar:** Yorumların ve siparişlerin tarihe/puana göre anlık olarak optimize edilip sıralanması.

## 🛠️ Kurulum Rehberi

Projeyi yerel ortamınızda (local) çalıştırmak için aşağıdaki adımları sırasıyla izleyin:

### 1. Projeyi Klonlayın
```bash
git clone https://github.com/kullaniciadi/jetyemek.git
cd jetyemek
```

### 2. Bağımlılıkları Yükleyin
```bash
npm install
```

### 3. Sahte Veritabanını (JSON Server) Başlatın
Ayrı bir terminal sekmesinde aşağıdaki komutu çalıştırarak `db.json` üzerinden API'yi 4000 portunda ayağa kaldırın:
```bash
npm run server
```

### 4. Geliştirme Sunucusunu Başlatın
Ana terminalinizde Vite sunucusunu başlatın:
```bash
npm run dev
```

Tarayıcınızda `http://localhost:3000` adresine giderek uygulamayı görüntüleyebilirsiniz! 🎉

---
<div align="center">
  <b>Modern web teknolojileri ile 💙 ile geliştirildi.</b>
</div>
