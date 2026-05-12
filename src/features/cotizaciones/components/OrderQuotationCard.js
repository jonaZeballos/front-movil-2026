import { Pressable, StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { colors } from "../../../shared/theme/colors";

export function OrderQuotationCard({ order, selected = false, onSelect }) {
  return (
    <Pressable
      style={[styles.card, selected && styles.cardSelected]}
      onPress={onSelect}
    >
      <View style={styles.header}>
        <View style={styles.iconBox}>
          <MaterialCommunityIcons name="file-document-edit-outline" size={22} color="#FFFFFF" />
        </View>

        <View style={styles.headerText}>
          <Text style={styles.code}>{order.codigo}</Text>
          <Text style={styles.client}>{order.cliente}</Text>
        </View>

        <View style={styles.statusPill}>
          <Text style={styles.statusText}>{order.estado}</Text>
        </View>
      </View>

      <View style={styles.detailBlock}>
        <Text style={styles.equipment}>{order.equipo}</Text>
        <Text style={styles.description}>Falla: {order.falla}</Text>
        <Text style={styles.description}>Diagnostico: {order.diagnostico}</Text>
      </View>

      <View style={[styles.actionButton, selected && styles.actionButtonSelected]}>
        <Text style={[styles.actionText, selected && styles.actionTextSelected]}>
          {selected ? "Orden seleccionada" : "Seleccionar orden"}
        </Text>
        <MaterialCommunityIcons
          name={selected ? "check" : "chevron-right"}
          size={21}
          color={selected ? colors.primary : "#FFFFFF"}
        />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "transparent",
    shadowColor: "#000000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  cardSelected: {
    borderColor: colors.primary,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  code: {
    fontSize: 16,
    fontWeight: "900",
    color: "#111827",
  },
  client: {
    marginTop: 2,
    fontSize: 13,
    color: "#6B7280",
  },
  statusPill: {
    maxWidth: 110,
    borderRadius: 999,
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 9,
    paddingVertical: 5,
  },
  statusText: {
    color: colors.primary,
    fontSize: 10,
    fontWeight: "800",
    textAlign: "center",
  },
  detailBlock: {
    marginTop: 14,
    rowGap: 5,
  },
  equipment: {
    color: "#111827",
    fontSize: 15,
    fontWeight: "800",
  },
  description: {
    color: "#6B7280",
    fontSize: 13,
    lineHeight: 18,
  },
  actionButton: {
    marginTop: 15,
    minHeight: 48,
    borderRadius: 16,
    backgroundColor: colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    columnGap: 6,
  },
  actionButtonSelected: {
    backgroundColor: "#EEF2FF",
  },
  actionText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "900",
  },
  actionTextSelected: {
    color: colors.primary,
  },
});
