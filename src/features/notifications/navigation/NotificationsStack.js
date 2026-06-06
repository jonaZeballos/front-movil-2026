import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { NotificationsScreen } from "../screens/NotificationsScreen";
import { NotificationDetailScreen } from "../screens/NotificationDetailScreen";
import { useNavigationActionGuard } from "../../../shared/navigation/useNavigationActionGuard";

const Stack = createNativeStackNavigator();

export function NotificationsStack({
  notifications = [],
  onMarkAsRead,
  onMarkAllAsRead,
  onDelete,
  products = [],
}) {
  const { createGuardedNavigation } = useNavigationActionGuard();

  const findNotificationById = (notificationId) => {
    return notifications.find(
      (notification) => String(notification.id) === String(notificationId)
    );
  };

  return (
    <Stack.Navigator
      initialRouteName="NotificationsList"
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
        gestureEnabled: true,
      }}
    >
      <Stack.Screen name="NotificationsList">
        {({ navigation }) => {
          const guardedNavigation = createGuardedNavigation(navigation);

          return (
            <NotificationsScreen
              navigation={guardedNavigation}
              notifications={notifications}
              products={products}
              onMarkAllAsRead={onMarkAllAsRead}
              onDelete={onDelete}
              onOpenNotification={(notification) => {
                onMarkAsRead?.(notification.id);
                guardedNavigation.push("NotificationDetail", {
                  notificationId: notification.id,
                });
              }}
            />
          );
        }}
      </Stack.Screen>

      <Stack.Screen name="NotificationDetail">
        {({ navigation, route }) => {
          const notification = findNotificationById(route.params?.notificationId);

          return (
            <NotificationDetailScreen
              navigation={createGuardedNavigation(navigation)}
              notification={notification}
            />
          );
        }}
      </Stack.Screen>
    </Stack.Navigator>
  );
}
