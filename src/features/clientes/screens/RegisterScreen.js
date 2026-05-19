import React, { useRef, useState } from "react";
import { Alert } from "react-native";

import RegistrarCliente from "../components/clienteRegister";
import { ScreenContainer } from "../../../shared/components/ScreenContainer";

export function RegisterScreen({ navigation, onGuardar }) {
  const [isSaving, setIsSaving] = useState(false);
  const isSavingRef = useRef(false);

  const handleGuardar = async (clienteData) => {
    if (!onGuardar || isSavingRef.current) return;

    try {
      isSavingRef.current = true;
      setIsSaving(true);
      await onGuardar(clienteData);
      Alert.alert("Exito", `Cliente ${clienteData.nombre} registrado.`);
    } catch (error) {
      Alert.alert("Error", error.message || "No se pudo registrar el cliente.");
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
      <RegistrarCliente
        onGuardar={handleGuardar}
        onVolver={handleVolver}
        isSaving={isSaving}
      />
    </ScreenContainer>
  );
}
