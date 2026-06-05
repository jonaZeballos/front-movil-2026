import { apiRequest } from "../../../shared/api/client";

export function listProductos(search = "", categoriaId = "", tipoInventario = "tienda") {
  const params = new URLSearchParams();
  if (search) params.set("buscar", search);
  if (categoriaId) params.set("categoriaId", categoriaId);
  if (tipoInventario) params.set("tipoInventario", tipoInventario);
  const query = params.toString() ? `?${params.toString()}` : "";
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
      stockMinimo: productoData.stockMinimo ?? 1,
      idCategoria: productoData.idCategoria ?? productoData.categoriaId ?? null,
      idTecnico: productoData.idTecnico ?? null,
      tipoInventario: productoData.tipoInventario || "tienda",
    }),
  }).then(mapProducto);
}

export function updateProducto(productoId, productoData) {
  return apiRequest(`/api/productos/${productoId}`, {
    method: "PATCH",
    body: JSON.stringify(productoData),
  }).then(mapProducto);
}

export function deactivateProducto(productoId, motivo) {
  return apiRequest(`/api/productos/${productoId}/desactivar`, {
    method: "PATCH",
    body: JSON.stringify({ motivo }),
  }).then(mapProducto);
}

export function restoreProducto(productoId) {
  return apiRequest(`/api/productos/${productoId}/restaurar`, {
    method: "PATCH",
  }).then(mapProducto);
}

export function deleteProducto(productoId) {
  return apiRequest(`/api/productos/${productoId}`, {
    method: "DELETE",
  });
}

export function listCategoriasProducto(tipoInventario = "tienda") {
  const params = new URLSearchParams();
  if (tipoInventario) params.set("tipoInventario", tipoInventario);
  const query = params.toString() ? `?${params.toString()}` : "";
  return apiRequest(`/api/productos/categorias${query}`).then((categorias) =>
    categorias.map(mapCategoriaProducto)
  );
}

export function createCategoriaProducto(categoriaData) {
  return apiRequest("/api/productos/categorias", {
    method: "POST",
    body: JSON.stringify({
      nombre: categoriaData.nombre,
      descripcion: categoriaData.descripcion,
      tipoInventario: categoriaData.tipoInventario || "tienda",
    }),
  }).then(mapCategoriaProducto);
}

function mapProducto(producto) {
  return {
    ...producto,
    precioTexto: `Bs. ${Number(producto.precio || 0).toFixed(2)}`,
    stockBajo: Boolean(producto.stockBajo),
    idCategoria: producto.idCategoria || producto.categoria?.id || null,
    idTecnico: producto.idTecnico || producto.tecnico?.id || null,
    tipoInventario: producto.tipoInventario || "tienda",
    categoria: producto.categoria || null,
    tecnico: producto.tecnico || null,
  };
}

function mapCategoriaProducto(categoria) {
  return {
    ...categoria,
    nombre: categoria.nombre || "",
    tipoInventario: categoria.tipoInventario || "tienda",
    productosCount: Number(categoria.productosCount || 0),
  };
}
