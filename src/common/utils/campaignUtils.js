export const PENDING_COUPON_KEY = "jetyemek_pending_coupon";

export function isCouponCampaign(campaign) {
  return ["coupon_fixed", "coupon_percent"].includes(campaign?.type);
}

export function getActiveCampaigns(campaigns) {
  return (campaigns || []).filter((campaign) => campaign.status === "Aktif");
}

export function getCampaignBadge(campaign) {
  if (campaign.type === "free_delivery") return "ÜCRETSİZ TESLİMAT";
  if (campaign.type === "coupon_percent") return "YÜZDE İNDİRİM";
  if (campaign.type === "coupon_fixed") return "KUPON FIRSATI";
  return "KAMPANYA";
}

export function getCampaignTitle(campaign) {
  if (campaign.type === "free_delivery") {
    return `${Number(campaign.minOrder || 0)} TL üzeri ücretsiz teslimat`;
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
  if (campaign.description) return campaign.description;
  if (campaign.minOrder) return `Minimum sepet tutarı ${Number(campaign.minOrder)} TL.`;
  return "Seçili siparişlerde geçerlidir.";
}

export function savePendingCoupon(code) {
  if (!code) return;
  window.localStorage.setItem(PENDING_COUPON_KEY, String(code).toUpperCase());
}
