import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { fontFamilies } from "../../../shared/theme/fonts";
import { formatCurrency } from "../data/salesMock";

export function SaleProductItem({
  product,
  quantity = 0,
  onIncrement,
  onDecrement,
}) {
  const isSelected = quantity > 0;

  return (
    <View style={[styles.card, isSelected && styles.cardSelected]}>
      <View style={styles.info}>
        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.meta}>
          {product.category} · Stock {product.stock}
        </Text>
        <Text style={styles.price}>{formatCurrency(product.price)}</Text>
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

        <Text style={styles.quantity}>{quantity}</Text>

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
    borderColor: "#2386F5",
    backgroundColor: "#F4F8FF",
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
    color: "#2386F5",
    fontFamily: fontFamilies.bold,
    fontSize: 16,
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
    backgroundColor: "#2386F5",
    alignItems: "center",
    justifyContent: "center",
  },
  counterBtnDisabled: {
    backgroundColor: "#ECECF2",
  },
  quantity: {
    minWidth: 20,
    textAlign: "center",
    color: "#111111",
    fontFamily: fontFamilies.bold,
    fontSize: 16,
  },
});