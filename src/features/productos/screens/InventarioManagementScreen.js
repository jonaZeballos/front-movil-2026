import React from "react";
import GestionInventario from "../components/productoManagement";
import { ScreenContainer } from "../../../shared/components/ScreenContainer";

export default function InventarioManagementScreen({ navigation, productos, isLoading, onRefresh }) {

  const handleRegistrar = () => {
    navigation.navigate("ProductoRegister");
  };

  return (
    <ScreenContainer>
      <GestionInventario
        productos={productos}
        onRegistrar={handleRegistrar}
        isLoading={isLoading}
        onRefresh={onRefresh}
      />
    </ScreenContainer>
  );
}
