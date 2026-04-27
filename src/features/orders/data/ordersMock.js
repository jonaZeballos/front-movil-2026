export const orderStatuses = [
  "Recibido",
  "En diagnóstico",
  "Cotizado",
  "En reparación",
  "Listo",
  "Entregado",
  "Sin solución",
];

export const mockEquipments = [
  {
    id: "eq-001",
    clientName: "Juan Soliz",
    type: "Laptop",
    brand: "HP",
    model: "Pavilion 15",
    serial: "HP-2026-001",
    failure: "No enciende",
  },
  {
    id: "eq-002",
    clientName: "Pedro Perez",
    type: "PC Escritorio",
    brand: "Lenovo",
    model: "ThinkCentre",
    serial: "LEN-7788",
    failure: "Pantalla azul al iniciar",
  },
  {
    id: "eq-003",
    clientName: "Maria Lopez",
    type: "Laptop",
    brand: "Asus",
    model: "Vivobook",
    serial: "ASU-9900",
    failure: "Batería no carga",
  },
];

export const mockOrders = [
  {
    id: "os-001",
    code: "#0001",
    clientName: "Juan Soliz",
    equipmentName: "Laptop HP Pavilion 15",
    equipmentSerial: "HP-2026-001",
    failure: "No enciende",
    status: "Recibido",
    observations: ["Equipo recibido para revisión inicial."],
  },
  {
    id: "os-002",
    code: "#0002",
    clientName: "Pedro Perez",
    equipmentName: "PC Escritorio Lenovo ThinkCentre",
    equipmentSerial: "LEN-7788",
    failure: "Pantalla azul al iniciar",
    status: "En diagnóstico",
    observations: ["Se inició diagnóstico de memoria RAM y disco."],
  },
];