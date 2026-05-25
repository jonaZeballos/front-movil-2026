import { Pressable, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { NotificationBadge } from "./NotificationBadge";

export function NotificationBell({
  unreadCount = 0,
  onPress,
  color = "#FFFFFF",
  backgroundColor = "rgba(255,255,255,0.14)",
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor },
        pressed && styles.pressed,
      ]}
    >
      <View>
        <Ionicons name="notifications-outline" size={21} color={color} />
        <NotificationBadge count={unreadCount} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  pressed: {
    opacity: 0.85,
  },
});