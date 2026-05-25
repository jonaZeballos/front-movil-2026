import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { ScreenContainer } from "../../../shared/components/ScreenContainer";
import { colors } from "../../../shared/theme/colors";
import {
  formatNotificationDate,
  getNotificationConfig,
} from "../services";

export function NotificationDetailScreen({ navigation, notification }) {
  if (!notification) {
    return (
      <ScreenContainer backgroundColor={colors.dashboardBg} edges={["top"]}>
        <View style={styles.container}>
          <View style={styles.emptyCard}>
            <Ionicons name="alert-circle-outline" size={44} color="#9CA3AF" />
            <Text style={styles.emptyTitle}>Notificación no disponible</Text>
            <Pressable style={styles.primaryButton} onPress={() => navigation.goBack()}>
              <Text style={styles.primaryButtonText}>Volver</Text>
            </Pressable>
          </View>
        </View>
      </ScreenContainer>
    );
  }

  const config = getNotificationConfig(notification.type);

  return (
    <ScreenContainer backgroundColor={colors.dashboardBg} edges={["top"]}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={22} color="#111827" />
          </Pressable>

          <View style={styles.headerText}>
            <Text style={styles.title}>Detalle</Text>
            <Text style={styles.subtitle}>{config.label}</Text>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
          <View style={styles.card}>
            <View style={[styles.iconBox, { backgroundColor: config.color }]}>
              <Ionicons name={config.iconName} size={32} color="#FFFFFF" />
            </View>

            <Text style={styles.notificationTitle}>{notification.title}</Text>
            <Text style={styles.notificationMessage}>{notification.message}</Text>

            <View style={styles.infoBox}>
              <Text style={styles.infoLabel}>Tipo</Text>
              <Text style={[styles.infoValue, { color: config.color }]}>
                {config.label}
              </Text>
            </View>

            <View style={styles.infoBox}>
              <Text style={styles.infoLabel}>Fecha</Text>
              <Text style={styles.infoValue}>
                {formatNotificationDate(notification.createdAt)}
              </Text>
            </View>

            <View style={styles.infoBox}>
              <Text style={styles.infoLabel}>Estado</Text>
              <Text style={styles.infoValue}>
                {notification.read ? "Leída" : "Sin leer"}
              </Text>
            </View>
          </View>

          <Pressable style={styles.primaryButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back-outline" size={18} color="#FFFFFF" />
            <Text style={styles.primaryButtonText}>Volver a notificaciones</Text>
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
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 22,
    alignItems: "center",
  },
  iconBox: {
    width: 72,
    height: 72,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  notificationTitle: {
    color: "#111827",
    fontSize: 21,
    fontWeight: "900",
    textAlign: "center",
  },
  notificationMessage: {
    marginTop: 10,
    color: "#4B5563",
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
    marginBottom: 18,
  },
  infoBox: {
    width: "100%",
    backgroundColor: "#F9FAFB",
    borderRadius: 16,
    padding: 14,
    marginTop: 10,
  },
  infoLabel: {
    color: "#9CA3AF",
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  infoValue: {
    marginTop: 4,
    color: "#111827",
    fontSize: 14,
    fontWeight: "900",
  },
  primaryButton: {
    marginTop: 16,
    height: 52,
    borderRadius: 18,
    backgroundColor: colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    columnGap: 8,
    paddingHorizontal: 18,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "900",
  },
  emptyCard: {
    marginTop: 80,
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 22,
    alignItems: "center",
    rowGap: 12,
  },
  emptyTitle: {
    color: "#111827",
    fontSize: 18,
    fontWeight: "900",
  },
});