import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import {
  formatReportCurrency,
  formatReportDate,
  getPaymentLabel,
  getReportClientName,
} from "../services";

export function SalesReportList({ ventas = [] }) {
  if (ventas.length === 0) {
    return (
      <View style={styles.emptyCard}>
        <Ionicons name="receipt-outline" size={40} color="#9CA3AF" />
        <Text style={styles.emptyTitle}>Sin ventas registradas</Text>
        <Text style={styles.emptyText}>
          Las ventas confirmadas aparecerán en este reporte.
        </Text>
      </View>
    );
  }

  return ventas.map((venta) => (
    <View key={venta.id || venta.number} style={styles.card}>
      <View style={styles.row}>
        <View style={styles.info}>
          <Text style={styles.title}>{venta.number || venta.numero || "Recibo"}</Text>
          <Text style={styles.subtitle}>{getReportClientName(venta.cliente)}</Text>
        </View>

        <Text style={styles.amount}>{formatReportCurrency(venta.total)}</Text>
      </View>

      <View style={styles.metaRow}>
        <Text style={styles.meta}>{getPaymentLabel(venta.metodoPago)}</Text>
        <Text style={styles.meta}>{formatReportDate(venta.issuedAt || venta.createdAt)}</Text>
      </View>
    </View>
  ));
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 14,
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    columnGap: 12,
  },
  info: {
    flex: 1,
  },
  title: {
    color: "#111827",
    fontSize: 15,
    fontWeight: "900",
  },
  subtitle: {
    marginTop: 3,
    color: "#6B7280",
    fontSize: 13,
  },
  amount: {
    color: "#2386F5",
    fontSize: 16,
    fontWeight: "900",
  },
  metaRow: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  meta: {
    color: "#9CA3AF",
    fontSize: 12,
    fontWeight: "700",
  },
  emptyCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 22,
    alignItems: "center",
    rowGap: 9,
  },
  emptyTitle: {
    color: "#111827",
    fontSize: 17,
    fontWeight: "900",
  },
  emptyText: {
    color: "#6B7280",
    fontSize: 13,
    textAlign: "center",
    lineHeight: 19,
  },
});