import { useEffect, useState } from "react";
import api from "../../../../services/api.js";
import { DEFAULT_ADMIN_AVATAR } from "../adminDashboardUtils.js";

export default function useAdminSettings({ currentUser, addToast }) {
  const [platformSettingsId, setPlatformSettingsId] = useState(null);
  const [baseCommission, setBaseCommission] = useState("12");
  const [baseDeliveryFee, setBaseDeliveryFee] = useState("24.90");
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [smsNotifs, setSmsNotifs] = useState(false);
  const [adminProfileName, setAdminProfileName] = useState("Cansu Yılmaz");
  const [adminEmail, setAdminProfileEmail] = useState(
    "cansu.y@vibranthearth.com",
  );
  const [adminAvatar, setAdminAvatar] = useState("");
  const [savedPlatformSettings, setSavedPlatformSettings] = useState(null);
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [settingsSaving, setSettingsSaving] = useState(false);

  const applyPlatformSettings = (settings) => {
    if (!settings) return;

    setPlatformSettingsId(settings.id || null);
    setBaseCommission(String(settings.baseCommission ?? 12));
    setBaseDeliveryFee(String(settings.baseDeliveryFee ?? 24.9));
    setEmailNotifs(settings.emailNotifications ?? true);
    setSmsNotifs(settings.smsNotifications ?? false);
    setAdminProfileName(
      settings.adminName || currentUser?.name || "Platform Admin",
    );
    setAdminProfileEmail(
      settings.adminEmail || currentUser?.email || "admin@jetyemek.com",
    );
    setAdminAvatar(settings.adminAvatar || currentUser?.avatar || "");
    setSavedPlatformSettings(settings);
  };

  useEffect(() => {
    async function loadPlatformSettings() {
      setSettingsLoading(true);

      try {
        const response = await api.get("/settings");
        const settings = (response.data || [])[0] || null;

        if (settings) {
          applyPlatformSettings(settings);
        } else {
          const fallbackSettings = {
            id: "platform",
            baseCommission: 12,
            baseDeliveryFee: 24.9,
            emailNotifications: true,
            smsNotifications: false,
            adminName: currentUser?.name || "Platform Admin",
            adminEmail: currentUser?.email || "admin@jetyemek.com",
            adminAvatar: currentUser?.avatar || "",
          };
          const createResponse = await api.post("/settings", fallbackSettings);
          applyPlatformSettings(createResponse.data);
        }
      } catch (error) {
        addToast({
          message: "Platform ayarları yüklenirken bir sorun oluştu.",
          type: "error",
        });
      } finally {
        setSettingsLoading(false);
      }
    }

    loadPlatformSettings();
  }, [currentUser?.avatar, currentUser?.email, currentUser?.name]);

  const handleResetSystemSettings = () => {
    applyPlatformSettings(savedPlatformSettings);
    addToast({ message: "Değişiklikler geri alındı.", type: "success" });
  };

  const handleSaveSystemSettings = async () => {
    const commissionValue = Number(baseCommission);
    const deliveryFeeValue = Number(String(baseDeliveryFee).replace(",", "."));

    if (
      Number.isNaN(commissionValue) ||
      commissionValue < 0 ||
      commissionValue > 100
    ) {
      addToast({
        message: "Komisyon oranı 0 ile 100 arasında olmalı.",
        type: "error",
      });
      return;
    }

    if (Number.isNaN(deliveryFeeValue) || deliveryFeeValue < 0) {
      addToast({
        message: "Teslimat ücreti geçerli bir tutar olmalı.",
        type: "error",
      });
      return;
    }

    const payload = {
      baseCommission: commissionValue,
      baseDeliveryFee: deliveryFeeValue,
      emailNotifications: emailNotifs,
      smsNotifications: smsNotifs,
      adminName: adminProfileName.trim() || "Platform Admin",
      adminEmail: adminEmail.trim() || "admin@jetyemek.com",
      adminAvatar: adminAvatar.trim(),
      updatedAt: new Date().toISOString(),
    };

    setSettingsSaving(true);

    try {
      const response = platformSettingsId
        ? await api.patch(`/settings/${platformSettingsId}`, payload)
        : await api.post("/settings", { id: "platform", ...payload });

      applyPlatformSettings(response.data);
      window.dispatchEvent(
        new CustomEvent("platformSettingsUpdated", { detail: response.data }),
      );
      addToast({ message: "Sistem ayarları kaydedildi.", type: "success" });
    } catch (error) {
      addToast({
        message: "Sistem ayarları kaydedilirken bir sorun oluştu.",
        type: "error",
      });
    } finally {
      setSettingsSaving(false);
    }
  };

  return {
    settingsLoading,
    settingsSaving,
    baseCommission,
    setBaseCommission,
    baseDeliveryFee,
    setBaseDeliveryFee,
    emailNotifs,
    setEmailNotifs,
    smsNotifs,
    setSmsNotifs,
    adminProfileName,
    setAdminProfileName,
    adminEmail,
    setAdminProfileEmail,
    adminAvatar,
    setAdminAvatar,
    visibleAdminName: adminProfileName.trim() || "Platform Admin",
    visibleAdminEmail: adminEmail.trim() || "admin@jetyemek.com",
    visibleAdminAvatar: adminAvatar.trim() || DEFAULT_ADMIN_AVATAR,
    handleResetSystemSettings,
    handleSaveSystemSettings,
  };
}
