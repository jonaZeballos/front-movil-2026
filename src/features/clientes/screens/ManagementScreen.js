import React, { useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

import GestionClientes from "../components/clienteManagement";
import { ScreenContainer } from "../../../shared/components/ScreenContainer";
import { colors } from "../../../shared/theme/colors";

export function ManagementScreen({
  navigation,
  clientes = [],
  ordenes = [],
  equipos = [],
}) {
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

  const handleOpenHistory = (cliente) => {
    navigation.push("ClientHistory", { clienteId: cliente.id });
  };

  const handleCloseModal = () => {
    setSelectedCliente(null);
  };

  return (
    <ScreenContainer>
      <GestionClientes
        clientes={clientes}
        ordenes={ordenes}
        equipos={equipos}
        onRegistrar={handleRegistrar}
        onBack={handleBack}
        onSelectCliente={handleSelectCliente}
        onOpenHistory={handleOpenHistory}
      />

      <Modal visible={!!selectedCliente} transparent animationType="slide">
        <View style={modalStyles.overlay}>
          <View style={modalStyles.card}>
            <Text style={modalStyles.title}>Detalle del cliente</Text>

            {selectedCliente ? (
              <View style={modalStyles.detailList}>
                <Text style={modalStyles.label}>Nombre</Text>
                <Text style={modalStyles.value}>
                  {selectedCliente.nombre || "No registrado"}
                </Text>

                <Text style={modalStyles.label}>Documento</Text>
                <Text style={modalStyles.value}>
                  {selectedCliente.numeroDocumento || "No registrado"}
                </Text>

                <Text style={modalStyles.label}>Correo</Text>
                <Text style={modalStyles.value}>
                  {selectedCliente.correo || "No registrado"}
                </Text>

                <Text style={modalStyles.label}>Teléfono</Text>
                <Text style={modalStyles.value}>
                  {selectedCliente.telefono || "No registrado"}
                </Text>

                <Text style={modalStyles.label}>Dirección</Text>
                <Text style={modalStyles.value}>
                  {selectedCliente.direccion || "No especificada"}
                </Text>
              </View>
            ) : null}

            <Pressable
              style={modalStyles.historyButton}
              onPress={() => {
                const cliente = selectedCliente;
                setSelectedCliente(null);

                if (cliente) {
                  handleOpenHistory(cliente);
                }
              }}
            >
              <Text style={modalStyles.historyButtonText}>Ver historial</Text>
            </Pressable>

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
    fontWeight: "900",
    color: colors.black,
    marginBottom: 18,
  },
  detailList: {
    marginBottom: 18,
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
  historyButton: {
    backgroundColor: "#EEF2FF",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#C7D2FE",
  },
  historyButtonText: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: "900",
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
    fontWeight: "700",
  },
});