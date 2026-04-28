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
];

const chartData = [42, 68, 50, 78, 62, 90, 74];

export function SalesDashboardScreen({
  onOpenClientes,
  onOpenInventory,
  onOpenSales,
}) {
  const insets = useSafeAreaInsets();

  const handleOptionPress = (id) => {
    if (id === "clientes") onOpenClientes?.();
    if (id === "inventario") onOpenInventory?.();
    if (id === "ventas") onOpenSales?.();
  };

  return (
    <ScreenContainer backgroundColor={colors.primary} edges={["top"]}>
      <View style={styles.root}>
        <View style={styles.hero}>
          <View style={styles.topGlow} />

          <View style={styles.avatarRow}>
            <View style={styles.avatarWrap}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>VT</Text>
              </View>

              <View>
                <Text style={styles.userName}>Ventas</Text>
                <View style={styles.rolePill}>
                  <Text style={styles.roleText}>Área comercial</Text>
                </View>
              </View>
            </View>

            <View style={styles.notificationWrap}>
              <Ionicons name="notifications-outline" size={19} color="#FFFFFF" />
              <View style={styles.badge}>
                <Text style={styles.badgeText}>2</Text>
              </View>
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
            {salesCards.map((item) => {
              const IconPack = item.iconPack;

              return (
                <View key={item.id} style={styles.salesCard}>
                  <View style={styles.cardTop}>
                    <View style={[styles.iconBox, { backgroundColor: item.iconBg }]}>
                      <IconPack name={item.iconName} size={15} color="#FFFFFF" />
                    </View>
                    <Text style={styles.cardTitle}>{item.title}</Text>
                  </View>

                  <View style={styles.metricRow}>
                    <Text
                      style={[
                        styles.metricValue,
                        item.value.length > 4 && styles.metricValueSmall,
                      ]}
                    >
                      {item.value}
                    </Text>
                    <Text style={styles.metricLabel}>{item.label}</Text>
                  </View>
                </View>
              );
            })}
          </View>

          <Text style={styles.sectionTitle}>Accesos comerciales</Text>

          <View style={styles.optionsGrid}>
            {options.map((item) => {
              const IconPack = item.iconPack;

              return (
                <Pressable
                  key={item.id}
                  style={styles.optionCard}
                  onPress={() => handleOptionPress(item.id)}
                >
                  <IconPack name={item.iconName} size={22} color={item.iconColor} />
                  <Text style={styles.optionLabel}>{item.label}</Text>
                </Pressable>
              );
            })}
          </View>

          <View style={styles.chartCard}>
            <View style={styles.chartHeader}>
              <View>
                <Text style={styles.chartTitle}>Estadísticas de ventas</Text>
                <Text style={styles.chartSubtitle}>Movimiento semanal</Text>
              </View>

              <View style={styles.chartBadge}>
                <Text style={styles.chartBadgeText}>+18%</Text>
              </View>
            </View>

            <View style={styles.chartBars}>
              {chartData.map((height, index) => (
                <View key={index} style={styles.barWrap}>
                  <View style={[styles.bar, { height }]} />
                  <Text style={styles.barLabel}>
                    {["L", "M", "M", "J", "V", "S", "D"][index]}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.noteCard}>
            <View style={styles.noteIcon}>
              <Feather name="info" size={18} color="#FFFFFF" />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.noteTitle}>Resumen comercial</Text>
              <Text style={styles.noteText}>
                Revisa productos disponibles, registra ventas y consulta clientes
                antes de completar una operación.
              </Text>
            </View>
          </View>
        </View>

        <View
          style={[
            styles.bottomBar,
            { paddingBottom: Math.max(insets.bottom, 4) },
          ]}
        >
          <Ionicons name="home-outline" size={20} color="#D8D7FF" />
          <Ionicons name="cart-outline" size={20} color="#D8D7FF" />
          <Pressable style={styles.centerBtn} onPress={onOpenSales}>
            <Ionicons name="add" size={36} color="#FFFFFF" />
          </Pressable>
          <MaterialCommunityIcons name="archive-outline" size={20} color="#D8D7FF" />
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
  salesCard: {
    flex: 1,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 10,
    paddingVertical: 10,
    elevation: 3,
  },
  cardTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    marginBottom: 4,
  },
  iconBox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  cardTitle: {
    color: "#111111",
    fontFamily: fontFamilies.semibold,
    fontSize: 12,
    lineHeight: 13,
    flexShrink: 1,
  },
  metricRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 4,
  },
  metricValue: {
    fontFamily: fontFamilies.bold,
    fontSize: 26,
    lineHeight: 34,
    color: "#101010",
  },
  metricValueSmall: {
    fontSize: 18,
  },
  metricLabel: {
    fontFamily: fontFamilies.medium,
    fontSize: 13,
    color: "#212121",
    marginBottom: 5,
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
  chartCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 14,
    marginBottom: 12,
  },
  chartHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  chartTitle: {
    fontFamily: fontFamilies.semibold,
    fontSize: 16,
    color: "#111111",
  },
  chartSubtitle: {
    marginTop: 2,
    fontFamily: fontFamilies.regular,
    fontSize: 12,
    color: "#7A7A82",
  },
  chartBadge: {
    backgroundColor: "#E9F8F1",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  chartBadgeText: {
    color: "#29B45A",
    fontFamily: fontFamilies.bold,
    fontSize: 12,
  },
  chartBars: {
    height: 110,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  barWrap: {
    alignItems: "center",
    justifyContent: "flex-end",
  },
  bar: {
    width: 20,
    borderRadius: 999,
    backgroundColor: colors.primary,
  },
  barLabel: {
    marginTop: 6,
    fontFamily: fontFamilies.medium,
    fontSize: 11,
    color: "#7A7A82",
  },
  noteCard: {
    backgroundColor: "#F5F5F7",
    borderRadius: 14,
    padding: 14,
    flexDirection: "row",
    gap: 12,
  },
  noteIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  noteTitle: {
    fontFamily: fontFamilies.semibold,
    fontSize: 15,
    color: "#111111",
  },
  noteText: {
    marginTop: 4,
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