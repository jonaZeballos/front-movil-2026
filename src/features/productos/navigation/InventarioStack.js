import React, { useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import {
  InventarioManagementScreen,
  ProductoRegisterScreen,
  StockControlScreen,
  StockMovementScreen,
  LowStockScreen,
} from "../screens";
import { applyStockMovement } from "../services";

const Stack = createNativeStackNavigator();

const initialProducts = [
  {
    id: 1,
    nombre: "Laptop HP Pavilion 15",
    marca: "HP",
    modelo: "Pav-15",
    precio: "Bs. 4.500",
    stock: 5,
  },
  {
    id: 2,
    nombre: "PC Lenovo ThinkCentre",
    marca: "Lenovo",
    modelo: "TC-M70",
    precio: "Bs. 6.200",
    stock: 2,
  },
  {
    id: 3,
    nombre: "Laptop Asus Vivobook",
    marca: "Asus",
    modelo: "VB-14",
    precio: "Bs. 3.800",
    stock: 8,
  },
];

export function InventarioStack() {
  const [productos, setProductos] = useState(initialProducts);
  const [stockMovements, setStockMovements] = useState([]);

  const handleAddProducto = (producto) => {
    const nuevo = {
      id: Date.now(),
      ...producto,
      stock: normalizeStock(producto.stock),
    };

    setProductos((prev) => [nuevo, ...prev]);
  };

  const handleSaveMovement = (movement) => {
    setProductos((prevProductos) => applyStockMovement(prevProductos, movement));
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
            navigation={navigation}
            productos={productos}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="ProductoRegister">
        {({ navigation }) => (
          <ProductoRegisterScreen
            navigation={navigation}
            onGuardar={(data) => {
              handleAddProducto(data);
              navigation.goBack();
            }}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="StockControl">
        {({ navigation }) => (
          <StockControlScreen
            navigation={navigation}
            productos={productos}
            stockMovements={stockMovements}
            onOpenLowStock={() => navigation.navigate("LowStock")}
            onOpenMovement={(product) =>
              navigation.navigate("StockMovement", { productId: product.id })
            }
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="StockMovement">
        {({ navigation, route }) => {
          const product = findProductById(route.params?.productId);

          return (
            <StockMovementScreen
              navigation={navigation}
              product={product}
              onSaveMovement={handleSaveMovement}
            />
          );
        }}
      </Stack.Screen>

      <Stack.Screen name="LowStock">
        {({ navigation }) => (
          <LowStockScreen
            navigation={navigation}
            productos={productos}
            onOpenMovement={(product) =>
              navigation.navigate("StockMovement", { productId: product.id })
            }
          />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

function normalizeStock(value) {
  const stock = Number(String(value || "0").replace(",", "."));
  return Number.isFinite(stock) ? stock : 0;
}