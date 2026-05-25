import { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { ScreenContainer } from "../../../shared/components/ScreenContainer";
import { colors } from "../../../shared/theme/colors";
import { ReportFilter } from "../components/ReportFilter";
import { ReportSummaryCard } from "../components/ReportSummaryCard";
import { ServicesReportList } from "../components/ServicesReportList";
import {
  calculateServicesReport,
  filterReportItemsByPeriod,
  getOrderDate,
} from "../services";

export function ServicesReportScreen({ navigation, ordenes = [] }) {
  const [period, setPeriod] = useState("todos");

  const filteredOrdenes = useMemo(
    () => filterReportItemsByPeriod(ordenes, period, getOrderDate),
    [ordenes, period]
  );

  const stats = useMemo(
    () => calculateServicesReport(filteredOrdenes),
    [filteredOrdenes]
  );

  return (
    <ScreenContainer backgroundColor={colors.dashboardBg} edges={["top"]}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={22} color="#111827" />
          </Pressable>

          <View style={styles.headerText}>
            <Text style={styles.title}>Reporte de servicios</Text>
            <Text style={styles.subtitle}>Órdenes técnicas y estados</Text>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
          <ReportFilter value={period} onChange={setPeriod} />

          <View style={styles.summaryRow}>
            <ReportSummaryCard
              title="Órdenes"
              value={String(stats.totalOrdenes)}
              subtitle="Total servicios"
              iconName="documents-outline"
              color={colors.primary}
            />

            <ReportSummaryCard
              title="Pendientes"
              value={String(stats.pendientes)}
              subtitle="Por diagnosticar/cotizar"
              iconName="time-outline"
              color="#F59E0B"
            />
          </View>

          <View style={styles.summaryRow}>
            <ReportSummaryCard
              title="En proceso"
              value={String(stats.enProceso)}
              subtitle="En reparación"
              iconName="construct-outline"
              color="#2386F5"
            />

            <ReportSummaryCard
              title="Finalizadas"
              value={String(stats.finalizadas)}
              subtitle="Listas o entregadas"
              iconName="checkmark-circle-outline"
              color="#10B981"
            />
          </View>

          <View style={styles.statusCard}>
            <Text style={styles.statusTitle}>Resumen por estado</Text>

            {Object.keys(stats.resumenEstados).length === 0 ? (
              <Text style={styles.statusText}>Sin estados registrados.</Text>
            ) : (
              Object.entries(stats.resumenEstados).map(([status, count]) => (
                <View key={status} style={styles.statusRow}>
                  <Text style={styles.statusText}>{status}</Text>
                  <Text style={styles.statusCount}>{count}</Text>
                </View>
              ))
            )}
          </View>

          <Text style={styles.sectionTitle}>Detalle de servicios</Text>
          <ServicesReportList ordenes={filteredOrdenes} />
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
  statusCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 16,
    marginBottom: 16,
  },
  statusTitle: {
    color: "#111827",
    fontSize: 16,
    fontWeight: "900",
    marginBottom: 10,
  },
  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 7,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  statusText: {
    color: "#6B7280",
    fontSize: 13,
    fontWeight: "700",
  },
  statusCount: {
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