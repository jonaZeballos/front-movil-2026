import { StyleSheet, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

import { colors } from "../../../shared/theme/colors";

export function ProductCard({ product }) {
  return (
    <View style={styles.card}>
      <View style={styles.cardRow}>
        <View style={styles.iconBox}>
          <MaterialIcons name="inventory" size={22} color="#FFFFFF" />
        </View>
        <View style={styles.cardInfo}>
          <Text style={styles.cardName}>{product.nombre}</Text>
          <Text style={styles.cardSub}>
            Marca: {product.marca} - Modelo: {product.modelo}
          </Text>
        </View>
      </View>
      <View style={styles.cardBottom}>
        <Text style={[styles.cardDetail, product.stockBajo && styles.lowStock]}>
          Stock: {product.stock} unidades
        </Text>
        <Text style={styles.priceText}>
          {product.precioTexto || `Bs. ${Number(product.precio || 0).toFixed(2)}`}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 16,
    marginBottom: 14,
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  cardInfo: {
    flex: 1,
  },
  cardName: {
    fontSize: 15,
    fontWeight: "800",
    color: "#111827",
  },
  cardSub: {
    marginTop: 3,
    fontSize: 13,
    color: "#6B7280",
  },
  cardBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardDetail: {
    fontSize: 13,
    color: "#374151",
  },
  priceText: {
    fontSize: 14,
    fontWeight: "900",
    color: colors.primary,
  },
  lowStock: {
    color: "#DC2626",
    fontWeight: "800",
  },
});
