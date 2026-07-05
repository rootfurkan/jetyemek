export const DEFAULT_ADMIN_AVATAR =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCW3F7uh6g1Kznczffnq89_eaBUXJq8xASo0zbD3eje_5FDbt5YvAYODYbkYpUnOEh1Hw2G6gPOlJBj9uGmtICPXc7xJGIts_Pe7soyVnnalozY_lL_RLoT8N3gng22vnqC7Q9hGG5FCSn-TtpYKjeTzSZuIxZvnd0sQnEKV_eeRZPLl6XSdbmnYHOffUF_DfOylLNs5qVH5kcor9EUg-LfQCi8dLcsRuaNNac3lG-cjyMYLGlcECKbklmwsAXuYFS93v2MYPGR6Ug";

export function formatCurrency(value) {
  return `${Number(value || 0).toLocaleString("tr-TR")} ₺`;
}

export function formatPdfCurrency(value) {
  return `${Number(value || 0).toLocaleString("tr-TR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} TL`;
}

export function getOrderDate(order) {
  return new Date(order.createdAt || order.date || 0);
}

export function isCancelled(order) {
  return (
    order.deliveryStatus === "cancelled" ||
    order.status === "İptal Edildi" ||
    order.status === "Iptal Edildi"
  );
}

export function getOrderStatusText(order) {
  if (isCancelled(order)) return "İptal Edildi";
  if (order.deliveryStatus === "delivered") return "Teslim Edildi";
  if (order.deliveryStatus === "on_the_way") return "Yolda";
  if (order.deliveryStatus === "ready") return "Hazır";
  return order.status || "Hazırlanıyor";
}

export function getFinancialStatus(order) {
  if (isCancelled(order)) return "İptal Edildi";
  if (order.deliveryStatus === "delivered" || order.status === "Teslim Edildi")
    return "Tamamlandı";
  return "Beklemede";
}

function arrayBufferToBase64(buffer) {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  const chunkSize = 0x8000;

  for (let index = 0; index < bytes.length; index += chunkSize) {
    const chunk = bytes.subarray(index, index + chunkSize);
    binary += String.fromCharCode.apply(null, chunk);
  }

  return btoa(binary);
}

export async function registerArialFont(doc) {
  const fontCandidates = [
    {
      url: "/fonts/Roboto-Medium.ttf",
      fileName: "Roboto-Medium.ttf",
      family: "JetYemekFont",
    },
    { url: "/fonts/arial.ttf", fileName: "arial.ttf", family: "JetYemekFont" },
    {
      url: "/fonts/Arial.ttf",
      fileName: "Arial.ttf",
      family: "JetYemekFont",
    },
  ];

  for (const font of fontCandidates) {
    try {
      const response = await fetch(font.url);
      if (!response.ok) continue;

      const fontBase64 = arrayBufferToBase64(await response.arrayBuffer());
      doc.addFileToVFS(font.fileName, fontBase64);
      doc.addFont(font.fileName, font.family, "normal", "Identity-H");
      doc.setFont(font.family, "normal");
      doc.setCharSpace(0);
      doc.getTextWidth("Türkçe karakter testi: ğüşöçıİ");
      return true;
    } catch (error) {
      doc.setFont("helvetica", "normal");
    }
  }

  doc.setFont("helvetica", "normal");
  doc.setCharSpace(0);
  return false;
}

export function normalizePdfText(value, hasUnicodeFont) {
  const text = String(value ?? "");
  if (hasUnicodeFont) return text;

  return text
    .replaceAll("İ", "I")
    .replaceAll("I", "I")
    .replaceAll("ı", "i")
    .replaceAll("Ş", "S")
    .replaceAll("ş", "s")
    .replaceAll("Ğ", "G")
    .replaceAll("ğ", "g")
    .replaceAll("Ü", "U")
    .replaceAll("ü", "u")
    .replaceAll("Ö", "O")
    .replaceAll("ö", "o")
    .replaceAll("Ç", "C")
    .replaceAll("ç", "c");
}

export function getCustomerPlatformRole(orderCount) {
  if (orderCount > 10) return "VIP";
  if (orderCount >= 10) return "Elite";
  if (orderCount >= 5) return "Gold";
  if (orderCount >= 3) return "Silver";
  return "Yeni";
}

export function formatJoinedDate(user) {
  const dateValue = user.createdAt || user.joinedAt || user.registeredAt;
  if (!dateValue) return "-";

  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleDateString("tr-TR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export const ORDER_STATUS_OPTIONS = [
  {
    label: "Hazırlanıyor",
    status: "Hazırlanıyor",
    deliveryStatus: "preparing",
    progress: 10,
    icon: "restaurant",
  },
  {
    label: "Sipariş Hazır",
    status: "Sipariş Hazır",
    deliveryStatus: "ready",
    progress: 35,
    icon: "inventory_2",
  },
  {
    label: "Kurye Yola Çıktı",
    status: "Kurye Yola Çıktı",
    deliveryStatus: "on_the_way",
    progress: 55,
    icon: "local_shipping",
  },
  {
    label: "Teslim Edildi",
    status: "Teslim Edildi",
    deliveryStatus: "delivered",
    progress: 100,
    icon: "check_circle",
  },
  {
    label: "İptal Edildi",
    status: "İptal Edildi",
    deliveryStatus: "cancelled",
    progress: 0,
    icon: "cancel",
  },
];

export const COURIER_MAP_ROUTES = [
  {
    path: "M 24 116 C 110 94, 168 92, 242 118 S 382 154, 500 112",
    duration: 24,
  },
  { path: "M 64 38 C 122 76, 158 126, 216 126 S 330 82, 456 46", duration: 22 },
  {
    path: "M 78 178 C 146 134, 218 146, 280 108 S 390 66, 520 78",
    duration: 27,
  },
  {
    path: "M 512 190 C 420 166, 364 156, 296 178 S 156 210, 42 172",
    duration: 26,
  },
  {
    path: "M 282 24 C 268 82, 286 128, 250 170 S 180 216, 102 206",
    duration: 23,
  },
  { path: "M 18 72 C 96 58, 158 54, 216 74 S 326 140, 536 142", duration: 29 },
];

export function getCourierMapVisual(courier, index) {
  const route = COURIER_MAP_ROUTES[index % COURIER_MAP_ROUTES.length];
  const isBusy = courier.status === "Teslimatta";
  const isAvailable =
    courier.status === "Müsait" || courier.status === "Beklemede";

  return {
    ...route,
    icon: courier.vehicle?.toLowerCase().includes("bisiklet")
      ? "pedal_bike"
      : "motorcycle",
    colorClass: isBusy
      ? "text-primary"
      : isAvailable
        ? "text-green-600"
        : "text-stone-400",
    pulseClass: isAvailable ? "animate-pulse" : "",
    isMoving: courier.status !== "Çevrimdışı",
  };
}

export function getCampaignTypeLabel(type) {
  if (type === "free_delivery") return "Teslimat Kampanyası";
  if (type === "coupon_fixed") return "Sabit Kupon";
  if (type === "coupon_percent") return "Yüzde Kupon";
  return "Kampanya";
}

export function getCampaignRateText(campaign) {
  if (campaign.type === "free_delivery")
    return `${Number(campaign.discountValue || 0)} TL teslimat`;
  if (campaign.type === "coupon_fixed")
    return `${Number(campaign.discountValue || 0)} TL`;
  if (campaign.type === "coupon_percent")
    return `%${Number(campaign.discountValue || 0)}`;
  return "-";
}

export function getCampaignUsageText(campaign) {
  const usageCount = Number(campaign.usageCount || 0);
  return campaign.usageLimit
    ? `${usageCount} / ${campaign.usageLimit}`
    : `${usageCount} / sınırsız`;
}

export function getCampaignProgress(campaign) {
  if (!campaign.usageLimit) return 0;
  return Math.min(
    100,
    (Number(campaign.usageCount || 0) / Number(campaign.usageLimit)) * 100,
  );
}
