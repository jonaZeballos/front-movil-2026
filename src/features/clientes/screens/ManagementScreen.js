import React, { useState } from "react";
import { View, Modal, Text, Pressable, StyleSheet } from "react-native";

import GestionClientes from "../components/clienteManagement";
import { ScreenContainer } from "../../../shared/components/ScreenContainer";
import { colors } from "../../../shared/theme/colors";

export function ManagementScreen({ navigation, clientes }) {
  const [selectedCliente, setSelectedCliente] = useState(null);

  const handleRegistrar = () => {
    navigation.push("RegisterClient");
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleSelectCliente = (cliente) => {
    setSelectedCliente(cliente);
  };

  const handleCloseModal = () => {
    setSelectedCliente(null);
  };

  return (
    <ScreenContainer>
      <GestionClientes
        clientes={clientes}
        onRegistrar={handleRegistrar}
        onBack={handleBack}
        onSelectCliente={handleSelectCliente}
      />

      <Modal visible={!!selectedCliente} transparent animationType="slide">
        <View style={modalStyles.overlay}>
          <View style={modalStyles.card}>
            <Text style={modalStyles.title}>Detalle del cliente</Text>
            {selectedCliente ? (
              <View style={modalStyles.detailList}>
                <Text style={modalStyles.label}>Nombre</Text>
                <Text style={modalStyles.value}>{selectedCliente.nombre}</Text>
                <Text style={modalStyles.label}>Correo</Text>
                <Text style={modalStyles.value}>{selectedCliente.correo}</Text>
                <Text style={modalStyles.label}>Teléfono</Text>
                <Text style={modalStyles.value}>{selectedCliente.telefono}</Text>
                <Text style={modalStyles.label}>Dirección</Text>
                <Text style={modalStyles.value}>{selectedCliente.direccion || "No especificada"}</Text>
              </View>
            ) : null}
            <Pressable style={modalStyles.closeButton} onPress={handleCloseModal}>
              <Text style={modalStyles.closeButtonText}>Cerrar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </ScreenContainer>
  );
}

const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  card: {
    width: "100%",
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 24,
    shadowColor: "#000",
    shadowOpacity: 0.16,
    shadowRadius: 20,
    elevation: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.black,
    marginBottom: 18,
  },
  detailList: {
    marginBottom: 24,
  },
  label: {
    fontSize: 12,
    color: "#888",
    marginBottom: 4,
    textTransform: "uppercase",
  },
  value: {
    fontSize: 15,
    color: colors.black,
    marginBottom: 10,
  },
  closeButton: {
    backgroundColor: "#534AB7",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
  },
  closeButtonText: {
    color: colors.surface,
    fontSize: 15,
    fontWeight: "600",
  },
});