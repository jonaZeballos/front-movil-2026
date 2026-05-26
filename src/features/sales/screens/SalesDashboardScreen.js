import { Pressable, StyleSheet, Text, View } from "react-native";
import {
  Feather,
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ScreenContainer } from "../../../shared/components/ScreenContainer";
import { colors } from "../../../shared/theme/colors";
import { fontFamilies } from "../../../shared/theme/fonts";
import { NotificationBell } from "../../notifications";
import { SalesChartCard } from "../components/SalesChartCard";
import { SalesMetricCard } from "../components/SalesMetricCard";
import { SalesNoteCard } from "../components/SalesNoteCard";
import { SalesOptionCard } from "../components/SalesOptionCard";

const salesCards = [
  {
    id: "today",
    title: "Ventas\ndel día",
    value: "8",
    label: "Hoy",
    iconPack: FontAwesome5,
    iconName: "cash-register",
    iconBg: "#2386F5",
  },
  {
    id: "income",
    title: "Ingresos\nestimados",
    value: "Bs 920",
    label: "Total",
    iconPack: MaterialCommunityIcons,
    iconName: "cash-multiple",
    iconBg: "#58D2B8",
  },
  {
    id: "stock",
    title: "Stock\nbajo",
    value: "5",
    label: "Items",
    iconPack: Feather,
    iconName: "alert-triangle",
    iconBg: "#F5AA29",
  },
];

const options = [
  {
    id: "clientes",
    label: "Clientes",
    iconPack: FontAwesome5,
    iconName: "id-badge",
    iconColor: "#F04C75",
  },
  {
    id: "inventario",
    label: "Inventario",
    iconPack: MaterialCommunityIcons,
    iconName: "archive-outline",
    iconColor: "#E29217",
  },
  {
    id: "ventas",
    label: "Ventas",
    iconPack: Ionicons,
    iconName: "cart-outline",
    iconColor: "#2386F5",
  },
  {
    id: "reportes",
    label: "Reportes",
    iconPack: Ionicons,
    iconName: "analytics-outline",
    iconColor: "#7C3AED",
  },
];

const chartData = [42, 68, 50, 78, 62, 90, 74];

export function SalesDashboardScreen({
  user,
  unreadNotificationsCount = 0,
  onOpenNotifications,
  onLogout,
  onOpenClientes,
  onOpenInventory,
  onOpenSales,
  onOpenReports,
}) {
  const insets = useSafeAreaInsets();
  const displayName = getUserDisplayName(user, "Ventas");
  const initials = getInitials(displayName);
  const roleLabel = getRoleLabel(user?.rol || user?.tipoUsuario || "ventas");

  const handleOptionPress = (id) => {
    if (id === "clientes") onOpenClientes?.();
    if (id === "inventario") onOpenInventory?.();
    if (id === "ventas") onOpenSales?.();
    if (id === "reportes") onOpenReports?.();
  };

  return (
    <ScreenContainer backgroundColor={colors.primary} edges={["top"]}>
      <View style={styles.root}>
        <View style={styles.hero}>
          <View style={styles.topGlow} />

          <View style={styles.avatarRow}>
            <View style={styles.avatarWrap}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{initials}</Text>
              </View>

              <View>
                <Text style={styles.userName}>{displayName}</Text>
                <View style={styles.rolePill}>
                  <Text style={styles.roleText}>{roleLabel}</Text>
                </View>
              </View>
            </View>

            <View style={styles.headerActions}>
              <NotificationBell
                unreadCount={unreadNotificationsCount}
                onPress={onOpenNotifications}
              />

              <Pressable style={styles.logoutButton} onPress={onLogout}>
                <Ionicons name="log-out-outline" size={20} color="#FFFFFF" />
              </Pressable>
            </View>
          </View>

          <Text style={styles.mainAmount}>Bs 920</Text>
          <Text style={styles.mainLabel}>Ventas registradas hoy</Text>

          <View style={styles.heroIcon}>
            <Ionicons name="cart" size={92} color="rgba(255,255,255,0.18)" />
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.cardsRow}>
            {salesCards.map((item) => (
              <SalesMetricCard key={item.id} item={item} />
            ))}
          </View>

          <Text style={styles.sectionTitle}>Accesos comerciales</Text>

          <View style={styles.optionsGrid}>
            {options.map((item) => (
              <SalesOptionCard
                key={item.id}
                item={item}
                onPress={() => handleOptionPress(item.id)}
              />
            ))}
          </View>

          <SalesChartCard data={chartData} />
          <SalesNoteCard />
        </View>

        <View
          style={[
            styles.bottomBar,
            { paddingBottom: Math.max(insets.bottom, 4) },
          ]}
        >
          <Ionicons name="home-outline" size={20} color="#D8D7FF" />

          <Pressable onPress={onOpenSales}>
            <Ionicons name="cart-outline" size={20} color="#D8D7FF" />
          </Pressable>

          <Pressable style={styles.centerBtn} onPress={onOpenSales}>
            <Ionicons name="add" size={36} color="#FFFFFF" />
          </Pressable>

          <Pressable onPress={onOpenInventory}>
            <MaterialCommunityIcons
              name="archive-outline"
              size={20}
              color="#D8D7FF"
            />
          </Pressable>

          <Pressable onPress={onOpenReports}>
            <Ionicons name="analytics-outline" size={20} color="#D8D7FF" />
          </Pressable>
        </View>
      </View>
    </ScreenContainer>
  );
}

function getUserDisplayName(user, fallback) {
  const fullName = [user?.nombres, user?.apellidos].filter(Boolean).join(" ").trim();
  return fullName || user?.username || user?.email || fallback;
}

function getInitials(name) {
  return name
    .split(" ")
    .map((part) => part[0]?.toUpperCase() || "")
    .slice(0, 2)
    .join("");
}

function getRoleLabel(role) {
  if (role === "admin") return "Admin";
  if (role === "tecnico") return "Tecnico";
  if (role === "ventas") return "Ventas";
  return role || "Usuario";
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.dashboardBg,
  },
  hero: {
    height: 196,
    paddingHorizontal: 18,
    paddingTop: 18,
    backgroundColor: colors.primary,
    overflow: "hidden",
  },
  topGlow: {
    position: "absolute",
    top: -20,
    right: 14,
    width: 132,
    height: 72,
    borderBottomLeftRadius: 100,
    borderBottomRightRadius: 100,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    backgroundColor: "rgba(166, 157, 248, 0.44)",
  },
  avatarRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 2,
    marginTop: 2,
  },
  avatarWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    flex: 1,
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#2C2B72",
    borderWidth: 2,
    borderColor: "#D7D8FD",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "#FFFFFF",
    fontFamily: fontFamilies.bold,
    fontSize: 11,
  },
  userName: {
    color: "#F2F3FF",
    fontFamily: fontFamilies.bold,
    fontSize: 20,
    lineHeight: 26,
  },
  rolePill: {
    marginTop: 2,
    backgroundColor: "#07060D",
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 1,
    alignSelf: "flex-start",
  },
  roleText: {
    color: "#FFFFFF",
    fontFamily: fontFamilies.medium,
    fontSize: 9,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 8,
  },
  logoutButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.14)",
    alignItems: "center",
    justifyContent: "center",
  },
  notificationWrap: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  badge: {
    position: "absolute",
    top: -2,
    right: -2,
    minWidth: 15,
    height: 15,
    borderRadius: 8,
    backgroundColor: "#FF4969",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 3,
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 9,
    fontFamily: fontFamilies.bold,
  },
  mainAmount: {
    marginTop: 16,
    color: "#E6E9FF",
    fontFamily: fontFamilies.bold,
    fontSize: 42,
    lineHeight: 50,
    zIndex: 2,
  },
  mainLabel: {
    color: "#DEE1FF",
    fontFamily: fontFamilies.medium,
    fontSize: 20,
    lineHeight: 23,
    zIndex: 2,
  },
  heroIcon: {
    position: "absolute",
    right: -2,
    bottom: 8,
  },
  content: {
    flex: 1,
    marginTop: -6,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: colors.dashboardBg,
    paddingTop: 10,
    paddingHorizontal: 14,
    paddingBottom: 92,
  },
  cardsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    columnGap: 8,
    marginTop: -34,
    marginBottom: 12,
  },
  sectionTitle: {
    marginTop: 4,
    marginBottom: 8,
    color: "#111111",
    fontFamily: fontFamilies.semibold,
    fontSize: 20,
  },
  optionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 10,
    marginBottom: 14,
  },
  bottomBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 76,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: "#060606",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  centerBtn: {
    marginTop: -30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    borderWidth: 3,
    borderColor: "#E7E7EF",
    alignItems: "center",
    justifyContent: "center",
  },
});