import { StyleSheet, Text, View } from "react-native";

import { fontFamilies } from "../../../shared/theme/fonts";

export function SalesMetricCard({ item }) {
  const IconPack = item.iconPack;

  return (
    <View style={styles.salesCard}>
      <View style={styles.cardTop}>
        <View style={[styles.iconBox, { backgroundColor: item.iconBg }]}>
          <IconPack name={item.iconName} size={15} color="#FFFFFF" />
        </View>
        <Text style={styles.cardTitle}>{item.title}</Text>
      </View>

      <View style={styles.metricRow}>
        <Text
          style={[
            styles.metricValue,
            item.value.length > 4 && styles.metricValueSmall,
          ]}
        >
          {item.value}
        </Text>
        <Text style={styles.metricLabel}>{item.label}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  salesCard: {
    flex: 1,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 10,
    paddingVertical: 10,
    elevation: 3,
  },
  cardTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    marginBottom: 4,
  },
  iconBox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  cardTitle: {
    color: "#111111",
    fontFamily: fontFamilies.semibold,
    fontSize: 12,
    lineHeight: 13,
    flexShrink: 1,
  },
  metricRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 4,
  },
  metricValue: {
    fontFamily: fontFamilies.bold,
    fontSize: 26,
    lineHeight: 34,
    color: "#101010",
  },
  metricValueSmall: {
    fontSize: 18,
  },
  metricLabel: {
    fontFamily: fontFamilies.medium,
    fontSize: 13,
    color: "#212121",
    marginBottom: 5,
  },
});
