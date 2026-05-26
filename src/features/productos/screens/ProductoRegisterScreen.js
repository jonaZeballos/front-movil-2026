import React from "react";
import { Alert } from "react-native";

import RegistroProducto from "../components/productoRegister";
import { ScreenContainer } from "../../../shared/components/ScreenContainer";

export default function ProductoRegisterScreen({ navigation, onGuardar }) {
  const handleGuardar = async (productoData) => {
    if (onGuardar) {
      await onGuardar(productoData);
      Alert.alert("Exito", "Producto registrado");
    }
  };

  const handleVolver = () => {
    navigation.goBack();
  };

  return (
    <ScreenContainer>
      <RegistroProducto
        onGuardar={handleGuardar}
        onCancelar={handleVolver}
      />
    </ScreenContainer>
  );
}
