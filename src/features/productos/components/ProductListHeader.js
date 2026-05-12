import { StyleSheet, Text, View } from "react-native";

export function ProductListHeader({ count }) {
  return (
    <View style={styles.listHeader}>
      <Text style={styles.listTitle}>Productos registrados</Text>
      <Text style={styles.listCount}>{count}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  listHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  listTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#111827",
  },
  listCount: {
    fontSize: 13,
    fontWeight: "700",
    color: "#6B7280",
  },
});
