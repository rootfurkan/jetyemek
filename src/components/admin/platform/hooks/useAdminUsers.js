import { useEffect, useMemo, useState } from "react";
import api from "../../../../services/api.js";
import {
  formatJoinedDate,
  getCustomerPlatformRole,
} from "../adminDashboardUtils.js";

export default function useAdminUsers({ platformOrders, addToast }) {
  const [users, setUsers] = useState([]);
  const [userDeleteModal, setUserDeleteModal] = useState(null);

  useEffect(() => {
    async function loadUsers() {
      try {
        const response = await api.get("/users");
        const customerUsers = (response.data || []).filter(
          (user) => user.role === "customer",
        );
        setUsers(customerUsers);
      } catch (error) {
        setUsers([]);
      }
    }

    loadUsers();
  }, []);

  const enrichedUsers = useMemo(
    () =>
      users.map((user) => {
        const orderCount = platformOrders.filter(
          (order) => String(order.userId) === String(user.id),
        ).length;
        const fullName =
          `${user.name || ""} ${user.surname || ""}`.trim() ||
          user.email ||
          "İsimsiz Kullanıcı";

        return {
          ...user,
          name: fullName,
          orders: orderCount,
          platformRole: getCustomerPlatformRole(orderCount),
          joined: formatJoinedDate(user),
          status: user.status || "Aktif",
        };
      }),
    [users, platformOrders],
  );

  const handleToggleUserStatus = async (id) => {
    const user = users.find((item) => String(item.id) === String(id));
    if (!user) return;

    const nextStatus = (user.status || "Aktif") === "Aktif" ? "Pasif" : "Aktif";

    try {
      const response = await api.patch(`/users/${id}`, { status: nextStatus });
      setUsers((prev) =>
        prev.map((item) =>
          String(item.id) === String(id) ? { ...item, ...response.data } : item,
        ),
      );
      addToast({ message: "Kullanıcı durumu güncellendi.", type: "success" });
    } catch (error) {
      addToast({
        message: "Kullanıcı durumu güncellenirken bir sorun oluştu.",
        type: "error",
      });
    }
  };

  const openUserDeleteModal = (user) => {
    setUserDeleteModal(user);
  };

  const closeUserDeleteModal = () => {
    setUserDeleteModal(null);
  };

  const handleDeleteUser = async () => {
    if (!userDeleteModal?.id) return;

    try {
      await api.delete(`/users/${userDeleteModal.id}`);
      setUsers((prev) =>
        prev.filter((user) => String(user.id) !== String(userDeleteModal.id)),
      );
      addToast({
        message: "Kullanıcı platformdan kaldırıldı.",
        type: "success",
      });
      closeUserDeleteModal();
    } catch (error) {
      addToast({
        message: "Kullanıcı silinirken bir sorun oluştu.",
        type: "error",
      });
    }
  };

  return {
    enrichedUsers,
    userDeleteModal,
    handleToggleUserStatus,
    openUserDeleteModal,
    closeUserDeleteModal,
    handleDeleteUser,
  };
}
