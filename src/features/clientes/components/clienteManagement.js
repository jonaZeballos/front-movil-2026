import React, { useState } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Feather } from "@expo/vector-icons";

import { SearchInput } from "../../../shared/components/SearchInput";
import { colors } from "../../../shared/theme/colors";
import { getClientStats } from "../services/clientHistoryApi";

export default function GestionClientes({
  clientes = [],
  ordenes = [],
  equipos = [],
  mode,
  onBack,
  onRegistrar,
  onSelectCliente,
  onOpenHistory,
  onAddToBlacklist,
  onRemoveFromBlacklist,
}) {
  const [busqueda, setBusqueda] = useState("");
  const [viewMode, setViewMode] = useState("full");
  const isBlacklistMode = mode === "blacklist";
  const isCompact = viewMode === "compact";
  const isSimple = viewMode === "simple";
  const clientList = Array.isArray(clientes) ? clientes : [];

  const filtrados = clientList.filter((cliente) => {
    if (isBlacklistMode && !cliente.enListaNegra) {
      return false;
    }

    const nombre = String(cliente.nombre || "").toLowerCase();
    const razonSocial = String(cliente.razonSocial || "").toLowerCase();
    const telefono = String(cliente.telefono || "");
    const correo = String(cliente.correo || cliente.email || "").toLowerCase();
    const documento = String(cliente.numeroDocumento || cliente.documento || "");
    const direccion = String(cliente.direccion || "").toLowerCase();
    const term = busqueda.trim().toLowerCase();
    const rawTerm = busqueda.trim();

    return (
      !term ||
      nombre.includes(term) ||
      razonSocial.includes(term) ||
      telefono.includes(rawTerm) ||
      correo.includes(term) ||
      documento.includes(rawTerm) ||
      direccion.includes(term)
    );
  });

  const renderCliente = ({ item }) => {
    const stats = getClientStats(item, ordenes, equipos);

    const CardWrapper = isSimple ? Pressable : View;
    const cardWrapperProps = isSimple ? { onPress: () => onSelectCliente?.(item) } : {};

    return (
      <CardWrapper style={[styles.card, isSimple && styles.simpleCard]} {...cardWrapperProps}>
        <View style={styles.cardRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {item.iniciales || getInitials(item.nombre)}
            </Text>
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.cardName}>{item.nombre || "Cliente sin nombre"}</Text>
            {!isSimple ? (
              <Text style={styles.cardEmail}>{item.correo || item.email || "Sin correo"}</Text>
            ) : null}
            {item.enListaNegra ? (
              <View style={styles.blacklistBadge}>
                <Text style={styles.blacklistBadgeText}>Lista negra</Text>
              </View>
            ) : null}
          </View>
        </View>

        <Text style={styles.cardDetail}>
          {item.telefono || "Sin telefono"}
          {!isCompact && !isSimple ? ` - ${item.direccion || "Sin direccion"}` : ""}
        </Text>

        {!isCompact && !isSimple ? (
        <View style={styles.statsRow}>
          <View style={styles.statChip}>
            <Text style={styles.statNumber}>{stats.totalEquipos}</Text>
            <Text style={styles.statText}>Equipos</Text>
          </View>

          <View style={styles.statChip}>
            <Text style={styles.statNumber}>{stats.totalOrdenes}</Text>
            <Text style={styles.statText}>Ordenes</Text>
          </View>

          <View style={styles.statChip}>
            <Text style={[styles.statNumber, styles.pendingNumber]}>
              {stats.pendientes}
            </Text>
            <Text style={styles.statText}>Pendientes</Text>
          </View>
        </View>
        ) : null}

        {!isSimple ? (
        <View style={styles.actionsRow}>
          <Pressable
            style={styles.detailButton}
            onPress={() => onSelectCliente?.(item)}
          >
            <Feather name="eye" size={16} color={colors.primary} />
            <Text style={styles.detailButtonText}>Detalle</Text>
          </Pressable>

          <Pressable
            style={styles.historyButton}
            onPress={() => onOpenHistory?.(item)}
          >
            <Feather name="clock" size={16} color="#FFFFFF" />
            <Text style={styles.historyButtonText}>Historial</Text>
          </Pressable>

          <Pressable
            style={[styles.blacklistButton, item.enListaNegra && styles.removeBlacklistButton]}
            onPress={() =>
              item.enListaNegra ? onRemoveFromBlacklist?.(item) : onAddToBlacklist?.(item)
            }
          >
            <Feather
              name={item.enListaNegra ? "check-circle" : "slash"}
              size={15}
              color={item.enListaNegra ? "#047857" : "#B91C1C"}
            />
            <Text
              style={[
                styles.blacklistButtonText,
                item.enListaNegra && styles.removeBlacklistButtonText,
              ]}
              numberOfLines={1}
            >
              {item.enListaNegra ? "Quitar" : "Lista negra"}
            </Text>
          </Pressable>
        </View>
        ) : null}
      </CardWrapper>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={onBack}>
          <Feather name="arrow-left" size={20} color="#111827" />
        </Pressable>

        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>Gestion de clientes</Text>
          <Text style={styles.headerSubtitle}>
            {isBlacklistMode
              ? "Clientes bloqueados para nuevas operaciones"
              : "Registro, detalle e historial de clientes"}
          </Text>
        </View>
      </View>

      <View style={styles.searchBox}>
        <SearchInput
          value={busqueda}
          onChangeText={setBusqueda}
          placeholder="Buscar por nombre, telefono, correo o CI"
        />
      </View>

      <View style={styles.listHeader}>
        <Text style={styles.listTitle}>
          {isBlacklistMode ? "Clientes en lista negra" : "Clientes registrados"}
        </Text>
        <Text style={styles.listCount}>{filtrados.length}</Text>
      </View>

      <View style={styles.viewToggle}>
        <Pressable
          style={[styles.viewToggleButton, viewMode === "full" && styles.viewToggleButtonActive]}
          onPress={() => setViewMode("full")}
        >
          <Text style={[styles.viewToggleText, viewMode === "full" && styles.viewToggleTextActive]}>
            Completa
          </Text>
        </Pressable>
        <Pressable
          style={[styles.viewToggleButton, viewMode === "compact" && styles.viewToggleButtonActive]}
          onPress={() => setViewMode("compact")}
        >
          <Text style={[styles.viewToggleText, viewMode === "compact" && styles.viewToggleTextActive]}>
            Compacta
          </Text>
        </Pressable>
        <Pressable
          style={[styles.viewToggleButton, viewMode === "simple" && styles.viewToggleButtonActive]}
          onPress={() => setViewMode("simple")}
        >
          <Text style={[styles.viewToggleText, viewMode === "simple" && styles.viewToggleTextActive]}>
            Simple
          </Text>
        </Pressable>
      </View>

      <FlatList
        data={filtrados}
        renderItem={renderCliente}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyCard}>
            <Feather name="users" size={38} color="#9CA3AF" />
            <Text style={styles.emptyTitle}>
              {isBlacklistMode ? "No hay clientes en lista negra" : "No hay clientes registrados"}
            </Text>
            <Text style={styles.emptyText}>
              {isBlacklistMode
                ? "Cuando agregues un cliente a lista negra aparecera aqui."
                : "Este negocio todavia no tiene clientes. Registra el primero para consultar su historial."}
            </Text>
          </View>
        }
      />

      {!isBlacklistMode ? (
        <Pressable style={styles.registerBtn} onPress={onRegistrar}>
          <Text style={{ fontSize: 22, color: colors.surface }}>+</Text>
          <Text style={styles.registerBtnText}>Registrar cliente</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

function getInitials(name) {
  return String(name || "CL")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  header: {
    backgroundColor: colors.surface,
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 18,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  backBtn: {
    width: 42,
    height: 42,
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: 0.5,
    borderColor: "#ddd",
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: "#111827",
  },
  headerSubtitle: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 3,
    lineHeight: 18,
  },
  searchBox: {
    marginHorizontal: 14,
    marginTop: 4,
    marginBottom: 12,
  },
  listHeader: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  listTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#111827",
  },
  listCount: {
    fontSize: 13,
    color: "#6B7280",
    fontWeight: "700",
  },
  viewToggle: {
    flexDirection: "row",
    marginHorizontal: 18,
    marginBottom: 10,
    backgroundColor: "#F3F4F6",
    borderRadius: 14,
    padding: 4,
  },
  viewToggleButton: {
    flex: 1,
    height: 36,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },
  viewToggleButtonActive: {
    backgroundColor: colors.primary,
  },
  viewToggleText: {
    color: "#6B7280",
    fontSize: 13,
    fontWeight: "900",
  },
  viewToggleTextActive: {
    color: "#FFFFFF",
  },
  listContainer: {
    paddingHorizontal: 14,
    paddingBottom: 128,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#F1F1F4",
  },
  simpleCard: {
    paddingVertical: 12,
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 8,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#e8e4fd",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#534AB7",
  },
  cardName: {
    fontSize: 15,
    fontWeight: "800",
    color: "#111827",
  },
  cardEmail: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 3,
  },
  blacklistBadge: {
    marginTop: 6,
    alignSelf: "flex-start",
    borderRadius: 999,
    backgroundColor: "#FEE2E2",
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  blacklistBadgeText: {
    color: "#B91C1C",
    fontSize: 11,
    fontWeight: "900",
  },
  cardDetail: {
    fontSize: 13,
    color: "#6B7280",
  },
  statsRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 12,
  },
  statChip: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    borderRadius: 14,
    paddingVertical: 9,
    alignItems: "center",
  },
  statNumber: {
    color: colors.primary,
    fontSize: 17,
    fontWeight: "900",
  },
  pendingNumber: {
    color: "#D97706",
  },
  statText: {
    color: "#6B7280",
    fontSize: 11,
    fontWeight: "800",
  },
  actionsRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 14,
  },
  detailButton: {
    flex: 1,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#EEF2FF",
    borderWidth: 1,
    borderColor: "#C7D2FE",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
  },
  detailButtonText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: "900",
  },
  historyButton: {
    flex: 1,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
  },
  historyButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "900",
  },
  blacklistButton: {
    flex: 1,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#FEE2E2",
    borderWidth: 1,
    borderColor: "#FCA5A5",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
  },
  blacklistButtonText: {
    color: "#B91C1C",
    fontSize: 12,
    fontWeight: "900",
  },
  removeBlacklistButton: {
    backgroundColor: "#ECFDF5",
    borderColor: "#A7F3D0",
  },
  removeBlacklistButtonText: {
    color: "#047857",
  },
  emptyCard: {
    marginTop: 30,
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 22,
    alignItems: "center",
    rowGap: 8,
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
  registerBtn: {
    marginHorizontal: 14,
    marginTop: 16,
    marginBottom: 104,
    backgroundColor: "#534AB7",
    borderRadius: 18,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  registerBtnText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: "800",
  },
});
