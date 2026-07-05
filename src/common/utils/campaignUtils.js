export const PENDING_COUPON_KEY = "jetyemek_pending_coupon"; // LocalStorage içinde kupon kodunu saklamak için sabit bir key oluşturduk.

export function isCouponCampaign(campaign) {
  return ["coupon_fixed", "coupon_percent"].includes(campaign?.type);
}

export function getActiveCampaigns(campaigns) { //dışardan kampanya verisi aldık
  return (campaigns || []).filter((campaign) => campaign.status === "Aktif"); //kampanya yoksa boş array verdik sonra sadece status değeri aktif olan kampanyaları filtreledik
}

export function getCampaignBadge(campaign) { 
  if (campaign.type === "free_delivery") return "ÜCRETSİZ TESLİMAT";
  if (campaign.type === "coupon_percent") return "YÜZDE İNDİRİM";
  if (campaign.type === "coupon_fixed") return "KUPON FIRSATI";
  return "KAMPANYA";
}

export function getCampaignTitle(campaign) {
  if (campaign.type === "free_delivery") {
    return `${Number(campaign.minOrder || 0)} TL üzeri ücretsiz teslimat`; // içinde değer yoksa 0 ver
  }

  if (campaign.type === "coupon_percent") {
    return `${campaign.code} koduyla %${Number(campaign.discountValue || 0)} indirim`;
  }

  if (campaign.type === "coupon_fixed") {
    return `${campaign.code} koduyla ${Number(campaign.discountValue || 0)} TL indirim`;
  }

  return campaign.name || "Kampanya";
}

export function getCampaignDescription(campaign) {
  if (campaign.description) return campaign.description;  // Eğer kampanyanın kendi açıklaması varsa direkt onu kullandık.
  if (campaign.minOrder) return `Minimum sepet tutarı ${Number(campaign.minOrder)} TL.`; // min sipariş tutarı varsa onu kullandık
  return "Seçili siparişlerde geçerlidir."; // yoksa varsayılan açıklama
}

export function savePendingCoupon(code) {
  if (!code) return;
  window.localStorage.setItem(PENDING_COUPON_KEY, String(code).toUpperCase()); //kupon kodunu stringe çevirip localstorage ye kaydettik giriş yaptıktn sonra da kullanılsın diye
}
