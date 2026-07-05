import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { updatePlatformOrderStatus } from "../../../../features/orders/ordersSlice.js";
import api from "../../../../services/api.js";

// Kurye verilerini ve sipariş atamalarını yönetir.
export default function useAdminCouriers({ orders, addToast }) {
  const dispatch = useDispatch();
  const [couriers, setCouriers] = useState([]);
  const [selectedOrderToAssign, setSelectedOrderToAssign] = useState("");
  const [selectedCourierToAssign, setSelectedCourierToAssign] =
    useState("courier-2");

  useEffect(() => {
    async function loadCouriers() {
      try {
        const response = await api.get("/couriers");
        setCouriers(response.data || []);
      } catch (error) {
        setCouriers([]);
      }
    }

    loadCouriers();
  }, []);

  const activeCouriers = couriers.filter(
    (courier) => courier.status !== "Çevrimdışı",
  );
  const deliveryCouriers = couriers.filter(
    (courier) => courier.status === "Teslimatta",
  );
  const availableCouriers = couriers.filter(
    (courier) => courier.status === "Müsait" || courier.status === "Beklemede",
  );
  const assignableOrders = orders.filter(
    (order) =>
      order.deliveryStatus === "ready" ||
      order.status === "Sipariş Hazır" ||
      order.status === "Hazır" ||
      order.deliveryStatus === "preparing",
  );

  useEffect(() => {
    if (assignableOrders.length === 0) {
      if (selectedOrderToAssign) setSelectedOrderToAssign("");
      return;
    }

    if (
      !assignableOrders.find(
        (order) => String(order.id) === String(selectedOrderToAssign),
      )
    ) {
      setSelectedOrderToAssign(assignableOrders[0].id);
    }
  }, [assignableOrders, selectedOrderToAssign]);

  useEffect(() => {
    if (availableCouriers.length === 0) {
      if (selectedCourierToAssign) setSelectedCourierToAssign("");
      return;
    }

    if (
      !availableCouriers.find(
        (courier) => String(courier.id) === String(selectedCourierToAssign),
      ) &&
      availableCouriers.length > 0
    ) {
      setSelectedCourierToAssign(availableCouriers[0].id);
    }
  }, [availableCouriers, selectedCourierToAssign]);

  // Seçilen siparişi seçilen kuryeye bağlar.
  const handleAssignOrder = async () => {
    const selectedCourier = couriers.find(
      (c) => String(c.id) === String(selectedCourierToAssign),
    );
    const selectedOrder = orders.find(
      (order) => String(order.id) === String(selectedOrderToAssign),
    );

    if (!selectedCourier || !selectedOrder) {
      addToast({
        message: "Atama için sipariş ve kurye seçmelisiniz.",
        type: "error",
      });
      return;
    }

    try {
      const [courierResponse, orderResponse] = await Promise.all([
        api.patch(`/couriers/${selectedCourier.id}`, { status: "Teslimatta" }),
        api.patch(`/orders/${selectedOrder.id}`, {
          status: "Kurye Yola Çıktı",
          deliveryStatus: "on_the_way",
          progress: 55,
          courierId: selectedCourier.id,
          courierName: selectedCourier.name,
        }),
      ]);

      setCouriers((prev) =>
        prev.map((c) =>
          String(c.id) === String(selectedCourier.id)
            ? { ...c, ...courierResponse.data }
            : c,
        ),
      );
      dispatch(
        updatePlatformOrderStatus({
          id: orderResponse.data.id,
          status: orderResponse.data.status,
          deliveryStatus: orderResponse.data.deliveryStatus,
          progress: orderResponse.data.progress,
        }),
      );
      addToast({
        message: `Sipariş #${selectedOrder.id}, kurye ${selectedCourier.name} üzerine başarıyla atandı.`,
        type: "success",
      });
    } catch (error) {
      addToast({
        message: "Kurye ataması yapılırken bir sorun oluştu.",
        type: "error",
      });
    }
  };

  return {
    couriers,
    activeCouriers,
    deliveryCouriers,
    availableCouriers,
    assignableOrders,
    selectedOrderToAssign,
    setSelectedOrderToAssign,
    selectedCourierToAssign,
    setSelectedCourierToAssign,
    handleAssignOrder,
  };
}
