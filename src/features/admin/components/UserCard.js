import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export function UserCard({ user, onPress }) {
  const roleLabel = user.role === "tecnico" ? "Técnico" : "Ventas";

  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{user.initials}</Text>
      </View>

      <View style={styles.info}>
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.email}>{user.email}</Text>
        <View style={styles.roleBadge}>
          <Text style={styles.roleText}>{roleLabel}</Text>
        </View>
      </View>

      <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
    </Pressable>
  );
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
    backgroundColor: "#F5F5F7",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: "flex-start",
  },
  roleText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#5655B9",
  },
});