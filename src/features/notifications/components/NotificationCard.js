import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import {
  formatNotificationDate,
  getNotificationConfig,
} from "../services";

export function NotificationCard({ notification, onPress }) {
  const config = getNotificationConfig(notification?.type);

  return (
    <Pressable
      onPress={() => onPress?.(notification)}
      style={({ pressed }) => [
        styles.card,
        !notification?.read && styles.unreadCard,
        pressed && styles.pressed,
      ]}
    >
      <View style={[styles.iconBox, { backgroundColor: config.color }]}>
        <Ionicons name={config.iconName} size={21} color="#FFFFFF" />
      </View>

      <View style={styles.info}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{notification?.title}</Text>
          {!notification?.read && <View style={styles.dot} />}
        </View>

        <Text style={styles.message} numberOfLines={2}>
          {notification?.message}
        </Text>

        <View style={styles.metaRow}>
          <Text style={[styles.typeLabel, { color: config.color }]}>
            {config.label}
          </Text>
          <Text style={styles.date}>
            {formatNotificationDate(notification?.createdAt)}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 15,
    marginBottom: 12,
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  unreadCard: {
    borderColor: "#C7D2FE",
    backgroundColor: "#FBFBFF",
  },
  pressed: {
    opacity: 0.88,
  },
  iconBox: {
    width: 46,
    height: 46,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 8,
  },
  title: {
    flex: 1,
    color: "#111827",
    fontSize: 15,
    fontWeight: "900",
  },
  dot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: "#EF4444",
  },
  message: {
    marginTop: 4,
    color: "#6B7280",
    fontSize: 13,
    lineHeight: 18,
  },
  metaRow: {
    marginTop: 9,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  typeLabel: {
    fontSize: 12,
    fontWeight: "900",
  },
  date: {
    color: "#9CA3AF",
    fontSize: 12,
    fontWeight: "700",
  },
});