import { ScrollView, StyleSheet, Text, View, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { ScreenContainer } from "../../../shared/components/ScreenContainer";
import { colors } from "../../../shared/theme/colors";
import { ReportCard } from "../components/ReportCard";
import { ReportSummaryCard } from "../components/ReportSummaryCard";
import {
  calculateSalesReport,
  calculateServicesReport,
  formatReportCurrency,
} from "../services";
import { demoSalesReports } from "../data/reportsMock";

export function ReportsDashboardScreen({
  navigation,
  ventas = [],
  ordenes = [],
}) {
  const ventasData = ventas.length > 0 ? ventas : demoSalesReports;
  const salesStats = calculateSalesReport(ventasData);
  const servicesStats = calculateServicesReport(ordenes);

  return (
    <ScreenContainer backgroundColor={colors.dashboardBg} edges={["top"]}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={22} color="#111827" />
          </Pressable>

          <View style={styles.headerText}>
            <Text style={styles.title}>Reportes</Text>
            <Text style={styles.subtitle}>Resumen de ventas y servicios</Text>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
          <View style={styles.summaryRow}>
            <ReportSummaryCard
              title="Ingresos"
              value={formatReportCurrency(salesStats.totalIngresos)}
              subtitle={`${salesStats.totalVentas} ventas`}
              iconName="cash-outline"
              color="#2386F5"
            />

            <ReportSummaryCard
              title="Servicios"
              value={String(servicesStats.totalOrdenes)}
              subtitle={`${servicesStats.pendientes} pendientes`}
              iconName="construct-outline"
              color="#0F766E"
            />
          </View>

          <View style={styles.summaryRow}>
            <ReportSummaryCard
              title="Promedio venta"
              value={formatReportCurrency(salesStats.promedioVenta)}
              subtitle="Ticket promedio"
              iconName="trending-up-outline"
              color="#7C3AED"
            />

            <ReportSummaryCard
              title="Finalizadas"
              value={String(servicesStats.finalizadas)}
              subtitle="Órdenes listas/entregadas"
              iconName="checkmark-circle-outline"
              color="#10B981"
            />
          </View>

          <Text style={styles.sectionTitle}>Selecciona un reporte</Text>

          <ReportCard
            title="Reporte de ventas"
            description="Consulta ingresos, ventas registradas, métodos de pago y detalle de recibos."
            iconName="receipt-outline"
            color="#2386F5"
            onPress={() => navigation.navigate("SalesReport")}
          />

          <ReportCard
            title="Reporte de servicios"
            description="Consulta órdenes técnicas, estados, pendientes y servicios finalizados."
            iconName="construct-outline"
            color="#0F766E"
            onPress={() => navigation.navigate("ServicesReport")}
          />

          <View style={styles.infoCard}>
            <Ionicons name="information-circle-outline" size={24} color={colors.primary} />
            <View style={styles.infoTextBox}>
              <Text style={styles.infoTitle}>Datos del reporte</Text>
              <Text style={styles.infoText}>
                Las ventas se toman de los recibos generados y los servicios de las órdenes registradas.
              </Text>
            </View>
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
    color: "#111827",
    fontSize: 24,
    fontWeight: "900",
  },
  subtitle: {
    marginTop: 3,
    color: "#6B7280",
    fontSize: 13,
  },
  content: {
    paddingBottom: 30,
  },
  summaryRow: {
    flexDirection: "row",
    columnGap: 12,
    marginBottom: 12,
  },
  sectionTitle: {
    marginTop: 6,
    marginBottom: 12,
    color: "#111827",
    fontSize: 18,
    fontWeight: "900",
  },
  infoCard: {
    marginTop: 8,
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 16,
    flexDirection: "row",
    columnGap: 12,
  },
  infoTextBox: {
    flex: 1,
  },
  infoTitle: {
    color: "#111827",
    fontSize: 14,
    fontWeight: "900",
  },
  infoText: {
    marginTop: 3,
    color: "#6B7280",
    fontSize: 13,
    lineHeight: 18,
  },
});