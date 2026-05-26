import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors } from "../../../shared/theme/colors";

const filters = [
  { id: "todos", label: "Todo" },
  { id: "equipo", label: "Equipos" },
  { id: "orden", label: "Órdenes" },
];

export function ClientHistoryFilter({ value, onChange }) {
  return (
    <View style={styles.container}>
      {filters.map((filter) => {
        const selected = value === filter.id;

        return (
          <Pressable
            key={filter.id}
            onPress={() => onChange?.(filter.id)}
            style={[styles.chip, selected && styles.chipSelected]}
          >
            <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
              {filter.label}
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
    height: 42,
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
    fontSize: 13,
    fontWeight: "900",
  },
  chipTextSelected: {
    color: "#FFFFFF",
  },
});