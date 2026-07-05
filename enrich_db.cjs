const fs = require('fs');

const dataPath = './db.json';
const db = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

db.menuItems = db.menuItems.map(item => {
  const name = item.name.toLowerCase();
  const category = (item.category || "").toLowerCase();

  // 1. Kahveler
  const isCoffee = category.includes('kahve') || name.includes('kahve') || name.includes('latte') || name.includes('espresso') || name.includes('mocha') || name.includes('americano') || name.includes('macchiato') || name.includes('cappuccino');
  
  // 2. Patates Kızartmaları
  const isFries = name.includes('patates') || category.includes('patates');
  
  // 5. Çiğköfte
  const isCigkofte = category.includes('çiğköfte') || name.includes('çiğköfte');

  // 4. Dürüm ve Kebaplar (Çiğköfte hariç)
  const isKebab = !isCigkofte && (category.includes('dürüm') || category.includes('kebap') || name.includes('dürüm') || name.includes('kebap') || name.includes('adana') || name.includes('urfa') || name.includes('şiş'));
  
  // 3. Tatlılar
  const isDessert = category.includes('tatlı') || name.includes('cheesecake') || name.includes('sütlaç') || name.includes('kek') || name.includes('tiramisu') || name.includes('brownie') || name.includes('profiterol') || name.includes('baklava') || name.includes('künefe');
  
  // 6. Pizzalar
  const isPizza = category.includes('pizza') || name.includes('pizza');
  
  // İçecekler (Hazır içecekleri atla)
  const isDrink = category.includes('içecek') || name.includes('kola') || name.includes('ayran') || name.includes('su') || name.includes('gazoz');

  let extraOptions = [];

  if (isCoffee) {
    extraOptions = [
      {
        title: 'Boyut Seçimi',
        type: 'single',
        required: true,
        options: [
          { name: 'Küçük Boy', price: 0 },
          { name: 'Orta Boy', price: 15 },
          { name: 'Büyük Boy', price: 30 }
        ]
      },
      {
        title: 'Süt Tercihi',
        type: 'single',
        required: true,
        options: [
          { name: 'Normal Süt', price: 0 },
          { name: 'Laktozsuz Süt', price: 10 },
          { name: 'Yulaf Sütü', price: 15 },
          { name: 'Badem Sütü', price: 15 },
          { name: 'Hindistan Cevizi Sütü', price: 15 }
        ]
      },
      {
        title: 'Ekstra Şurup & Sos',
        type: 'multi',
        required: false,
        options: [
          { name: 'Vanilya Şurubu', price: 10 },
          { name: 'Fındık Şurubu', price: 10 },
          { name: 'Karamel Sos', price: 15 },
          { name: 'White Chocolate Sos', price: 15 }
        ]
      }
    ];
  } else if (isFries) {
    extraOptions = [
      {
        title: 'Ekstra Soslar',
        type: 'multi',
        required: false,
        options: [
          { name: 'Ketçap', price: 5 },
          { name: 'Mayonez', price: 5 },
          { name: 'Ranch Sos', price: 10 },
          { name: 'Barbekü Sos', price: 10 },
          { name: 'Acı Sos', price: 10 }
        ]
      }
    ];
  } else if (isPizza) {
    extraOptions = [
      {
        title: 'Boyut',
        type: 'single',
        required: true,
        options: [
          { name: 'Küçük', price: 0 },
          { name: 'Orta', price: 60 },
          { name: 'Büyük', price: 100 }
        ]
      },
      {
        title: 'Kenar Tipi',
        type: 'single',
        required: true,
        options: [
          { name: 'İnce Kenar', price: 0 },
          { name: 'Kalın Kenar', price: 0 },
          { name: 'Peynir Dolgulu Kenar', price: 30 }
        ]
      },
      {
        title: 'Ekstra Malzemeler',
        type: 'multi',
        required: false,
        options: [
          { name: 'Mantar', price: 15 },
          { name: 'Zeytin', price: 10 },
          { name: 'Sucuk', price: 25 },
          { name: 'Mısır', price: 10 },
          { name: 'Jalapeno Biber', price: 10 }
        ]
      }
    ];
  } else if (isDessert) {
    extraOptions = [
      {
        title: 'Ekstra Dondurma',
        type: 'single',
        required: false,
        options: [
          { name: 'İstemiyorum', price: 0 },
          { name: '1 Top Sade', price: 70 },
          { name: '2 Top Sade', price: 130 }
        ]
      }
    ];
  } else if (isCigkofte) {
    extraOptions = [
      {
        title: 'Acı Durumu',
        type: 'single',
        required: true,
        options: [
          { name: 'Acısız', price: 0 },
          { name: 'Az Acılı', price: 0 },
          { name: 'Bol Acılı', price: 0 }
        ]
      },
      {
        title: 'Ekstra Malzeme',
        type: 'multi',
        required: false,
        options: [
          { name: 'Nar Ekşisi', price: 5 },
          { name: 'Ekstra Lavaş', price: 10 }
        ]
      }
    ];
  } else if (isKebab) {
    extraOptions = [
      {
        title: 'Soğan Tercihi',
        type: 'single',
        required: true,
        options: [
          { name: 'Soğanlı', price: 0 },
          { name: 'Soğansız', price: 0 }
        ]
      },
      {
        title: 'Ekstra Lavaş',
        type: 'single',
        required: false,
        options: [
          { name: 'İstemiyorum', price: 0 },
          { name: '1 Lavaş', price: 15 }
        ]
      }
    ];
  }

  if (extraOptions.length > 0 && (!isDrink || isCoffee)) {
    item.extraOptions = extraOptions;
  }

  return item;
});

fs.writeFileSync(dataPath, JSON.stringify(db, null, 2));
console.log('Veritabanı başarıyla güncellendi!');
