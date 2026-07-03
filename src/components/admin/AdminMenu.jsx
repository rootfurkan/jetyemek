import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addMenuItem, deleteMenuItem, updateMenuItem } from '../../features/menu/menuSlice.js';
import { useToast } from '../../common/components/Toast.jsx';

export default function AdminMenu() {
  const dispatch = useDispatch();
  const addToast = useToast();

  // Giriş yapan restoranın bilgisi
  const currentUser = useSelector((state) => state.auth.currentUser);
  const restaurantId = currentUser?.restaurantId || 'gourmet-burger';

  // Redux'tan sadece bu restorana ait ürünleri al
  const allMenuItems = useSelector((state) => state.menu.items);
  const products = allMenuItems.filter(item => item.restaurantId === restaurantId);

  const [selectedCategory, setSelectedCategory] = useState('Tümü');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPrice, setEditingPrice] = useState(null); // { id, value }

  // Kategorileri ürünlerden dinamik türet
  const dynamicCategories = ['Tümü', ...new Set(products.map(p => p.category).filter(Boolean))];
  const [extraCategories, setExtraCategories] = useState([]);
  const categories = [...new Set([...dynamicCategories, ...extraCategories])];

  // Form states for new product
  const [newProductName, setNewProductName] = useState('');
  const [newProductPrice, setNewProductPrice] = useState('');
  const [newProductDesc, setNewProductDesc] = useState('');
  const [newProductCat, setNewProductCat] = useState('Popüler');
  const [newProductImg, setNewProductImg] = useState('');
  const [newProductTag, setNewProductTag] = useState('');

  // Handle product toggle status — Redux
  const handleToggleStatus = (prod) => {
    dispatch(updateMenuItem({
      id: prod.id,
      status: prod.status === 'Active' ? 'Inactive' : 'Active',
    }));
  };

  // Handle product deletion — Redux
  const handleDeleteProduct = (id) => {
    if (window.confirm('Bu ürünü menüden kaldırmak istediğinize emin misiniz?')) {
      dispatch(deleteMenuItem(id));
      addToast({ message: 'Ürün başarıyla menüden kaldırıldı.', type: 'success' });
    }
  };

  // Inline fiyat güncelleme — Redux
  const handlePriceUpdate = (id) => {
    if (!editingPrice || editingPrice.id !== id) return;
    const newPrice = parseFloat(editingPrice.value);
    if (isNaN(newPrice) || newPrice <= 0) {
      addToast({ message: 'Geçerli bir fiyat giriniz.', type: 'error' });
      return;
    }
    dispatch(updateMenuItem({ id, price: newPrice }));
    setEditingPrice(null);
    addToast({ message: 'Ürün fiyatı başarıyla güncellendi!', type: 'success' });
  };

  // Add new product submit handler — Redux
  const handleAddProductSubmit = (e) => {
    e.preventDefault();
    if (!newProductName || !newProductPrice) {
      addToast({ message: 'Lütfen en az ürün adı ve fiyatını doldurunuz.', type: 'error' });
      return;
    }

    const defaultImg = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80';

    dispatch(addMenuItem({
      name: newProductName,
      price: parseFloat(newProductPrice),
      description: newProductDesc || 'Özenle hazırlanan gurme lezzetler.',
      category: newProductCat,
      image: newProductImg || defaultImg,
      status: 'Active',
      tag: newProductTag || null,
      restaurantId,
    }));

    setNewProductName('');
    setNewProductPrice('');
    setNewProductDesc('');
    setNewProductImg('');
    setNewProductTag('');
    setShowAddModal(false);
    addToast({ message: `"${newProductName}" menüye eklendi ve müşteri paneline yansıdı!`, type: 'success' });
  };

  // Handle add custom category
  const handleAddCategory = () => {
    const catName = window.prompt('Yeni kategori adını girin:');
    if (catName && catName.trim() !== '') {
      const exists = categories.find(c => c.toLowerCase() === catName.toLowerCase());
      if (exists) {
        addToast({ message: 'Bu kategori zaten mevcut!', type: 'error' });
        return;
      }
      setExtraCategories(prev => [...prev, catName.trim()]);
    }
  };

  const filteredProducts = selectedCategory === 'Tümü'
    ? products
    : products.filter(p => p.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Title & Add Action bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h2 className="text-3xl font-black text-stone-800 tracking-tight">Menü Yönetimi</h2>
          <p className="text-stone-500 text-sm mt-1">
            İşletmenizin yemeklerini, fiyatlarını ve kategorilerini organize edin.
            <span className="ml-2 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              {products.length} ürün
            </span>
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-primary hover:bg-primary-container text-white px-5 py-3 rounded-full font-bold flex items-center gap-2 shadow-lg shadow-primary/10 hover:scale-102 active:scale-95 transition-all cursor-pointer whitespace-nowrap"
        >
          <span className="material-symbols-outlined text-[20px] font-bold">add</span>
          Yeni Ürün Ekle
        </button>
      </div>

      {/* Redux Sync Banner */}
      <div className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-emerald-50 border border-emerald-200/60">
        <span className="material-symbols-outlined text-emerald-500 text-lg">sync</span>
        <p className="text-emerald-700 text-xs font-semibold">
          <strong>Gerçek Zamanlı Senkronizasyon:</strong> Eklediğiniz ürünler anında müşteri paneline yansır.
        </p>
      </div>

      {/* Categories Horizontal Tabs */}
      <div className="flex gap-4 items-center border-b border-stone-200/50 pb-2 overflow-x-auto whitespace-nowrap no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 text-sm font-bold border-b-2 transition-all cursor-pointer ${
              selectedCategory === cat
                ? 'text-primary border-primary font-extrabold'
                : 'text-stone-500 border-transparent hover:text-stone-800'
            }`}
          >
            {cat} ({cat === 'Tümü' ? products.length : products.filter(p => p.category === cat).length})
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
          <button
            onClick={() => setShowAddModal(true)}
            className="mt-4 bg-primary text-white px-5 py-2.5 rounded-full text-xs font-bold cursor-pointer"
          >
            İlk Ürünü Ekle
          </button>
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
                  </div>
                  <p className="text-stone-500 text-xs font-medium leading-relaxed line-clamp-2">{prod.description}</p>

                  {/* Inline Fiyat Güncelleme */}
                  <div className="mt-3 flex items-center gap-2">
                    {editingPrice?.id === prod.id ? (
                      <>
                        <input
                          type="number"
                          step="0.01"
                          value={editingPrice.value}
                          onChange={(e) => setEditingPrice({ id: prod.id, value: e.target.value })}
                          onKeyDown={(e) => { if (e.key === 'Enter') handlePriceUpdate(prod.id); if (e.key === 'Escape') setEditingPrice(null); }}
                          className="w-24 border border-primary/40 rounded-lg px-2 py-1 text-sm font-bold text-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                          autoFocus
                        />
                        <button onClick={() => handlePriceUpdate(prod.id)} className="text-emerald-600 hover:text-emerald-700 cursor-pointer">
                          <span className="material-symbols-outlined text-[18px]">check</span>
                        </button>
                        <button onClick={() => setEditingPrice(null)} className="text-stone-400 hover:text-stone-600 cursor-pointer">
                          <span className="material-symbols-outlined text-[18px]">close</span>
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => setEditingPrice({ id: prod.id, value: prod.price.toString() })}
                        className="flex items-center gap-1.5 group/price cursor-pointer"
                        title="Fiyatı güncelle"
                      >
                        <span className="font-black text-primary text-base">{prod.price?.toFixed(2)} ₺</span>
                        <span className="material-symbols-outlined text-[14px] text-stone-300 group-hover/price:text-primary transition-colors">edit</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="flex items-center justify-between pt-4 mt-4 border-t border-stone-100">
                  <div className="flex items-center gap-2">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={prod.status === 'Active'}
                        onChange={() => handleToggleStatus(prod)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                    <span className="text-[10px] font-black text-stone-500 uppercase tracking-wider">
                      {prod.status === 'Active' ? 'Aktif' : 'Pasif'}
                    </span>
                  </div>

                  <button
                    onClick={() => handleDeleteProduct(prod.id)}
                    className="p-1.5 text-stone-400 hover:text-red-500 hover:bg-rose-50 rounded-lg transition-all cursor-pointer"
                    title="Sil"
                  >
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                  </button>
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
              {c}
            </div>
          ))}
          <div className="bg-stone-50 px-3 py-1.5 rounded-xl border border-stone-200 border-dashed text-xs font-bold text-stone-400 flex items-center gap-1">
            + Daha Fazla
          </div>
        </div>
      </div>

      {/* Add New Product Modal Screen */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form
            onSubmit={handleAddProductSubmit}
            className="bg-white rounded-[32px] p-6 md:p-8 max-w-lg w-full shadow-2xl relative border border-stone-100 space-y-5 flex flex-col justify-between max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center border-b border-stone-100 pb-3">
              <div>
                <h3 className="text-lg font-black text-stone-800">Menüye Yeni Lezzet Ekle</h3>
                <p className="text-xs text-stone-400 mt-0.5">Bu ürün anında müşteri menüsüne yansıyacak.</p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1 text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
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
                    {categories.filter(c => c !== 'Tümü').map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                    <option value="Popüler">Popüler</option>
                    <option value="Burgerler">Burgerler</option>
                    <option value="Pizza">Pizza</option>
                    <option value="Ana Yemekler">Ana Yemekler</option>
                    <option value="Yan Ürünler">Yan Ürünler</option>
                    <option value="İçecekler">İçecekler</option>
                    <option value="Tatlılar">Tatlılar</option>
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
