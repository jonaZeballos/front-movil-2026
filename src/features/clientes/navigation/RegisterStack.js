import React, { useState, useMemo } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { ManagementScreen, RegisterScreen } from "../index";

const Stack = createNativeStackNavigator();

const initialClientes = [
  {
    id: 1,
    nombre: "Juan Soliz",
    correo: "juan.soliz@email.com",
    telefono: "+591 70011223",
    direccion: "Calle Libertad 45",
    iniciales: "JS",
  },
  {
    id: 2,
    nombre: "Pedro Perez",
    correo: "pedro.perez@gmail.com",
    telefono: "+591 71234567",
    direccion: "Av. Busch 120",
    iniciales: "PP",
  },
  {
    id: 3,
    nombre: "Maria Lopez",
    correo: "maria.lopez@hotmail.com",
    telefono: "+591 76543210",
    direccion: "Calle Murillo 8",
    iniciales: "ML",
  },
];

function getInitials(nombre) {
  return nombre
    .split(" ")
    .map((part) => part[0]?.toUpperCase() || "")
    .slice(0, 2)
    .join("");
}

export function RegisterStack() {
  const [clientes, setClientes] = useState(initialClientes);

  const handleAddCliente = (clienteData) => {
    const nuevoCliente = {
      id: Date.now(),
      nombre: clienteData.nombre,
      correo: clienteData.correo,
      telefono: clienteData.telefono,
      direccion: clienteData.direccion || "",
      iniciales: getInitials(clienteData.nombre),
    };

    setClientes((prev) => [nuevoCliente, ...prev]);
  };

  const screenProps = useMemo(
    () => ({
      clientes,
      onAddCliente: handleAddCliente,
    }),
    [clientes]
  );

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
            clientes={screenProps.clientes}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="RegisterClient">
        {({ navigation }) => (
          <RegisterScreen
            navigation={navigation}
            onGuardar={(clienteData) => {
              handleAddCliente(clienteData);
              navigation.goBack();
            }}
          />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}
