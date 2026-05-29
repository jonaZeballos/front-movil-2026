import React, { useState } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Feather } from "@expo/vector-icons";

import { colors } from "../../../shared/theme/colors";
import { getClientStats } from "../services/clientHistoryApi";

export default function GestionClientes({
  clientes = [],
  ordenes = [],
  equipos = [],
  onBack,
  onRegistrar,
  onSelectCliente,
  onOpenHistory,
}) {
  const [busqueda, setBusqueda] = useState("");
  const clientList = Array.isArray(clientes) ? clientes : [];

  const filtrados = clientList.filter((cliente) => {
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

    return (
      <View style={styles.card}>
        <View style={styles.cardRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {item.iniciales || getInitials(item.nombre)}
            </Text>
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.cardName}>{item.nombre || "Cliente sin nombre"}</Text>
            <Text style={styles.cardEmail}>{item.correo || item.email || "Sin correo"}</Text>
          </View>
        </View>

        <Text style={styles.cardDetail}>
          {item.telefono || "Sin telefono"} · {item.direccion || "Sin direccion"}
        </Text>

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
        </View>
      </View>
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
            Registro, detalle e historial de clientes
          </Text>
        </View>
      </View>

      <View style={styles.searchBox}>
        <Text style={styles.searchLabel}>Buscar cliente</Text>

        <View style={styles.searchInput}>
          <Feather name="search" size={18} color="#8C8C8C" />
          <TextInput
            style={styles.inputText}
            placeholder="Por nombre, telefono, correo, documento o direccion"
            placeholderTextColor="#8C8C8C"
            value={busqueda}
            onChangeText={setBusqueda}
          />
        </View>
      </View>

      <View style={styles.listHeader}>
        <Text style={styles.listTitle}>Clientes registrados</Text>
        <Text style={styles.listCount}>{filtrados.length}</Text>
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
            <Text style={styles.emptyTitle}>No hay clientes registrados</Text>
            <Text style={styles.emptyText}>
              Este negocio todavia no tiene clientes. Registra el primero para consultar su historial.
            </Text>
          </View>
        }
      />

      <Pressable style={styles.registerBtn} onPress={onRegistrar}>
        <Text style={{ fontSize: 22, color: colors.surface }}>+</Text>
        <Text style={styles.registerBtnText}>Registrar cliente</Text>
      </Pressable>
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
    backgroundColor: colors.surface,
    marginHorizontal: 14,
    marginVertical: 12,
    borderRadius: 18,
    padding: 16,
  },
  searchLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#4B4B4B",
    letterSpacing: 1.1,
    marginBottom: 8,
    textTransform: "uppercase",
  },
  searchInput: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#f5f5f5",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 13,
  },
  inputText: {
    flex: 1,
    fontSize: 15,
    color: colors.black,
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
  listContainer: {
    paddingHorizontal: 14,
    paddingBottom: 16,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#F1F1F4",
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
    marginVertical: 16,
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
