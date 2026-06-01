import React, { useState } from "react";
import { Alert } from "react-native";

import RegistroProducto from "../components/productoRegister";
import { ScreenContainer } from "../../../shared/components/ScreenContainer";

export default function ProductoRegisterScreen({
  navigation,
  onGuardar,
  categorias = [],
  initialCategoriaId,
  technicians = [],
  inventoryType = "tienda",
  role,
}) {
  const [isSaving, setIsSaving] = useState(false);

  const handleGuardar = async (productoData) => {
    if (isSaving) return;

    if (onGuardar) {
      try {
        setIsSaving(true);
        await onGuardar(productoData);
        Alert.alert("Exito", "Producto registrado");
      } catch (error) {
        Alert.alert("No se pudo registrar", error.message || "Intenta nuevamente.");
      } finally {
        setIsSaving(false);
      }
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
        isSaving={isSaving}
        categorias={categorias}
        initialCategoriaId={initialCategoriaId}
        technicians={technicians}
        inventoryType={inventoryType}
        role={role}
      />
    </ScreenContainer>
  );
}
