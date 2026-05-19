import { apiRequest } from "../../../shared/api/client";

export function listProductos(search = "") {
  const query = search ? `?buscar=${encodeURIComponent(search)}` : "";
  return apiRequest(`/api/productos${query}`).then((productos) => productos.map(mapProducto));
}

export function createProducto(productoData) {
  return apiRequest("/api/productos", {
    method: "POST",
    body: JSON.stringify({
      nombre: productoData.nombre,
      marca: productoData.marca,
      modelo: productoData.modelo,
      descripcion: productoData.descripcion,
      precio: productoData.precio,
      stock: productoData.stock,
      stockMinimo: productoData.stockMinimo || 1,
    }),
  }).then(mapProducto);
}

export function updateProducto(productoId, productoData) {
  return apiRequest(`/api/productos/${productoId}`, {
    method: "PATCH",
    body: JSON.stringify(productoData),
  }).then(mapProducto);
}

function mapProducto(producto) {
  return {
    ...producto,
    precioTexto: `Bs. ${Number(producto.precio || 0).toFixed(2)}`,
    stockBajo: Boolean(producto.stockBajo),
  };
}
