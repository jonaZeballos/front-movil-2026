import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { colors } from "../../../shared/theme/colors";
import { fontFamilies } from "../../../shared/theme/fonts";
import { paymentMethods } from "../services/salesApi";

export function PaymentMethodSelector({ value, onChange }) {
  return (
    <View style={styles.grid}>
      {paymentMethods.map((method) => {
        const isSelected = value?.id === method.id;

        return (
          <Pressable
            key={method.id}
            style={[styles.card, isSelected && styles.cardSelected]}
            onPress={() => onChange(method)}
          >
            <View style={[styles.iconWrap, isSelected && styles.iconWrapSelected]}>
              <Ionicons
                name={method.iconName}
                size={21}
                color={isSelected ? "#FFFFFF" : colors.primary}
              />
            </View>

            <Text style={[styles.label, isSelected && styles.labelSelected]}>
              {method.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  card: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingVertical: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#EFEFF5",
  },
  cardSelected: {
    borderColor: colors.primary,
    backgroundColor: "#F4F3FF",
  },
  iconWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#EEF5FF",
    alignItems: "center",
    justifyContent: "center",
  },
  iconWrapSelected: {
    backgroundColor: colors.primary,
  },
  label: {
    marginTop: 8,
    color: "#777782",
    fontFamily: fontFamilies.medium,
    fontSize: 11,
    textAlign: "center",
  },
  labelSelected: {
    color: colors.primary,
    fontFamily: fontFamilies.bold,
  },
});
