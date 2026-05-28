import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export function UserCard({ user, onPress }) {
  const roleConfig = getRoleConfig(user.role);

  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{user.initials}</Text>
      </View>

      <View style={styles.info}>
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.email}>{user.email}</Text>
        <View style={[styles.roleBadge, { backgroundColor: roleConfig.backgroundColor }]}>
          <Text style={[styles.roleText, { color: roleConfig.color }]}>{roleConfig.label}</Text>
        </View>
      </View>

      <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
    </Pressable>
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
});
