import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { ManagementScreen, RegisterScreen, ClientHistoryScreen } from "../index";

const Stack = createNativeStackNavigator();

export function RegisterStack({
  clientes = [],
  ordenes = [],
  equipos = [],
  onGuardarCliente,
}) {
  const findClienteById = (clienteId) => {
    return clientes.find((cliente) => String(cliente.id) === String(clienteId));
  };

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
          <ManagementScreen
            navigation={navigation}
            clientes={clientes}
            ordenes={ordenes}
            equipos={equipos}
          />
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

      <Stack.Screen name="ClientHistory">
        {({ navigation, route }) => {
          const cliente = findClienteById(route.params?.clienteId);

          return (
            <ClientHistoryScreen
              navigation={navigation}
              cliente={cliente}
              ordenes={ordenes}
              equipos={equipos}
            />
          );
        }}
      </Stack.Screen>
    </Stack.Navigator>
  );
}