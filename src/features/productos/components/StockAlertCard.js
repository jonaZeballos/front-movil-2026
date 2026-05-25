import { Pressable, StyleSheet, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

import { colors } from "../../../shared/theme/colors";
import { getProductStock } from "../services";
import { StockBadge } from "./StockBadge";

export function StockAlertCard({ product, onPress }) {
  const stock = getProductStock(product);

  return (
    <Pressable
      onPress={() => onPress?.(product)}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.iconBox}>
        <MaterialIcons name="inventory-2" size={22} color="#FFFFFF" />
      </View>

      <View style={styles.info}>
        <Text style={styles.name}>{product.nombre}</Text>
        <Text style={styles.description}>
          Marca: {product.marca || "Sin marca"} · Modelo: {product.modelo || "Sin modelo"}
        </Text>

        <View style={styles.bottomRow}>
          <Text style={styles.stockText}>Stock actual: {stock}</Text>
          <StockBadge product={product} />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 15,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  pressed: {
    opacity: 0.9,
  },
  iconBox: {
    width: 46,
    height: 46,
    borderRadius: 15,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 15,
    fontWeight: "900",
    color: "#111827",
  },
  description: {
    marginTop: 3,
    fontSize: 12,
    color: "#6B7280",
  },
  bottomRow: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  stockText: {
    fontSize: 13,
    fontWeight: "800",
    color: "#374151",
  },
});