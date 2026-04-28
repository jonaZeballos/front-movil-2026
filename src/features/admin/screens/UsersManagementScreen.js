import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { UserCard } from "../components/UserCard";
import { ScreenContainer } from "../../../shared/components/ScreenContainer";
import { colors } from "../../../shared/theme/colors";

const initialUsers = [
  {
    id: "u1",
    name: "Carlos Técnico",
    email: "tecnico@servitech.com",
    role: "tecnico",
    initials: "CT",
  },
  {
    id: "u2",
    name: "Laura Ventas",
    email: "ventas@servitech.com",
    role: "ventas",
    initials: "LV",
  },
];

export function UsersManagementScreen({ users = initialUsers, onBack, onCreateUser }) {
  const [localUsers] = useState(users);

  return (
    <ScreenContainer backgroundColor={colors.dashboardBg} edges={["top"]}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable onPress={onBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={22} color="#111827" />
          </Pressable>

          <View style={styles.headerText}>
            <Text style={styles.title}>Gestión de usuarios</Text>
            <Text style={styles.subtitle}>Crear y administrar técnicos y ventas</Text>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Usuarios registrados</Text>
          <Text style={styles.sectionCount}>{localUsers.length}</Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.listContent}>
          {localUsers.map((user) => (
            <UserCard key={user.id} user={user} />
          ))}

          <Pressable style={styles.createButton} onPress={onCreateUser}>
            <Ionicons name="add" size={22} color="#FFFFFF" />
            <Text style={styles.createButtonText}>Crear usuario</Text>
          </Pressable>
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
    paddingBottom: 24,
  },
  createButton: {
    height: 54,
    borderRadius: 18,
    backgroundColor: "#5655B9",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    columnGap: 8,
    marginTop: 8,
  },
  createButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },
});