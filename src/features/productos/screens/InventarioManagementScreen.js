import React from "react";

import GestionInventario from "../components/productoManagement";
import { ScreenContainer } from "../../../shared/components/ScreenContainer";

export default function InventarioManagementScreen({
  navigation,
  productos,
  categorias,
  isLoading,
  onRefresh,
  onCreateCategoria,
  canManageCategories,
  title,
  inventoryType,
}) {
  const handleRegistrar = (categoria) => {
    navigation.navigate("ProductoRegister", { categoriaId: categoria?.id });
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
        categorias={categorias}
        isLoading={isLoading}
        title={title}
        inventoryType={inventoryType}
        onRegistrar={handleRegistrar}
        onOpenStockControl={handleOpenStockControl}
        onRefresh={onRefresh}
        onCreateCategoria={onCreateCategoria}
        canManageCategories={canManageCategories}
        onVolver={handleVolver}
      />
    </ScreenContainer>
  );
}
