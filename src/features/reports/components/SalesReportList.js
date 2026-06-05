import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import {
  formatReportCurrency,
  formatReportDate,
  getPaymentLabel,
  getReportClientName,
  normalizeReportSale,
} from "../services";

export function SalesReportList({ ventas = [] }) {
  const [expandedId, setExpandedId] = useState(null);
  const normalizedVentas = ventas.map(normalizeReportSale);

  if (normalizedVentas.length === 0) {
    return (
      <View style={styles.emptyCard}>
        <Ionicons name="receipt-outline" size={40} color="#9CA3AF" />
        <Text style={styles.emptyTitle}>Sin ventas registradas</Text>
        <Text style={styles.emptyText}>
          Las ventas confirmadas apareceran en este reporte.
        </Text>
      </View>
    );
  }

  return normalizedVentas.map((venta) => {
    const cardId = String(venta.id || venta.reciboCodigo || venta.number);
    const isExpanded = expandedId === cardId;
    const productos = venta.productos || [];

    return (
      <Pressable
        key={cardId}
        style={styles.card}
        onPress={() => setExpandedId(isExpanded ? null : cardId)}
      >
        <View style={styles.row}>
          <View style={styles.info}>
            <Text style={styles.title}>{venta.reciboCodigo || venta.number || "Recibo"}</Text>
            <Text style={styles.subtitle}>{getReportClientName(venta.cliente)}</Text>
          </View>

          <View style={styles.amountGroup}>
            <Text style={styles.amount}>{formatReportCurrency(venta.total)}</Text>
            <Ionicons
              name={isExpanded ? "chevron-up" : "chevron-down"}
              size={18}
              color="#6B7280"
            />
          </View>
        </View>

        <View style={styles.metaRow}>
          <Text style={styles.meta}>{getPaymentLabel(venta.metodoPago)}</Text>
          <Text style={styles.meta}>{formatReportDate(venta.issuedAt || venta.createdAt)}</Text>
        </View>

        <View style={styles.receiptRow}>
          <InfoPill icon="cube-outline" text={`${venta.totalProductos || 0} productos`} />
          <InfoPill icon="document-text-outline" text="Recibo emitido" />
        </View>

        {isExpanded ? (
          <View style={styles.detailBox}>
            <DetailRow label="Subtotal" value={formatReportCurrency(venta.subtotal)} />
            <DetailRow label="Descuento" value={formatReportCurrency(venta.descuento)} />
            <DetailRow label="Total" value={formatReportCurrency(venta.total)} strong />

            <Text style={styles.detailTitle}>Productos vendidos</Text>
            {productos.length === 0 ? (
              <Text style={styles.mutedText}>No hay productos registrados en esta venta.</Text>
            ) : (
              productos.map((item) => (
                <View key={`${cardId}-${item.id || item.productoId || item.nombre}`} style={styles.productRow}>
                  <View style={styles.productInfo}>
                    <Text style={styles.productName}>{item.nombre || item.name || "Producto"}</Text>
                    <Text style={styles.productMeta}>
                      {item.cantidad || item.quantity || 0} x {formatReportCurrency(item.precioUnitario || item.unitPrice)}
                    </Text>
                  </View>
                  <Text style={styles.productTotal}>{formatReportCurrency(item.subtotal || item.total)}</Text>
                </View>
              ))
            )}
          </View>
        ) : null}
      </Pressable>
    );
  });
}

function InfoPill({ icon, text }) {
  return (
    <View style={styles.infoPill}>
      <Ionicons name={icon} size={14} color="#5655B9" />
      <Text style={styles.infoPillText}>{text}</Text>
    </View>
  );
}

function DetailRow({ label, value, strong = false }) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={[styles.detailValue, strong && styles.detailValueStrong]}>{value}</Text>
    </View>
  );
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
  amountGroup: {
    alignItems: "flex-end",
    rowGap: 4,
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
  receiptRow: {
    marginTop: 12,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  infoPill: {
    borderRadius: 999,
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 10,
    paddingVertical: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  infoPillText: {
    color: "#5655B9",
    fontSize: 11,
    fontWeight: "900",
  },
  detailBox: {
    marginTop: 14,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    paddingTop: 12,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
  },
  detailLabel: {
    color: "#6B7280",
    fontSize: 13,
    fontWeight: "700",
  },
  detailValue: {
    color: "#111827",
    fontSize: 13,
    fontWeight: "800",
  },
  detailValueStrong: {
    color: "#2386F5",
    fontSize: 15,
    fontWeight: "900",
  },
  detailTitle: {
    marginTop: 12,
    marginBottom: 8,
    color: "#111827",
    fontSize: 14,
    fontWeight: "900",
  },
  productRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    columnGap: 10,
    paddingVertical: 9,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    color: "#111827",
    fontSize: 13,
    fontWeight: "900",
  },
  productMeta: {
    marginTop: 2,
    color: "#6B7280",
    fontSize: 12,
    fontWeight: "700",
  },
  productTotal: {
    color: "#111827",
    fontSize: 13,
    fontWeight: "900",
  },
  mutedText: {
    color: "#6B7280",
    fontSize: 13,
    lineHeight: 18,
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
