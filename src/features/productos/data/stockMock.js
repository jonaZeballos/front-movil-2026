export const stockMovementTypes = [
  {
    id: "entrada",
    label: "Entrada",
    description: "Aumenta el stock del producto",
  },
  {
    id: "salida",
    label: "Salida",
    description: "Disminuye el stock del producto",
  },
  {
    id: "ajuste",
    label: "Ajuste",
    description: "Reemplaza el stock actual",
  },
];

export const stockQuickReasons = [
  "Compra de producto",
  "Venta registrada",
  "Corrección de inventario",
  "Producto dañado",
  "Devolución",
];