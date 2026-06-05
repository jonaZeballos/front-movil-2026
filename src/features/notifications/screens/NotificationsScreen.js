import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { ScreenContainer } from "../../../shared/components/ScreenContainer";
import { colors } from "../../../shared/theme/colors";
import { NotificationCard } from "../components/NotificationCard";
import { NotificationEmptyState } from "../components/NotificationEmptyState";
import { getUnreadNotificationsCount } from "../services";

export function NotificationsScreen({
  navigation,
  notifications = [],
  onOpenNotification,
  onMarkAllAsRead,
}) {
  const unreadCount = getUnreadNotificationsCount(notifications);

  return (
    <ScreenContainer backgroundColor={colors.dashboardBg} edges={["top"]}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={22} color="#111827" />
          </Pressable>

          <View style={styles.headerText}>
            <Text style={styles.title}>Notificaciones</Text>
            <Text style={styles.subtitle}>
              {unreadCount} sin leer · {notifications.length} en total
            </Text>
          </View>
        </View>

        {notifications.length > 0 && (
          <Pressable style={styles.markButton} onPress={onMarkAllAsRead}>
            <Ionicons name="checkmark-done-outline" size={18} color={colors.primary} />
            <Text style={styles.markButtonText}>Marcar todas como leídas</Text>
          </Pressable>
        )}

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
          {notifications.length === 0 ? (
            <NotificationEmptyState />
          ) : (
            notifications.map((notification) => (
              <NotificationCard
                key={notification.id}
                notification={notification}
                onPress={onOpenNotification}
              />
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
    marginBottom: 14,
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
  markButton: {
    height: 46,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E0E7FF",
    marginBottom: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    columnGap: 8,
  },
  markButtonText: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: "900",
  },
  content: {
    paddingBottom: 118,
  },
});
