import { useEffect, useMemo, useState } from "react";
import { getFinancialStatus, getOrderDate, isCancelled } from "../adminDashboardUtils.js";
import { downloadFinancePdf } from "../financePdf.js";

export default function useAdminFinance({
  platformOrders,
  restaurants,
  addToast,
}) {
  const [financeSearch, setFinanceSearch] = useState("");
  const [financeSort, setFinanceSort] = useState("amount_desc");
  const [financePage, setFinancePage] = useState(1);
  const [pdfLoading, setPdfLoading] = useState(false);

  const financials = useMemo(
    () =>
      [...platformOrders]
        .sort((a, b) => getOrderDate(b) - getOrderDate(a))
        .map((order) => {
          const restaurant = restaurants.find(
            (item) => String(item.id) === String(order.restaurantId),
          );
          const gross = Number(order.total) || 0;
          const commissionRate = Number(restaurant?.commission ?? 12);
          const comm = isCancelled(order) ? 0 : (gross * commissionRate) / 100;
          const net = isCancelled(order) ? 0 : gross - comm;
          const orderDate = getOrderDate(order);

          return {
            id: order.id,
            restaurant:
              restaurant?.name ||
              order.restaurant ||
              order.restaurantName ||
              "Restoran",
            date: Number.isNaN(orderDate.getTime())
              ? "-"
              : orderDate.toLocaleString("tr-TR", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                }),
            dateValue: Number.isNaN(orderDate.getTime())
              ? 0
              : orderDate.getTime(),
            gross,
            comm,
            net,
            commissionRate,
            status: getFinancialStatus(order),
          };
        }),
    [platformOrders, restaurants],
  );

  const filteredFinancials = useMemo(() => {
    const searchText = financeSearch.trim().toLocaleLowerCase("tr-TR");
    const searchedFinancials = financials.filter(
      (ledger) =>
        !searchText ||
        String(ledger.id).toLocaleLowerCase("tr-TR").includes(searchText) ||
        ledger.restaurant.toLocaleLowerCase("tr-TR").includes(searchText) ||
        ledger.status.toLocaleLowerCase("tr-TR").includes(searchText),
    );

    return [...searchedFinancials].sort((a, b) => {
      if (financeSort === "amount_asc") return a.gross - b.gross;
      if (financeSort === "commission_desc") return b.comm - a.comm;
      if (financeSort === "date_desc") return b.dateValue - a.dateValue;
      return b.gross - a.gross;
    });
  }, [financeSearch, financeSort, financials]);

  const financePerPage = 10;
  const financeTotalPages = Math.max(
    1,
    Math.ceil(filteredFinancials.length / financePerPage),
  );
  const paginatedFinancials = filteredFinancials.slice(
    (financePage - 1) * financePerPage,
    financePage * financePerPage,
  );
  const financeGrossTotal = financials.reduce(
    (sum, ledger) =>
      sum + (ledger.status === "İptal Edildi" ? 0 : ledger.gross),
    0,
  );
  const financeCommissionTotal = financials.reduce(
    (sum, ledger) => sum + ledger.comm,
    0,
  );
  const financeRestaurantPayout = financials.reduce(
    (sum, ledger) => sum + ledger.net,
    0,
  );
  const averageCommissionRate = financials.length
    ? financials.reduce((sum, ledger) => sum + ledger.commissionRate, 0) /
      financials.length
    : 0;

  useEffect(() => {
    setFinancePage(1);
  }, [financeSearch, financeSort]);

  useEffect(() => {
    if (financePage > financeTotalPages) {
      setFinancePage(financeTotalPages);
    }
  }, [financePage, financeTotalPages]);

  const handleDownloadPDF = async () => {
    setPdfLoading(true);

    try {
      const hasArialFont = await downloadFinancePdf({
        filteredFinancials,
        financeGrossTotal,
        financeCommissionTotal,
        financeRestaurantPayout,
      });
      addToast({
        message: hasArialFont
          ? "Finans raporu indirildi."
          : "Finans raporu indirildi. Türkçe karakterler için public/fonts/arial.ttf dosyasını ekleyin.",
        type: "success",
      });
    } catch (error) {
      addToast({
        message: "Finans raporu oluşturulurken bir sorun oluştu.",
        type: "error",
      });
    } finally {
      setPdfLoading(false);
    }
  };
  return {
    financials,
    filteredFinancials,
    paginatedFinancials,
    financeGrossTotal,
    financeCommissionTotal,
    financeRestaurantPayout,
    averageCommissionRate,
    financeSearch,
    setFinanceSearch,
    financeSort,
    setFinanceSort,
    handleDownloadPDF,
    pdfLoading,
    financePerPage,
    financePage,
    setFinancePage,
    financeTotalPages,
  };
}

