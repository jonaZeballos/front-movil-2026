import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";

import { colors } from "../theme/colors";

const NAV_ITEMS = {
  admin: [
    { label: "Inicio", icon: "home-outline", route: "AdminDashboard" },
    { label: "Clientes", icon: "people-outline", route: "Clientes" },
    { label: "Ordenes", icon: "document-text-outline", route: "OrdersList" },
    { label: "Ventas", icon: "cart-outline", route: "RegisterSale" },
    { label: "Mas", icon: "ellipsis-horizontal-outline", type: "more" },
  ],
  tecnico: [
    { label: "Inicio", icon: "home-outline", route: "Home" },
    { label: "Ordenes", icon: "document-text-outline", route: "OrdersList" },
    { label: "Equipos", icon: "laptop-outline", route: "EquipmentList" },
    { label: "Cotizar", icon: "calculator-outline", route: "Cotizaciones" },
    { label: "Mas", icon: "ellipsis-horizontal-outline", type: "more" },
  ],
  ventas: [
    { label: "Inicio", icon: "home-outline", route: "SalesDashboard" },
    { label: "Ventas", icon: "receipt-outline", route: "RegisterSale" },
    { label: "Inventario", icon: "cube-outline", route: "InventarioTienda" },
    { label: "Clientes", icon: "people-outline", route: "Clientes" },
    { label: "Mas", icon: "ellipsis-horizontal-outline", type: "more" },
  ],
};

const MORE_ITEMS = {
  admin: [
    { label: "Reportes", icon: "bar-chart-outline", route: "Reports" },
    { label: "Roles y permisos", icon: "shield-checkmark-outline", route: "RolesPermissions" },
    { label: "Notificaciones", icon: "notifications-outline", route: "Notifications" },
    { label: "Cerrar sesion", icon: "log-out-outline", action: "logout", danger: true },
  ],
  tecnico: [
    { label: "Notificaciones", icon: "notifications-outline", route: "Notifications" },
    { label: "Cerrar sesion", icon: "log-out-outline", action: "logout", danger: true },
  ],
  ventas: [
    { label: "Notificaciones", icon: "notifications-outline", route: "Notifications" },
    { label: "Cerrar sesion", icon: "log-out-outline", action: "logout", danger: true },
  ],
};

export function RoleBottomNav({ role, currentRoute, onNavigate, onLogout }) {
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const normalizedRole = String(role || "").toLowerCase();
  const items = NAV_ITEMS[normalizedRole] || NAV_ITEMS.tecnico;
  const moreItems = MORE_ITEMS[normalizedRole] || MORE_ITEMS.tecnico;

  const handleItemPress = (item) => {
    if (item.type === "more") {
      setIsMoreOpen(true);
      return;
    }

    onNavigate?.(item.route);
  };

  const handleMorePress = (item) => {
    setIsMoreOpen(false);

    if (item.action === "logout") {
      onLogout?.();
      return;
    }

    onNavigate?.(item.route);
  };

  return (
    <>
      <View style={styles.wrapper}>
        {items.map((item) => {
          const active =
            currentRoute === item.route ||
            (item.type === "more" && moreItems.some((option) => option.route === currentRoute));

          return (
            <Pressable
              key={item.route || item.type}
              style={[styles.item, active && styles.itemActive]}
              onPress={() => handleItemPress(item)}
            >
              <Ionicons
                name={item.icon}
                size={20}
                color={active ? colors.primary : "#6B7280"}
              />
              <Text style={[styles.label, active && styles.labelActive]} numberOfLines={1}>
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Modal
        visible={isMoreOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsMoreOpen(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setIsMoreOpen(false)}>
          <Pressable style={styles.moreSheet} onPress={() => {}}>
            <Text style={styles.moreTitle}>Mas opciones</Text>
            {moreItems.map((item) => (
              <Pressable
                key={item.route || item.action}
                style={styles.moreItem}
                onPress={() => handleMorePress(item)}
              >
                <View style={[styles.moreIcon, item.danger && styles.moreIconDanger]}>
                  <Ionicons
                    name={item.icon}
                    size={19}
                    color={item.danger ? "#DC2626" : colors.primary}
                  />
                </View>
                <Text style={[styles.moreLabel, item.danger && styles.moreLabelDanger]}>
                  {item.label}
                </Text>
              </Pressable>
            ))}
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 8,
    paddingVertical: 4,
    shadowColor: colors.primary,
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: -2 },
    elevation: 0,
  },
  item: {
    flex: 1,
    minHeight: 42,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    rowGap: 3,
  },
  itemActive: {
    backgroundColor: "#F1F0FF",
  },
  label: {
    color: "#6B7280",
    fontSize: 10,
    fontWeight: "800",
  },
  labelActive: {
    color: colors.primary,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(17, 24, 39, 0.35)",
    padding: 16,
  },
  moreSheet: {
    borderRadius: 24,
    backgroundColor: "#FFFFFF",
    padding: 16,
  },
  moreTitle: {
    color: "#111827",
    fontSize: 16,
    fontWeight: "900",
    marginBottom: 10,
  },
  moreItem: {
    minHeight: 52,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    columnGap: 12,
  },
  moreIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F1F0FF",
  },
  moreIconDanger: {
    backgroundColor: "#FEF2F2",
  },
  moreLabel: {
    color: "#111827",
    fontSize: 14,
    fontWeight: "800",
  },
  moreLabelDanger: {
    color: "#DC2626",
  },
});
