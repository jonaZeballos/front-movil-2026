import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { fontFamilies } from "../../../shared/theme/fonts";
import { paymentMethods } from "../data/salesMock";

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
                color={isSelected ? "#FFFFFF" : "#2386F5"}
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
    borderColor: "#2386F5",
    backgroundColor: "#F4F8FF",
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
    backgroundColor: "#2386F5",
  },
  label: {
    marginTop: 8,
    color: "#777782",
    fontFamily: fontFamilies.medium,
    fontSize: 11,
    textAlign: "center",
  },
  labelSelected: {
    color: "#2386F5",
    fontFamily: fontFamilies.bold,
  },
});