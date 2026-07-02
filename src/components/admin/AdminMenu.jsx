import React, { useState } from 'react';

export default function AdminMenu() {
  const [selectedCategory, setSelectedCategory] = useState('Burgers');
  const [showAddModal, setShowAddModal] = useState(false);

  // Initial products dataset for management screen
  const [products, setProducts] = useState([
    {
      id: 'prod-1',
      name: 'Classic Smash Burger',
      price: 245.00,
      description: 'Double beef patty, signature sauce, American cheese, and pickles on a toasted bun.',
      category: 'Burgers',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAtNBGxlreW2TJCj3i3nmdFBXb1X0RFjXYdnLmMEVzP44Tnkvt03w_-1bmnmUI-69UsgS3nVZT1-v8t24J4NrWZFlLFInRuzwW9IHiyU9tPvHpqEMjlmeTM2NxuLe5hmZ3yYDSyTqpNEsxxSLzELidQg-Ey5d226Iw8oIDwXH_8IZLnkJpgy6mKISGA5GvZvRef_obP8gO4mOMIMDt_ZdsmOnfZx_r1hGSuOzMmYxXRFAEqjV9UME1hqL7wPN54kG_x0zqf24g0G-s',
      status: 'Active',
      tag: 'Bestseller'
    },
    {
      id: 'prod-2',
      name: 'Bacon Deluxe Burger',
      price: 280.00,
      description: 'Triple-smoked bacon, grass-fed beef, caramelized onions, and white cheddar cheese.',
      category: 'Burgers',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAvKNHWLij5-ns8ihNSeSGzjRb7D39zeimOnI9SfMnLVIJVLmETgRgt_DWKFwWkUeDOy-BrZAMj7AsEvN3vWoxfNHctIjWBcEf9P-RkKhYU2jTxyhn2-9qEDTViq31sVA8VMrKI-_V-b2vQJnnQOXyt7JOFwTz72AtrYaUr1ZsRu_wJ0wOYYPUIEFt5B-VxUjmfUpIBECJlfNyjJ8plGabd6UkvbprM4qQsek60vRv9RJl9QeERBVus6rVVTrMTahD_cGzs3cx5M-0',
      status: 'Active',
      tag: 'Hot'
    },
    {
      id: 'prod-3',
      name: 'The Garden Burger',
      price: 210.00,
      description: 'Plant-based patty, smashed avocado, sprouts, and vegan mayo on a whole grain bun.',
      category: 'Burgers',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCuDEhmCVURFKpZqpT0DBseAGVRyBzAEJZFfwHpUQT0ggUqOj_-tX7n4vjypGMOZcZu9mBVxmZTd_W54oIjzZwpvFkZL-_yCZjlphft6EP8eDtWAAEtHDR03IEYbFoC_Za_hh7W50Qg3g8WRr_-4uB_gWJQb7t0UNMXf4Sy9NoFfLbrU7SRDLg2IBMK5y5XsHXT8-3jsNdT7Y_WzAfb1AdWa1HmotQvcsvz_3I8nqy2N0-43VlUp7BTmrCjaTJIrOrFMe-EiQ7zMz0',
      status: 'Active',
      tag: 'Vegan'
    },
    {
      id: 'prod-4',
      name: 'Buffalo Heatwave',
      price: 195.00,
      description: 'Spicy breaded chicken breast, buffalo sauce, and ranch dressing with extra kick.',
      category: 'Burgers',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBNr9bU9x8FgxdSAwy1rqydJax9FK0Mm83CP8sW-jZnmQzRVzkLB01P65MJ1-kx3BrIqGu3QBPZXpaLW2FQK1rOlxM09mIz8oIsNIMw4PL33D0DNCxu-9rLzsLRQ1gTpkUdp4oXD0NBhA5b7ixfpWpBQvjHf4l1Kt-ipBk2pIuC36mrdQTMY7T7imYdfms0GIqP8vclGmnD4bXszBASYerUy2djc-JVYhwA0GxJBMWDRoihnzRgd7WDcQAyO-as9nBks8yxSyqDzaE',
      status: 'Inactive',
      tag: 'Hot'
    },
    {
      id: 'prod-5',
      name: 'Pizza Margherita',
      price: 210.00,
      description: 'Traditional tomato sauce, fresh buffalo mozzarella, hand-picked basil, and extra virgin olive oil.',
      category: 'Pizza',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBygBpUWwh8OtaJC8RU2J-A3XvmOOJca3DQs7kGCsbTxO3fcb4wn7A_YykulSKHii-Y-aMMYDY2BDj27jevbX3OcLGAiQfHaJV5bnGn78U5EzoK7T-jD81IcSCQbdncrCQoJ8FagaFgoTzAsGi94d3yC7alslg07ls9QDj09SQ1AUqY2Y6owNH8TjCL_VUVJ2wPzZ1xo0cf7e8ZqdmqB_y-GLeXkZZDQ8TMB5d22qQAqqQGz-Kh9C8NXjLlbUn5oQMiZZ85v5_zA6U',
      status: 'Active'
    },
    {
      id: 'prod-6',
      name: 'Sweet Potato Fries',
      price: 95.00,
      description: 'Crispy sweet potatoes with signature spicy aioli.',
      category: 'Sides',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCfVoyPIsfvP5OzWbIeugoMzguTP_t0xopL8iToK4Iha4cISvDsM-OkeUndsmI6ntlKuGIidFze5ztS5nWIaHNCA1IBp0vwNrpfGQ6lBSlOdCEoDGsE0-a-uoSMc4aO6NSW3rDWLeKKaBMUXu6RuISIwsZrOnnMqt1TDPbojni6ixpX_k9aRUABv6UvEbHiqg0aU9fXHsl5WWD6K3k0sA8fiNrtfnVfosqTCcMsuyRxDp2OmO4ggWBXdaz76HBNCuVLQWd5EmU41mQ',
      status: 'Active'
    },
    {
      id: 'prod-7',
      name: 'Coca Cola Zero',
      price: 47.50,
      description: 'Sıfır şekerli, soğuk kutu kola.',
      category: 'Drinks',
      image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=400&q=80',
      status: 'Active'
    }
  ]);

  // Categories list
  const [categories, setCategories] = useState([
    { id: 'Burgers', name: 'Burgers', count: 4 },
    { id: 'Pizza', name: 'Pizza', count: 1 },
    { id: 'Drinks', name: 'Drinks', count: 1 },
    { id: 'Desserts', name: 'Desserts', count: 0 },
    { id: 'Salads', name: 'Salads', count: 0 },
    { id: 'Sides', name: 'Sides', count: 1 }
  ]);

  // Form states for new product
  const [newProductName, setNewProductName] = useState('');
  const [newProductPrice, setNewProductPrice] = useState('');
  const [newProductDesc, setNewProductDesc] = useState('');
  const [newProductCat, setNewProductCat] = useState('Burgers');
  const [newProductImg, setNewProductImg] = useState('');
  const [newProductTag, setNewProductTag] = useState('');

  // Handle product toggle status
  const handleToggleStatus = (id) => {
    setProducts(prev => prev.map(p => {
      if (p.id === id) {
        const nextStatus = p.status === 'Active' ? 'Inactive' : 'Active';
        return { ...p, status: nextStatus };
      }
      return p;
    }));
  };

  // Handle product deletion
  const handleDeleteProduct = (id) => {
    if (confirm('Bu ürünü silmek istediğinize emin misiniz?')) {
      const deletedProd = products.find(p => p.id === id);
      setProducts(prev => prev.filter(p => p.id !== id));
      
      // Update counts
      if (deletedProd) {
        setCategories(prev => prev.map(c => 
          c.id === deletedProd.category ? { ...c, count: Math.max(0, c.count - 1) } : c
        ));
      }
    }
  };

  // Add new product submit handler
  const handleAddProductSubmit = (e) => {
    e.preventDefault();
    if (!newProductName || !newProductPrice) {
      alert('Lütfen en az ürün adı ve fiyatını doldurunuz.');
      return;
    }

    const defaultImg = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80';

    const newProd = {
      id: `prod-${Date.now()}`,
      name: newProductName,
      price: parseFloat(newProductPrice),
      description: newProductDesc || 'Özenle hazırlanan gurme lezzetler.',
      category: newProductCat,
      image: newProductImg || defaultImg,
      status: 'Active',
      tag: newProductTag || null
    };

    setProducts(prev => [newProd, ...prev]);

    // Update categories count
    setCategories(prev => prev.map(c => 
      c.id === newProductCat ? { ...c, count: c.count + 1 } : c
    ));

    // Clear form & close modal
    setNewProductName('');
    setNewProductPrice('');
    setNewProductDesc('');
    setNewProductImg('');
    setNewProductTag('');
    setShowAddModal(false);
  };

  // Handle add custom category
  const handleAddCategory = () => {
    const catName = prompt('Yeni kategori adını girin:');
    if (catName && catName.trim() !== '') {
      const exists = categories.find(c => c.name.toLowerCase() === catName.toLowerCase());
      if (exists) {
        alert('Bu kategori zaten mevcut!');
        return;
      }
      setCategories(prev => [...prev, { id: catName, name: catName, count: 0 }]);
    }
  };

  const filteredProducts = products.filter(p => p.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Title & Add Action bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h2 className="text-3xl font-black text-stone-800 tracking-tight">Menü Yönetimi</h2>
          <p className="text-stone-500 text-sm mt-1">İşletmenizin yemeklerini, fiyatlarını, aktif durumlarını ve kategorilerini organize edin.</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-primary hover:bg-primary-container text-white px-5 py-3 rounded-full font-bold flex items-center gap-2 shadow-lg shadow-primary/10 hover:scale-102 active:scale-95 transition-all cursor-pointer whitespace-nowrap"
        >
          <span className="material-symbols-outlined text-[20px] font-bold">add</span>
          Yeni Ürün Ekle
        </button>
      </div>

      {/* Categories Horizontal Tabs */}
      <div className="flex gap-4 items-center border-b border-stone-200/50 pb-2 overflow-x-auto whitespace-nowrap scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 text-sm font-bold border-b-2 transition-all cursor-pointer ${
              selectedCategory === cat.id 
                ? 'text-primary border-primary font-extrabold' 
                : 'text-stone-500 border-transparent hover:text-stone-800'
            }`}
          >
            {cat.name} ({cat.count})
          </button>
        ))}
        
        <div className="flex-1"></div>
        
        <button 
          onClick={handleAddCategory}
          className="flex items-center gap-1 text-primary hover:text-primary-container font-bold text-xs px-3 py-1.5 rounded-lg hover:bg-primary/5 transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-[16px]">category</span>
          Yeni Kategori
        </button>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white border border-stone-100 rounded-[24px] p-16 text-center shadow-soft flex flex-col items-center justify-center">
          <div className="w-16 h-16 bg-stone-50 rounded-full flex items-center justify-center mb-4 text-stone-400">
            <span className="material-symbols-outlined text-[32px]">menu_book</span>
          </div>
          <h3 className="text-lg font-bold text-stone-700">Bu Kategoride Ürün Yok</h3>
          <p className="text-stone-400 text-xs mt-1 max-w-sm">
            "{selectedCategory}" kategorisinde henüz tanımlanmış ürün bulunmamaktadır. Sağ üstteki butonla yeni bir tane ekleyebilirsiniz.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((prod) => (
            <div 
              key={prod.id} 
              className={`bg-white rounded-[24px] overflow-hidden shadow-soft border-2 transition-all flex flex-col justify-between group ${
                prod.status === 'Inactive' 
                  ? 'border-transparent opacity-65 grayscale hover:grayscale-0 hover:opacity-100' 
                  : 'border-transparent hover:border-primary/20'
              }`}
            >
              <div className="relative h-44 overflow-hidden bg-stone-100">
                <img 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                  alt={prod.name}
                  src={prod.image} 
                  referrerPolicy="no-referrer"
                />
                
                <div className="absolute top-3 right-3 flex flex-col gap-1.5">
                  <span className={`px-2.5 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-wider shadow-sm ${
                    prod.status === 'Active' 
                      ? 'bg-green-50 text-green-600 border border-green-200' 
                      : 'bg-stone-800 text-white'
                  }`}>
                    {prod.status === 'Active' ? 'Açık / Satışta' : 'Kapalı / Yok'}
                  </span>

                  {prod.tag && (
                    <span className="bg-primary text-white px-2.5 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-wider shadow-sm text-center">
                      {prod.tag}
                    </span>
                  )}
                </div>
              </div>

              {/* Product Info */}
              <div className="p-4 flex-grow flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start gap-2 mb-1.5">
                    <h3 className="font-extrabold text-stone-800 text-sm leading-tight line-clamp-1">{prod.name}</h3>
                    <span className="font-black text-primary text-sm whitespace-nowrap">{prod.price.toFixed(2)} ₺</span>
                  </div>
                  <p className="text-stone-500 text-xs font-medium leading-relaxed line-clamp-2">{prod.description}</p>
                </div>

                {/* Footer Controls */}
                <div className="flex items-center justify-between pt-4 mt-4 border-t border-stone-100">
                  <div className="flex items-center gap-2">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={prod.status === 'Active'}
                        onChange={() => handleToggleStatus(prod.id)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                    <span className="text-[10px] font-black text-stone-500 uppercase tracking-wider">
                      {prod.status === 'Active' ? 'Aktif' : 'Pasif'}
                    </span>
                  </div>

                  <div className="flex gap-1">
                    <button 
                      onClick={() => alert('Ürün düzenleme yakında eklenecek! Şimdilik silebilir veya yeni ürün ekleyebilirsiniz.')}
                      className="p-1.5 text-stone-400 hover:text-primary hover:bg-stone-50 rounded-lg transition-all"
                      title="Düzenle"
                    >
                      <span className="material-symbols-outlined text-[18px]">edit</span>
                    </button>
                    <button 
                      onClick={() => handleDeleteProduct(prod.id)}
                      className="p-1.5 text-stone-400 hover:text-primary hover:bg-rose-50 rounded-lg transition-all"
                      title="Sil"
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Category Drag Details Box */}
      <div className="p-6 bg-stone-100 rounded-3xl border-2 border-dashed border-stone-300 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h4 className="font-extrabold text-stone-800 text-sm">Kategori Sıralama ve Yönetim Paneli</h4>
          <p className="text-stone-500 text-xs mt-0.5">Sürükle-bırak sıralama, müşteri menüsünde hangi sırayla listeleneceğini belirler.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.slice(0, 3).map((c, idx) => (
            <div key={idx} className="bg-white px-3 py-1.5 rounded-xl border border-stone-200 shadow-sm flex items-center gap-2 text-xs font-bold text-stone-700">
              <span className="material-symbols-outlined text-[14px] text-stone-400 select-none">drag_indicator</span>
              {c.name}
            </div>
          ))}
          <div className="bg-stone-50 px-3 py-1.5 rounded-xl border border-stone-200 border-dashed text-xs font-bold text-stone-400 flex items-center gap-1">
            + Daha Fazla
          </div>
        </div>
      </div>

      {/* Add New Product Modal Screen */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <form 
            onSubmit={handleAddProductSubmit}
            className="bg-white rounded-[32px] p-6 md:p-8 max-w-lg w-full shadow-2xl relative border border-stone-100 space-y-5 flex flex-col justify-between max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center border-b border-stone-100 pb-3">
              <h3 className="text-lg font-black text-stone-800">Menüye Yeni Lezzet Ekle</h3>
              <button 
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1 text-stone-400 hover:text-stone-700 transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1">Ürün Adı *</label>
                <input 
                  type="text"
                  required
                  placeholder="Örn: Double Cheesy Bacon Burger"
                  value={newProductName}
                  onChange={(e) => setNewProductName(e.target.value)}
                  className="w-full bg-stone-50 hover:bg-stone-100/70 border border-stone-200 rounded-xl px-4 py-3 text-sm focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-stone-800 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1">Fiyat (₺) *</label>
                  <input 
                    type="number"
                    step="0.01"
                    required
                    placeholder="Örn: 245.00"
                    value={newProductPrice}
                    onChange={(e) => setNewProductPrice(e.target.value)}
                    className="w-full bg-stone-50 hover:bg-stone-100/70 border border-stone-200 rounded-xl px-4 py-3 text-sm focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-stone-800 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1">Kategori</label>
                  <select 
                    value={newProductCat}
                    onChange={(e) => setNewProductCat(e.target.value)}
                    className="w-full bg-stone-50 hover:bg-stone-100/70 border border-stone-200 rounded-xl px-4 py-3 text-sm focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-stone-800 focus:outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1">Açıklama / İçerik</label>
                <textarea 
                  rows="2"
                  placeholder="Örn: Double beef patty, karamelize soğan, barbekü sos, cheddar peyniri ve çıtır bacon şeritleri."
                  value={newProductDesc}
                  onChange={(e) => setNewProductDesc(e.target.value)}
                  className="w-full bg-stone-50 hover:bg-stone-100/70 border border-stone-200 rounded-xl px-4 py-3 text-sm focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-stone-800 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1">Fotoğraf URL</label>
                  <input 
                    type="url"
                    placeholder="Resim internet linki"
                    value={newProductImg}
                    onChange={(e) => setNewProductImg(e.target.value)}
                    className="w-full bg-stone-50 hover:bg-stone-100/70 border border-stone-200 rounded-xl px-4 py-3 text-sm focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-stone-800 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1">Etiket / Durum</label>
                  <select 
                    value={newProductTag}
                    onChange={(e) => setNewProductTag(e.target.value)}
                    className="w-full bg-stone-50 hover:bg-stone-100/70 border border-stone-200 rounded-xl px-4 py-3 text-sm focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-stone-800 focus:outline-none"
                  >
                    <option value="">Yok / Normal Ürün</option>
                    <option value="Bestseller">Bestseller (En Çok Satan)</option>
                    <option value="Hot">Hot (Popüler/Acı)</option>
                    <option value="Vegan">Vegan (Bitkisel)</option>
                    <option value="Promo">%25 İndirim</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-stone-100 justify-end">
              <button 
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-5 py-2.5 bg-stone-100 hover:bg-stone-200 rounded-full font-bold text-xs text-stone-600 transition-all cursor-pointer"
              >
                İptal Et
              </button>
              <button 
                type="submit"
                className="px-7 py-2.5 bg-primary hover:bg-primary-container text-white rounded-full font-bold text-xs transition-all cursor-pointer shadow-md"
              >
                Kaydet ve Menüye Ekle
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
