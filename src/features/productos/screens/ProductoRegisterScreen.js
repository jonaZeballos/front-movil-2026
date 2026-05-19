import React, { useRef, useState } from "react";
import { Alert } from "react-native";

import RegistroProducto from "../components/productoRegister";
import { ScreenContainer } from "../../../shared/components/ScreenContainer";

export default function ProductoRegisterScreen({ navigation, onGuardar }) {
  const [isSaving, setIsSaving] = useState(false);
  const isSavingRef = useRef(false);

  const handleGuardar = async (productoData) => {
    if (!onGuardar || isSavingRef.current) return;

    try {
      isSavingRef.current = true;
      setIsSaving(true);
      await onGuardar(productoData);
      Alert.alert("Exito", "Producto registrado");
    } catch (error) {
      Alert.alert("Error", error.message || "No se pudo registrar el producto.");
      isSavingRef.current = false;
      setIsSaving(false);
    }
  };

  const handleVolver = () => {
    if (!isSavingRef.current) {
      navigation.goBack();
    }
  };

  return (
    <ScreenContainer>
      <RegistroProducto
        onGuardar={handleGuardar}
        onCancelar={handleVolver}
        isSaving={isSaving}
      />
    </ScreenContainer>
  );
}
