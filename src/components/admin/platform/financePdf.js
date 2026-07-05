import {
  formatPdfCurrency,
  normalizePdfText,
  registerArialFont,
} from "./adminDashboardUtils.js";

export async function downloadFinancePdf({
  filteredFinancials,
  financeGrossTotal,
  financeCommissionTotal,
  financeRestaurantPayout,
}) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const hasArialFont = await registerArialFont(doc);
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  const primary = [225, 29, 72];
  const primaryDark = [190, 18, 60];
  const roseLight = [255, 241, 242];
  const stoneText = [41, 37, 36];
  const mutedText = [120, 113, 108];
  const border = [231, 229, 228];
  let y = 16;
  const pdfText = (value) => normalizePdfText(value, hasArialFont);

  const addPageFooter = () => {
    const pageCount = doc.internal.getNumberOfPages();
    doc.setFontSize(7);
    doc.setTextColor(...mutedText);
    doc.text(
      pdfText(`JetYemek Finans Raporu • Sayfa ${pageCount}`),
      margin,
      pageHeight - 8,
    );
  };

  const drawCoverHeader = () => {
    doc.setFillColor(...primary);
    doc.roundedRect(margin, y, pageWidth - margin * 2, 24, 4, 4, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(17);
    doc.text(pdfText("JetYemek Finans Raporu"), margin + 7, y + 10);
    doc.setFontSize(8.5);
    doc.text(
      pdfText(`Oluşturma Tarihi: ${new Date().toLocaleString("tr-TR")}`),
      margin + 7,
      y + 17,
    );
    y += 32;
  };

  const drawSummaryCard = (x, title, value, note) => {
    doc.setFillColor(...roseLight);
    doc.setDrawColor(...border);
    doc.roundedRect(x, y, 56, 25, 3, 3, "FD");
    doc.setTextColor(...mutedText);
    doc.setFontSize(7.5);
    doc.text(pdfText(title), x + 4, y + 7);
    doc.setTextColor(...primaryDark);
    doc.setFontSize(11);
    doc.text(pdfText(value), x + 4, y + 15);
    doc.setTextColor(...mutedText);
    doc.setFontSize(6.8);
    doc.text(pdfText(note), x + 4, y + 21);
  };

  drawCoverHeader();
  drawSummaryCard(
    margin,
    "Platform Cirosu",
    formatPdfCurrency(financeGrossTotal),
    "İptal dışı siparişler",
  );
  drawSummaryCard(
    margin + 62,
    "Komisyon Geliri",
    formatPdfCurrency(financeCommissionTotal),
    "Restoran oranlarına göre",
  );
  drawSummaryCard(
    margin + 124,
    "Restoran Hak Edişi",
    formatPdfCurrency(financeRestaurantPayout),
    `${filteredFinancials.length} kayıt`,
  );
  y += 35;

  const columns = [
    { key: "id", label: "İşlem", x: margin, width: 26, align: "left" },
    { key: "restaurant", label: "Restoran", x: 40, width: 43, align: "left" },
    { key: "date", label: "Tarih", x: 84, width: 34, align: "left" },
    { key: "gross", label: "Brüt", x: 119, width: 24, align: "right" },
    { key: "comm", label: "Komisyon", x: 144, width: 25, align: "right" },
    { key: "net", label: "Net", x: 170, width: 26, align: "right" },
  ];
  const tableWidth = pageWidth - margin * 2;
  const rowHeight = 10;

  const drawHeader = () => {
    doc.setFillColor(...primary);
    doc.roundedRect(margin, y, tableWidth, 9, 2, 2, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(7.5);
    columns.forEach((column) => {
      const textX =
        column.align === "right" ? column.x + column.width - 2 : column.x + 2;
      doc.text(pdfText(column.label), textX, y + 5.8, {
        align: column.align === "right" ? "right" : "left",
      });
    });
    y += 9;
  };

  drawHeader();

  filteredFinancials.forEach((ledger, index) => {
    if (y > pageHeight - 18) {
      addPageFooter();
      doc.addPage();
      y = 16;
      drawHeader();
    }

    doc.setFillColor(
      index % 2 === 0 ? 255 : 250,
      index % 2 === 0 ? 255 : 250,
      index % 2 === 0 ? 255 : 250,
    );
    doc.rect(margin, y, tableWidth, rowHeight, "F");
    doc.setDrawColor(...border);
    doc.line(margin, y + rowHeight, pageWidth - margin, y + rowHeight);
    doc.setFontSize(7.2);

    const values = {
      id: `#${ledger.id}`,
      restaurant: ledger.restaurant,
      date: ledger.date,
      gross: formatPdfCurrency(ledger.gross),
      comm: `-${formatPdfCurrency(ledger.comm)}`,
      net: formatPdfCurrency(ledger.net),
    };

    columns.forEach((column) => {
      const text =
        doc.splitTextToSize(pdfText(values[column.key]), column.width - 3)[0] ||
        "";
      const isMoney = ["gross", "comm", "net"].includes(column.key);
      doc.setTextColor(
        column.key === "comm" ? primaryDark[0] : stoneText[0],
        column.key === "comm" ? primaryDark[1] : stoneText[1],
        column.key === "comm" ? primaryDark[2] : stoneText[2],
      );
      if (!isMoney && column.key !== "restaurant") {
        doc.setTextColor(...mutedText);
      }

      const textX =
        column.align === "right" ? column.x + column.width - 2 : column.x + 2;
      doc.text(text, textX, y + 6.4, {
        align: column.align === "right" ? "right" : "left",
      });
    });

    y += rowHeight;
  });

  addPageFooter();
  doc.save(
    `jetyemek-finans-raporu-${new Date().toISOString().slice(0, 10)}.pdf`,
  );

  return hasArialFont;
}
