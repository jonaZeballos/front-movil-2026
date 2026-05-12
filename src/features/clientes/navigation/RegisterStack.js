import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { ManagementScreen, RegisterScreen } from "../index";

const Stack = createNativeStackNavigator();

export function RegisterStack({ clientes = [], onGuardarCliente }) {
  return (
    <Stack.Navigator
      initialRouteName="Management"
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
        gestureEnabled: true,
      }}
    >
      <Stack.Screen name="Management">
        {({ navigation }) => (
          <ManagementScreen navigation={navigation} clientes={clientes} />
        )}
      </Stack.Screen>
      <Stack.Screen name="RegisterClient">
        {({ navigation }) => (
          <RegisterScreen
            navigation={navigation}
            onGuardar={async (clienteData) => {
              await onGuardarCliente?.(clienteData);
              navigation.goBack();
            }}
          />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}
