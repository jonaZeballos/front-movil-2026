import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export function NotificationEmptyState() {
  return (
    <View style={styles.card}>
      <Ionicons name="notifications-off-outline" size={44} color="#9CA3AF" />
      <Text style={styles.title}>Sin notificaciones</Text>
      <Text style={styles.text}>
        Las alertas del sistema aparecerán aquí cuando exista actividad nueva.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: 60,
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    rowGap: 10,
  },
  title: {
    color: "#111827",
    fontSize: 18,
    fontWeight: "900",
  },
  text: {
    color: "#6B7280",
    fontSize: 13,
    lineHeight: 19,
    textAlign: "center",
  },
});