export const MIN_STOCK_DEFAULT = 5;

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