import { StyleSheet, Text, View } from "react-native";

export function QuotationOrderInfoCard({ order }) {
  return (
    <View style={styles.card}>
      <Text style={styles.eyebrow}>Orden seleccionada</Text>
      <Text style={styles.code}>{order.codigo}</Text>

      <InfoRow label="Cliente" value={order.cliente} />
      <InfoRow label="Equipo" value={order.equipo} />
      <InfoRow label="Falla reportada" value={order.falla} />
      <InfoRow label="Diagnostico" value={order.diagnostico} />
    </View>
  );
}

function InfoRow({ label, value }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: "800",
    color: "#6B7280",
    textTransform: "uppercase",
  },
  code: {
    marginTop: 4,
    marginBottom: 10,
    fontSize: 22,
    fontWeight: "900",
    color: "#111827",
  },
  row: {
    paddingVertical: 9,
    borderTopWidth: 1,
    borderTopColor: "#F0F1F5",
  },
  label: {
    fontSize: 12,
    fontWeight: "800",
    color: "#6B7280",
  },
  value: {
    marginTop: 3,
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
    lineHeight: 19,
  },
});
