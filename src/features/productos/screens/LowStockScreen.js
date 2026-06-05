import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { ScreenContainer } from "../../../shared/components/ScreenContainer";
import { colors } from "../../../shared/theme/colors";
import { getLowStockProducts } from "../services";
import { StockAlertCard } from "../components/StockAlertCard";

export default function LowStockScreen({
  navigation,
  productos = [],
  onOpenMovement,
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
            <Text style={styles.title}>Alertas de stock</Text>
            <Text style={styles.subtitle}>Productos agotados o con pocas unidades</Text>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
          {lowStockProducts.length === 0 ? (
            <View style={styles.emptyCard}>
              <Ionicons name="checkmark-circle-outline" size={44} color="#10B981" />
              <Text style={styles.emptyTitle}>Stock saludable</Text>
              <Text style={styles.emptyText}>
                No tienes productos agotados ni con stock bajo.
              </Text>
            </View>
          ) : (
            lowStockProducts.map((product) => (
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
    fontSize: 23,
    fontWeight: "900",
    color: "#111827",
  },
  subtitle: {
    marginTop: 3,
    color: "#6B7280",
    fontSize: 13,
  },
  content: {
    paddingBottom: 118,
  },
  emptyCard: {
    marginTop: 60,
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
