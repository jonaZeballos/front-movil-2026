import { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { ScreenContainer } from "../../../shared/components/ScreenContainer";
import { colors } from "../../../shared/theme/colors";
import { ReportFilter } from "../components/ReportFilter";
import { ReportSummaryCard } from "../components/ReportSummaryCard";
import { SalesReportList } from "../components/SalesReportList";
import {
  calculateSalesReport,
  filterReportItemsByPeriod,
  formatReportCurrency,
  getSaleDate,
} from "../services";

export function SalesReportScreen({ navigation, ventas = [], salesReport }) {
  const [period, setPeriod] = useState("todos");
  const ventasData = salesReport?.ventas || ventas;

  const filteredVentas = useMemo(
    () => filterReportItemsByPeriod(ventasData, period, getSaleDate),
    [ventasData, period]
  );

  const stats = useMemo(() => {
    if (salesReport) {
      return {
        totalVentas: salesReport.totalVentas || 0,
        totalIngresos: salesReport.ingresos || 0,
        promedioVenta: salesReport.ticketPromedio || 0,
        productosVendidos: salesReport.unidadesVendidas || 0,
        metodosPago: {},
      };
    }

    return calculateSalesReport(filteredVentas);
  }, [filteredVentas, salesReport]);

  return (
    <ScreenContainer backgroundColor={colors.dashboardBg} edges={["top"]}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={22} color="#111827" />
          </Pressable>

          <View style={styles.headerText}>
            <Text style={styles.title}>Reporte de ventas</Text>
            <Text style={styles.subtitle}>Ingresos y recibos registrados</Text>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
          <ReportFilter value={period} onChange={setPeriod} />

          <View style={styles.summaryRow}>
            <ReportSummaryCard
              title="Total ingresos"
              value={formatReportCurrency(stats.totalIngresos)}
              subtitle={`${stats.totalVentas} ventas`}
              iconName="cash-outline"
              color="#2386F5"
            />

            <ReportSummaryCard
              title="Promedio"
              value={formatReportCurrency(stats.promedioVenta)}
              subtitle="Por venta"
              iconName="analytics-outline"
              color="#7C3AED"
            />
          </View>

          <View style={styles.summaryRow}>
            <ReportSummaryCard
              title="Productos"
              value={String(stats.productosVendidos)}
              subtitle="Unidades vendidas"
              iconName="cube-outline"
              color="#0F766E"
            />

            <ReportSummaryCard
              title="Recibos"
              value={String(filteredVentas.length)}
              subtitle="Emitidos"
              iconName="receipt-outline"
              color="#F59E0B"
            />
          </View>

          <View style={styles.paymentCard}>
            <Text style={styles.paymentTitle}>Métodos de pago</Text>

            {Object.keys(stats.metodosPago).length === 0 ? (
              <Text style={styles.paymentText}>Sin métodos registrados.</Text>
            ) : (
              Object.entries(stats.metodosPago).map(([method, count]) => (
                <View key={method} style={styles.paymentRow}>
                  <Text style={styles.paymentText}>{method}</Text>
                  <Text style={styles.paymentCount}>{count}</Text>
                </View>
              ))
            )}
          </View>

          <Text style={styles.sectionTitle}>Detalle de ventas</Text>
          <SalesReportList ventas={filteredVentas} />
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
    fontSize: 23,
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
  paymentCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 16,
    marginBottom: 16,
  },
  paymentTitle: {
    color: "#111827",
    fontSize: 16,
    fontWeight: "900",
    marginBottom: 10,
  },
  paymentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 7,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  paymentText: {
    color: "#6B7280",
    fontSize: 13,
    fontWeight: "700",
  },
  paymentCount: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: "900",
  },
  sectionTitle: {
    marginBottom: 12,
    color: "#111827",
    fontSize: 17,
    fontWeight: "900",
  },
});
