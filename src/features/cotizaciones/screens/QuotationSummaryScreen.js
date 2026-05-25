import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { AppButton } from "../../../shared/components/buttons";
import { ScreenContainer } from "../../../shared/components/ScreenContainer";
import { colors } from "../../../shared/theme/colors";
import { QuotationSummaryCard } from "../components/QuotationSummaryCard";
import { ShareQuotationButton } from "../components/ShareQuotationButton";

export function QuotationSummaryScreen({ quotation, onBackToOrders, onViewDetail }) {
  if (!quotation) {
    return (
      <ScreenContainer backgroundColor={colors.dashboardBg} edges={["top"]}>
        <View style={styles.container}>
          <View style={styles.emptyCard}>
            <Ionicons name="alert-circle-outline" size={44} color="#9CA3AF" />
            <Text style={styles.emptyTitle}>Resumen no disponible</Text>
            <Text style={styles.emptyText}>
              Genera una cotizacion desde una orden para ver el resumen.
            </Text>
            <AppButton
              title="Volver a ordenes"
              onPress={onBackToOrders}
              backgroundColor={colors.primary}
              borderRadius={18}
              minHeight={52}
            />
          </View>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer backgroundColor={colors.dashboardBg} edges={["top"]}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable onPress={onBackToOrders} style={styles.backButton}>
            <Ionicons name="arrow-back" size={22} color="#111827" />
          </Pressable>

          <View style={styles.headerText}>
            <Text style={styles.title}>Resumen</Text>
            <Text style={styles.subtitle}>Cotizacion pendiente de aprobacion</Text>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
          <QuotationSummaryCard quotation={quotation} />

          <View style={styles.actions}>
            <ShareQuotationButton quotation={quotation} />

            <AppButton
              title="Volver a ordenes"
              onPress={onBackToOrders}
              backgroundColor={colors.primary}
              borderRadius={18}
              minHeight={52}
            />

            <AppButton
              title="Ver detalle de cotizacion"
              onPress={onViewDetail}
              backgroundColor="#FFFFFF"
              textColor="#111827"
              borderColor="#E5E7EB"
              borderRadius={18}
              minHeight={52}
            />
          </View>
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
  content: {
    paddingBottom: 28,
  },
  actions: {
    marginTop: 16,
    rowGap: 10,
  },
  emptyCard: {
    marginTop: 80,
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