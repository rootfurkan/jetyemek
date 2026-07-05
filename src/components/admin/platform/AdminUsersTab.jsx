import React from "react";
import AdminSectionHeader from "../../../common/components/AdminSectionHeader.jsx";
import TableEmptyState from "../../../common/components/TableEmptyState.jsx";

// Platform kullanıcılarını ve durum işlemlerini gösterir.
export default function AdminUsersTab({
  searchQuery,
  setSearchQuery,
  filteredUsers,
  userDeleteModal,
  handleToggleUserStatus,
  openUserDeleteModal,
  closeUserDeleteModal,
  handleDeleteUser,
}) {
  return (
    <div className="space-y-6 animate-fade-in">
      <AdminSectionHeader
        title="Müşteri Portföyü"
        description="Platformdaki tüm kayıtlı kullanıcıların listesi, sipariş adetleri ve hesap durumları."
      >
        <div className="relative max-w-xs w-full">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-[18px]">
            search
          </span>
          <input
            type="text"
            placeholder="İsim veya e-posta ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-4 py-2 bg-white border border-stone-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-4 focus:ring-primary/5 w-full text-stone-700 placeholder-stone-400 transition-all"
          />
        </div>
      </AdminSectionHeader>

      <div className="bg-white rounded-[28px] shadow-soft border border-stone-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-100 text-[10px] font-black text-stone-400 uppercase tracking-wider">
                <th className="px-6 py-4">Müşteri Bilgisi</th>
                <th className="px-4 py-4 text-center">Platform Rolü</th>
                <th className="px-4 py-4 text-center">Toplam Sipariş</th>
                <th className="px-4 py-4">Kayıt Tarihi</th>
                <th className="px-4 py-4">Hesap Durumu</th>
                <th className="px-6 py-4 text-right">İşlemler</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-stone-100 text-xs text-stone-700 font-medium">
              {filteredUsers.length === 0 ? (
                <TableEmptyState colSpan="6" message="Kullanıcı bulunamadı." />
              ) : (
                filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-stone-50/40 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {user.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-9 h-9 object-cover rounded-full shadow-sm border border-stone-100"
                          />
                        ) : (
                          <div className="w-9 h-9 bg-primary-container text-white rounded-full flex items-center justify-center font-bold text-xs">
                            {(user.name || "?")
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </div>
                        )}
                        <div>
                          <p className="font-extrabold text-stone-800 text-xs">
                            {user.name}
                          </p>
                          <p className="text-[10px] text-stone-400 font-semibold">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wide inline-block ${
                          user.platformRole === "VIP" ||
                          user.platformRole === "Elite" ||
                          user.platformRole === "Gold"
                            ? "bg-amber-50 text-amber-700 border border-amber-200"
                            : "bg-stone-100 text-stone-500 border border-stone-200"
                        }`}
                      >
                        {user.platformRole}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center font-black text-stone-800">
                      {user.orders}
                    </td>
                    <td className="px-4 py-4 text-stone-400 whitespace-nowrap">
                      {user.joined}
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wide inline-block ${
                          user.status === "Aktif"
                            ? "bg-green-50 text-green-700 border border-green-200"
                            : "bg-rose-50 text-rose-700 border border-rose-200"
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex gap-1.5 justify-end">
                        <button
                          onClick={() => handleToggleUserStatus(user.id)}
                          className="p-1.5 hover:bg-stone-50 border border-stone-200 rounded-lg shadow-sm text-stone-500 hover:text-stone-800"
                          title="Kullanıcı Hesap Durumunu Değiştir"
                        >
                          <span className="material-symbols-outlined text-[16px]">
                            sync
                          </span>
                        </button>
                        <button
                          onClick={() => openUserDeleteModal(user)}
                          className="p-1.5 hover:bg-rose-50 border border-rose-100 rounded-lg shadow-sm text-primary"
                          title="Kullanıcıyı Sil"
                        >
                          <span className="material-symbols-outlined text-[16px]">
                            delete
                          </span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {userDeleteModal && (
        <div className="fixed inset-0 bg-black/45 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[28px] p-6 w-full max-w-sm shadow-2xl border border-stone-100 space-y-5 animate-scale-up">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="w-11 h-11 rounded-2xl bg-rose-50 text-primary flex items-center justify-center mb-3">
                  <span className="material-symbols-outlined">
                    person_remove
                  </span>
                </div>
                <h4 className="text-lg font-black text-stone-800">
                  Kullanıcıyı Sil
                </h4>
                <p className="text-xs text-stone-500 font-semibold mt-2 leading-relaxed">
                  <span className="font-black text-stone-800">
                    {userDeleteModal.name}
                  </span>{" "}
                  kullanıcısını platformdan kaldırmak istediğine emin misin?
                </p>
              </div>
              <button
                type="button"
                onClick={closeUserDeleteModal}
                className="p-1 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg cursor-pointer transition-all"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={closeUserDeleteModal}
                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-xl text-xs font-bold cursor-pointer"
              >
                İptal
              </button>
              <button
                type="button"
                onClick={handleDeleteUser}
                className="px-5 py-2 bg-primary hover:bg-primary-container text-white rounded-xl text-xs font-black cursor-pointer shadow-sm"
              >
                Sil
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
