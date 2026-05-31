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
  listProductos,
  updateProductoStock,
} from "../services";
import { useNavigationActionGuard } from "../../../shared/navigation/useNavigationActionGuard";

const Stack = createNativeStackNavigator();

export function InventarioStack({ onProductsChange }) {
  const { createGuardedNavigation } = useNavigationActionGuard();
  const [productos, setProductos] = useState([]);
  const [stockMovements, setStockMovements] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const refreshProductos = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await listProductos();
      setProductos(data);
      onProductsChange?.(data);
    } finally {
      setIsLoading(false);
    }
  }, [onProductsChange]);

  useEffect(() => {
    refreshProductos().catch((error) => {
      console.warn("No se pudo cargar inventario.", error);
    });
  }, [refreshProductos]);

  const handleAddProducto = async (producto) => {
    await createProducto(producto);
    await refreshProductos();
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
            isLoading={isLoading}
            onRefresh={refreshProductos}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="ProductoRegister">
        {({ navigation }) => {
          const guardedNavigation = createGuardedNavigation(navigation);

          return (
            <ProductoRegisterScreen
              navigation={guardedNavigation}
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
