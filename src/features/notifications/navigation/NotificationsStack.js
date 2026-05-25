import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { NotificationsScreen } from "../screens/NotificationsScreen";
import { NotificationDetailScreen } from "../screens/NotificationDetailScreen";

const Stack = createNativeStackNavigator();

export function NotificationsStack({
  notifications = [],
  onMarkAsRead,
  onMarkAllAsRead,
}) {
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
        {({ navigation }) => (
          <NotificationsScreen
            navigation={navigation}
            notifications={notifications}
            onMarkAllAsRead={onMarkAllAsRead}
            onOpenNotification={(notification) => {
              onMarkAsRead?.(notification.id);
              navigation.push("NotificationDetail", {
                notificationId: notification.id,
              });
            }}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="NotificationDetail">
        {({ navigation, route }) => {
          const notification = findNotificationById(route.params?.notificationId);

          return (
            <NotificationDetailScreen
              navigation={navigation}
              notification={notification}
            />
          );
        }}
      </Stack.Screen>
    </Stack.Navigator>
  );
}