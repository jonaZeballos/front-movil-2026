import { apiRequest } from "../../../shared/api/client";

export const MIN_STOCK_DEFAULT = 5;

export async function listProductos(search = "", categoriaId = "", tipoInventario = "tienda") {
  const params = new URLSearchParams();
  if (search) params.set("buscar", search);
  if (categoriaId) params.set("categoriaId", categoriaId);
  if (tipoInventario) params.set("tipoInventario", tipoInventario);
  const query = params.toString() ? `?${params.toString()}` : "";
  const productos = await apiRequest(`/api/productos${query}`);
  return productos.map(mapProducto);
}

export async function createProducto(productoData) {
  const producto = await apiRequest("/api/productos", {
    method: "POST",
    body: JSON.stringify({
      nombre: productoData.nombre,
      marca: productoData.marca,
      modelo: productoData.modelo,
      descripcion: productoData.descripcion,
      precio: parseMoney(productoData.precio),
      stock: parseInteger(productoData.stock),
      stockMinimo: parseInteger(productoData.stockMinimo ?? productoData.stock_minimo ?? 1),
      idCategoria: productoData.idCategoria ?? productoData.categoriaId ?? null,
      idTecnico: productoData.idTecnico ?? null,
      tipoInventario: productoData.tipoInventario || "tienda",
    }),
  });

  return mapProducto(producto);
}

export async function updateProductoStock(productId, stock) {
  const producto = await apiRequest(`/api/productos/${productId}`, {
    method: "PATCH",
    body: JSON.stringify({ stock: parseInteger(stock) }),
  });

  return mapProducto(producto);
}

export async function listCategoriasProducto(tipoInventario = "tienda") {
  const params = new URLSearchParams();
  if (tipoInventario) params.set("tipoInventario", tipoInventario);
  const query = params.toString() ? `?${params.toString()}` : "";
  const categorias = await apiRequest(`/api/productos/categorias${query}`);
  return categorias.map(mapCategoriaProducto);
}

export async function createCategoriaProducto(categoriaData) {
  const categoria = await apiRequest("/api/productos/categorias", {
    method: "POST",
    body: JSON.stringify({
      nombre: categoriaData.nombre,
      descripcion: categoriaData.descripcion,
      tipoInventario: categoriaData.tipoInventario || "tienda",
    }),
  });

  return mapCategoriaProducto(categoria);
}

function mapProducto(producto) {
  return {
    ...producto,
    nombre: producto.nombre,
    name: producto.name || producto.nombre,
    marca: producto.marca || "",
    modelo: producto.modelo || "",
    descripcion: producto.descripcion || "",
    precio: Number(producto.precio || 0),
    price: Number(producto.price || producto.precio || 0),
    stock: Number(producto.stock || 0),
    stockMinimo: Number(producto.stockMinimo || producto.stock_minimo || 1),
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

function parseMoney(value) {
  const cleanValue = String(value ?? "0")
    .replace(/Bs\.?/gi, "")
    .replace(/\s/g, "")
    .replace(",", ".");
  const number = Number(cleanValue);
  return Number.isFinite(number) ? number : 0;
}

function parseInteger(value) {
  const number = Number(String(value ?? "0").replace(",", "."));
  return Number.isFinite(number) ? Math.max(0, Math.trunc(number)) : 0;
}

export function getProductStock(product) {
  const stock = Number(product?.stock ?? product?.cantidad ?? 0);
  return Number.isFinite(stock) ? stock : 0;
}

export function getStockStatus(product, minStock = MIN_STOCK_DEFAULT) {
  const stock = getProductStock(product);

  if (stock <= 0) {
    return {
      key: "agotado",
      label: "Agotado",
      color: "#DC2626",
      backgroundColor: "#FEE2E2",
    };
  }

  if (stock <= minStock) {
    return {
      key: "bajo",
      label: "Stock bajo",
      color: "#D97706",
      backgroundColor: "#FEF3C7",
    };
  }

  return {
    key: "disponible",
    label: "Disponible",
    color: "#059669",
    backgroundColor: "#D1FAE5",
  };
}

export function getLowStockProducts(productos = [], minStock = MIN_STOCK_DEFAULT) {
  return productos.filter((product) => {
    const status = getStockStatus(product, minStock);
    return status.key === "agotado" || status.key === "bajo";
  });
}

export function applyStockMovement(productos = [], movement) {
  return productos.map((product) => {
    if (product.id !== movement.productId) {
      return product;
    }

    const currentStock = getProductStock(product);
    const quantity = Number(movement.quantity || 0);

    let nextStock = currentStock;

    if (movement.type === "entrada") {
      nextStock = currentStock + quantity;
    }

    if (movement.type === "salida") {
      nextStock = Math.max(currentStock - quantity, 0);
    }

    if (movement.type === "ajuste") {
      nextStock = Math.max(quantity, 0);
    }

    return {
      ...product,
      stock: nextStock,
      lastStockMovement: {
        ...movement,
        previousStock: currentStock,
        currentStock: nextStock,
      },
    };
  });
}

export function createStockMovement({ product, type, quantity, reason }) {
  const parsedQuantity = Number(quantity || 0);

  if (!product) {
    throw new Error("Selecciona un producto válido.");
  }

  if (!type) {
    throw new Error("Selecciona el tipo de movimiento.");
  }

  if (!Number.isFinite(parsedQuantity) || parsedQuantity < 0) {
    throw new Error("Ingresa una cantidad válida.");
  }

  if (type !== "ajuste" && parsedQuantity <= 0) {
    throw new Error("La cantidad debe ser mayor a 0.");
  }

  return {
    id: Date.now(),
    productId: product.id,
    productName: product.nombre,
    type,
    quantity: parsedQuantity,
    reason: String(reason || "").trim() || "Sin observación",
    createdAt: new Date().toISOString(),
  };
}

export function getStockMovementLabel(type) {
  const labels = {
    entrada: "Entrada de stock",
    salida: "Salida de stock",
    ajuste: "Ajuste manual",
  };

  return labels[type] || "Movimiento de stock";
}
