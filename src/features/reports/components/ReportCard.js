import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { colors } from "../../../shared/theme/colors";

export function ReportCard({
  title,
  description,
  iconName,
  color = colors.primary,
  onPress,
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={[styles.iconBox, { backgroundColor: color }]}>
        <Ionicons name={iconName} size={24} color="#FFFFFF" />
      </View>

      <View style={styles.info}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>

      <Ionicons name="chevron-forward" size={22} color="#9CA3AF" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  pressed: {
    opacity: 0.88,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  title: {
    color: "#111827",
    fontSize: 16,
    fontWeight: "900",
  },
  description: {
    marginTop: 3,
    color: "#6B7280",
    fontSize: 13,
    lineHeight: 18,
  },
});