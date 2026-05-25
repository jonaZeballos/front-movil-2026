const now = new Date();

export const demoSalesReports = [
  {
    id: "demo-sale-1",
    number: "REC-DEMO-001",
    issuedAt: now.toISOString(),
    cliente: {
      nombre: "Cliente demostración",
    },
    productos: [
      {
        id: "prod-001",
        name: "Cargador universal",
        quantity: 2,
        unitPrice: 85,
        total: 170,
      },
    ],
    metodoPago: {
      id: "efectivo",
      label: "Efectivo",
    },
    subtotal: 170,
    descuento: 0,
    total: 170,
    status: "Emitido",
  },
  {
    id: "demo-sale-2",
    number: "REC-DEMO-002",
    issuedAt: now.toISOString(),
    cliente: {
      nombre: "Cliente mostrador",
    },
    productos: [
      {
        id: "serv-001",
        name: "Diagnóstico técnico",
        quantity: 1,
        unitPrice: 50,
        total: 50,
      },
      {
        id: "prod-002",
        name: "Cable USB-C reforzado",
        quantity: 1,
        unitPrice: 35,
        total: 35,
      },
    ],
    metodoPago: {
      id: "qr",
      label: "Pago QR",
    },
    subtotal: 85,
    descuento: 5,
    total: 80,
    status: "Emitido",
  },
];

export const reportPeriods = [
  {
    id: "todos",
    label: "Todo",
  },
  {
    id: "hoy",
    label: "Hoy",
  },
  {
    id: "semana",
    label: "Semana",
  },
  {
    id: "mes",
    label: "Mes",
  },
];