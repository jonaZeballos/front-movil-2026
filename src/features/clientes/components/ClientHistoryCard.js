import { StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";

import { colors } from "../../../shared/theme/colors";
import {
  getClienteAddress,
  getClienteDocument,
  getClienteEmail,
  getClienteName,
  getClientePhone,
} from "../services/clientHistoryApi";

export function ClientHistoryCard({ cliente, stats }) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{getInitials(getClienteName(cliente))}</Text>
        </View>

        <View style={styles.info}>
          <Text style={styles.name}>{getClienteName(cliente)}</Text>
          <Text style={styles.document}>Doc: {getClienteDocument(cliente)}</Text>
        </View>
      </View>

      {cliente?.enListaNegra ? (
        <View style={styles.blacklistAlert}>
          <View style={styles.alertHeader}>
            <Feather name="alert-triangle" size={16} color="#B91C1C" />
            <Text style={styles.alertTitle}>Cliente en lista negra</Text>
          </View>
          {cliente.motivoListaNegra ? (
            <Text style={styles.alertReason}>
              Motivo: {cliente.motivoListaNegra}
            </Text>
          ) : null}
        </View>
      ) : null}

      <View style={styles.contactBox}>
        <View style={styles.contactRow}>
          <Feather name="phone" size={15} color="#6B7280" />
          <Text style={styles.contactText}>{getClientePhone(cliente)}</Text>
        </View>

        <View style={styles.contactRow}>
          <Feather name="mail" size={15} color="#6B7280" />
          <Text style={styles.contactText}>{getClienteEmail(cliente)}</Text>
        </View>

        <View style={styles.contactRow}>
          <Feather name="map-pin" size={15} color="#6B7280" />
          <Text style={styles.contactText}>{getClienteAddress(cliente)}</Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{stats?.totalEquipos || 0}</Text>
          <Text style={styles.statLabel}>Equipos</Text>
        </View>

        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{stats?.totalOrdenes || 0}</Text>
          <Text style={styles.statLabel}>Ordenes</Text>
        </View>

        <View style={styles.statItem}>
          <Text style={[styles.statNumber, styles.pendingNumber]}>
            {stats?.pendientes || 0}
          </Text>
          <Text style={styles.statLabel}>Pendientes</Text>
        </View>
      </View>
    </View>
  );
}

function getInitials(name) {
  return String(name || "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 18,
    marginBottom: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 18,
    backgroundColor: "#EDEBFF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  avatarText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: "900",
  },
  info: {
    flex: 1,
  },
  name: {
    color: "#111827",
    fontSize: 18,
    fontWeight: "900",
  },
  document: {
    marginTop: 3,
    color: "#6B7280",
    fontSize: 13,
  },
  contactBox: {
    marginTop: 16,
    rowGap: 8,
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 8,
  },
  contactText: {
    color: "#374151",
    fontSize: 13,
    fontWeight: "700",
  },
  statsRow: {
    flexDirection: "row",
    columnGap: 10,
    marginTop: 18,
  },
  statItem: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    borderRadius: 18,
    padding: 12,
    alignItems: "center",
  },
  statNumber: {
    color: colors.primary,
    fontSize: 23,
    fontWeight: "900",
  },
  pendingNumber: {
    color: "#D97706",
  },
  statLabel: {
    marginTop: 2,
    color: "#6B7280",
    fontSize: 12,
    fontWeight: "800",
  },
  blacklistAlert: {
    backgroundColor: "#FEE2E2",
    borderRadius: 16,
    padding: 12,
    marginTop: 14,
    borderWidth: 1,
    borderColor: "#FCA5A5",
  },
  alertHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  alertTitle: {
    color: "#B91C1C",
    fontSize: 14,
    fontWeight: "900",
  },
  alertReason: {
    color: "#7F1D1D",
    fontSize: 13,
    fontWeight: "700",
    marginTop: 4,
    lineHeight: 17,
  },
});
