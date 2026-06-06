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
  products = [],
  onOpenNotification,
  onMarkAllAsRead,
}) {
  const unreadCount = getUnreadNotificationsCount(notifications);
  
  const lowStockProducts = products.filter(
    (p) => Number(p.stock || 0) <= Number(p.stockMinimo || 1)
  );

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

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
          <Text style={styles.sectionTitle}>Stock bajo</Text>
          {lowStockProducts.length === 0 ? (
            <View style={styles.emptyStockBox}>
              <Ionicons name="checkmark-circle-outline" size={20} color="#10B981" />
              <Text style={styles.emptyStockText}>No hay alertas de stock mínimo.</Text>
            </View>
          ) : (
            lowStockProducts.map((p) => (
              <View key={p.id} style={styles.stockAlertCard}>
                <View style={styles.stockIconBox}>
                  <Ionicons name="warning" size={20} color="#F59E0B" />
                </View>
                <View style={styles.stockAlertContent}>
                  <Text style={styles.stockAlertTitle}>{p.nombre || "Producto"}</Text>
                  <Text style={styles.stockAlertMessage}>
                    Stock bajo: {p.nombre || "Producto"} tiene {p.stock || 0} unidades. Mínimo recomendado: {p.stockMinimo || 1}.
                  </Text>
                  <View style={styles.stockAlertFooter}>
                    <Text style={styles.stockInventoryLabel}>
                      Inventario: {p.tipo === "insumo" ? "Técnico" : "Tienda"}
                    </Text>
                  </View>
                </View>
              </View>
            ))
          )}

          <View style={styles.systemNotificationsHeader}>
            <Text style={styles.sectionTitle}>Avisos del sistema</Text>
            {notifications.length > 0 && (
              <Pressable style={styles.markButton} onPress={onMarkAllAsRead}>
                <Text style={styles.markButtonText}>Marcar todas como leídas</Text>
              </Pressable>
            )}
          </View>

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
  sectionTitle: {
    color: "#111827",
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 12,
    marginTop: 4,
  },
  systemNotificationsHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 20,
    marginBottom: 6,
  },
  markButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: "#EEF2FF",
  },
  markButtonText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: "800",
  },
  content: {
    paddingBottom: 118,
  },
  emptyStockBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ECFDF5",
    padding: 14,
    borderRadius: 14,
    marginBottom: 10,
    columnGap: 8,
  },
  emptyStockText: {
    color: "#065F46",
    fontSize: 13,
    fontWeight: "600",
  },
  stockAlertCard: {
    flexDirection: "row",
    backgroundColor: "#FFFBEB",
    padding: 14,
    borderRadius: 14,
    marginBottom: 10,
    columnGap: 12,
    borderWidth: 1,
    borderColor: "#FEF3C7",
  },
  stockIconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "#FEF3C7",
    alignItems: "center",
    justifyContent: "center",
  },
  stockAlertContent: {
    flex: 1,
  },
  stockAlertTitle: {
    color: "#92400E",
    fontSize: 15,
    fontWeight: "900",
  },
  stockAlertMessage: {
    marginTop: 4,
    color: "#B45309",
    fontSize: 13,
    lineHeight: 18,
  },
  stockAlertFooter: {
    marginTop: 8,
  },
  stockInventoryLabel: {
    color: "#D97706",
    fontSize: 11,
    fontWeight: "800",
  },
});
