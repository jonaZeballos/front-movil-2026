import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import {
  Feather,
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SvgUri } from "react-native-svg";

import EsferaSvg from "../../../../assets/images/esfera.svg";
import { ScreenContainer } from "../../../shared/components/ScreenContainer";
import { colors } from "../../../shared/theme/colors";
import { fontFamilies } from "../../../shared/theme/fonts";

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
    id: "usuarios",
    label: "Usuarios",
    iconPack: Feather,
    iconName: "users",
    iconColor: "#5655B9",
  },
  {
    id: "clientes",
    label: "Clientes",
    iconPack: FontAwesome5,
    iconName: "id-badge",
    iconColor: "#F04C75",
  },
  {
    id: "equipos",
    label: "Equipos",
    iconPack: MaterialCommunityIcons,
    iconName: "monitor-dashboard",
    iconColor: "#3D3D45",
  },
  {
    id: "ordenes",
    label: "Órdenes",
    iconPack: MaterialCommunityIcons,
    iconName: "view-dashboard",
    iconColor: "#4A40BF",
  },
  {
    id: "ventas",
    label: "Ventas",
    iconPack: FontAwesome5,
    iconName: "shopping-cart",
    iconColor: "#2386F5",
  },
  {
    id: "inventario",
    label: "Inventario",
    iconPack: MaterialIcons,
    iconName: "inventory",
    iconColor: "#E29217",
  },
];

export function AdminDashboardScreen({
  onOpenUsers,
  onOpenClientes,
  onOpenEquipos,
  onOpenOrders,
  onOpenSales,
  onOpenInventory,
}) {
  const insets = useSafeAreaInsets();

  const esferaUri =
    typeof EsferaSvg === "number"
      ? Image.resolveAssetSource(EsferaSvg)?.uri
      : null;

  const handleOptionPress = (id) => {
    if (id === "usuarios") onOpenUsers?.();
    if (id === "clientes") onOpenClientes?.();
    if (id === "equipos") onOpenEquipos?.();
    if (id === "ordenes") onOpenOrders?.();
    if (id === "ventas") onOpenSales?.();
    if (id === "inventario") onOpenInventory?.();
  };

  return (
    <ScreenContainer backgroundColor={colors.primary} edges={["top"]}>
      <View style={styles.root}>
        <View style={styles.hero}>
          <View style={styles.topGlow} />

          <View style={styles.avatarRow}>
            <View style={styles.avatarWrap}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>AD</Text>
              </View>

              <View>
                <Text style={styles.userName}>Administrador</Text>
                <View style={styles.rolePill}>
                  <Text style={styles.roleText}>Admin principal</Text>
                </View>
              </View>
            </View>

            <View style={styles.notificationWrap}>
              <Ionicons name="notifications-outline" size={19} color="#FFFFFF" />
              <View style={styles.badge}>
                <Text style={styles.badgeText}>5</Text>
              </View>
            </View>
          </View>

          <Text style={styles.salesAmount}>Panel</Text>
          <Text style={styles.salesLabel}>Control general del sistema</Text>

          <View style={styles.sphereWrap}>
            {typeof EsferaSvg === "number" ? (
              esferaUri ? <SvgUri uri={esferaUri} width={258} height={258} /> : null
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
                    <View style={[styles.serviceIconBox, { backgroundColor: item.iconBg }]}>
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

          <Text style={styles.sectionTitle}>Módulos administrativos</Text>

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

          <Text style={styles.recentSectionTitle}>Resumen rápido</Text>

          <View style={styles.adminInfoCard}>
            <Text style={styles.infoTitle}>Acceso total habilitado</Text>
            <Text style={styles.infoText}>
              Desde este panel podrás administrar usuarios, clientes, equipos,
              órdenes, ventas e inventario.
            </Text>
          </View>
        </View>

        <View
          style={[
            styles.bottomBar,
            { paddingBottom: Math.max(insets.bottom, 4) },
          ]}
        >
          <Ionicons name="home-outline" size={20} color="#D8D7FF" />
          <Feather name="users" size={18} color="#D8D7FF" />
          <Pressable style={styles.centerBtn} onPress={onOpenUsers}>
            <Ionicons name="add" size={36} color="#FFFFFF" />
          </Pressable>
          <Feather name="bar-chart-2" size={18} color="#D8D7FF" />
          <Ionicons name="person" size={20} color="#D8D7FF" />
        </View>
      </View>
    </ScreenContainer>
  );
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
    fontSize: 42,
    lineHeight: 50,
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
    paddingBottom: 92,
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