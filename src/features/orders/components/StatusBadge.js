import { StyleSheet, Text, View } from "react-native";

import { getOrderStateColor, getOrderStateLabel } from "../utils/orderStates";

export function StatusBadge({ status }) {
  const color = getOrderStateColor(status);
  const label = getOrderStateLabel(status);

  return (
    <View style={[styles.badge, { backgroundColor: color.bg }]}>
      <Text style={[styles.text, { color: color.text }]}>{label}</Text>
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
