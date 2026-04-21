import { ScrollView, StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons, Ionicons, MaterialIcons, FontAwesome5, Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Circle, ClipPath, Defs, Ellipse, G, LinearGradient, Path, RadialGradient, Stop } from "react-native-svg";

import { ScreenContainer } from "../../../shared/components/ScreenContainer";
import { colors } from "../../../shared/theme/colors";
import { fontFamilies } from "../../../shared/theme/fonts";

const serviceCards = [
  {
    id: "orders",
    title: "Ordenes de\nservicio",
    total: "27",
    totalLabel: "Tot.",
    confirm: "20",
    pending: "7",
    trend: "+10%",
    trendLabel: "que la semana anterior",
    iconPack: MaterialIcons,
    iconName: "computer",
    iconBg: "#F5AA29",
  },
  {
    id: "sales",
    title: "Ventas",
    total: "7819$",
    totalLabel: "Mes",
    confirm: "132",
    pending: "11",
    trend: "-22%",
    trendLabel: "que la semana anterior",
    iconPack: MaterialCommunityIcons,
    iconName: "file-chart",
    iconBg: "#58D2B8",
    trendColor: "#E54848",
  },
  {
    id: "clients",
    title: "Clientes",
    total: "95",
    totalLabel: "Act.",
    confirm: "16",
    pending: "5",
    trend: "+4%",
    trendLabel: "que la semana anterior",
    iconPack: Feather,
    iconName: "users",
    iconBg: "#3F7AFD",
  },
];

const options = [
  { id: "clientes", label: "Clientes", iconPack: FontAwesome5, iconName: "id-badge", iconColor: "#F04C75" },
  { id: "equipos", label: "Equipos", iconPack: MaterialCommunityIcons, iconName: "monitor-dashboard", iconColor: "#3D3D45" },
  { id: "ordenes", label: "Ordenes", iconPack: MaterialCommunityIcons, iconName: "view-dashboard", iconColor: "#4A40BF" },
  { id: "ventas", label: "Ventas", iconPack: MaterialCommunityIcons, iconName: "cash-fast", iconColor: "#F5AA29" },
  { id: "inventario", label: "Inventario", iconPack: MaterialCommunityIcons, iconName: "receipt-text", iconColor: "#58D2B8" },
  { id: "config", label: "Configuracion", iconPack: Ionicons, iconName: "settings-outline", iconColor: "#232227" },
];

const recentOrders = [
  {
    id: "0012",
    status: "Pendiente",
    code: "#0012",
    name: "Juan Soliz",
    iconPack: MaterialCommunityIcons,
    iconName: "file-document-outline",
    iconColor: "#E29217",
  },
  {
    id: "0023",
    status: "En progreso",
    code: "#0023",
    name: "Pedro Perez",
    iconPack: MaterialCommunityIcons,
    iconName: "hammer-wrench",
    iconColor: "#2386F5",
  },
  {
    id: "0213",
    status: "Finalizada",
    code: "#0213",
    name: "Kim Granger",
    iconPack: MaterialCommunityIcons,
    iconName: "check-decagram",
    iconColor: "#67AF28",
  },
];

export function HomeScreen() {
  const insets = useSafeAreaInsets();

  return (
    <ScreenContainer backgroundColor={colors.primary}>
      <View style={styles.root}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 132 + Math.max(insets.bottom, 10) }}
        >
          <View style={styles.hero}>
            <View style={styles.topGlow} />
            <View style={styles.avatarRow}>
              <View style={styles.avatarWrap}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>AG</Text>
                </View>
                <View>
                  <Text style={styles.userName}>Alex G.</Text>
                  <View style={styles.rolePill}>
                    <Text style={styles.roleText}>Ventas</Text>
                  </View>
                </View>
              </View>

              <View style={styles.notificationWrap}>
                <Ionicons name="notifications-outline" size={22} color="#FFFFFF" />
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>3</Text>
                </View>
              </View>
            </View>

            <Text style={styles.salesAmount}>7819$</Text>
            <Text style={styles.salesLabel}>Ventas hoy</Text>

            <View style={styles.sphereWrap}>
              <SphereGraphic />
            </View>
          </View>

          <View style={styles.content}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.serviceRow}
              decelerationRate="fast"
              snapToInterval={226}
            >
              {serviceCards.map((item) => {
                const IconPack = item.iconPack;

                return (
                  <View key={item.id} style={styles.serviceCard}>
                    <View style={styles.serviceHeader}>
                      <View style={[styles.serviceIconBox, { backgroundColor: item.iconBg }]}>
                        <IconPack name={item.iconName} size={20} color="#FFFFFF" />
                      </View>
                      <Text style={styles.serviceTitle}>{item.title}</Text>
                    </View>

                    <View style={styles.metricsRow}>
                      <Text style={styles.metricsMain}>{item.total}</Text>
                      <Text style={styles.metricsSub}>{item.totalLabel}</Text>
                      <View style={styles.metricsDivider} />
                      <View>
                        <Text style={styles.metricsRight}>
                          <Text style={styles.metricsBlue}>{item.confirm}</Text> Confirm.
                        </Text>
                        <Text style={styles.metricsRight}>
                          <Text style={styles.metricsRed}>{item.pending}</Text> Pend.
                        </Text>
                      </View>
                    </View>

                    <Text style={styles.trendText}>
                      <Text style={{ color: item.trendColor || "#29B45A" }}>{item.trend}</Text> {item.trendLabel}
                    </Text>
                  </View>
                );
              })}
            </ScrollView>

            <Text style={styles.sectionTitle}>Opciones</Text>
            <View style={styles.optionsGrid}>
              {options.map((item) => {
                const IconPack = item.iconPack;
                return (
                  <View key={item.id} style={styles.optionCard}>
                    <IconPack name={item.iconName} size={28} color={item.iconColor} />
                    <Text style={styles.optionLabel}>{item.label}</Text>
                  </View>
                );
              })}
            </View>

            <View style={styles.recentTitleRow}>
              <Text style={styles.sectionTitle}>Ordenes de servicio recientes</Text>
              <Text style={styles.seeAll}>Ver todas →</Text>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.recentRow}>
              {recentOrders.map((order) => {
                const IconPack = order.iconPack;
                return (
                  <View key={order.id} style={styles.recentCard}>
                    <Text style={styles.recentStatus}>{order.status}</Text>
                    <View style={[styles.recentIconWrap, { backgroundColor: order.iconColor }]}>
                      <IconPack name={order.iconName} size={19} color="#FFFFFF" />
                    </View>
                    <Text style={styles.recentCode}>{order.code}</Text>
                    <Text style={styles.recentName}>{order.name}</Text>
                  </View>
                );
              })}
            </ScrollView>
          </View>
        </ScrollView>

        <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 10) }]}>
          <Ionicons name="home-outline" size={22} color="#D8D7FF" />
          <MaterialCommunityIcons name="briefcase-account-outline" size={22} color="#D8D7FF" />
          <View style={styles.centerBtn}>
            <Ionicons name="add" size={44} color="#FFFFFF" />
          </View>
          <Feather name="tag" size={20} color="#D8D7FF" />
          <Ionicons name="person" size={22} color="#D8D7FF" />
        </View>
      </View>
    </ScreenContainer>
  );
}

function SphereGraphic() {
  return (
    <Svg width="356" height="356" viewBox="0 0 520 520" fill="none">
      <Defs>
        <RadialGradient id="sphereBase" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(360 160) rotate(132) scale(470)">
          <Stop offset="0" stopColor="#6F6F74" />
          <Stop offset="0.38" stopColor="#2D2E33" />
          <Stop offset="0.75" stopColor="#111216" />
          <Stop offset="1" stopColor="#050609" />
        </RadialGradient>

        <RadialGradient id="innerGlow" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(370 170) rotate(130) scale(260)">
          <Stop offset="0" stopColor="#A8A9AF" stopOpacity="0.35" />
          <Stop offset="1" stopColor="#A8A9AF" stopOpacity="0" />
        </RadialGradient>

        <LinearGradient id="rimLight" x1="130" y1="160" x2="420" y2="240" gradientUnits="userSpaceOnUse">
          <Stop stopColor="#FFFFFF" stopOpacity="0.3" />
          <Stop offset="1" stopColor="#FFFFFF" stopOpacity="0.03" />
        </LinearGradient>

        <ClipPath id="sphereClip">
          <Circle cx="260" cy="260" r="252" />
        </ClipPath>
      </Defs>

      <Circle cx="260" cy="260" r="252" fill="url(#sphereBase)" />
      <Circle cx="260" cy="260" r="252" fill="url(#innerGlow)" />

      <G clipPath="url(#sphereClip)">
        <Path d="M59 221C116 146 234 111 332 132C389 145 435 177 464 221" stroke="url(#rimLight)" strokeWidth="44" strokeLinecap="round" />
        <Ellipse cx="230" cy="354" rx="170" ry="125" fill="#000000" fillOpacity="0.22" />
        <Path d="M132 272L172 236L196 279L155 316L132 272Z" fill="#B8BABF" fillOpacity="0.42" />
      </G>
    </Svg>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.dashboardBg,
  },
  hero: {
    height: 306,
    paddingHorizontal: 30,
    paddingTop: 20,
    backgroundColor: colors.primary,
    overflow: "hidden",
  },
  topGlow: {
    position: "absolute",
    top: -34,
    right: 20,
    width: 188,
    height: 102,
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
  },
  avatarWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#2C2B72",
    borderWidth: 2,
    borderColor: "#D7D8FD",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "#FFFFFF",
    fontFamily: fontFamilies.bold,
    fontSize: 15,
  },
  userName: {
    color: "#F2F3FF",
    fontFamily: fontFamilies.bold,
    fontSize: 33,
    lineHeight: 22,
  },
  rolePill: {
    marginTop: 6,
    backgroundColor: "#07060D",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 2,
    alignSelf: "flex-start",
  },
  roleText: {
    color: "#FFFFFF",
    fontFamily: fontFamilies.medium,
    fontSize: 12,
  },
  notificationWrap: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  badge: {
    position: "absolute",
    top: -2,
    right: -2,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#FF4969",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontFamily: fontFamilies.bold,
  },
  salesAmount: {
    marginTop: 34,
    color: "#E6E9FF",
    fontFamily: fontFamilies.bold,
    fontSize: 66,
    lineHeight: 66,
    zIndex: 2,
  },
  salesLabel: {
    marginTop: 6,
    color: "#DEE1FF",
    fontFamily: fontFamilies.medium,
    fontSize: 35,
    zIndex: 2,
  },
  sphereWrap: {
    position: "absolute",
    right: -114,
    top: 100,
  },
  content: {
    marginTop: -50,
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    backgroundColor: colors.dashboardBg,
    paddingTop: 6,
    paddingHorizontal: 20,
  },
  serviceRow: {
    gap: 18,
    paddingRight: 26,
    paddingBottom: 12,
  },
  serviceCard: {
    width: 208,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 18,
    paddingVertical: 16,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.09,
    shadowRadius: 14,
    elevation: 4,
  },
  serviceHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    gap: 12,
  },
  serviceIconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  serviceTitle: {
    color: "#111111",
    fontFamily: fontFamilies.semibold,
    fontSize: 19,
    lineHeight: 20,
    flexShrink: 1,
  },
  metricsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  metricsMain: {
    fontSize: 50,
    color: "#101010",
    fontFamily: fontFamilies.bold,
    lineHeight: 52,
  },
  metricsSub: {
    fontFamily: fontFamilies.medium,
    fontSize: 34,
    color: "#212121",
    marginRight: 2,
  },
  metricsDivider: {
    width: 1,
    height: 38,
    backgroundColor: "#D9D9D9",
    marginHorizontal: 3,
  },
  metricsRight: {
    fontSize: 20,
    lineHeight: 26,
    color: "#8A8A92",
  },
  metricsBlue: {
    color: "#4765FF",
    fontFamily: fontFamilies.medium,
  },
  metricsRed: {
    color: "#E74C4C",
    fontFamily: fontFamilies.medium,
  },
  trendText: {
    marginTop: 8,
    fontSize: 20,
    color: "#8A8A92",
    lineHeight: 28,
  },
  sectionTitle: {
    marginTop: 8,
    marginBottom: 12,
    color: "#111111",
    fontFamily: fontFamilies.semibold,
    fontSize: 31,
  },
  optionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 14,
  },
  optionCard: {
    width: "31%",
    backgroundColor: "#F5F5F7",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    minHeight: 104,
  },
  optionLabel: {
    marginTop: 10,
    color: "#7A7A82",
    fontFamily: fontFamilies.medium,
    fontSize: 17,
  },
  recentTitleRow: {
    marginTop: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  seeAll: {
    color: "#A0A0A7",
    fontFamily: fontFamilies.medium,
    fontSize: 20,
  },
  recentRow: {
    gap: 12,
    paddingBottom: 8,
    paddingRight: 24,
  },
  recentCard: {
    width: 112,
    borderRadius: 16,
    backgroundColor: "#F5F5F7",
    paddingVertical: 12,
    alignItems: "center",
  },
  recentStatus: {
    fontFamily: fontFamilies.semibold,
    color: "#171717",
    fontSize: 15,
  },
  recentIconWrap: {
    marginTop: 10,
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  recentCode: {
    marginTop: 10,
    fontFamily: fontFamilies.medium,
    fontSize: 28,
    color: "#1B1B1B",
    lineHeight: 30,
  },
  recentName: {
    marginTop: 6,
    color: "#8E8E96",
    fontFamily: fontFamilies.regular,
    fontSize: 14,
  },
  bottomBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 90,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: "#060606",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: 26,
  },
  centerBtn: {
    marginTop: -42,
    width: 74,
    height: 74,
    borderRadius: 37,
    backgroundColor: colors.primary,
    borderWidth: 3,
    borderColor: "#E7E7EF",
    alignItems: "center",
    justifyContent: "center",
  },
});
