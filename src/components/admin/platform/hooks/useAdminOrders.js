import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { updatePlatformOrderStatus } from "../../../../features/orders/ordersSlice.js";
import api from "../../../../services/api.js";

export default function useAdminOrders({ orders, addToast }) {
  const dispatch = useDispatch();
  const [orderStatusModal, setOrderStatusModal] = useState(null);
  const [ordersPage, setOrdersPage] = useState(1);
  const ordersPerPage = 10;
  const totalOrderPages = Math.max(1, Math.ceil(orders.length / ordersPerPage));
  const paginatedOrders = orders.slice(
    (ordersPage - 1) * ordersPerPage,
    ordersPage * ordersPerPage,
  );

  useEffect(() => {
    if (ordersPage > totalOrderPages) {
      setOrdersPage(totalOrderPages);
    }
  }, [ordersPage, totalOrderPages]);

  const openOrderStatusModal = (order) => {
    setOrderStatusModal(order);
  };

  const closeOrderStatusModal = () => {
    setOrderStatusModal(null);
  };

  const handleUpdateOrderStatus = async (
    statusOption,
    targetOrder = orderStatusModal,
  ) => {
    if (!targetOrder?.id) return;

    try {
      const response = await api.patch(`/orders/${targetOrder.id}`, {
        status: statusOption.status,
        deliveryStatus: statusOption.deliveryStatus,
        progress: statusOption.progress,
      });

      dispatch(
        updatePlatformOrderStatus({
          id: response.data.id,
          status: response.data.status,
          deliveryStatus: response.data.deliveryStatus,
          progress: response.data.progress,
        }),
      );
      addToast({
        message: `Sipariş durumu "${statusOption.label}" olarak güncellendi.`,
        type: "success",
      });
      if (orderStatusModal?.id === targetOrder.id) {
        closeOrderStatusModal();
      }
    } catch (error) {
      addToast({
        message: "Sipariş durumu güncellenirken bir sorun oluştu.",
        type: "error",
      });
    }
  };

  return {
    orderStatusModal,
    ordersPage,
    setOrdersPage,
    ordersPerPage,
    totalOrderPages,
    paginatedOrders,
    openOrderStatusModal,
    closeOrderStatusModal,
    handleUpdateOrderStatus,
  };
}
