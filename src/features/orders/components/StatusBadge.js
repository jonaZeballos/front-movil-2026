import { StyleSheet, Text, View } from "react-native";

const statusColors = {
  Recibido: { bg: "#E5E7EB", text: "#374151" },
  Cotizado: { bg: "#DBEAFE", text: "#1D4ED8" },
  Listo: { bg: "#DCFCE7", text: "#166534" },
  Entregado: { bg: "#BBF7D0", text: "#14532D" },
  "Sin solucion": { bg: "#FEE2E2", text: "#B91C1C" },
  Anulado: { bg: "#F3F4F6", text: "#4B5563" },
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
