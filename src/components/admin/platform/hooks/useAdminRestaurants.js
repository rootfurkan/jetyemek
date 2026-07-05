import { useState } from "react";
import { useDispatch } from "react-redux";
import {
  addRestaurant,
  deleteRestaurant,
  toggleRestaurantStatus,
  updateRestaurantCommission,
} from "../../../../features/restaurants/restaurantsSlice.js";
import api from "../../../../services/api.js";

// Restoran ekleme, silme ve komisyon işlemlerini yönetir.
export default function useAdminRestaurants({ addToast }) {
  const dispatch = useDispatch();
  const [showAddRestaurant, setShowAddRestaurant] = useState(false);
  const [newRestName, setNewRestName] = useState("");
  const [newRestCategory, setNewRestCategory] = useState("Fast Food");
  const [newRestComm, setNewRestCommission] = useState("12");
  const [newRestCity, setNewRestCity] = useState("Kadıköy, İstanbul");
  const [newRestEmail, setNewRestEmail] = useState("");
  const [newRestPassword, setNewRestPassword] = useState("");
  const [commissionModal, setCommissionModal] = useState(null);
  const [commissionValue, setCommissionValue] = useState("");
  const [deleteModal, setDeleteModal] = useState(null);

  // Restoranı aktif veya pasif yapar.
  const handleToggleRestStatus = (id) => {
    dispatch(toggleRestaurantStatus(id));
  };

  // Komisyon düzenleme modalını açar.
  const openCommissionModal = (restaurant) => {
    setCommissionModal(restaurant);
    setCommissionValue(String(restaurant.commission ?? 12));
  };

  // Komisyon modalını kapatır.
  const closeCommissionModal = () => {
    setCommissionModal(null);
    setCommissionValue("");
  };

  // Yeni komisyon oranını restorana kaydeder.
  const handleUpdateCommission = (event) => {
    event.preventDefault();
    const commission = Number(commissionValue);

    if (
      !commissionModal ||
      Number.isNaN(commission) ||
      commission < 0 ||
      commission > 100
    ) {
      addToast({
        message: "Lütfen 0 ile 100 arasında geçerli bir komisyon oranı girin.",
        type: "error",
      });
      return;
    }

    dispatch(updateRestaurantCommission({ id: commissionModal.id, commission }));
    addToast({ message: "Komisyon oranı güncellendi.", type: "success" });
    closeCommissionModal();
  };

  // Restoran silme onayını açar.
  const openDeleteModal = (restaurant) => {
    setDeleteModal(restaurant);
  };

  // Restoran silme onayını kapatır.
  const closeDeleteModal = () => {
    setDeleteModal(null);
  };

  // Seçili restoranı listeden kaldırır.
  const handleDeleteRestaurant = () => {
    if (!deleteModal?.id) return;

    dispatch(deleteRestaurant(deleteModal.id));
    addToast({ message: "Restoran platformdan kaldırıldı.", type: "success" });
    closeDeleteModal();
  };

  // Yeni restoran ve giriş kullanıcısı oluşturur.
  const handleAddRestaurantSubmit = async (e) => {
    e.preventDefault();
    if (!newRestName.trim()) return;

    const restId =
      "rest-" +
      newRestName
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "") +
      "-" +
      Date.now();
    const defaultRestaurantImage =
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBRPoRs6VKT-ySLSQhdu8Boq9afALJYNi_qrxHW-yLf_DmqyDxotD82BvURB4QL-MlsTp2H8vqXlt1wKPxvYswVY99Au7AamrCyBaahAzRkn5kFLIX-KgTpWc-in1avO-e_2PAF4dENFsQbj_rgqNpYrhGZ0ts-zVI_y95NpjAqahKSopcwfRkK51fX0_bxNsfcoIlzBfCilwibiS63DPsMkr-Tl1_Y4PCq8YrGFEchU9eSaiEywQw4fB8hU_4EykbBLLWrVMQpj_U";
    const restaurantPayload = {
      id: restId,
      name: newRestName.trim(),
      category: newRestCategory,
      commission: parseFloat(newRestComm) || 12,
      status: "Aktif",
      isOpen: true,
      isSponsor: false,
      city: newRestCity,
      rating: "5.0",
      time: "30-40 dk",
      deliveryFee: "Ücretsiz",
      minOrder: "100 TL",
      tag: "restoran",
      image: defaultRestaurantImage,
      bannerImage: "",
      description: "",
      deliveryZones: newRestCity,
      address: newRestCity,
      phone: "",
      email: newRestEmail.trim(),
      holidayMode: false,
      holidayStart: "",
      holidayEnd: "",
    };

    try {
      const savedRestaurantResponse = await api.post(
        "/restaurants",
        restaurantPayload,
      );
      dispatch(addRestaurant(savedRestaurantResponse.data));

      if (newRestEmail.trim()) {
        await api.post("/users", {
          id: restId + "-user",
          role: "restaurant",
          email: newRestEmail.trim(),
          password: newRestPassword || "rest123",
          restaurantId: restId,
          name: newRestName.trim(),
          avatar: defaultRestaurantImage,
        });
      }
    } catch (error) {
      addToast({
        message: "Restoran kaydedilirken bir sorun oluştu.",
        type: "error",
      });
      return;
    }

    addToast({
      message: `"${newRestName}" restoranı platforma eklendi ve müşteri paneline yansıdı!`,
      type: "success",
    });
    setNewRestName("");
    setNewRestEmail("");
    setNewRestPassword("");
    setShowAddRestaurant(false);
  };

  return {
    showAddRestaurant,
    setShowAddRestaurant,
    newRestName,
    setNewRestName,
    newRestCategory,
    setNewRestCategory,
    newRestComm,
    setNewRestCommission,
    newRestCity,
    setNewRestCity,
    newRestEmail,
    setNewRestEmail,
    newRestPassword,
    setNewRestPassword,
    commissionModal,
    commissionValue,
    setCommissionValue,
    deleteModal,
    handleToggleRestStatus,
    openCommissionModal,
    closeCommissionModal,
    handleUpdateCommission,
    openDeleteModal,
    closeDeleteModal,
    handleDeleteRestaurant,
    handleAddRestaurantSubmit,
  };
}
