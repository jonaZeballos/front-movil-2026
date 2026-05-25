import { StyleSheet, Text, View } from "react-native";

import { getStockStatus } from "../services";

export function StockBadge({ product, stock, minStock }) {
  const fakeProduct = product || { stock };
  const status = getStockStatus(fakeProduct, minStock);

  return (
    <View style={[styles.badge, { backgroundColor: status.backgroundColor }]}>
      <Text style={[styles.badgeText, { color: status.color }]}>
        {status.label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "900",
  },
});