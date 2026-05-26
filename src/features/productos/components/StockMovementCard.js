import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { getStockMovementLabel } from "../services";

export function StockMovementCard({ movement }) {
  if (!movement) return null;

  const iconName = getIconName(movement.type);
  const color = getColor(movement.type);

  return (
    <View style={styles.card}>
      <View style={[styles.iconBox, { backgroundColor: color }]}>
        <Ionicons name={iconName} size={20} color="#FFFFFF" />
      </View>

      <View style={styles.info}>
        <Text style={styles.title}>{getStockMovementLabel(movement.type)}</Text>
        <Text style={styles.subtitle}>{movement.productName}</Text>
        <Text style={styles.reason}>{movement.reason}</Text>
      </View>

      <View style={styles.amountBox}>
        <Text style={[styles.amount, { color }]}>
          {movement.type === "salida" ? "-" : "+"}
          {movement.quantity}
        </Text>
      </View>
    </View>
  );
}

function getIconName(type) {
  if (type === "entrada") return "arrow-down-circle-outline";
  if (type === "salida") return "arrow-up-circle-outline";
  return "create-outline";
}

function getColor(type) {
  if (type === "entrada") return "#059669";
  if (type === "salida") return "#DC2626";
  return "#2563EB";
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 14,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  title: {
    color: "#111827",
    fontSize: 14,
    fontWeight: "900",
  },
  subtitle: {
    marginTop: 2,
    color: "#4B5563",
    fontSize: 12,
    fontWeight: "700",
  },
  reason: {
    marginTop: 2,
    color: "#6B7280",
    fontSize: 12,
  },
  amountBox: {
    marginLeft: 8,
  },
  amount: {
    fontSize: 16,
    fontWeight: "900",
  },
});