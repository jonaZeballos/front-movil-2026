import React, { useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { InventarioManagementScreen, ProductoRegisterScreen } from "../screens";
import { createProducto, listProductos } from "../services/productosApi";

const Stack = createNativeStackNavigator();

export function InventarioStack() {

  const [productos, setProductos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const refreshProductos = async () => {
    setIsLoading(true);
    try {
      const data = await listProductos();
      setProductos(data);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshProductos().catch((error) => {
      console.warn("No se pudo cargar el inventario.", error);
    });
  }, []);

  const handleAddProducto = async (producto) => {
    const nuevo = await createProducto(producto);
    setProductos((prev) => [nuevo, ...prev]);
  };

  return (
    <Stack.Navigator initialRouteName="Inventario" screenOptions={{ headerShown: false }}>

      <Stack.Screen name="Inventario">
        {({ navigation }) => (
          <InventarioManagementScreen
            navigation={navigation}
            productos={productos}
            isLoading={isLoading}
            onRefresh={refreshProductos}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="ProductoRegister">
        {({ navigation }) => (
          <ProductoRegisterScreen
            navigation={navigation}
            onGuardar={async (data) => {
              await handleAddProducto(data);
              navigation.goBack();
            }}
          />
        )}
      </Stack.Screen>

    </Stack.Navigator>
  );
}
