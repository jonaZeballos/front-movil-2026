import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { ScreenContainer } from "../../../shared/components/ScreenContainer";
import { colors } from "../../../shared/theme/colors";
import { getLowStockProducts } from "../services";
import { StockAlertCard } from "../components/StockAlertCard";

export default function StockControlScreen({
  navigation,
  productos = [],
  onOpenMovement,
  onOpenLowStock,
}) {
  const lowStockProducts = getLowStockProducts(productos);

  return (
    <ScreenContainer backgroundColor={colors.dashboardBg} edges={["top"]}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={22} color="#111827" />
          </Pressable>

          <View style={styles.headerText}>
            <Text style={styles.title}>Control de stock</Text>
            <Text style={styles.subtitle}>Gestiona entradas, salidas y alertas</Text>
          </View>
        </View>

        <View style={styles.summaryRow}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryNumber}>{productos.length}</Text>
            <Text style={styles.summaryLabel}>Productos</Text>
          </View>

          <Pressable style={styles.summaryCard} onPress={onOpenLowStock}>
            <Text style={[styles.summaryNumber, styles.warningNumber]}>
              {lowStockProducts.length}
            </Text>
            <Text style={styles.summaryLabel}>Alertas</Text>
          </Pressable>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
          {productos.length === 0 ? (
            <View style={styles.emptyCard}>
              <Ionicons name="cube-outline" size={42} color="#9CA3AF" />
              <Text style={styles.emptyTitle}>No hay productos</Text>
              <Text style={styles.emptyText}>
                Registra productos para empezar a controlar el stock.
              </Text>
            </View>
          ) : (
            productos.map((product) => (
              <StockAlertCard
                key={product.id}
                product={product}
                onPress={() => onOpenMovement?.(product)}
              />
            ))
          )}
        </ScrollView>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 14,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "900",
    color: "#111827",
  },
  subtitle: {
    marginTop: 3,
    color: "#6B7280",
    fontSize: 13,
  },
  summaryRow: {
    flexDirection: "row",
    columnGap: 12,
    marginBottom: 16,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 16,
  },
  summaryNumber: {
    color: colors.primary,
    fontSize: 28,
    fontWeight: "900",
  },
  warningNumber: {
    color: "#DC2626",
  },
  summaryLabel: {
    marginTop: 2,
    color: "#6B7280",
    fontSize: 13,
    fontWeight: "700",
  },
  content: {
    paddingBottom: 118,
  },
  emptyCard: {
    marginTop: 40,
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 22,
    alignItems: "center",
    rowGap: 10,
  },
  emptyTitle: {
    color: "#111827",
    fontSize: 18,
    fontWeight: "900",
  },
  emptyText: {
    color: "#6B7280",
    fontSize: 13,
    textAlign: "center",
    lineHeight: 19,
  },
});
