export const salesProductsMock = [
  {
    id: "prod-001",
    name: "Cargador universal",
    category: "Accesorio",
    sku: "ACC-001",
    price: 85,
    stock: 12,
  },
  {
    id: "prod-002",
    name: "Cable USB-C reforzado",
    category: "Accesorio",
    sku: "ACC-002",
    price: 35,
    stock: 24,
  },
  {
    id: "prod-003",
    name: "Mouse inalámbrico",
    category: "Periférico",
    sku: "PER-001",
    price: 95,
    stock: 8,
  },
  {
    id: "prod-004",
    name: "Teclado compacto",
    category: "Periférico",
    sku: "PER-002",
    price: 140,
    stock: 6,
  },
  {
    id: "serv-001",
    name: "Diagnóstico técnico",
    category: "Servicio",
    sku: "SER-001",
    price: 50,
    stock: 99,
  },
  {
    id: "serv-002",
    name: "Mantenimiento preventivo",
    category: "Servicio",
    sku: "SER-002",
    price: 120,
    stock: 99,
  },
];

export const paymentMethods = [
  {
    id: "efectivo",
    label: "Efectivo",
    iconName: "cash-outline",
  },
  {
    id: "qr",
    label: "Pago QR",
    iconName: "qr-code-outline",
  },
  {
    id: "transferencia",
    label: "Transferencia",
    iconName: "card-outline",
  },
];

export function formatCurrency(value) {
  const number = Number(value || 0);
  return `Bs ${number.toFixed(2)}`;
}

export function buildReceiptNumber() {
  const now = new Date();
  const datePart = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(
    2,
    "0"
  )}${String(now.getDate()).padStart(2, "0")}`;
  const randomPart = Math.floor(1000 + Math.random() * 9000);

  return `REC-${datePart}-${randomPart}`;
}

export function buildElectronicReceipt(saleDraft, savedSale = {}) {
  const now = new Date();

  return {
    id: savedSale.id || savedSale.reciboId || `receipt-${Date.now()}`,
    saleId: savedSale.id || savedSale.ventaId || `sale-${Date.now()}`,
    number: savedSale.numeroRecibo || savedSale.number || buildReceiptNumber(),
    issuedAt: savedSale.fechaEmision || now.toISOString(),
    cliente: saleDraft.cliente,
    productos: saleDraft.productos,
    metodoPago: saleDraft.metodoPago,
    subtotal: saleDraft.subtotal,
    descuento: saleDraft.descuento,
    total: saleDraft.total,
    status: "Emitido",
  };
}