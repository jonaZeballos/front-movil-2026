import { StyleSheet, Text, View } from "react-native";

export function NotificationBadge({ count = 0 }) {
  if (!count) return null;

  return (
    <View style={styles.badge}>
      <Text style={styles.text}>{count > 9 ? "9+" : count}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: "absolute",
    top: -4,
    right: -4,
    minWidth: 17,
    height: 17,
    borderRadius: 9,
    backgroundColor: "#EF4444",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: "#FFFFFF",
  },
  text: {
    color: "#FFFFFF",
    fontSize: 9,
    fontWeight: "900",
  },
});