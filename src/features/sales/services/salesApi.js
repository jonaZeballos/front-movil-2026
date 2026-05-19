import { apiRequest } from "../../../shared/api/client";

export function listVentas() {
  return apiRequest("/api/ventas").then((ventas) => ventas.map(mapVenta));
}

export function createVenta(ventaData) {
  return apiRequest("/api/ventas", {
    method: "POST",
    body: JSON.stringify({
      clienteNombre: ventaData.clienteNombre,
      items: ventaData.items,
    }),
  }).then(mapVenta);
}

function mapVenta(venta) {
  return {
    ...venta,
    total: Number(venta.total || 0),
  };
}
