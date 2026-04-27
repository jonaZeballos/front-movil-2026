import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import {
  MaterialCommunityIcons,
  Ionicons,
  MaterialIcons,
  FontAwesome5,
  Feather,
} from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SvgUri } from "react-native-svg";

import EsferaSvg from "../../../../assets/images/esfera.svg";
import { ScreenContainer } from "../../../shared/components/ScreenContainer";
import { colors } from "../../../shared/theme/colors";
import { fontFamilies } from "../../../shared/theme/fonts";

const serviceCards = [
  {
    id: "pending",
    title: "Ordenes\npendientes",
    total: "7",
    totalLabel: "Hoy",
    statPrimary: "4",
    statPrimaryLabel: "Urg.",
    statSecondary: "3",
    statSecondaryLabel: "Nvas.",
    trend: "4 equipos",
    trendLabel: "entran hoy a revision",
    iconPack: MaterialIcons,
    iconName: "computer",
    iconBg: "#F5AA29",
  },
  {
    id: "diagnosis",
    title: "En\ndiagnostico",
    total: "12",
    totalLabel: "Act.",
    statPrimary: "8",
    statPrimaryLabel: "Rev.",
    statSecondary: "4",
    statSecondaryLabel: "Piez.",
    trend: "3 ordenes",
    trendLabel: "esperan respuesta del cliente",
    iconPack: MaterialCommunityIcons,
    iconName: "progress-wrench",
    iconBg: "#58D2B8",
    trendColor: "#2386F5",
  },
  {
    id: "ready",
    title: "Listas para\nentrega",
    total: "8",
    totalLabel: "Prep.",
    statPrimary: "5",
    statPrimaryLabel: "Avis.",
    statSecondary: "3",
    statSecondaryLabel: "Hoy",
    trend: "5 ordenes",
    trendLabel: "pueden cerrarse hoy",
    iconPack: Feather,
    iconName: "check-circle",
    iconBg: "#3F7AFD",
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
    id: "equipos",
    label: "Equipos",
    iconPack: MaterialCommunityIcons,
    iconName: "monitor-dashboard",
    iconColor: "#3D3D45",
  },
  {
    id: "ordenes",
    label: "Ordenes",
    iconPack: MaterialCommunityIcons,
    iconName: "view-dashboard",
    iconColor: "#4A40BF",
  },
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
    status: "En diagnostico",
    code: "#0023",
    name: "Pedro Perez",
    iconPack: MaterialCommunityIcons,
    iconName: "hammer-wrench",
    iconColor: "#2386F5",
  },
  {
    id: "0213",
    status: "Lista",
    code: "#0213",
    name: "Kim Granger",
    iconPack: MaterialCommunityIcons,
    iconName: "check-decagram",
    iconColor: "#67AF28",
  },
];

export function HomeScreen({ onOpenOrders }) {
  const insets = useSafeAreaInsets();
  const esferaUri =
    typeof EsferaSvg === "number"
      ? Image.resolveAssetSource(EsferaSvg)?.uri
      : null;

  const handleOpenOrders = () => {
    if (onOpenOrders) {
      onOpenOrders();
    }
  };

  return (
    <ScreenContainer backgroundColor={colors.primary} edges={["top"]}>
      <View style={styles.root}>
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
                  <Text style={styles.roleText}>Tecnico</Text>
                </View>
              </View>
            </View>

            <View style={styles.notificationWrap}>
              <Ionicons
                name="notifications-outline"
                size={19}
                color="#FFFFFF"
              />
              <View style={styles.badge}>
                <Text style={styles.badgeText}>3</Text>
              </View>
            </View>
          </View>

          <Text style={styles.salesAmount}>27</Text>
          <Text style={styles.salesLabel}>Ordenes activas</Text>

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
            {serviceCards.map((item, index) => {
              const IconPack = item.iconPack;
              const isLargeMetric = item.total.length > 3;
              const isWideCard = index === 2;

              return (
                <Pressable
                  key={item.id}
                  style={[
                    styles.serviceCard,
                    isWideCard ? styles.serviceCardWide : styles.serviceCardHalf,
                  ]}
                  onPress={handleOpenOrders}
                >
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
                    <Text
                      style={[
                        styles.metricsMain,
                        isLargeMetric && styles.metricsMainCompact,
                      ]}
                      numberOfLines={1}
                    >
                      {item.total}
                    </Text>
                    <Text style={styles.metricsSub}>{item.totalLabel}</Text>
                    <View style={styles.metricsDivider} />
                    <View>
                      <Text style={styles.metricsRight}>
                        <Text style={styles.metricsBlue}>{item.statPrimary}</Text>{" "}
                        {item.statPrimaryLabel}
                      </Text>
                      <Text style={styles.metricsRight}>
                        <Text style={styles.metricsRed}>
                          {item.statSecondary}
                        </Text>{" "}
                        {item.statSecondaryLabel}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.trendText}>
                    <Text style={{ color: item.trendColor || "#29B45A" }}>
                      {item.trend}
                    </Text>{" "}
                    {item.trendLabel}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <Text style={styles.sectionTitle}>Accesos rapidos</Text>
          <View style={styles.optionsGrid}>
            {options.map((item) => {
              const IconPack = item.iconPack;
              const isOrdersOption = item.id === "ordenes";

              return (
                <Pressable
                  key={item.id}
                  style={styles.optionCard}
                  onPress={isOrdersOption ? handleOpenOrders : undefined}
                >
                  <IconPack name={item.iconName} size={20} color={item.iconColor} />
                  <Text style={styles.optionLabel}>{item.label}</Text>
                </Pressable>
              );
            })}
          </View>

          <View style={styles.recentTitleRow}>
            <Text style={styles.recentSectionTitle}>
              Ultimas ordenes asignadas
            </Text>
            <Pressable onPress={handleOpenOrders}>
              <Text style={styles.seeAll}>Ver todas</Text>
            </Pressable>
          </View>

          <View style={styles.recentRow}>
            {recentOrders.map((order) => {
              const IconPack = order.iconPack;

              return (
                <Pressable
                  key={order.id}
                  style={styles.recentCard}
                  onPress={handleOpenOrders}
                >
                  <Text style={styles.recentStatus}>{order.status}</Text>
                  <View
                    style={[
                      styles.recentIconWrap,
                      { backgroundColor: order.iconColor },
                    ]}
                  >
                    <IconPack name={order.iconName} size={15} color="#FFFFFF" />
                  </View>
                  <Text style={styles.recentCode}>{order.code}</Text>
                  <Text style={styles.recentName}>{order.name}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View
          style={[
            styles.bottomBar,
            { paddingBottom: Math.max(insets.bottom, 4) },
          ]}
        >
          <Ionicons name="home-outline" size={20} color="#D8D7FF" />
          <MaterialCommunityIcons
            name="briefcase-account-outline"
            size={20}
            color="#D8D7FF"
          />
          <Pressable style={styles.centerBtn} onPress={handleOpenOrders}>
            <Ionicons name="add" size={36} color="#FFFFFF" />
          </Pressable>
          <Feather name="tag" size={18} color="#D8D7FF" />
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
    paddingTop: 1,
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
    paddingTop: 1,
    zIndex: 2,
  },
  salesLabel: {
    marginTop: 0,
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
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 10,
    marginTop: -34,
    marginBottom: 8,
  },
  serviceCard: {
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 11,
    paddingVertical: 9,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  serviceCardHalf: {
    width: "48.5%",
    minHeight: 104,
  },
  serviceCardWide: {
    width: "100%",
    minHeight: 100,
  },
  serviceHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
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
    fontSize: 13,
    lineHeight: 14,
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
    paddingTop: 2,
    includeFontPadding: false,
  },
  metricsMainCompact: {
    fontSize: 23,
    lineHeight: 31,
    paddingTop: 2,
  },
  metricsSub: {
    fontFamily: fontFamilies.medium,
    fontSize: 14,
    lineHeight: 18,
    color: "#212121",
  },
  metricsDivider: {
    width: 1,
    height: 22,
    backgroundColor: "#D9D9D9",
    marginHorizontal: 3,
  },
  metricsRight: {
    fontSize: 10,
    lineHeight: 13,
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
    marginTop: 3,
    fontSize: 10,
    color: "#8A8A92",
    lineHeight: 12,
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
    justifyContent: "space-between",
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
  recentTitleRow: {
    marginTop: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    columnGap: 8,
  },
  seeAll: {
    color: "#A0A0A7",
    fontFamily: fontFamilies.medium,
    fontSize: 12,
  },
  recentSectionTitle: {
    color: "#111111",
    fontFamily: fontFamilies.semibold,
    fontSize: 20,
    flexShrink: 1,
  },
  recentRow: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "stretch",
  },
  recentCard: {
    width: "31.5%",
    borderRadius: 12,
    backgroundColor: "#F5F5F7",
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  recentStatus: {
    fontFamily: fontFamilies.semibold,
    color: "#171717",
    fontSize: 11,
  },
  recentIconWrap: {
    marginTop: 6,
    width: 30,
    height: 30,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  recentCode: {
    marginTop: 6,
    fontFamily: fontFamilies.medium,
    fontSize: 19,
    color: "#1B1B1B",
    lineHeight: 20,
  },
  recentName: {
    marginTop: 2,
    color: "#8E8E96",
    fontFamily: fontFamilies.regular,
    fontSize: 10,
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
