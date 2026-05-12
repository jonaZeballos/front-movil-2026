import React from "react";
import { Alert } from "react-native";

import RegistroProducto from "../components/productoRegister";
import { ScreenContainer } from "../../../shared/components/ScreenContainer";

export default function ProductoRegisterScreen({ navigation, onGuardar }) {

  const handleGuardar = (productoData) => {
    if (onGuardar) {
      onGuardar(productoData);
      Alert.alert("Éxito", "Producto registrado");
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