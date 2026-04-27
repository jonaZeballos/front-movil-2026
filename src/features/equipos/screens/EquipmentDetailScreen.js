import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { ScreenContainer } from "../../../shared/components/ScreenContainer";
import { colors } from "../../../shared/theme/colors";

export function EquipmentDetailScreen({ equipment, onBack }) {
  if (!equipment) {
    return (
      <ScreenContainer backgroundColor={colors.dashboardBg} edges={["top"]}>
        <View style={styles.container}>
          <Text style={styles.title}>Equipo no encontrado</Text>
          <Pressable style={styles.primaryButton} onPress={onBack}>
            <Text style={styles.primaryButtonText}>Volver</Text>
          </Pressable>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer backgroundColor={colors.dashboardBg} edges={["top"]}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable onPress={onBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={22} color="#111827" />
          </Pressable>

          <View style={styles.headerText}>
            <Text style={styles.title}>Detalle de equipo</Text>
            <Text style={styles.subtitle}>{equipment.clientName}</Text>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Informacion principal</Text>

            <InfoRow label="Cliente" value={equipment.clientName} />
            <InfoRow label="Tipo de equipo" value={equipment.type} />
            <InfoRow label="Marca" value={equipment.brand} />
            <InfoRow label="Modelo" value={equipment.model} />
            <InfoRow label="Serie" value={equipment.serial} />
            <InfoRow label="Falla reportada" value={equipment.failure} />
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
