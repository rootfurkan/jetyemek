import React from "react";
import AdminSectionHeader from "../../../common/components/AdminSectionHeader.jsx";
import SearchInput from "../../../common/components/SearchInput.jsx";
import RestaurantCommissionModal from "./RestaurantCommissionModal.jsx";
import RestaurantCreateForm from "./RestaurantCreateForm.jsx";
import RestaurantDeleteModal from "./RestaurantDeleteModal.jsx";
import RestaurantListTable from "./RestaurantListTable.jsx";

// Restoran ekleme, listeleme ve komisyon işlemlerini gösterir.
export default function AdminRestaurantsTab({
  searchQuery,
  setSearchQuery,
  showAddRestaurant,
  setShowAddRestaurant,
  handleAddRestaurantSubmit,
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
  filteredRestaurants,
  handleToggleRestStatus,
  openCommissionModal,
  openDeleteModal,
  commissionModal,
  closeCommissionModal,
  handleUpdateCommission,
  commissionValue,
  setCommissionValue,
  deleteModal,
  closeDeleteModal,
  handleDeleteRestaurant,
}) {
  return (
    <div className="space-y-6 animate-fade-in">
      <AdminSectionHeader
        title="Restoran Listesi & Onay Kuyruğu"
        description="Platformdaki tüm aktif restoranların yönetimi ve yeni restoran onayı."
      >
        <div className="flex gap-2 w-full sm:w-auto">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Restoran ara..."
            className="flex-1 sm:w-64"
          />
          <button
            onClick={() => setShowAddRestaurant(true)}
            className="bg-primary hover:bg-primary-container text-white px-5 py-2 rounded-xl text-xs font-black uppercase tracking-wide flex items-center gap-1.5 shadow-sm active:scale-95 transition-all whitespace-nowrap"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            Yeni Restoran Ekle
          </button>
        </div>
      </AdminSectionHeader>

      {showAddRestaurant && (
        <RestaurantCreateForm
          handleAddRestaurantSubmit={handleAddRestaurantSubmit}
          newRestName={newRestName}
          setNewRestName={setNewRestName}
          newRestCategory={newRestCategory}
          setNewRestCategory={setNewRestCategory}
          newRestComm={newRestComm}
          setNewRestCommission={setNewRestCommission}
          newRestCity={newRestCity}
          setNewRestCity={setNewRestCity}
          newRestEmail={newRestEmail}
          setNewRestEmail={setNewRestEmail}
          newRestPassword={newRestPassword}
          setNewRestPassword={setNewRestPassword}
          setShowAddRestaurant={setShowAddRestaurant}
        />
      )}

      <RestaurantListTable
        filteredRestaurants={filteredRestaurants}
        handleToggleRestStatus={handleToggleRestStatus}
        openCommissionModal={openCommissionModal}
        openDeleteModal={openDeleteModal}
      />

      <RestaurantCommissionModal
        commissionModal={commissionModal}
        closeCommissionModal={closeCommissionModal}
        handleUpdateCommission={handleUpdateCommission}
        commissionValue={commissionValue}
        setCommissionValue={setCommissionValue}
      />

      <RestaurantDeleteModal
        deleteModal={deleteModal}
        closeDeleteModal={closeDeleteModal}
        handleDeleteRestaurant={handleDeleteRestaurant}
      />
    </div>
  );
}
