import { StyleSheet, Text, View } from "react-native";

import { colors } from "../../../shared/theme/colors";
import { fontFamilies } from "../../../shared/theme/fonts";

const weekLabels = ["L", "M", "M", "J", "V", "S", "D"];

export function SalesChartCard({ data }) {
  return (
    <View style={styles.chartCard}>
      <View style={styles.chartHeader}>
        <View>
          <Text style={styles.chartTitle}>Estadisticas de ventas</Text>
          <Text style={styles.chartSubtitle}>Movimiento semanal</Text>
        </View>

        <View style={styles.chartBadge}>
          <Text style={styles.chartBadgeText}>+18%</Text>
        </View>
      </View>

      <View style={styles.chartBars}>
        {data.map((height, index) => (
          <View key={index} style={styles.barWrap}>
            <View style={[styles.bar, { height }]} />
            <Text style={styles.barLabel}>{weekLabels[index]}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  chartCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 14,
    marginBottom: 12,
  },
  chartHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  chartTitle: {
    fontFamily: fontFamilies.semibold,
    fontSize: 16,
    color: "#111111",
  },
  chartSubtitle: {
    marginTop: 2,
    fontFamily: fontFamilies.regular,
    fontSize: 12,
    color: "#7A7A82",
  },
  chartBadge: {
    backgroundColor: "#E9F8F1",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  chartBadgeText: {
    color: "#29B45A",
    fontFamily: fontFamilies.bold,
    fontSize: 12,
  },
  chartBars: {
    height: 110,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  barWrap: {
    alignItems: "center",
    justifyContent: "flex-end",
  },
  bar: {
    width: 20,
    borderRadius: 999,
    backgroundColor: colors.primary,
  },
  barLabel: {
    marginTop: 6,
    fontFamily: fontFamilies.medium,
    fontSize: 11,
    color: "#7A7A82",
  },
});
