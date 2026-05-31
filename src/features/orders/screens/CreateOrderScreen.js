import { useRef, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

import { ScreenContainer } from "../../../shared/components/ScreenContainer";
import { colors } from "../../../shared/theme/colors";
import { OrderFormModal } from "../components/OrderFormModal";

export function CreateOrderScreen({ clientes = [], equipments = [], onCreateOrder, onBack }) {
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

        {equipments.length === 0 ? (
          <View style={styles.card}>
            <View style={styles.iconBox}>
              <MaterialCommunityIcons name="clipboard-text-outline" size={30} color="#5655B9" />
            </View>
            <Text style={styles.cardTitle}>No hay equipos registrados</Text>
            <Text style={styles.emptyText}>
              No hay equipos registrados. Registra un equipo antes de crear una orden.
            </Text>
          </View>
        ) : null}

        <OrderFormModal
          visible={equipments.length > 0}
          clientes={clientes}
          equipments={equipments}
          submitLabel="Crear orden"
          isSubmitting={isSaving}
          onClose={onBack}
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
  emptyText: {
    marginTop: 14,
    color: "#B45309",
    fontSize: 13,
    lineHeight: 18,
    textAlign: "center",
  },
});
