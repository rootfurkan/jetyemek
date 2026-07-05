import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addMenuItem, deleteMenuItem, updateMenuItem } from '../../features/menu/menuSlice.js';
import { useToast } from '../../common/components/Toast.jsx';
import { createMenuItem, updateMenuItemApi, deleteMenuItemApi } from '../../services/api.js';
import AdminMenuCategoryModal from './menu/AdminMenuCategoryModal.jsx';
import AdminMenuDeleteModal from './menu/AdminMenuDeleteModal.jsx';
import AdminMenuProductCard from './menu/AdminMenuProductCard.jsx';
import AdminMenuProductModal from './menu/AdminMenuProductModal.jsx';

// Ürün etiketlerini kullanıcıya Türkçe gösterir.
const formatProductTag = (tag) => {
  if (tag === 'Hot') return 'Popüler';
  if (tag === 'Bestseller') return 'En Çok Satan';
  if (tag === 'Promo') return '%25 İndirim';
  if (tag === '%25 Off') return '%25 İndirim';
  if (tag === 'New') return 'Yeni';
  return tag;
};

// Restoran menü yönetimi ekranını çalıştırır.
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
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [editingPrice, setEditingPrice] = useState(null); // { id, value }
  const [editingProduct, setEditingProduct] = useState(null);

  // Kategorileri ürünlerden dinamik türet
  const dynamicCategories = ['Tümü', ...new Set(products.map(p => p.category).filter(Boolean))];
  const [extraCategories, setExtraCategories] = useState([]);
  const categories = [...new Set([...dynamicCategories, ...extraCategories])];
  const categoryOptions = categories.filter(c => c !== dynamicCategories[0]);

  // Form states for new product
  const [newProductName, setNewProductName] = useState('');
  const [newProductPrice, setNewProductPrice] = useState('');
  const [newProductDesc, setNewProductDesc] = useState('');
  const [newProductCat, setNewProductCat] = useState('Popüler');
  const [newProductImg, setNewProductImg] = useState('');
  const [newProductTag, setNewProductTag] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [hasExtraOptions, setHasExtraOptions] = useState(false);
  const [extraOptionGroups, setExtraOptionGroups] = useState([
    { title: '', type: 'single', required: false, options: [{ name: '', price: '' }] }
  ]);

  // Ürün formunu boş başlangıç haline getirir.
  const resetProductForm = () => {
    setEditingProduct(null);
    setNewProductName('');
    setNewProductPrice('');
    setNewProductDesc('');
    setNewProductCat(categoryOptions[0] || 'Popüler');
    setNewProductImg('');
    setNewProductTag('');
    setHasExtraOptions(false);
    setExtraOptionGroups([{ title: '', type: 'single', required: false, options: [{ name: '', price: '' }] }]);
  };

  // Yeni ürün ekleme modalını açar.
  const openAddProductModal = () => {
    resetProductForm();
    setShowAddModal(true);
  };

  // Seçilen ürünü düzenleme formuna taşır.
  const openEditProductModal = (product) => {
    setEditingProduct(product);
    setNewProductName(product.name || '');
    setNewProductPrice(product.price?.toString() || '');
    setNewProductDesc(product.description || '');
    setNewProductCat(product.category || categoryOptions[0] || '');
    setNewProductImg(product.image || '');
    setNewProductTag(product.tag || '');
    setHasExtraOptions(!!product.extraOptions);
    if (product.extraOptions) {
      if (Array.isArray(product.extraOptions)) {
        setExtraOptionGroups(
          product.extraOptions.map((group) => ({
            title: group.title || '',
            type: group.type || 'single',
            required: !!group.required,
            options: group.options?.length
              ? group.options.map((opt) => ({ name: opt.name || '', price: opt.price?.toString() || '' }))
              : [{ name: '', price: '' }]
          }))
        );
      } else {
        setExtraOptionGroups([{
          title: product.extraOptions.title || '',
          type: 'single',
          required: false,
          options: product.extraOptions.options?.length
            ? product.extraOptions.options.map((opt) => ({ name: opt.name || '', price: opt.price?.toString() || '' }))
            : [{ name: '', price: '' }]
        }]);
      }
    } else {
      setExtraOptionGroups([{ title: '', type: 'single', required: false, options: [{ name: '', price: '' }] }]);
    }
    setShowAddModal(true);
  };

  // Handle product toggle status — Redux
  // Ürünü satışa açar veya kapatır.
  const handleToggleStatus = async (prod) => {
    const nextStatus = prod.status === 'Active' ? 'Inactive' : 'Active';

    try {
      const updatedMenuItem = await updateMenuItemApi(prod.id, { status: nextStatus });
      dispatch(updateMenuItem(updatedMenuItem));
      addToast({
        message: nextStatus === 'Active' ? 'Ürün satışa açıldı.' : 'Ürün satışa kapatıldı.',
        type: 'success',
      });
    } catch (error) {
      addToast({ message: 'Ürün durumu güncellenirken bir sorun oluştu.', type: 'error' });
    }
  };

  // Handle product deletion — Redux
  // Silinecek ürünü seçip onay modalını açar.
  const handleDeleteProduct = (id) => {
    setProductToDelete(id);
    setIsDeleteModalOpen(true);
  };

  // Onaylanan ürünü db.json ve Redux üzerinden siler.
  const confirmDeleteProduct = async () => {
    if (productToDelete) {
      try {
        await deleteMenuItemApi(productToDelete);
        dispatch(deleteMenuItem(productToDelete));
        addToast({ message: 'Ürün başarıyla silindi.', type: 'success' });
        setIsDeleteModalOpen(false);
        setProductToDelete(null);
      } catch (error) {
        addToast({ message: 'Ürün silinirken bir sorun oluştu.', type: 'error' });
      }
    }
  };

  // Inline fiyat güncelleme — Redux
  // Ürün fiyatını hızlı düzenleme alanından günceller.
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
  // Ürün ekleme ve düzenleme formunu kaydeder.
  const handleAddProductSubmit = async (e) => {
    e.preventDefault();
    if (!newProductName || !newProductPrice) {
      addToast({ message: 'Lütfen en az ürün adı ve fiyatını doldurunuz.', type: 'error' });
      return;
    }

    const defaultImg = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80';
    
    // YENİ JSON ŞEMASINA UYGUN PAYLOAD OLUŞTURMA
    const menuItemPayload = {
      restaurantId,
      name: newProductName.trim(),
      price: parseFloat(newProductPrice),
      description: newProductDesc.trim(),
      category: newProductCat || categories[0] || 'Kategorisiz',
      image: newProductImg.trim() || defaultImg,
      time: "20-30 dk", // Varsayılan süre
      status: "Active"
    };

    if (newProductTag && newProductTag.trim() !== '') {
      menuItemPayload.tag = newProductTag.trim();
    }

    if (hasExtraOptions) {
      const validGroups = extraOptionGroups.map(g => ({
        title: g.title.trim(),
        type: g.type,
        required: g.required,
        options: g.options
          .map(o => ({ name: o.name.trim(), price: Number(o.price) || 0 }))
          .filter(o => o.name)
      })).filter(g => g.title && g.options.length > 0);

      if (validGroups.length === 0) {
        addToast({ message: 'Lütfen geçerli ek seçenekler ekleyin veya toggleı kapatın.', type: 'error' });
        return;
      }
      menuItemPayload.extraOptions = validGroups;
    } else if (editingProduct?.extraOptions) {
      menuItemPayload.extraOptions = null;
    }

    try {
      if (editingProduct) {
        const updatedMenuItem = await updateMenuItemApi(editingProduct.id, menuItemPayload);
        dispatch(updateMenuItem(updatedMenuItem));
      } else {
        const savedMenuItem = await createMenuItem(menuItemPayload);
        dispatch(addMenuItem(savedMenuItem));
      }
    } catch (error) {
      console.error('Urun kaydedilirken hata:', error);
      addToast({ message: 'Ürün kaydedilirken bir hata oluştu.', type: 'error' });
      return;
    }

    const productName = newProductName;
    const wasEditing = !!editingProduct;
    resetProductForm();
    setShowAddModal(false);
    addToast({
      message: wasEditing
        ? `"${productName}" ürünü güncellendi.`
        : `"${productName}" menüye eklendi ve müşteri paneline yansıdı!`,
      type: 'success'
    });
  };

  // Yeni kategoriyi menü filtrelerine ekler.
  const handleAddCategorySubmit = (e) => {
    e.preventDefault();
    const catName = newCategoryName.trim();

    if (!catName) {
      addToast({ message: 'Lutfen kategori adi giriniz.', type: 'error' });
      return;
    }

    const exists = categories.find(c => c.toLowerCase() === catName.toLowerCase());
    if (exists) {
      addToast({ message: 'Bu kategori zaten mevcut!', type: 'error' });
      return;
    }

    setExtraCategories(prev => [...prev, catName]);
    setSelectedCategory(catName);
    setNewProductCat(catName);
    setNewCategoryName('');
    setShowCategoryModal(false);
    addToast({ message: `"${catName}" kategorisi eklendi.`, type: 'success' });
  };

  const filteredProducts = selectedCategory === 'Tümü'
    ? products
    : products.filter(p => p.category === selectedCategory);
  const productsPerPage = 12;
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / productsPerPage));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedProducts = filteredProducts.slice(
    (safePage - 1) * productsPerPage,
    safePage * productsPerPage
  );

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
          onClick={openAddProductModal}
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
            onClick={() => {
              setSelectedCategory(cat);
              setCurrentPage(1);
            }}
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
          onClick={() => setShowCategoryModal(true)}
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
            onClick={openAddProductModal}
            className="mt-4 bg-primary text-white px-5 py-2.5 rounded-full text-xs font-bold cursor-pointer"
          >
            İlk Ürünü Ekle
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {paginatedProducts.map((prod) => (
            <AdminMenuProductCard
              key={prod.id}
              product={prod}
              editingPrice={editingPrice}
              setEditingPrice={setEditingPrice}
              onPriceUpdate={handlePriceUpdate}
              onToggleStatus={handleToggleStatus}
              onEdit={openEditProductModal}
              onDelete={handleDeleteProduct}
              formatProductTag={formatProductTag}
            />
          ))}
        </div>
      )}

      {filteredProducts.length > productsPerPage && (
        <div className="bg-white border border-stone-100 rounded-2xl px-4 py-3 shadow-soft flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs font-bold text-stone-500">
            {(safePage - 1) * productsPerPage + 1}-{Math.min(safePage * productsPerPage, filteredProducts.length)} / {filteredProducts.length} ürün gösteriliyor
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              disabled={safePage === 1}
              className="w-9 h-9 rounded-xl border border-stone-200 bg-white text-stone-500 hover:bg-stone-50 hover:text-primary disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all flex items-center justify-center"
              title="Önceki sayfa"
            >
              <span className="material-symbols-outlined text-[18px]">chevron_left</span>
            </button>

            {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
              <button
                key={page}
                type="button"
                onClick={() => setCurrentPage(page)}
                className={`w-9 h-9 rounded-xl text-xs font-black border transition-all cursor-pointer ${
                  safePage === page
                    ? 'bg-primary text-white border-primary shadow-md shadow-primary/15'
                    : 'bg-white text-stone-500 border-stone-200 hover:bg-stone-50 hover:text-primary'
                }`}
              >
                {page}
              </button>
            ))}

            <button
              type="button"
              onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
              disabled={safePage === totalPages}
              className="w-9 h-9 rounded-xl border border-stone-200 bg-white text-stone-500 hover:bg-stone-50 hover:text-primary disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all flex items-center justify-center"
              title="Sonraki sayfa"
            >
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          </div>
        </div>
      )}

      {showCategoryModal && (
        <AdminMenuCategoryModal
          newCategoryName={newCategoryName}
          setNewCategoryName={setNewCategoryName}
          onSubmit={handleAddCategorySubmit}
          onClose={() => {
            setShowCategoryModal(false);
            setNewCategoryName('');
          }}
        />
      )}

      {showAddModal && (
        <AdminMenuProductModal
          editingProduct={editingProduct}
          categoryOptions={categoryOptions}
          newProductName={newProductName}
          setNewProductName={setNewProductName}
          newProductPrice={newProductPrice}
          setNewProductPrice={setNewProductPrice}
          newProductDesc={newProductDesc}
          setNewProductDesc={setNewProductDesc}
          newProductCat={newProductCat}
          setNewProductCat={setNewProductCat}
          newProductImg={newProductImg}
          setNewProductImg={setNewProductImg}
          newProductTag={newProductTag}
          setNewProductTag={setNewProductTag}
          hasExtraOptions={hasExtraOptions}
          setHasExtraOptions={setHasExtraOptions}
          extraOptionGroups={extraOptionGroups}
          setExtraOptionGroups={setExtraOptionGroups}
          onSubmit={handleAddProductSubmit}
          onClose={() => {
            setShowAddModal(false);
            resetProductForm();
          }}
        />
      )}

      <AdminMenuDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDeleteProduct}
      />
    </div>
  );
}
