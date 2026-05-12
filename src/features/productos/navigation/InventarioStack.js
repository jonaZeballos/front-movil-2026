import React, { useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { InventarioManagementScreen, ProductoRegisterScreen } from "../screens";

const Stack = createNativeStackNavigator();

export function InventarioStack() {

  const [productos, setProductos] = useState([]);

  const handleAddProducto = (producto) => {
    const nuevo = {
      id: Date.now(),
      ...producto,
    };

    setProductos((prev) => [nuevo, ...prev]);
  };

  return (
    <Stack.Navigator initialRouteName="Inventario" screenOptions={{ headerShown: false }}>

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

    </Stack.Navigator>
  );
}