import React, { useCallback, useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import {
  InventarioManagementScreen,
  ProductoRegisterScreen,
  StockControlScreen,
  StockMovementScreen,
  LowStockScreen,
} from "../screens";
import {
  applyStockMovement,
  createProducto,
  createCategoriaProducto,
  listCategoriasProducto,
  listProductos,
  updateProductoStock,
} from "../services";
import { useNavigationActionGuard } from "../../../shared/navigation/useNavigationActionGuard";

const Stack = createNativeStackNavigator();

export function InventarioStack({
  onProductsChange,
  role,
  inventoryType = "tienda",
  technicians = [],
}) {
  const { createGuardedNavigation } = useNavigationActionGuard();
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [stockMovements, setStockMovements] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const canManageCategories = role === "admin";
  const title = inventoryType === "tecnico" ? "Inventario tecnico" : "Inventario tienda";

  const refreshProductos = useCallback(async () => {
    setIsLoading(true);
    try {
      const [productosData, categoriasData] = await Promise.all([
        listProductos("", "", inventoryType),
        listCategoriasProducto(inventoryType),
      ]);
      setProductos(productosData);
      setCategorias(categoriasData);
      onProductsChange?.(productosData);
    } finally {
      setIsLoading(false);
    }
  }, [inventoryType, onProductsChange]);

  useEffect(() => {
    refreshProductos().catch((error) => {
      console.warn("No se pudo cargar inventario.", error);
    });
  }, [refreshProductos]);

  const handleAddProducto = async (producto) => {
    await createProducto({ ...producto, tipoInventario: inventoryType });
    await refreshProductos();
  };

  const handleCreateCategoria = async (categoria) => {
    const savedCategoria = await createCategoriaProducto({ ...categoria, tipoInventario: inventoryType });
    setCategorias((prevCategorias) => [...prevCategorias, savedCategoria].sort((a, b) => a.nombre.localeCompare(b.nombre)));
    return savedCategoria;
  };

  const handleSaveMovement = async (movement) => {
    let updatedProduct = null;
    const currentProduct = findProductById(movement.productId);
    const nextProducts = applyStockMovement(productos, movement);
    const nextProduct = nextProducts.find((product) => String(product.id) === String(movement.productId));

    if (currentProduct && nextProduct) {
      updatedProduct = await updateProductoStock(currentProduct.id, nextProduct.stock);
    }

    setProductos((prevProductos) => {
      const localNext = applyStockMovement(prevProductos, movement);
      const finalNext = updatedProduct
        ? localNext.map((product) => (product.id === updatedProduct.id ? updatedProduct : product))
        : localNext;
      onProductsChange?.(finalNext);
      return finalNext;
    });
    setStockMovements((prevMovements) => [movement, ...prevMovements]);
  };

  const findProductById = (productId) => {
    return productos.find((producto) => String(producto.id) === String(productId));
  };

  return (
    <Stack.Navigator
      initialRouteName="Inventario"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Inventario">
        {({ navigation }) => (
          <InventarioManagementScreen
            navigation={createGuardedNavigation(navigation)}
            productos={productos}
            categorias={categorias}
            isLoading={isLoading}
            title={title}
            inventoryType={inventoryType}
            onRefresh={refreshProductos}
            onCreateCategoria={canManageCategories ? handleCreateCategoria : undefined}
            canManageCategories={canManageCategories}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="ProductoRegister">
        {({ navigation, route }) => {
          const guardedNavigation = createGuardedNavigation(navigation);

          return (
            <ProductoRegisterScreen
              navigation={guardedNavigation}
              categorias={categorias}
              technicians={technicians}
              inventoryType={inventoryType}
              role={role}
              initialCategoriaId={route.params?.categoriaId}
              onGuardar={async (data) => {
                await handleAddProducto(data);
                guardedNavigation.goBack();
              }}
            />
          );
        }}
      </Stack.Screen>

      <Stack.Screen name="StockControl">
        {({ navigation }) => {
          const guardedNavigation = createGuardedNavigation(navigation);

          return (
            <StockControlScreen
              navigation={guardedNavigation}
              productos={productos}
              stockMovements={stockMovements}
              onOpenLowStock={() => guardedNavigation.navigate("LowStock")}
              onOpenMovement={(product) =>
                guardedNavigation.navigate("StockMovement", { productId: product.id })
              }
            />
          );
        }}
      </Stack.Screen>

      <Stack.Screen name="StockMovement">
        {({ navigation, route }) => {
          const product = findProductById(route.params?.productId);

          return (
            <StockMovementScreen
              navigation={createGuardedNavigation(navigation)}
              product={product}
              onSaveMovement={handleSaveMovement}
            />
          );
        }}
      </Stack.Screen>

      <Stack.Screen name="LowStock">
        {({ navigation }) => {
          const guardedNavigation = createGuardedNavigation(navigation);

          return (
            <LowStockScreen
              navigation={guardedNavigation}
              productos={productos}
              onOpenMovement={(product) =>
                guardedNavigation.navigate("StockMovement", { productId: product.id })
              }
            />
          );
        }}
      </Stack.Screen>
    </Stack.Navigator>
  );
}
