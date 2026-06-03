import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { fontFamilies } from "../../../shared/theme/fonts";
import { formatCurrency } from "../services/salesApi";
import {
  getReceiptClientEmailText,
  getReceiptClientName,
  getReceiptClientPhone,
  getReceiptDate,
  getReceiptNumber,
  getReceiptPaymentLabel,
  getReceiptProducts,
  getReceiptSeller,
} from "../services/receiptFormatters";

export function ElectronicReceiptCard({ receipt }) {
  if (!receipt) return null;

  const products = getReceiptProducts(receipt);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.iconWrap}>
          <Ionicons name="receipt-outline" size={30} color="#FFFFFF" />
        </View>

        <View>
          <Text style={styles.title}>Comprobante de venta</Text>
          <Text style={styles.number}>{getReceiptNumber(receipt)}</Text>
        </View>
      </View>

      <View style={styles.statusPill}>
        <Ionicons name="checkmark-circle" size={15} color="#10B981" />
        <Text style={styles.statusText}>{receipt.status || "Emitido"}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Cliente</Text>
        <Text style={styles.mainText}>{getReceiptClientName(receipt)}</Text>
        <Text style={styles.mutedText}>{getReceiptClientEmailText(receipt)}</Text>
        <Text style={styles.mutedText}>{getReceiptClientPhone(receipt)}</Text>
        <Text style={styles.mutedText}>Venta realizada por: {getReceiptSeller(receipt)}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Detalle</Text>

        {products.map((item) => (
          <View key={item.id || item.productoId || item.name} style={styles.productRow}>
            <View style={styles.productInfo}>
              <Text style={styles.productName}>{item.name || item.nombre || "Producto"}</Text>
              <Text style={styles.mutedText}>
                {item.quantity || item.cantidad || 0} x {formatCurrency(item.unitPrice || item.precioUnitario)}
              </Text>
            </View>

            <Text style={styles.productTotal}>{formatCurrency(item.total || item.subtotal)}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Subtotal</Text>
          <Text style={styles.totalText}>{formatCurrency(receipt.subtotal)}</Text>
        </View>

        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Descuento</Text>
          <Text style={styles.totalText}>- {formatCurrency(receipt.descuento)}</Text>
        </View>

        <View style={styles.separator} />

        <View style={styles.totalRow}>
          <Text style={styles.grandTotalLabel}>Total pagado</Text>
          <Text style={styles.grandTotal}>{formatCurrency(receipt.total)}</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Metodo de pago: {getReceiptPaymentLabel(receipt)}</Text>
        <Text style={styles.footerText}>Emitido: {getReceiptDate(receipt)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: "#EFEFF5",
  },
  header: { flexDirection: "row", alignItems: "center", gap: 12 },
  iconWrap: {
    width: 54,
    height: 54,
    borderRadius: 18,
    backgroundColor: "#2386F5",
    alignItems: "center",
    justifyContent: "center",
  },
  title: { color: "#111111", fontFamily: fontFamilies.bold, fontSize: 20 },
  number: { marginTop: 2, color: "#777782", fontFamily: fontFamilies.medium, fontSize: 13 },
  statusPill: {
    alignSelf: "flex-start",
    marginTop: 14,
    backgroundColor: "#ECFDF5",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  statusText: { color: "#10B981", fontFamily: fontFamilies.bold, fontSize: 12 },
  section: { marginTop: 18 },
  sectionTitle: { marginBottom: 8, color: "#111111", fontFamily: fontFamilies.bold, fontSize: 15 },
  mainText: { color: "#22222A", fontFamily: fontFamilies.semibold, fontSize: 15 },
  mutedText: { marginTop: 2, color: "#8B8B96", fontFamily: fontFamilies.medium, fontSize: 12 },
  productRow: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F5",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  productInfo: { flex: 1 },
  productName: { color: "#22222A", fontFamily: fontFamilies.semibold, fontSize: 14 },
  productTotal: { color: "#111111", fontFamily: fontFamilies.bold, fontSize: 14 },
  totalRow: { marginBottom: 9, flexDirection: "row", justifyContent: "space-between" },
  totalLabel: { color: "#777782", fontFamily: fontFamilies.medium, fontSize: 14 },
  totalText: { color: "#22222A", fontFamily: fontFamilies.semibold, fontSize: 14 },
  separator: { height: 1, backgroundColor: "#EFEFF5", marginVertical: 8 },
  grandTotalLabel: { color: "#111111", fontFamily: fontFamilies.bold, fontSize: 17 },
  grandTotal: { color: "#2386F5", fontFamily: fontFamilies.bold, fontSize: 22 },
  footer: { marginTop: 18, backgroundColor: "#F8F8FB", borderRadius: 16, padding: 12 },
  footerText: { color: "#777782", fontFamily: fontFamilies.medium, fontSize: 12, marginBottom: 3 },
});
