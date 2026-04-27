import { Pressable, StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { StatusBadge } from "./StatusBadge";

export function OrderCard({ order, onPress }) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.iconBox}>
          <MaterialCommunityIcons name="clipboard-text-outline" size={22} color="#FFFFFF" />
        </View>

        <View style={styles.info}>
          <Text style={styles.code}>{order.code}</Text>
          <Text style={styles.client}>{order.clientName}</Text>
        </View>

        <MaterialCommunityIcons name="chevron-right" size={24} color="#9CA3AF" />
      </View>

      <Text style={styles.equipment}>{order.equipmentName}</Text>
      <Text style={styles.failure} numberOfLines={2}>
        Falla: {order.failure}
      </Text>

      <View style={styles.footer}>
        <StatusBadge status={order.status} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 16,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#5655B9",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  code: {
    fontSize: 16,
    fontWeight: "800",
    color: "#111827",
  },
  client: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 2,
  },
  equipment: {
    marginTop: 14,
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
  },
  failure: {
    marginTop: 6,
    fontSize: 13,
    color: "#6B7280",
    lineHeight: 18,
  },
  footer: {
    marginTop: 12,
  },
});