import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { ManagementScreen, RegisterScreen, ClientHistoryScreen } from "../index";
import { useNavigationActionGuard } from "../../../shared/navigation/useNavigationActionGuard";

const Stack = createNativeStackNavigator();

export function RegisterStack({
  clientes = [],
  ordenes = [],
  equipos = [],
  onGuardarCliente,
  onAddToBlacklist,
  onRemoveFromBlacklist,
}) {
  const { createGuardedNavigation } = useNavigationActionGuard();

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
        {({ navigation }) => {
          const guardedNavigation = createGuardedNavigation(navigation);

          return (
            <ManagementScreen
              navigation={guardedNavigation}
              clientes={clientes}
              ordenes={ordenes}
              equipos={equipos}
              onAddToBlacklist={onAddToBlacklist}
              onRemoveFromBlacklist={onRemoveFromBlacklist}
            />
          );
        }}
      </Stack.Screen>

      <Stack.Screen name="RegisterClient">
        {({ navigation }) => {
          const guardedNavigation = createGuardedNavigation(navigation);

          return (
            <RegisterScreen
              navigation={guardedNavigation}
              onGuardar={async (clienteData) => {
                await onGuardarCliente?.(clienteData);
                guardedNavigation.goBack();
              }}
            />
          );
        }}
      </Stack.Screen>

      <Stack.Screen name="ClientHistory">
        {({ navigation, route }) => {
          const cliente = findClienteById(route.params?.clienteId);

          return (
            <ClientHistoryScreen
              navigation={createGuardedNavigation(navigation)}
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
