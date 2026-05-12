import React from "react";
import GestionInventario from "../components/productoManagement";
import { ScreenContainer } from "../../../shared/components/ScreenContainer";

export default function InventarioManagementScreen({ navigation, productos }) {

  const handleRegistrar = () => {
    navigation.navigate("ProductoRegister");
  };

  return (
    <ScreenContainer>
      <GestionInventario
        productos={productos}
        onRegistrar={handleRegistrar}
      />
    </ScreenContainer>
  );
}