import React, { useState } from "react";
import { Alert, Modal, Pressable, StyleSheet, Text, TextInput, View, Keyboard, Platform, KeyboardAvoidingView } from "react-native";

import GestionClientes from "../components/clienteManagement";
import { ScreenContainer } from "../../../shared/components/ScreenContainer";
import { colors } from "../../../shared/theme/colors";

export function ManagementScreen({
  navigation,
  clientes = [],
  ordenes = [],
  equipos = [],
  mode,
  onAddToBlacklist,
  onRemoveFromBlacklist,
}) {
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [blacklistTarget, setBlacklistTarget] = useState(null);
  const [blacklistReason, setBlacklistReason] = useState("");
  const [isUpdatingBlacklist, setIsUpdatingBlacklist] = useState(false);

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

  const handleAddToBlacklist = async () => {
    if (!blacklistTarget || isUpdatingBlacklist) return;
    if (!blacklistReason.trim()) {
      Alert.alert("Motivo requerido", "Ingresa el motivo para agregar al cliente a lista negra.");
      return;
    }

    setIsUpdatingBlacklist(true);
    try {
      await onAddToBlacklist?.(blacklistTarget.id, blacklistReason.trim());
      setBlacklistTarget(null);
      setBlacklistReason("");
      setSelectedCliente(null);
    } catch (error) {
      Alert.alert("No se pudo actualizar", error.message || "Intenta nuevamente.");
    } finally {
      setIsUpdatingBlacklist(false);
    }
  };

  const handleRemoveFromBlacklist = (cliente) => {
    Alert.alert("Quitar de lista negra", `Deseas quitar a ${cliente.nombre || "este cliente"} de lista negra?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Quitar",
        onPress: async () => {
          try {
            await onRemoveFromBlacklist?.(cliente.id);
            setSelectedCliente(null);
          } catch (error) {
            Alert.alert("No se pudo actualizar", error.message || "Intenta nuevamente.");
          }
        },
      },
    ]);
  };

  const checkIsAdmin = (nav) => {
    if (!nav) return false;
    let currentNav = nav;
    while (currentNav) {
      const state = currentNav.getState();
      if (state?.routes) {
        for (const route of state.routes) {
          if (route.name === "AdminDashboard") return true;
          if (route.name === "SalesDashboard" || route.name === "Home") return false;
        }
      }
      currentNav = currentNav.getParent ? currentNav.getParent() : null;
    }
    return false;
  };

  const isAdminUser = checkIsAdmin(navigation);

  return (
    <ScreenContainer>
      <GestionClientes
        clientes={clientes}
        ordenes={ordenes}
        equipos={equipos}
        mode={mode}
        isAdmin={isAdminUser}
        onRegistrar={handleRegistrar}
        onBack={handleBack}
        onSelectCliente={handleSelectCliente}
        onOpenHistory={handleOpenHistory}
        onAddToBlacklist={(cliente) => setBlacklistTarget(cliente)}
        onRemoveFromBlacklist={handleRemoveFromBlacklist}
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

                {selectedCliente.enListaNegra ? (
                  <>
                    <Text style={modalStyles.label}>Lista negra</Text>
                    <Text style={[modalStyles.value, modalStyles.blacklistValue]}>
                      {selectedCliente.motivoListaNegra || "Sin motivo registrado"}
                    </Text>
                  </>
                ) : null}
              </View>
            ) : null}

            {isAdminUser ? (
              <Pressable
                style={[
                  modalStyles.blacklistButton,
                  selectedCliente?.enListaNegra && modalStyles.removeBlacklistButton,
                ]}
                onPress={() => {
                  if (!selectedCliente) return;
                  if (selectedCliente.enListaNegra) {
                    handleRemoveFromBlacklist(selectedCliente);
                  } else {
                    setBlacklistTarget(selectedCliente);
                  }
                }}
              >
                <Text
                  style={[
                    modalStyles.blacklistButtonText,
                    selectedCliente?.enListaNegra && modalStyles.removeBlacklistButtonText,
                  ]}
                >
                  {selectedCliente?.enListaNegra ? "Quitar de lista negra" : "Agregar a lista negra"}
                </Text>
              </Pressable>
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

      <Modal visible={!!blacklistTarget} transparent animationType="fade" onRequestClose={() => { if (!isUpdatingBlacklist) setBlacklistTarget(null); }}>
        <Pressable 
          style={modalStyles.overlay} 
          onPress={() => {
            if (!isUpdatingBlacklist) {
              Keyboard.dismiss();
              setBlacklistTarget(null);
              setBlacklistReason("");
            }
          }}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ width: "100%", alignItems: "center" }}
          >
            <Pressable style={modalStyles.card} onPress={(e) => e.stopPropagation()}>
              <Text style={modalStyles.title}>Agregar a lista negra</Text>
              
              <Text style={modalStyles.label}>Cliente</Text>
              <Text style={[modalStyles.value, { fontWeight: "800", marginBottom: 14 }]}>
                {blacklistTarget?.nombre || "Cliente seleccionado"}
              </Text>

              <Text style={modalStyles.label}>Motivo de lista negra *</Text>
              <TextInput
                value={blacklistReason}
                onChangeText={setBlacklistReason}
                placeholder="Indica la justificación obligatoria..."
                placeholderTextColor="#9CA3AF"
                style={modalStyles.reasonInput}
                multiline
                numberOfLines={3}
              />
              
              <View style={{ gap: 10, marginTop: 8 }}>
                <Pressable
                  style={[modalStyles.closeButton, isUpdatingBlacklist && { opacity: 0.7 }]}
                  onPress={handleAddToBlacklist}
                  disabled={isUpdatingBlacklist}
                >
                  <Text style={modalStyles.closeButtonText}>
                    {isUpdatingBlacklist ? "Guardando..." : "Guardar"}
                  </Text>
                </Pressable>
                
                <Pressable
                  style={modalStyles.historyButton}
                  onPress={() => {
                    setBlacklistTarget(null);
                    setBlacklistReason("");
                  }}
                  disabled={isUpdatingBlacklist}
                >
                  <Text style={modalStyles.historyButtonText}>Cancelar</Text>
                </Pressable>
              </View>
            </Pressable>
          </KeyboardAvoidingView>
        </Pressable>
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
  blacklistValue: {
    color: "#B91C1C",
    fontWeight: "800",
  },
  blacklistButton: {
    backgroundColor: "#FEE2E2",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#FCA5A5",
  },
  blacklistButtonText: {
    color: "#B91C1C",
    fontSize: 15,
    fontWeight: "900",
  },
  removeBlacklistButton: {
    backgroundColor: "#ECFDF5",
    borderColor: "#A7F3D0",
  },
  removeBlacklistButtonText: {
    color: "#047857",
  },
  reasonInput: {
    minHeight: 96,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 14,
    padding: 12,
    textAlignVertical: "top",
    color: colors.black,
    marginBottom: 12,
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
