import { useState } from "react";
import {
  Alert,
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
import { orderStatuses } from "../data/ordersMock";

export function OrderDetailScreen({ order, onBack, onUpdateStatus, onAddObservation }) {
  const [observation, setObservation] = useState("");

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

  const handleAddObservation = () => {
    if (!observation.trim()) {
      Alert.alert("Observación vacía", "Ingresa una observación válida.");
      return;
    }

    onAddObservation(order.id, observation.trim());
    setObservation("");
    Alert.alert("Confirmación", "La observación fue agregada correctamente.");
  };

  return (
    <ScreenContainer backgroundColor={colors.dashboardBg} edges={["top"]}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable onPress={onBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={22} color="#111827" />
          </Pressable>

          <View style={styles.headerText}>
            <Text style={styles.title}>Detalle de orden</Text>
            <Text style={styles.subtitle}>{order.code}</Text>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Información principal</Text>

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
                    style={[styles.statusButton, active && styles.statusButtonActive]}
                    onPress={() => {
                      onUpdateStatus(order.id, status);
                      Alert.alert("Confirmación", "El estado fue actualizado correctamente.");
                    }}
                  >
                    <Text style={[styles.statusButtonText, active && styles.statusButtonTextActive]}>
                      {status}
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
              <Text style={styles.emptyText}>Aún no hay observaciones registradas.</Text>
            )}

            <TextInput
              value={observation}
              onChangeText={setObservation}
              placeholder="Agregar observación del servicio..."
              multiline
              style={styles.input}
            />

            <Pressable style={styles.primaryButton} onPress={handleAddObservation}>
              <Text style={styles.primaryButtonText}>Agregar observación</Text>
            </Pressable>
          </View>
        </ScrollView>
      </View>
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
});