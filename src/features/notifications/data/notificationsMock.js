export const notificationTypes = {
  STOCK: "stock",
  ORDER: "order",
  SALE: "sale",
  QUOTATION: "quotation",
  SYSTEM: "system",
};

export const notificationsMock = [
  {
    id: "notif-001",
    type: notificationTypes.SYSTEM,
    title: "Sistema actualizado",
    message: "Las nuevas funciones del sistema ya se encuentran disponibles.",
    createdAt: new Date().toISOString(),
    read: false,
    priority: "normal",
  },
  {
    id: "notif-002",
    type: notificationTypes.ORDER,
    title: "Orden pendiente",
    message: "Tienes órdenes técnicas pendientes de revisión.",
    createdAt: new Date().toISOString(),
    read: false,
    priority: "high",
  },
  {
    id: "notif-003",
    type: notificationTypes.QUOTATION,
    title: "Cotización pendiente",
    message: "Revisa las cotizaciones generadas para seguimiento del cliente.",
    createdAt: new Date().toISOString(),
    read: true,
    priority: "normal",
  },
];