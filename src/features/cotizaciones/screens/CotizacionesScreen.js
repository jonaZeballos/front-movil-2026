import { useState } from "react";
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { ScreenContainer } from "../../../shared/components/ScreenContainer";
import { colors } from "../../../shared/theme/colors";
import { OrderQuotationCard } from "../components/OrderQuotationCard";

export function CotizacionesScreen({ orders = [], onBack, onGenerateQuotation }) {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const quoteableOrders = orders.filter((order) => {
    const status = String(order.status || order.estado || "").toLowerCase();
    return status !== "entregado" && status !== "sin solucion";
  });

  const handleGenerate = () => {
    if (!selectedOrder) {
      Alert.alert("Orden obligatoria", "Selecciona una orden para generar la cotizacion.");
      return;
    }

    onGenerateQuotation?.(selectedOrder);
  };

  return (
    <ScreenContainer backgroundColor={colors.dashboardBg} edges={["top"]}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable onPress={onBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={22} color="#111827" />
          </Pressable>

          <View style={styles.headerText}>
            <Text style={styles.title}>Cotizaciones</Text>
            <Text style={styles.subtitle}>Ordenes listas para cotizar</Text>
          </View>
        </View>

        <FlatList
          data={quoteableOrders}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <OrderQuotationCard
              order={item}
              selected={selectedOrder?.id === item.id}
              onSelect={() => setSelectedOrder(item)}
            />
          )}
          ListEmptyComponent={
            <View style={styles.emptyCard}>
              <Ionicons name="document-text-outline" size={42} color="#9CA3AF" />
              <Text style={styles.emptyTitle}>No hay ordenes para cotizar</Text>
              <Text style={styles.emptyText}>Registra ordenes de servicio para generar cotizaciones.</Text>
            </View>
          }
        />

        <Pressable style={styles.createButton} onPress={handleGenerate}>
          <Ionicons name="add" size={22} color="#FFFFFF" />
          <Text style={styles.createButtonText}>Generar cotizacion</Text>
        </Pressable>
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
  listContent: {
    paddingBottom: 16,
  },
  createButton: {
    height: 54,
    borderRadius: 18,
    backgroundColor: colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    columnGap: 8,
    marginTop: 10,
    marginBottom: 16,
  },
  createButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },
  emptyCard: {
    marginTop: 30,
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
    lineHeight: 19,
    textAlign: "center",
  },
});
