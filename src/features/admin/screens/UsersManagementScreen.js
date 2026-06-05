import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { ScreenContainer } from "../../../shared/components/ScreenContainer";
import { colors } from "../../../shared/theme/colors";

export function UsersManagementScreen({ users = [], onBack, onCreateUser }) {
  return (
    <ScreenContainer backgroundColor={colors.dashboardBg} edges={["top"]}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable onPress={onBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={22} color="#111827" />
          </Pressable>

          <View style={styles.headerText}>
            <Text style={styles.title}>Gestion de usuarios</Text>
            <Text style={styles.subtitle}>Crear y administrar tecnicos y ventas</Text>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Usuarios registrados</Text>
          <Text style={styles.sectionCount}>{users.length}</Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.listContent}>
          {users.map((user) => {
            const roleConfig = getRoleConfig(user.role);
            return (
              <View key={user.id} style={styles.card}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{user.initials || "U"}</Text>
                </View>

                <View style={styles.info}>
                  <Text style={styles.name}>{user.name}</Text>
                  <Text style={styles.email}>{user.email}</Text>
                  <View style={[styles.roleBadge, { backgroundColor: roleConfig.backgroundColor }]}>
                    <Text style={[styles.roleText, { color: roleConfig.color }]}>{roleConfig.label}</Text>
                  </View>
                  {user.bloqueado ? (
                    <View style={styles.blockedBadge}>
                      <Text style={styles.blockedText}>Bloqueado</Text>
                    </View>
                  ) : null}
                </View>
              </View>
            );
          })}
        </ScrollView>

        <Pressable style={styles.createButton} onPress={onCreateUser}>
          <Ionicons name="add" size={22} color="#FFFFFF" />
          <Text style={styles.createButtonText}>Crear usuario</Text>
        </Pressable>
      </View>
    </ScreenContainer>
  );
}

function getRoleConfig(value) {
  const role = String(value || "").toLowerCase();

  if (role === "admin") {
    return {
      label: "Admin",
      color: "#047857",
      backgroundColor: "#D1FAE5",
    };
  }

  if (role === "tecnico") {
    return {
      label: "Tecnico",
      color: "#5655B9",
      backgroundColor: "#EEF2FF",
    };
  }

  if (role === "ventas") {
    return {
      label: "Ventas",
      color: "#0F766E",
      backgroundColor: "#DCFDF4",
    };
  }

  return {
    label: role || "Usuario",
    color: "#64748B",
    backgroundColor: "#F1F5F9",
  };
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
    fontSize: 13,
    color: "#6B7280",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#111827",
  },
  sectionCount: {
    fontSize: 13,
    fontWeight: "700",
    color: "#6B7280",
  },
  listContent: {
    paddingBottom: 16,
  },
  createButton: {
    height: 54,
    borderRadius: 18,
    backgroundColor: "#5655B9",
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
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 16,
    marginBottom: 14,
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#5655B9",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  avatarText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "900",
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 15,
    fontWeight: "800",
    color: "#111827",
  },
  email: {
    marginTop: 3,
    fontSize: 13,
    color: "#6B7280",
  },
  roleBadge: {
    marginTop: 8,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: "flex-start",
  },
  roleText: {
    fontSize: 12,
    fontWeight: "700",
  },
  blockedBadge: {
    marginTop: 6,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: "flex-start",
    backgroundColor: "#FEE2E2",
  },
  blockedText: {
    color: "#B91C1C",
    fontSize: 12,
    fontWeight: "800",
  },
});
