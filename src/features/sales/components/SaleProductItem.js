import { Platform, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { colors } from "../../../shared/theme/colors";
import { fontFamilies } from "../../../shared/theme/fonts";
import { formatCurrency } from "../services/salesApi";

export function SaleProductItem({
  product,
  quantity = 0,
  error,
  onIncrement,
  onDecrement,
  onChangeQuantity,
}) {
  const isSelected = quantity > 0;

  return (
    <View style={[styles.card, isSelected && styles.cardSelected]}>
      <View style={styles.info}>
        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.meta}>{product.category || "Inventario"} · Stock {product.stock}</Text>
        <Text style={styles.price}>{formatCurrency(product.price)}</Text>
        {!!error && <Text style={styles.errorText}>{error}</Text>}
      </View>

      <View style={styles.counter}>
        <Pressable
          style={[styles.counterBtn, quantity === 0 && styles.counterBtnDisabled]}
          onPress={onDecrement}
          disabled={quantity === 0}
        >
          <Ionicons
            name="remove"
            size={18}
            color={quantity === 0 ? "#B6B6BF" : "#FFFFFF"}
          />
        </Pressable>

        <TextInput
          value={String(quantity || "")}
          onChangeText={onChangeQuantity}
          keyboardType="number-pad"
          style={styles.quantityInput}
          placeholder="0"
          placeholderTextColor="#9CA3AF"
        />

        <Pressable style={styles.counterBtn} onPress={onIncrement}>
          <Ionicons name="add" size={18} color="#FFFFFF" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#EFEFF5",
  },
  cardSelected: {
    borderColor: colors.primary,
    backgroundColor: "#F4F3FF",
  },
  info: {
    flex: 1,
    paddingRight: 12,
  },
  name: {
    color: "#15151A",
    fontFamily: fontFamilies.semibold,
    fontSize: 15,
  },
  meta: {
    marginTop: 4,
    color: "#8B8B96",
    fontFamily: fontFamilies.medium,
    fontSize: 12,
  },
  price: {
    marginTop: 6,
    color: colors.primary,
    fontFamily: fontFamilies.bold,
    fontSize: 16,
  },
  errorText: {
    marginTop: 6,
    color: "#D14343",
    fontFamily: fontFamilies.medium,
    fontSize: 12,
  },
  counter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
  },
  counterBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  counterBtnDisabled: {
    backgroundColor: "#ECECF2",
  },
  quantityInput: {
    minWidth: 48,
    height: 38,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
    textAlign: "center",
    color: "#111111",
    fontFamily: fontFamilies.bold,
    fontSize: 16,
    lineHeight: 20,
    paddingHorizontal: 4,
    paddingVertical: Platform.OS === "android" ? 0 : 6,
    textAlignVertical: "center",
    includeFontPadding: false,
  },
});
