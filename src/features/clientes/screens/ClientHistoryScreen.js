import { useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";

import { ScreenContainer } from "../../../shared/components/ScreenContainer";
import { colors } from "../../../shared/theme/colors";
import { ClientHistoryCard } from "../components/ClientHistoryCard";
import { ClientHistoryFilter } from "../components/ClientHistoryFilter";
import { ClientTimelineItem } from "../components/ClientTimelineItem";
import {
  buildClientHistory,
  filterClientHistory,
  getClientHistory,
  getClientStats,
  getClienteName,
} from "../services/clientHistoryApi";

export function ClientHistoryScreen({
  navigation,
  cliente,
  ordenes = [],
  equipos = [],
}) {
  const [filter, setFilter] = useState("todos");
  const [remoteHistory, setRemoteHistory] = useState(null);

  useEffect(() => {
    if (!cliente?.id) return;

    getClientHistory(cliente.id)
      .then(setRemoteHistory)
      .catch(() => setRemoteHistory(null));
  }, [cliente?.id]);

  const stats = useMemo(
    () => remoteHistory?.resumen || getClientStats(cliente, ordenes, equipos),
    [cliente, ordenes, equipos, remoteHistory]
  );

  const history = useMemo(
    () => buildRemoteHistory(remoteHistory) || buildClientHistory(cliente, ordenes, equipos),
    [cliente, ordenes, equipos, remoteHistory]
  );

  const filteredHistory = useMemo(
    () => filterClientHistory(history, filter),
    [history, filter]
  );

  if (!cliente) {
    return (
      <ScreenContainer backgroundColor={colors.dashboardBg} edges={["top"]}>
        <View style={styles.container}>
          <View style={styles.emptyCard}>
            <Feather name="alert-circle" size={42} color="#9CA3AF" />
            <Text style={styles.emptyTitle}>Cliente no disponible</Text>
            <Text style={styles.emptyText}>
              Vuelve a la lista y selecciona un cliente para ver su historial.
            </Text>

            <Pressable style={styles.primaryButton} onPress={() => navigation.goBack()}>
              <Text style={styles.primaryButtonText}>Volver</Text>
            </Pressable>
          </View>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer backgroundColor={colors.dashboardBg} edges={["top"]}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
            <Feather name="arrow-left" size={21} color="#111827" />
          </Pressable>

          <View style={styles.headerText}>
            <Text style={styles.title}>Historial del cliente</Text>
            <Text style={styles.subtitle}>{getClienteName(cliente)}</Text>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
          <ClientHistoryCard cliente={cliente} stats={stats} />

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Actividad registrada</Text>
            <Text style={styles.sectionCount}>{filteredHistory.length}</Text>
          </View>

          <ClientHistoryFilter value={filter} onChange={setFilter} />

          {filteredHistory.length === 0 ? (
            <View style={styles.emptyHistoryCard}>
              <Feather name="clock" size={38} color="#9CA3AF" />
              <Text style={styles.emptyTitle}>Sin actividad</Text>
              <Text style={styles.emptyText}>
                Este cliente todavía no tiene equipos u órdenes registradas.
              </Text>
            </View>
          ) : (
            filteredHistory.map((item) => (
              <ClientTimelineItem key={item.id} item={item} />
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
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    color: "#111827",
    fontSize: 17,
    fontWeight: "900",
  },
  sectionCount: {
    color: "#6B7280",
    fontSize: 13,
    fontWeight: "900",
  },
  emptyCard: {
    marginTop: 80,
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 22,
    alignItems: "center",
    rowGap: 10,
  },
  emptyHistoryCard: {
    marginTop: 16,
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
  primaryButton: {
    marginTop: 8,
    height: 52,
    borderRadius: 18,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "900",
  },
});

function buildRemoteHistory(historial) {
  if (!historial) return null;

  const equipos = (historial.equipos || []).map((equipo) => ({
    id: `equipo-${equipo.id}`,
    type: "equipo",
    title: "Equipo registrado",
    description: equipo.nombre || [equipo.tipo, equipo.marca, equipo.modelo].filter(Boolean).join(" "),
    date: equipo.fechaRegistro,
    status: "Registrado",
    raw: equipo,
  }));

  const ordenes = (historial.ordenes || []).map((orden) => ({
    id: `orden-${orden.id}`,
    type: "orden",
    title: "Orden de servicio",
    description: orden.diagnostico || orden.failure || "Servicio registrado",
    date: orden.fechaRecepcion || orden.fechaEntrega,
    status: orden.estado || orden.status || "Pendiente",
    raw: orden,
  }));

  const ventas = (historial.ventas || []).map((venta) => ({
    id: `venta-${venta.id}`,
    type: "venta",
    title: "Venta registrada",
    description: `${venta.reciboCodigo || venta.codigo || "Recibo"} - Bs ${Number(venta.total || 0).toFixed(2)}`,
    date: venta.fechaCreacion,
    status: "Emitido",
    raw: venta,
  }));

  return [...equipos, ...ordenes, ...ventas].sort((a, b) => {
    const dateA = a.date ? new Date(a.date).getTime() : 0;
    const dateB = b.date ? new Date(b.date).getTime() : 0;
    return dateB - dateA;
  });
}
