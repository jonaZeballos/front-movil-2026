import { useRef, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { ScreenContainer } from "../../../shared/components/ScreenContainer";
import { colors } from "../../../shared/theme/colors";
import { StatusBadge } from "../components/StatusBadge";
import { orderStatuses } from "../services/ordersApi";

export function OrderDetailScreen({ order, onBack, onUpdateStatus, onAddObservation }) {
  const [observation, setObservation] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState(null);
  const [isAddingObservation, setIsAddingObservation] = useState(false);
  const statusRef = useRef(false);
  const observationRef = useRef(false);

  if (!order) {
    return (
      <ScreenContainer backgroundColor={colors.dashboardBg} edges={["top"]}>
        <View style={styles.container}>
          <Text style={styles.title}>Orden no encontrada</Text>
          <Pressable style={styles.primaryButton} onPress={onBack}>
            <Text style={styles.primaryButtonText}>Volver</Text>
          </Pressable>
        </View>
      </ScreenContainer>
    );
  }

  const handleUpdateStatus = async (status) => {
    if (statusRef.current || order.status === status) return;

    try {
      statusRef.current = true;
      setUpdatingStatus(status);
      await onUpdateStatus(order.id, status);
      Alert.alert("Confirmacion", "El estado fue actualizado correctamente.");
    } catch (error) {
      Alert.alert("Error", error.message || "No se pudo actualizar el estado.");
    } finally {
      statusRef.current = false;
      setUpdatingStatus(null);
    }
  };

  const handleAddObservation = async () => {
    if (observationRef.current) return;

    if (!observation.trim()) {
      Alert.alert("Observacion vacia", "Ingresa una observacion valida.");
      return;
    }

    try {
      observationRef.current = true;
      setIsAddingObservation(true);
      await onAddObservation(order.id, observation.trim());
      setObservation("");
      Alert.alert("Confirmacion", "La observacion fue agregada correctamente.");
    } catch (error) {
      Alert.alert("Error", error.message || "No se pudo agregar la observacion.");
    } finally {
      observationRef.current = false;
      setIsAddingObservation(false);
    }
  };

  return (
    <ScreenContainer backgroundColor={colors.dashboardBg} edges={["top"]}>
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable
            onPress={onBack}
            style={styles.backButton}
            disabled={Boolean(updatingStatus) || isAddingObservation}
          >
            <Ionicons name="arrow-back" size={22} color="#111827" />
          </Pressable>

          <View style={styles.headerText}>
            <Text style={styles.title}>Detalle de orden</Text>
            <Text style={styles.subtitle}>{order.code}</Text>
          </View>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Informacion principal</Text>

            <InfoRow label="Cliente" value={order.clientName} />
            <InfoRow label="Equipo" value={order.equipmentName} />
            <InfoRow label="Serie" value={order.equipmentSerial} />
            <InfoRow label="Falla reportada" value={order.failure} />

            <View style={styles.statusCurrent}>
              <Text style={styles.label}>Estado actual</Text>
              <StatusBadge status={order.status} />
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Actualizar estado</Text>

            <View style={styles.statusGrid}>
              {orderStatuses.map((status) => {
                const active = order.status === status;

                return (
                  <Pressable
                    key={status}
                    style={[
                      styles.statusButton,
                      active && styles.statusButtonActive,
                      updatingStatus && styles.disabledButton,
                    ]}
                    onPress={() => handleUpdateStatus(status)}
                    disabled={Boolean(updatingStatus)}
                  >
                    <Text style={[styles.statusButtonText, active && styles.statusButtonTextActive]}>
                      {updatingStatus === status ? "Actualizando..." : status}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Observaciones</Text>

            {order.observations?.length ? (
              order.observations.map((item, index) => (
                <View key={`${item}-${index}`} style={styles.observationItem}>
                  <Text style={styles.observationText}>{item}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.emptyText}>Aun no hay observaciones registradas.</Text>
            )}

            <TextInput
              value={observation}
              onChangeText={setObservation}
              placeholder="Agregar observacion del servicio..."
              multiline
              style={styles.input}
              editable={!isAddingObservation}
            />

            <Pressable
              style={[styles.primaryButton, isAddingObservation && styles.disabledButton]}
              onPress={handleAddObservation}
              disabled={isAddingObservation}
            >
              <Text style={styles.primaryButtonText}>
                {isAddingObservation ? "Guardando..." : "Agregar observacion"}
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </View>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

function InfoRow({ label, value }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 14,
  },
  keyboardContainer: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "900",
    color: "#111827",
  },
  subtitle: {
    marginTop: 3,
    fontSize: 13,
    color: "#6B7280",
  },
  scrollContent: {
    paddingBottom: 24,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "900",
    color: "#111827",
    marginBottom: 14,
  },
  infoRow: {
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 4,
  },
  value: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
  },
  statusCurrent: {
    marginTop: 4,
  },
  statusGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  statusButton: {
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 999,
    backgroundColor: "#F3F4F6",
  },
  statusButtonActive: {
    backgroundColor: "#5655B9",
  },
  statusButtonText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#374151",
  },
  statusButtonTextActive: {
    color: "#FFFFFF",
  },
  observationItem: {
    backgroundColor: "#F9FAFB",
    borderRadius: 14,
    padding: 12,
    marginBottom: 8,
  },
  observationText: {
    fontSize: 13,
    color: "#374151",
    lineHeight: 18,
  },
  emptyText: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 12,
  },
  input: {
    minHeight: 90,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 16,
    padding: 12,
    fontSize: 14,
    textAlignVertical: "top",
    color: "#111827",
    marginTop: 10,
  },
  primaryButton: {
    height: 52,
    borderRadius: 16,
    backgroundColor: "#5655B9",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },
  disabledButton: {
    opacity: 0.65,
  },
});
