import { StyleSheet, Text, View } from "react-native";

import { colors } from "../../../shared/theme/colors";

export function TotalQuotationBox({ total }) {
  return (
    <View style={styles.box}>
      <Text style={styles.label}>Total a pagar</Text>
      <Text style={styles.total}>Bs. {total.toFixed(2)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    borderRadius: 18,
    backgroundColor: colors.primary,
    padding: 18,
    marginTop: 4,
    marginBottom: 16,
  },
  label: {
    color: "#E7E7FF",
    fontSize: 13,
    fontWeight: "800",
  },
  total: {
    marginTop: 4,
    color: "#FFFFFF",
    fontSize: 32,
    lineHeight: 38,
    fontWeight: "900",
  },
});
