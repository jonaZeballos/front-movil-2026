import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { colors } from "../../../shared/theme/colors";

export function ReportSummaryCard({
  title,
  value,
  subtitle,
  iconName = "stats-chart-outline",
  color = colors.primary,
}) {
  return (
    <View style={styles.card}>
      <View style={[styles.iconBox, { backgroundColor: color }]}>
        <Ionicons name={iconName} size={21} color="#FFFFFF" />
      </View>

      <View style={styles.info}>
        <Text style={styles.title}>{title}</Text>
        <Text style={[styles.value, { color }]}>{value}</Text>
        {!!subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 14,
    minHeight: 118,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  info: {
    flex: 1,
  },
  title: {
    color: "#6B7280",
    fontSize: 12,
    fontWeight: "800",
  },
  value: {
    marginTop: 4,
    fontSize: 20,
    fontWeight: "900",
  },
  subtitle: {
    marginTop: 3,
    color: "#9CA3AF",
    fontSize: 11,
    fontWeight: "700",
  },
});