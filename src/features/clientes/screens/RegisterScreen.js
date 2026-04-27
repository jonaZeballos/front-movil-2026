import React from "react";
import { Alert } from "react-native";

import RegistrarCliente from "../components/clienteRegister";
import { ScreenContainer } from "../../../shared/components/ScreenContainer";

export function RegisterScreen({ navigation, onGuardar }) {
  const handleGuardar = (clienteData) => {
    if (onGuardar) {
      onGuardar(clienteData);
      Alert.alert("Éxito", `Cliente ${clienteData.nombre} registrado.`);
    }
  };

  const handleVolver = () => {
    navigation.goBack();
  };

  return (
    <ScreenContainer>
      <RegistrarCliente onGuardar={handleGuardar} onVolver={handleVolver} />
    </ScreenContainer>
  );
}