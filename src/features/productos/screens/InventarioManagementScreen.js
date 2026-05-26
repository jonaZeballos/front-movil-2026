import React from "react";

import GestionInventario from "../components/productoManagement";
import { ScreenContainer } from "../../../shared/components/ScreenContainer";

export default function InventarioManagementScreen({ navigation, productos }) {
  const handleRegistrar = () => {
    navigation.navigate("ProductoRegister");
  };

  const handleOpenStockControl = () => {
    navigation.navigate("StockControl");
  };

  const handleVolver = () => {
    navigation.goBack();
  };

  return (
    <ScreenContainer>
      <GestionInventario
        productos={productos}
        onRegistrar={handleRegistrar}
        onOpenStockControl={handleOpenStockControl}
        onVolver={handleVolver}
      />
    </ScreenContainer>
  );
}
