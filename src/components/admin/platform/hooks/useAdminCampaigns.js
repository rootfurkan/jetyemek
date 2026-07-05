import { useEffect, useState } from "react";
import api from "../../../../services/api.js";

// Kampanya CRUD işlemlerini yönetir.
export default function useAdminCampaigns({ addToast }) {
  const [promos, setPromos] = useState([]);
  const [newCampaignName, setNewCampaignName] = useState("");
  const [newCampaignCode, setNewCampaignCode] = useState("");
  const [newCampaignType, setNewCampaignType] = useState("coupon_percent");
  const [newCampaignDiscount, setNewCampaignDiscount] = useState("20");
  const [newCampaignMin, setNewCampaignMin] = useState("150");
  const [campaignDeleteModal, setCampaignDeleteModal] = useState(null);

  const activePromos = promos.filter((promo) => promo.status === "Aktif");
  const totalCampaignUsage = promos.reduce(
    (sum, promo) => sum + Number(promo.usageCount || 0),
    0,
  );
  const couponPromoCount = promos.filter(
    (promo) => promo.type !== "free_delivery",
  ).length;

  useEffect(() => {
    async function loadCampaigns() {
      try {
        const response = await api.get("/campaigns");
        setPromos(response.data || []);
      } catch (error) {
        setPromos([]);
      }
    }

    loadCampaigns();
  }, []);

  // Yeni kampanya veya kupon kaydı oluşturur.
  const handleLaunchCampaign = async (e) => {
    e.preventDefault();
    if (newCampaignType !== "free_delivery" && !newCampaignCode.trim()) return;

    const newPromo = {
      id: "camp-" + Date.now(),
      name: newCampaignName || "Yeni Kampanya",
      code:
        newCampaignType === "free_delivery"
          ? ""
          : newCampaignCode.toUpperCase().trim(),
      type: newCampaignType,
      discountValue:
        newCampaignType === "free_delivery"
          ? 50
          : Number(newCampaignDiscount || 0),
      minOrder: Number(newCampaignMin || 0),
      status: "Aktif",
      usageCount: 0,
      usageLimit: newCampaignType === "free_delivery" ? null : 10000,
      description:
        newCampaignType === "free_delivery"
          ? `${newCampaignMin} TL üzeri siparişlerde teslimat ücreti bedava`
          : `${newCampaignMin} TL üzeri siparişlerde geçerli kupon`,
    };

    try {
      const response = await api.post("/campaigns", newPromo);
      setPromos((prev) => [response.data, ...prev]);
      setNewCampaignName("");
      setNewCampaignCode("");
      addToast({ message: "Yeni kampanya yayına alındı.", type: "success" });
    } catch (error) {
      addToast({
        message: "Kampanya kaydedilirken bir sorun oluştu.",
        type: "error",
      });
    }
  };

  // Kampanyayı aktif veya pasif yapar.
  const handleToggleCampaignStatus = async (campaign) => {
    const nextStatus = campaign.status === "Aktif" ? "Pasif" : "Aktif";

    try {
      const response = await api.patch(`/campaigns/${campaign.id}`, {
        status: nextStatus,
      });
      setPromos((prev) =>
        prev.map((promo) =>
          String(promo.id) === String(campaign.id)
            ? { ...promo, ...response.data }
            : promo,
        ),
      );
      addToast({
        message: `Kampanya ${nextStatus.toLowerCase()} duruma alındı.`,
        type: "success",
      });
    } catch (error) {
      addToast({
        message: "Kampanya durumu güncellenirken bir sorun oluştu.",
        type: "error",
      });
    }
  };

  // Silinecek kampanya için onay modalını açar.
  const openCampaignDeleteModal = (campaign) => {
    setCampaignDeleteModal(campaign);
  };

  // Kampanya silme modalını kapatır.
  const closeCampaignDeleteModal = () => {
    setCampaignDeleteModal(null);
  };

  // Onaylanan kampanyayı veritabanından siler.
  const handleDeleteCampaign = async () => {
    if (!campaignDeleteModal?.id) return;

    try {
      await api.delete(`/campaigns/${campaignDeleteModal.id}`);
      setPromos((prev) =>
        prev.filter(
          (promo) => String(promo.id) !== String(campaignDeleteModal.id),
        ),
      );
      addToast({ message: "Kampanya silindi.", type: "success" });
      closeCampaignDeleteModal();
    } catch (error) {
      addToast({
        message: "Kampanya silinirken bir sorun oluştu.",
        type: "error",
      });
    }
  };

  return {
    promos,
    activePromos,
    totalCampaignUsage,
    couponPromoCount,
    newCampaignName,
    setNewCampaignName,
    newCampaignCode,
    setNewCampaignCode,
    newCampaignType,
    setNewCampaignType,
    newCampaignDiscount,
    setNewCampaignDiscount,
    newCampaignMin,
    setNewCampaignMin,
    campaignDeleteModal,
    handleLaunchCampaign,
    handleToggleCampaignStatus,
    openCampaignDeleteModal,
    closeCampaignDeleteModal,
    handleDeleteCampaign,
  };
}
