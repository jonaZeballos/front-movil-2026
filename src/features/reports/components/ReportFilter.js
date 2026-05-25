import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors } from "../../../shared/theme/colors";
import { reportPeriods } from "../data/reportsMock";

export function ReportFilter({ value, onChange }) {
  return (
    <View style={styles.container}>
      {reportPeriods.map((period) => {
        const selected = value === period.id;

        return (
          <Pressable
            key={period.id}
            onPress={() => onChange?.(period.id)}
            style={[styles.chip, selected && styles.chipSelected]}
          >
            <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
              {period.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    columnGap: 8,
    marginBottom: 14,
  },
  chip: {
    flex: 1,
    height: 40,
    borderRadius: 999,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
  },
  chipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    color: "#6B7280",
    fontSize: 12,
    fontWeight: "900",
  },
  chipTextSelected: {
    color: "#FFFFFF",
  },
});