import { Pressable, StyleSheet, Text } from "react-native";

import { fontFamilies } from "../../../shared/theme/fonts";

export function SalesOptionCard({ item, onPress }) {
  const IconPack = item.iconPack;

  return (
    <Pressable style={styles.optionCard} onPress={onPress}>
      <IconPack name={item.iconName} size={22} color={item.iconColor} />
      <Text style={styles.optionLabel}>{item.label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  optionCard: {
    width: "31.5%",
    backgroundColor: "#F5F5F7",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    minHeight: 78,
  },
  optionLabel: {
    marginTop: 7,
    color: "#7A7A82",
    fontFamily: fontFamilies.medium,
    fontSize: 12,
  },
});
