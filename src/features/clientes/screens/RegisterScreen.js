import React, { useRef, useState } from "react";
import { Alert } from "react-native";

import RegistrarCliente from "../components/clienteRegister";
import { ScreenContainer } from "../../../shared/components/ScreenContainer";

export function RegisterScreen({ navigation, onGuardar }) {
  const [isSaving, setIsSaving] = useState(false);
  const submitLockRef = useRef(false);

  const handleGuardar = async (clienteData) => {
    if (submitLockRef.current || isSaving) return;

    submitLockRef.current = true;
    setIsSaving(true);

    try {
      await onGuardar?.(clienteData);
      Alert.alert("Exito", `Cliente ${clienteData.nombre} registrado.`);
    } catch (error) {
      Alert.alert("No se pudo registrar", error.message || "Intenta nuevamente.");
    } finally {
      submitLockRef.current = false;
      setIsSaving(false);
    }
  };

  const handleVolver = () => {
    navigation.goBack();
  };

  return (
    <ScreenContainer>
      <RegistrarCliente onGuardar={handleGuardar} onVolver={handleVolver} isSaving={isSaving} />
    </ScreenContainer>
  );
}
