import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { formatReportDate } from "../services";

export function ServicesReportList({ ordenes = [] }) {
  if (ordenes.length === 0) {
    return (
      <View style={styles.emptyCard}>
        <Ionicons name="construct-outline" size={40} color="#9CA3AF" />
        <Text style={styles.emptyTitle}>Sin servicios registrados</Text>
        <Text style={styles.emptyText}>
          Las órdenes de servicio aparecerán en este reporte.
        </Text>
      </View>
    );
  }

  return ordenes.map((orden) => (
    <View key={orden.id} style={styles.card}>
      <View style={styles.row}>
        <View style={styles.info}>
          <Text style={styles.title}>{orden.code || orden.codigo || `Orden ${orden.id}`}</Text>
          <Text style={styles.subtitle}>
            {orden.clientName || orden.cliente?.nombre || "Cliente no registrado"}
          </Text>
        </View>

        <View style={styles.statusPill}>
          <Text style={styles.statusText}>{orden.status || orden.estado || "Sin estado"}</Text>
        </View>
      </View>

      <Text style={styles.description}>
        {orden.failure || orden.diagnostico || orden.descripcion || "Sin diagnóstico"}
      </Text>

      <Text style={styles.date}>
        {formatReportDate(orden.createdAt || orden.fecha || orden.updatedAt)}
      </Text>
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
    columnGap: 10,
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
  statusPill: {
    alignSelf: "flex-start",
    borderRadius: 999,
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  statusText: {
    color: "#5655B9",
    fontSize: 11,
    fontWeight: "900",
  },
  description: {
    marginTop: 10,
    color: "#374151",
    fontSize: 13,
    lineHeight: 18,
  },
  date: {
    marginTop: 8,
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