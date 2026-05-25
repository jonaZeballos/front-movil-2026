import { notificationTypes, notificationsMock } from "../data/notificationsMock";

export function getInitialNotifications() {
  return notificationsMock;
}

export function getUnreadNotificationsCount(notifications = []) {
  return notifications.filter((notification) => !notification.read).length;
}

export function markNotificationAsRead(notifications = [], notificationId) {
  return notifications.map((notification) =>
    String(notification.id) === String(notificationId)
      ? { ...notification, read: true }
      : notification
  );
}

export function markAllNotificationsAsRead(notifications = []) {
  return notifications.map((notification) => ({
    ...notification,
    read: true,
  }));
}

export function addNotification(notifications = [], notificationData) {
  const newNotification = {
    id: notificationData.id || `notif-${Date.now()}`,
    type: notificationData.type || notificationTypes.SYSTEM,
    title: notificationData.title || "Nueva notificación",
    message: notificationData.message || "Tienes una nueva actualización del sistema.",
    createdAt: notificationData.createdAt || new Date().toISOString(),
    read: false,
    priority: notificationData.priority || "normal",
    payload: notificationData.payload || null,
  };

  return [newNotification, ...notifications];
}

export function buildSaleNotification(receipt) {
  return {
    id: `sale-${receipt?.id || Date.now()}`,
    type: notificationTypes.SALE,
    title: "Venta registrada",
    message: `Se generó el recibo ${receipt?.number || "sin número"} por un total de ${formatNotificationCurrency(receipt?.total)}.`,
    priority: "normal",
    payload: receipt,
  };
}

export function buildOrderStatusNotification(order) {
  return {
    id: `order-${order?.id || Date.now()}-${Date.now()}`,
    type: notificationTypes.ORDER,
    title: "Orden actualizada",
    message: `La orden ${order?.code || order?.codigo || order?.id || ""} cambió a estado ${order?.status || order?.estado || "actualizado"}.`,
    priority: "high",
    payload: order,
  };
}

export function formatNotificationDate(value) {
  if (!value) return "Sin fecha";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Sin fecha";
  }

  return date.toLocaleString("es-BO", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function getNotificationConfig(type) {
  const configs = {
    [notificationTypes.STOCK]: {
      iconName: "cube-outline",
      color: "#F59E0B",
      label: "Stock",
    },
    [notificationTypes.ORDER]: {
      iconName: "construct-outline",
      color: "#5655B9",
      label: "Orden",
    },
    [notificationTypes.SALE]: {
      iconName: "cart-outline",
      color: "#2386F5",
      label: "Venta",
    },
    [notificationTypes.QUOTATION]: {
      iconName: "document-text-outline",
      color: "#0F766E",
      label: "Cotización",
    },
    [notificationTypes.SYSTEM]: {
      iconName: "information-circle-outline",
      color: "#64748B",
      label: "Sistema",
    },
  };

  return configs[type] || configs[notificationTypes.SYSTEM];
}

function formatNotificationCurrency(value) {
  const number = Number(value || 0);
  return `Bs ${number.toFixed(2)}`;
}