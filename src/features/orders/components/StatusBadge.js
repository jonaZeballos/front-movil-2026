import { StyleSheet, Text, View } from "react-native";

const statusColors = {
  Recibido: { bg: "#E5E7EB", text: "#374151" },
  "En diagnóstico": { bg: "#FEF3C7", text: "#92400E" },
  Cotizado: { bg: "#DBEAFE", text: "#1D4ED8" },
  "En reparación": { bg: "#FFEDD5", text: "#C2410C" },
  Listo: { bg: "#DCFCE7", text: "#166534" },
  Entregado: { bg: "#BBF7D0", text: "#14532D" },
  "Sin solución": { bg: "#FEE2E2", text: "#B91C1C" },
};

export function StatusBadge({ status }) {
  const color = statusColors[status] || statusColors.Recibido;

  return (
    <View style={[styles.badge, { backgroundColor: color.bg }]}>
      <Text style={[styles.text, { color: color.text }]}>{status}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  text: {
    fontSize: 12,
    fontWeight: "700",
  },
});