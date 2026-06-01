import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import {
  Feather,
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { SvgUri } from "react-native-svg";

import EsferaSvg from "../../../../assets/images/esfera.svg";
import { ScreenContainer } from "../../../shared/components/ScreenContainer";
import { MODULES } from "../../../shared/permissions/permissions";
import { colors } from "../../../shared/theme/colors";
import { fontFamilies } from "../../../shared/theme/fonts";
import { NotificationBell } from "../../notifications";

const summaryCards = [
  {
    id: "users",
    title: "Usuarios\nactivos",
    total: "12",
    label: "Total",
    iconPack: Feather,
    iconName: "users",
    iconBg: "#5655B9",
  },
  {
    id: "orders",
    title: "Órdenes\nactivas",
    total: "27",
    label: "Hoy",
    iconPack: MaterialCommunityIcons,
    iconName: "clipboard-list-outline",
    iconBg: "#F5AA29",
  },
  {
    id: "sales",
    title: "Ventas\ndel día",
    total: "8",
    label: "Hoy",
    iconPack: FontAwesome5,
    iconName: "cash-register",
    iconBg: "#58D2B8",
  },
];

const options = [
  {
    id: MODULES.USUARIOS,
    label: "Usuarios",
    iconPack: Feather,
    iconName: "users",
    iconColor: "#5655B9",
  },
  {
    id: MODULES.CLIENTES,
    label: "Clientes",
    iconPack: FontAwesome5,
    iconName: "id-badge",
    iconColor: "#F04C75",
  },
  {
    id: "lista_negra",
    label: "Lista negra",
    iconPack: MaterialCommunityIcons,
    iconName: "account-cancel-outline",
    iconColor: "#B91C1C",
  },
  {
    id: MODULES.EQUIPOS,
    label: "Equipos",
    iconPack: MaterialCommunityIcons,
    iconName: "monitor-dashboard",
    iconColor: "#3D3D45",
  },
  {
    id: MODULES.ORDENES,
    label: "Órdenes",
    iconPack: MaterialCommunityIcons,
    iconName: "view-dashboard",
    iconColor: "#4A40BF",
  },
  {
    id: MODULES.VENTAS,
    label: "Ventas",
    iconPack: FontAwesome5,
    iconName: "shopping-cart",
    iconColor: "#2386F5",
  },
  {
    id: MODULES.COTIZACIONES,
    label: "Cotizar",
    iconPack: MaterialCommunityIcons,
    iconName: "file-document-edit-outline",
    iconColor: "#0F766E",
  },
  {
    id: MODULES.INVENTARIO,
    label: "Inv. tienda",
    iconPack: MaterialIcons,
    iconName: "inventory",
    iconColor: "#E29217",
  },
  {
    id: "inventario_tecnico",
    label: "Inv. tecnico",
    iconPack: MaterialCommunityIcons,
    iconName: "toolbox-outline",
    iconColor: "#0F766E",
  },
  {
    id: MODULES.REPORTES,
    label: "Reportes",
    iconPack: Feather,
    iconName: "bar-chart-2",
    iconColor: "#7C3AED",
  },
  {
    id: MODULES.ROLES_PERMISOS,
    label: "Roles y permisos",
    iconPack: MaterialCommunityIcons,
    iconName: "shield-account-outline",
    iconColor: "#5655B9",
  },
  {
    id: "configuracion",
    label: "Configuracion",
    iconPack: Ionicons,
    iconName: "settings-outline",
    iconColor: "#374151",
  },
];

export function AdminDashboardScreen({
  user,
  stats = {},
  unreadNotificationsCount = 0,
  onOpenNotifications,
  onLogout,
  onOpenUsers,
  onOpenClientes,
  onOpenBlacklist,
  onOpenEquipos,
  onOpenOrders,
  onOpenSales,
  onOpenInventory,
  onOpenTechnicalInventory,
  onOpenQuotations,
  onOpenReports,
  onOpenRolesPermissions,
  onOpenSettings,
}) {
  const displayName = getUserDisplayName(user, "Administrador");
  const businessName = getBusinessName(user);
  const initials = getInitials(displayName);
  const roleLabel = getRoleLabel(user?.rol || user?.tipoUsuario || "admin");
  const summaryCards = [
    {
      id: "users",
      title: "Usuarios\nactivos",
      total: String(stats.users ?? 0),
      label: "Total",
      iconPack: Feather,
      iconName: "users",
      iconBg: "#5655B9",
    },
    {
      id: "orders",
      title: "Ordenes\nactivas",
      total: String(stats.orders ?? 0),
      label: "Total",
      iconPack: MaterialCommunityIcons,
      iconName: "clipboard-list-outline",
      iconBg: "#F5AA29",
    },
    {
      id: "sales",
      title: "Ventas\ndel dia",
      total: String(stats.sales ?? 0),
      label: "Total",
      iconPack: FontAwesome5,
      iconName: "cash-register",
      iconBg: "#58D2B8",
    },
  ];

  const esferaUri =
    typeof EsferaSvg === "number"
      ? Image.resolveAssetSource(EsferaSvg)?.uri
      : null;

  const handleOptionPress = (id) => {
    if (id === MODULES.USUARIOS) onOpenUsers?.();
    if (id === MODULES.CLIENTES) onOpenClientes?.();
    if (id === "lista_negra") onOpenBlacklist?.();
    if (id === MODULES.EQUIPOS) onOpenEquipos?.();
    if (id === MODULES.ORDENES) onOpenOrders?.();
    if (id === MODULES.VENTAS) onOpenSales?.();
    if (id === MODULES.COTIZACIONES) onOpenQuotations?.();
    if (id === MODULES.INVENTARIO) onOpenInventory?.();
    if (id === "inventario_tecnico") onOpenTechnicalInventory?.();
    if (id === MODULES.REPORTES) onOpenReports?.();
    if (id === MODULES.ROLES_PERMISOS) onOpenRolesPermissions?.();
    if (id === "configuracion") onOpenSettings?.();
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

          <Text style={styles.salesAmount}>Panel Administrativo</Text>
          <Text style={styles.salesLabel}>{businessName}</Text>

          <View style={styles.sphereWrap}>
            {typeof EsferaSvg === "number" ? (
              esferaUri ? (
                <SvgUri uri={esferaUri} width={258} height={258} />
              ) : null
            ) : (
              <EsferaSvg width={258} height={258} />
            )}
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.serviceGrid}>
            {summaryCards.map((item) => {
              const IconPack = item.iconPack;

              return (
                <View key={item.id} style={styles.serviceCard}>
                  <View style={styles.serviceHeader}>
                    <View
                      style={[
                        styles.serviceIconBox,
                        { backgroundColor: item.iconBg },
                      ]}
                    >
                      <IconPack name={item.iconName} size={16} color="#FFFFFF" />
                    </View>

                    <Text style={styles.serviceTitle}>{item.title}</Text>
                  </View>

                  <View style={styles.metricsRow}>
                    <Text style={styles.metricsMain}>{item.total}</Text>
                    <Text style={styles.metricsSub}>{item.label}</Text>
                  </View>
                </View>
              );
            })}
          </View>

          <Text style={styles.sectionTitle}>Modulos administrativos</Text>

          <View style={styles.optionsGrid}>
            {options.map((item) => {
              const IconPack = item.iconPack;

              return (
                <Pressable
                  key={item.id}
                  style={styles.optionCard}
                  onPress={() => handleOptionPress(item.id)}
                >
                  <IconPack name={item.iconName} size={20} color={item.iconColor} />
                  <Text style={styles.optionLabel}>{item.label}</Text>
                </Pressable>
              );
            })}
          </View>

          <Text style={styles.recentSectionTitle}>Resumen rapido</Text>

          <View style={styles.adminInfoCard}>
            <Text style={styles.infoTitle}>Acceso total habilitado</Text>
            <Text style={styles.infoText}>
              Desde este panel puedes administrar usuarios, clientes, equipos,
              ordenes, ventas, inventario y consultar el control de roles y
              permisos.
            </Text>
          </View>
        </View>
      </View>
    </ScreenContainer>
  );
}

function getUserDisplayName(user, fallback) {
  const fullName = [user?.nombres, user?.apellidos]
    .filter(Boolean)
    .join(" ")
    .trim();

  return fullName || user?.username || user?.email || fallback;
}

function getInitials(name) {
  return name
    .split(" ")
    .map((part) => part[0]?.toUpperCase() || "")
    .slice(0, 2)
    .join("");
}

function getBusinessName(user) {
  return (
    user?.negocio?.nombre ||
    user?.negocio?.razonSocial ||
    user?.negocioNombre ||
    user?.businessName ||
    "Gestion general del negocio"
  );
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
  salesAmount: {
    marginTop: 16,
    color: "#E6E9FF",
    fontFamily: fontFamilies.bold,
    fontSize: 30,
    lineHeight: 36,
    zIndex: 2,
  },
  salesLabel: {
    color: "#DEE1FF",
    fontFamily: fontFamilies.medium,
    fontSize: 20,
    lineHeight: 23,
    zIndex: 2,
  },
  sphereWrap: {
    position: "absolute",
    right: -100,
    top: 54,
  },
  content: {
    flex: 1,
    marginTop: -6,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: colors.dashboardBg,
    paddingTop: 10,
    paddingHorizontal: 14,
    paddingBottom: 24,
  },
  serviceGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    columnGap: 8,
    marginTop: -34,
    marginBottom: 12,
  },
  serviceCard: {
    flex: 1,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 10,
    paddingVertical: 10,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  serviceHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
    gap: 7,
  },
  serviceIconBox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  serviceTitle: {
    color: "#111111",
    fontFamily: fontFamilies.semibold,
    fontSize: 12,
    lineHeight: 13,
    flexShrink: 1,
  },
  metricsRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 4,
  },
  metricsMain: {
    fontSize: 27,
    color: "#101010",
    fontFamily: fontFamilies.bold,
    lineHeight: 35,
  },
  metricsSub: {
    fontFamily: fontFamilies.medium,
    fontSize: 13,
    lineHeight: 18,
    color: "#212121",
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
  optionCard: {
    width: "31.5%",
    backgroundColor: "#F5F5F7",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    minHeight: 78,
  },
  optionLabel: {
    marginTop: 7,
    color: "#7A7A82",
    fontFamily: fontFamilies.medium,
    fontSize: 12,
    textAlign: "center",
  },
  recentSectionTitle: {
    color: "#111111",
    fontFamily: fontFamilies.semibold,
    fontSize: 20,
    marginBottom: 10,
  },
  adminInfoCard: {
    backgroundColor: "#F5F5F7",
    borderRadius: 14,
    padding: 14,
  },
  infoTitle: {
    fontFamily: fontFamilies.semibold,
    fontSize: 15,
    color: "#111111",
    marginBottom: 4,
  },
  infoText: {
    fontFamily: fontFamilies.regular,
    fontSize: 12,
    lineHeight: 17,
    color: "#7A7A82",
  },
});
