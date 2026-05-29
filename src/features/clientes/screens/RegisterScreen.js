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
      console.warn("Error al registrar cliente", error);
      Alert.alert(
        "No se pudo registrar el cliente",
        getClientRegisterErrorMessage(error)
      );
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

function getClientRegisterErrorMessage(error) {
  const message = String(error?.message || "").trim();

  if (!message) {
    return "No se pudo registrar el cliente. Intenta nuevamente.";
  }

  if (message.includes("documento en este negocio")) {
    return "Ya existe un cliente con ese documento en este negocio.";
  }

  if (message.includes("correo en este negocio")) {
    return "Ya existe un cliente con ese correo en este negocio.";
  }

  if (
    message.includes("Invalid `prisma") ||
    message.includes("Prisma") ||
    message.includes("Unique constraint") ||
    message.includes("does not exist")
  ) {
    return "No se pudo registrar el cliente. Intenta nuevamente.";
  }

  return message;
}
