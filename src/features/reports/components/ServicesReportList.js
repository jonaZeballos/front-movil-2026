import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import {
  formatReportCurrency,
  formatReportDate,
  normalizeReportService,
} from "../services";

export function ServicesReportList({ ordenes = [] }) {
  const [expandedId, setExpandedId] = useState(null);
  const normalizedOrdenes = ordenes.map(normalizeReportService);

  if (normalizedOrdenes.length === 0) {
    return (
      <View style={styles.emptyCard}>
        <Ionicons name="construct-outline" size={40} color="#9CA3AF" />
        <Text style={styles.emptyTitle}>Sin servicios registrados</Text>
        <Text style={styles.emptyText}>
          Las ordenes de servicio apareceran en este reporte.
        </Text>
      </View>
    );
  }

  return normalizedOrdenes.map((orden) => {
    const cardId = String(orden.id || orden.code || orden.codigo);
    const isExpanded = expandedId === cardId;
    const cotizaciones = orden.cotizaciones || [];

    return (
      <Pressable
        key={cardId}
        style={styles.card}
        onPress={() => setExpandedId(isExpanded ? null : cardId)}
      >
        <View style={styles.row}>
          <View style={styles.info}>
            <Text style={styles.title}>{orden.code || orden.codigo || "Orden"}</Text>
            <Text style={styles.subtitle}>{orden.clienteNombre}</Text>
            <Text style={styles.equipment}>{orden.equipoNombre}</Text>
          </View>

          <View style={styles.side}>
            <View style={styles.statusPill}>
              <Text style={styles.statusText}>{orden.status || orden.estado || "Sin estado"}</Text>
            </View>
            <Ionicons
              name={isExpanded ? "chevron-up" : "chevron-down"}
              size={18}
              color="#6B7280"
            />
          </View>
        </View>

        <Text style={styles.description} numberOfLines={isExpanded ? undefined : 2}>
          {orden.diagnostico || "Sin diagnostico"}
        </Text>

        <View style={styles.metaRow}>
          <InfoPill icon="calendar-outline" text={formatReportDate(orden.fechaRecepcion || orden.createdAt)} />
          <InfoPill icon="flag-outline" text={orden.prioridad || "Sin prioridad"} />
        </View>

        {isExpanded ? (
          <View style={styles.detailBox}>
            <DetailRow label="Fecha recepcion" value={formatReportDate(orden.fechaRecepcion || orden.createdAt)} />
            <DetailRow label="Fecha entrega" value={formatReportDate(orden.fechaEntrega)} />
            <DetailRow label="Garantia" value={`${orden.garantiaDias || 0} dias`} />
            <DetailRow label="Tecnico" value={orden.tecnico?.nombre || "No asignado"} />

            <Text style={styles.detailTitle}>Equipo</Text>
            <Text style={styles.detailText}>{orden.equipoNombre}</Text>
            {orden.equipo?.nroSerie || orden.equipo?.serial ? (
              <Text style={styles.mutedText}>Serie: {orden.equipo.nroSerie || orden.equipo.serial}</Text>
            ) : null}

            <Text style={styles.detailTitle}>Descripcion / observaciones</Text>
            <Text style={styles.detailText}>{orden.descripcion || "Sin observaciones"}</Text>

            <Text style={styles.detailTitle}>Cotizaciones generadas</Text>
            {cotizaciones.length === 0 ? (
              <Text style={styles.mutedText}>No hay cotizaciones registradas para esta orden.</Text>
            ) : (
              cotizaciones.map((cotizacion) => (
                <View key={`${cardId}-${cotizacion.id || cotizacion.codigo}`} style={styles.quoteRow}>
                  <View style={styles.quoteInfo}>
                    <Text style={styles.quoteTitle}>
                      {cotizacion.codigo || `COT-${String(cotizacion.numero || "").padStart(4, "0")}`}
                    </Text>
                    <Text style={styles.quoteMeta}>{cotizacion.estado || "Sin estado"}</Text>
                  </View>
                  <Text style={styles.quoteTotal}>{formatReportCurrency(cotizacion.total)}</Text>
                </View>
              ))
            )}

            <DetailRow label="Total cotizado" value={formatReportCurrency(orden.totalCotizado)} strong />
          </View>
        ) : null}
      </Pressable>
    );
  });
}

function InfoPill({ icon, text }) {
  return (
    <View style={styles.infoPill}>
      <Ionicons name={icon} size={14} color="#5655B9" />
      <Text style={styles.infoPillText}>{text}</Text>
    </View>
  );
}

function DetailRow({ label, value, strong = false }) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={[styles.detailValue, strong && styles.detailValueStrong]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 14,
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    columnGap: 10,
  },
  info: {
    flex: 1,
  },
  title: {
    color: "#111827",
    fontSize: 15,
    fontWeight: "900",
  },
  subtitle: {
    marginTop: 3,
    color: "#6B7280",
    fontSize: 13,
    fontWeight: "700",
  },
  equipment: {
    marginTop: 3,
    color: "#374151",
    fontSize: 12,
    fontWeight: "800",
  },
  side: {
    alignItems: "flex-end",
    rowGap: 7,
  },
  statusPill: {
    alignSelf: "flex-start",
    borderRadius: 999,
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  statusText: {
    color: "#5655B9",
    fontSize: 11,
    fontWeight: "900",
  },
  description: {
    marginTop: 10,
    color: "#374151",
    fontSize: 13,
    lineHeight: 18,
  },
  metaRow: {
    marginTop: 12,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  infoPill: {
    borderRadius: 999,
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 10,
    paddingVertical: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  infoPillText: {
    color: "#5655B9",
    fontSize: 11,
    fontWeight: "900",
  },
  detailBox: {
    marginTop: 14,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    paddingTop: 12,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    columnGap: 12,
    paddingVertical: 5,
  },
  detailLabel: {
    color: "#6B7280",
    fontSize: 13,
    fontWeight: "700",
  },
  detailValue: {
    flex: 1,
    textAlign: "right",
    color: "#111827",
    fontSize: 13,
    fontWeight: "800",
  },
  detailValueStrong: {
    color: "#2386F5",
    fontSize: 15,
    fontWeight: "900",
  },
  detailTitle: {
    marginTop: 12,
    marginBottom: 5,
    color: "#111827",
    fontSize: 14,
    fontWeight: "900",
  },
  detailText: {
    color: "#374151",
    fontSize: 13,
    lineHeight: 18,
  },
  mutedText: {
    color: "#6B7280",
    fontSize: 12,
    lineHeight: 17,
  },
  quoteRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    columnGap: 10,
    paddingVertical: 9,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  quoteInfo: {
    flex: 1,
  },
  quoteTitle: {
    color: "#111827",
    fontSize: 13,
    fontWeight: "900",
  },
  quoteMeta: {
    marginTop: 2,
    color: "#6B7280",
    fontSize: 12,
    fontWeight: "700",
  },
  quoteTotal: {
    color: "#111827",
    fontSize: 13,
    fontWeight: "900",
  },
  emptyCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 22,
    alignItems: "center",
    rowGap: 9,
  },
  emptyTitle: {
    color: "#111827",
    fontSize: 17,
    fontWeight: "900",
  },
  emptyText: {
    color: "#6B7280",
    fontSize: 13,
    textAlign: "center",
    lineHeight: 19,
  },
});
