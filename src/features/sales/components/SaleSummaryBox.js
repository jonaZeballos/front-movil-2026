import { StyleSheet, Text, View } from "react-native";

import { fontFamilies } from "../../../shared/theme/fonts";
import { formatCurrency } from "../data/salesMock";

export function SaleSummaryBox({ subtotal, discount, total }) {
  return (
    <View style={styles.box}>
      <Text style={styles.title}>Resumen de venta</Text>

      <View style={styles.row}>
        <Text style={styles.label}>Subtotal</Text>
        <Text style={styles.value}>{formatCurrency(subtotal)}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Descuento</Text>
        <Text style={styles.value}>- {formatCurrency(discount)}</Text>
      </View>

      <View style={styles.separator} />

      <View style={styles.row}>
        <Text style={styles.totalLabel}>Total</Text>
        <Text style={styles.totalValue}>{formatCurrency(total)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "#EFEFF5",
  },
  title: {
    marginBottom: 12,
    color: "#111111",
    fontFamily: fontFamilies.bold,
    fontSize: 17,
  },
  row: {
    marginBottom: 9,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    color: "#777782",
    fontFamily: fontFamilies.medium,
    fontSize: 14,
  },
  value: {
    color: "#22222A",
    fontFamily: fontFamilies.semibold,
    fontSize: 14,
  },
  separator: {
    height: 1,
    backgroundColor: "#EFEFF5",
    marginVertical: 8,
  },
  totalLabel: {
    color: "#111111",
    fontFamily: fontFamilies.bold,
    fontSize: 18,
  },
  totalValue: {
    color: "#2386F5",
    fontFamily: fontFamilies.bold,
    fontSize: 22,
  },
});