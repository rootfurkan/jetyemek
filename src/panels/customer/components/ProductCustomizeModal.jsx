import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ProductCustomizeModal({
  isOpen,
  onClose,
  product,
  restaurant,
  onAddToCart,
  addToast,
}) {
  if (!isOpen || !product) return null;

  // Options State
  const [selectedSingleOptions, setSelectedSingleOptions] = useState({});
  const [selectedMultiOptions, setSelectedMultiOptions] = useState({});
  const [productNote, setProductNote] = useState("");
  const [quantity, setQuantity] = useState(1);

  // Derived Values
  const isBurger =
    product.category === "Burgerler" ||
    product.name.toLowerCase().includes("burger");
  const isPizza =
    product.category === "Pizzalar" ||
    product.name.toLowerCase().includes("pizza");
  const isDessert =
    product.category === "Tatlılar" ||
    product.name.toLowerCase().includes("tatlı");

  // Hardcoded option sets based on category
  const getOptions = () => {
    let options = [];
    if (isBurger) {
      options = [
        {
          id: "gramaj",
          title: "Köfte Gramajı",
          type: "single", // radio
          required: true,
          choices: [
            { name: "80gr", price: 0 },
            { name: "100gr", price: 50 },
            { name: "120gr", price: 100 },
          ],
        },
        {
          id: "sos",
          title: "Ekstra Soslar",
          type: "multi", // checkbox
          required: false,
          choices: [
            { name: "Ketçap", price: 10 },
            { name: "Mayonez", price: 10 },
            { name: "Ranch Sos", price: 15 },
          ],
        },
        {
          id: "malzeme",
          title: "Ekstra Malzemeler",
          type: "multi", // checkbox
          required: false,
          choices: [
            { name: "Karamelize Soğan", price: 20 },
            { name: "Marul", price: 10 },
            { name: "Turşu", price: 10 },
          ],
        },
      ];
    } else if (isPizza) {
      options = [
        {
          id: "boyut",
          title: "Büyüklük",
          type: "single",
          required: true,
          choices: [
            { name: "Küçük", price: 0 },
            { name: "Orta", price: 70 },
            { name: "Büyük", price: 110 },
          ],
        },
        {
          id: "hamur",
          title: "Hamur Kalınlığı",
          type: "single",
          required: true,
          choices: [
            { name: "İnce Hamur", price: 0 },
            { name: "Orta Hamur", price: 0 },
            { name: "Kalın Hamur", price: 0 },
          ],
        },
        {
          id: "ekstra",
          title: "Ekstra Malzemeler",
          type: "multi",
          required: false,
          choices: [
            { name: "Parmesan", price: 25 },
            { name: "Mantar", price: 25 },
            { name: "Sucuk", price: 50 },
            { name: "Mısır", price: 20 },
          ],
        },
        {
          id: "baharat",
          title: "Ekstra Pizza Baharatı",
          type: "single",
          required: false,
          choices: [
            { name: "İstemiyorum", price: 0 },
            { name: "1 Adet", price: 5 },
            { name: "2 Adet", price: 10 },
            { name: "3 Adet", price: 15 },
          ],
        },
      ];
    } else if (isDessert) {
      options = [
        {
          id: "dondurma",
          title: "Ekstra Dondurma",
          type: "single",
          required: false,
          choices: [
            { name: "İstemiyorum", price: 0 },
            { name: "1 Top", price: 70 },
            { name: "2 Top", price: 130 },
          ],
        },
      ];
    }

    // fallback for regular items
    if (options.length === 0 && product.extraOptions) {
      if (Array.isArray(product.extraOptions)) {
        options = product.extraOptions.map((optGroup, index) => ({
          id: `custom_group_${index}`,
          title: optGroup.title || "Seçenekler",
          type: optGroup.type || "single", // single or multi
          required: optGroup.required || false,
          choices: (optGroup.options || []).map((opt) => ({
            name: opt.name,
            price: Number(opt.price) || 0,
          })),
        }));
      } else {
        options = [
          {
            id: "generic_extra",
            title: product.extraOptions.title || "Ek Seçenekler",
            type: "single",
            required: true,
            choices: (product.extraOptions.options || []).map((opt) => ({
              name: opt.name,
              price: Number(opt.price) || 0,
            })),
          },
        ];
      }
    }
    return options;
  };

  const optionGroups = getOptions();

  // Initialize Default State when modal opens
  useEffect(() => {
    if (isOpen) {
      const initialSingle = {};
      const initialMulti = {};
      optionGroups.forEach((group) => {
        if (group.type === "single") {
          // Set first option as default if required
          if (group.required && group.choices.length > 0) {
            initialSingle[group.id] = group.choices[0];
          }
        } else {
          initialMulti[group.id] = [];
        }
      });
      setSelectedSingleOptions(initialSingle);
      setSelectedMultiOptions(initialMulti);
      setProductNote("");
      setQuantity(1);
    }
  }, [isOpen, product]);

  // Handlers
  const handleSingleSelect = (groupId, choice) => {
    setSelectedSingleOptions((prev) => ({ ...prev, [groupId]: choice }));
  };

  const handleMultiSelect = (groupId, choice) => {
    setSelectedMultiOptions((prev) => {
      const current = prev[groupId] || [];
      const exists = current.find((c) => c.name === choice.name);
      if (exists) {
        return {
          ...prev,
          [groupId]: current.filter((c) => c.name !== choice.name),
        };
      } else {
        return { ...prev, [groupId]: [...current, choice] };
      }
    });
  };

  // Price Calculation
  const getExtraPrice = () => {
    let total = 0;
    Object.values(selectedSingleOptions).forEach((choice) => {
      if (choice && choice.price) total += choice.price;
    });
    Object.values(selectedMultiOptions).forEach((choices) => {
      choices.forEach((choice) => {
        if (choice && choice.price) total += choice.price;
      });
    });
    return total;
  };

  const unitPrice = (Number(product.price) || 0) + getExtraPrice();
  const totalPrice = unitPrice * quantity;

  const handleAddToCartClick = () => {
    // Validate Required Single Choices
    for (const group of optionGroups) {
      if (group.type === "single" && group.required) {
        if (!selectedSingleOptions[group.id]) {
          addToast({
            message: `Lütfen zorunlu bir seçim yapın: ${group.title}`,
            type: "warning",
          });
          return;
        }
      }
    }

    // Build the options string for Name and ID uniqueness
    let selectedNames = [];
    Object.values(selectedSingleOptions).forEach((choice) => {
      if (choice && choice.name && choice.name !== "İstemiyorum") {
        selectedNames.push(choice.name);
      }
    });
    Object.values(selectedMultiOptions).forEach((choices) => {
      choices.forEach((choice) => {
        if (choice && choice.name) selectedNames.push(choice.name);
      });
    });

    const optionsText =
      selectedNames.length > 0 ? ` (${selectedNames.join(", ")})` : "";
    const finalName = `${product.name}${optionsText}`;

    // Create a unique ID string to allow multiple variations of the same product in cart
    const finalId =
      selectedNames.length > 0
        ? `${product.id}-${selectedNames.join("-").replace(/\s+/g, "")}`
        : product.id;

    const cartItem = {
      ...product,
      id: finalId,
      name: finalName,
      price: unitPrice,
      restaurantId: restaurant?.id || product.restaurantId,
      restaurantName: restaurant?.name || product.restaurantName || "Restoran",
      quantity, // Use our local quantity state
      note: productNote.trim() !== "" ? productNote : null,
    };

    onAddToCart(cartItem);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            initial={{ y: "100%", opacity: 0.5 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="relative w-full max-w-2xl bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/80 hover:bg-white text-stone-700 rounded-full flex items-center justify-center backdrop-blur shadow-sm cursor-pointer border border-stone-200 transition-all"
            >
              <span className="material-symbols-outlined text-[20px]">
                close
              </span>
            </button>

            {/* Header Image (Optional) */}
            {product.image && (
              <div className="w-full h-35 sm:h-50 bg-stone-100 relative shrink-0">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              </div>
            )}

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto pb-24 text-left">
              <div className="p-6">
                <h2 className="text-2xl font-black text-stone-800 leading-tight">
                  {product.name}
                </h2>
                <p className="text-xl font-extrabold text-primary mt-1">
                  ₺{product.price}
                </p>
                <p className="text-sm text-stone-500 font-medium mt-3 leading-relaxed">
                  {product.description ||
                    "Restoranın özenle hazırladığı nefis lezzet."}
                </p>
              </div>

              <div className="px-6 space-y-6">
                {/* Options Mapping */}
                {optionGroups.map((group) => (
                  <div
                    key={group.id}
                    className="bg-stone-50 border border-stone-100 rounded-2xl p-4 sm:p-5"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <h4 className="font-bold text-stone-800 text-base">
                          {group.title}
                        </h4>
                        <span className="text-[10px] text-stone-500 font-bold uppercase tracking-wider bg-stone-200/50 px-2 py-0.5 rounded-full mt-1 inline-block">
                          {group.type === "single"
                            ? group.required
                              ? "Zorunlu Seçim (1)"
                              : "İsteğe Bağlı (En fazla 1)"
                            : "İsteğe Bağlı"}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {group.choices.map((choice, idx) => {
                        const isSingle = group.type === "single";
                        const isSelected = isSingle
                          ? selectedSingleOptions[group.id]?.name ===
                            choice.name
                          : selectedMultiOptions[group.id]?.some(
                              (c) => c.name === choice.name,
                            );

                        return (
                          <label
                            key={idx}
                            onClick={() =>
                              isSingle
                                ? handleSingleSelect(group.id, choice)
                                : handleMultiSelect(group.id, choice)
                            }
                            className={`flex items-center justify-between py-3 px-4 rounded-xl border transition-all cursor-pointer group ${isSelected ? "border-primary bg-primary/5 text-primary shadow-sm shadow-primary/10" : "border-stone-200 text-stone-600 hover:bg-stone-50"}`}
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-5 h-5 flex items-center justify-center border-2 transition-all ${isSingle ? "rounded-full" : "rounded"} ${isSelected ? "border-primary bg-primary" : "border-stone-300 bg-white group-hover:border-primary/50"}`}
                              >
                                {isSelected && (
                                  <span
                                    className="material-symbols-outlined text-[14px] text-white font-extrabold"
                                    style={{
                                      fontVariationSettings: "'FILL' 1",
                                    }}
                                  >
                                    {isSingle ? "circle" : "check"}
                                  </span>
                                )}
                              </div>
                              <span
                                className={`text-sm font-semibold ${isSelected ? "text-stone-800" : "text-stone-600 group-hover:text-stone-800"}`}
                              >
                                {choice.name}
                              </span>
                            </div>
                            {choice.price > 0 && (
                              <span
                                className={`text-xs font-extrabold px-2 py-1 rounded-lg ${isSelected ? "text-primary bg-white border border-primary/20" : "text-stone-500 bg-white border border-stone-200"}`}
                              >
                                +{choice.price} TL
                              </span>
                            )}
                          </label>
                        );
                      })}
                    </div>
                  </div>
                ))}

                {/* Product Note */}
                <div className="bg-stone-50 border border-stone-100 rounded-2xl p-4 sm:p-5">
                  <div className="mb-3">
                    <h4 className="font-bold text-stone-800 text-base">
                      Ürün Notu
                    </h4>
                    <span className="text-[10px] text-stone-500 font-bold uppercase tracking-wider bg-stone-200/50 px-2 py-0.5 rounded-full mt-1 inline-block">
                      Özel tercihleriniz var mı?
                    </span>
                  </div>
                  <textarea
                    rows={3}
                    placeholder="Ürünle ilgili notunuzu yazabilirsiniz..."
                    value={productNote}
                    onChange={(e) => setProductNote(e.target.value)}
                    className="w-full bg-white border border-stone-200 rounded-xl py-3 px-4 text-sm font-medium focus:border-primary focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/10 resize-none transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Sticky Bottom Actions */}
            <div className="absolute bottom-0 inset-x-0 bg-white border-t border-stone-100 p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-4 shadow-[0_-10px_30px_rgba(0,0,0,0.05)] z-20">
              <div className="flex items-center justify-between bg-stone-100 rounded-xl p-1 w-full sm:w-auto shrink-0">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center text-stone-500 hover:text-stone-800 bg-white rounded-lg shadow-sm cursor-pointer transition-all active:scale-95 border border-stone-200/50"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    remove
                  </span>
                </button>
                <span className="w-10 text-center font-black text-stone-800 text-base">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 flex items-center justify-center text-stone-500 hover:text-stone-800 bg-white rounded-lg shadow-sm cursor-pointer transition-all active:scale-95 border border-stone-200/50"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    add
                  </span>
                </button>
              </div>

              <button
                onClick={handleAddToCartClick}
                className="flex-1 brand-gradient-bg text-white font-extrabold text-base rounded-xl py-3.5 px-6 flex justify-between items-center shadow-md shadow-rose-900/10 hover:shadow-lg transition-all active:scale-95 cursor-pointer border-none"
              >
                <span>Sepete Ekle</span>
                <span>₺{totalPrice.toFixed(2)}</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
