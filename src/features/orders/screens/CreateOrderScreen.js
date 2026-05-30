import { useRef, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

import { ScreenContainer } from "../../../shared/components/ScreenContainer";
import { colors } from "../../../shared/theme/colors";
import { OrderFormModal } from "../components/OrderFormModal";

export function CreateOrderScreen({ clientes = [], equipments = [], onCreateOrder, onBack }) {
  const [formVisible, setFormVisible] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const submitLockRef = useRef(false);

  const handleCreate = async (orderData) => {
    if (submitLockRef.current || isSaving) return;

    submitLockRef.current = true;
    setIsSaving(true);

    try {
      await onCreateOrder(orderData.equipoId, orderData);
    } catch (error) {
      Alert.alert("No se pudo crear la orden", error.message || "Intenta nuevamente.");
    } finally {
      submitLockRef.current = false;
      setIsSaving(false);
    }
  };

  return (
    <ScreenContainer backgroundColor={colors.dashboardBg} edges={["top"]}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable onPress={onBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={22} color="#111827" />
          </Pressable>

          <View style={styles.headerText}>
            <Text style={styles.title}>Nueva orden</Text>
            <Text style={styles.subtitle}>Crea una orden para un equipo existente</Text>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.iconBox}>
            <MaterialCommunityIcons name="clipboard-text-outline" size={30} color="#5655B9" />
          </View>
          <Text style={styles.cardTitle}>Formulario de orden</Text>
          <Text style={styles.cardText}>
            Selecciona cliente, uno o varios equipos, prioridad y registra el diagnostico o falla de la orden.
          </Text>

          {equipments.length === 0 ? (
            <Text style={styles.emptyText}>
              No hay equipos registrados. Registra un equipo antes de crear una orden.
            </Text>
          ) : null}

          <Pressable
            style={[styles.primaryButton, equipments.length === 0 && styles.disabledButton]}
            onPress={() => setFormVisible(true)}
            disabled={equipments.length === 0}
          >
            <Text style={styles.primaryButtonText}>Abrir formulario</Text>
          </Pressable>
        </View>

        <OrderFormModal
          visible={formVisible && equipments.length > 0}
          clientes={clientes}
          equipments={equipments}
          submitLabel="Crear orden"
          isSubmitting={isSaving}
          onClose={() => setFormVisible(false)}
          onSubmit={handleCreate}
        />
      </View>
    </ScreenContainer>
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
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 18,
    alignItems: "center",
  },
  iconBox: {
    width: 58,
    height: 58,
    borderRadius: 18,
    backgroundColor: "#EDEBFF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  cardTitle: {
    color: "#111827",
    fontSize: 18,
    fontWeight: "900",
  },
  cardText: {
    marginTop: 6,
    color: "#6B7280",
    fontSize: 13,
    lineHeight: 19,
    textAlign: "center",
  },
  emptyText: {
    marginTop: 14,
    color: "#B45309",
    fontSize: 13,
    lineHeight: 18,
    textAlign: "center",
  },
  primaryButton: {
    width: "100%",
    height: 54,
    borderRadius: 17,
    backgroundColor: "#5655B9",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 18,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "900",
  },
  disabledButton: {
    opacity: 0.55,
  },
});
