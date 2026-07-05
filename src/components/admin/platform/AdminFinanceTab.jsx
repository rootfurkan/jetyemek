import React from "react";
import AdminPagination from "../../../common/components/AdminPagination.jsx";
import SearchInput from "../../../common/components/SearchInput.jsx";
import StatCard from "../../../common/components/StatCard.jsx";
import StatusBadge from "../../../common/components/StatusBadge.jsx";
import TableEmptyState from "../../../common/components/TableEmptyState.jsx";

// Platform finansal analiz sekmesini gösterir.
export default function AdminFinanceTab({
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
  formatCurrency,
}) {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          label="Platform Toplam Cirosu"
          value={formatCurrency(financeGrossTotal)}
          icon="trending_up"
          className="min-h-36"
        />
        <StatCard
          label="Net Kar (Hizmet Bedeli)"
          value={formatCurrency(financeCommissionTotal)}
          icon="account_balance_wallet"
          color="primary"
          className="min-h-36"
        />
        <StatCard
          label="Restoranlara Dağıtılacak Tutar"
          value={formatCurrency(financeRestaurantPayout)}
          icon="restaurant"
          className="min-h-36"
        />
      </div>

      <div className="bg-white rounded-[28px] border border-stone-100 shadow-soft overflow-hidden">
        <div className="p-5 border-b border-stone-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h4 className="text-base font-extrabold text-stone-800">
              Hak Ediş ve Muhasebe Logları
            </h4>
            <p className="text-[10px] text-stone-400 font-bold mt-1">
              {filteredFinancials.length} kayıt listeleniyor • %
              {averageCommissionRate.toFixed(1)} ortalama komisyon
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <SearchInput
              value={financeSearch}
              onChange={setFinanceSearch}
              placeholder="Restoran, işlem veya durum ara..."
              className="flex-1 sm:w-64"
            />
            <select
              value={financeSort}
              onChange={(event) => setFinanceSort(event.target.value)}
              className="px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-bold text-stone-700 focus:outline-none focus:ring-4 focus:ring-primary/5"
            >
              <option value="amount_desc">Tutar: Yüksekten Düşüğe</option>
              <option value="amount_asc">Tutar: Düşükten Yükseğe</option>
              <option value="date_desc">Tarih: En Yeni</option>
              <option value="commission_desc">Komisyon: Yüksekten Düşüğe</option>
            </select>
            <button
              type="button"
              onClick={handleDownloadPDF}
              disabled={pdfLoading || filteredFinancials.length === 0}
              className="px-5 py-2.5 bg-primary hover:bg-primary-container disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-xs rounded-xl uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
            >
              <span className="material-symbols-outlined text-[16px]">
                picture_as_pdf
              </span>
              {pdfLoading ? "Rapor Üretiliyor..." : "PDF Finans Raporu Al"}
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-100 text-[10px] font-black text-stone-400 uppercase tracking-wider">
                <th className="px-6 py-4">Restoran Bilgisi</th>
                <th className="px-4 py-4">İşlem Tarihi</th>
                <th className="px-4 py-4">Brüt Sipariş Tutarı</th>
                <th className="px-4 py-4">Alınan Komisyon</th>
                <th className="px-4 py-4">Net Restoran Ödeme</th>
                <th className="px-6 py-4">Mutabakat Statüsü</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-xs text-stone-700 font-medium">
              {paginatedFinancials.length === 0 ? (
                <TableEmptyState colSpan="6" message="Finans kaydı bulunamadı." />
              ) : (
                paginatedFinancials.map((ledger) => (
                  <tr
                    key={ledger.id}
                    className="hover:bg-stone-50/40 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <p className="font-extrabold text-stone-800 text-xs">
                        {ledger.restaurant}
                      </p>
                      <p className="text-[10px] text-stone-400 font-semibold">
                        İşlem: {ledger.id}
                      </p>
                    </td>
                    <td className="px-4 py-4 text-stone-400 whitespace-nowrap">
                      {ledger.date}
                    </td>
                    <td className="px-4 py-4">{formatCurrency(ledger.gross)}</td>
                    <td className="px-4 py-4 text-primary">
                      -{formatCurrency(ledger.comm)}{" "}
                      <span className="text-[10px] text-stone-400">
                        (%{ledger.commissionRate})
                      </span>
                    </td>
                    <td className="px-4 py-4 font-black text-stone-800">
                      {formatCurrency(ledger.net)}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={ledger.status} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {filteredFinancials.length > financePerPage && (
          <AdminPagination
            currentPage={financePage}
            totalPages={financeTotalPages}
            onPageChange={setFinancePage}
          />
        )}
      </div>
    </div>
  );
}
