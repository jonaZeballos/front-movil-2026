import { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Asset } from "expo-asset";

import { AuthEntryScreen, LoginScreen } from "../../features/auth";
import { HomeScreen } from "../../features/home";
import { OnboardingScreen } from "../../features/onboarding";
import { SplashScreen } from "../../features/splash";
import { onboardingPreloadAssets } from "../../shared/assets";

import {
  OrdersListScreen,
  CreateOrderScreen,
  OrderDetailScreen,
  mockOrders,
  mockEquipments,
} from "../../features/orders";

const Stack = createNativeStackNavigator();

export function AppNavigator() {
  const [isSplashVisible, setIsSplashVisible] = useState(true);

  const [orders, setOrders] = useState(mockOrders);
  const [equipments] = useState(mockEquipments);

  useEffect(() => {
    let isMounted = true;

    const prepareApp = async () => {
      try {
        await Promise.all([
          new Promise((resolve) => setTimeout(resolve, 2800)),
          Asset.loadAsync(onboardingPreloadAssets),
        ]);
      } catch (error) {
        // Si falla la precarga, igual dejamos avanzar la app.
      } finally {
        if (isMounted) {
          setIsSplashVisible(false);
        }
      }
    };

    prepareApp();

    return () => {
      isMounted = false;
    };
  }, []);

  const createOrder = (equipmentId, navigation) => {
    const equipment = equipments.find((item) => item.id === equipmentId);

    if (!equipment) {
      return;
    }

    const newOrderNumber = orders.length + 1;

    const newOrder = {
      id: `os-${Date.now()}`,
      code: `#${String(newOrderNumber).padStart(4, "0")}`,
      clientName: equipment.clientName,
      equipmentName: `${equipment.type} ${equipment.brand} ${equipment.model}`,
      equipmentSerial: equipment.serial,
      failure: equipment.failure,
      status: "Recibido",
      observations: [],
    };

    setOrders((prevOrders) => [newOrder, ...prevOrders]);

    navigation.replace("OrderDetail", {
      orderId: newOrder.id,
    });
  };

  const updateOrderStatus = (orderId, status) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, status } : order
      )
    );
  };

  const addOrderObservation = (orderId, observation) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId
          ? {
              ...order,
              observations: [...(order.observations || []), observation],
            }
          : order
      )
    );
  };

  if (isSplashVisible) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Onboarding"
        screenOptions={{
          headerShown: false,
          animation: "slide_from_right",
          gestureEnabled: true,
        }}
      >
        <Stack.Screen
          name="Onboarding"
          options={{
            gestureEnabled: false,
          }}
        >
          {({ navigation }) => (
            <OnboardingScreen
              onComplete={() => navigation.replace("AuthEntry")}
            />
          )}
        </Stack.Screen>

        <Stack.Screen
          name="AuthEntry"
          options={{
            gestureEnabled: false,
          }}
        >
          {({ navigation }) => (
            <AuthEntryScreen
              onLogin={() => navigation.push("Login")}
              onRegister={() => {}}
              onGoogle={() => {}}
              onFacebook={() => {}}
            />
          )}
        </Stack.Screen>

        <Stack.Screen
          name="Login"
          options={{
            gestureEnabled: true,
          }}
        >
          {({ navigation }) => (
            <LoginScreen
              onLoginSuccess={() => navigation.replace("Home")}
              onBack={() => navigation.goBack()}
            />
          )}
        </Stack.Screen>

        <Stack.Screen
          name="Home"
          options={{
            gestureEnabled: true,
            fullScreenGestureEnabled: false,
          }}
        >
          {({ navigation }) => (
            <HomeScreen
              onBackToAuth={() => navigation.replace("AuthEntry")}
              onOpenOrders={() => navigation.push("OrdersList")}
            />
          )}
        </Stack.Screen>

        <Stack.Screen
          name="OrdersList"
          options={{
            gestureEnabled: true,
          }}
        >
          {({ navigation }) => (
            <OrdersListScreen
              orders={orders}
              onCreateOrder={() => navigation.push("CreateOrder")}
              onOpenOrder={(order) =>
                navigation.push("OrderDetail", {
                  orderId: order.id,
                })
              }
              onBack={() => navigation.goBack()}
            />
          )}
        </Stack.Screen>

        <Stack.Screen
          name="CreateOrder"
          options={{
            gestureEnabled: true,
          }}
        >
          {({ navigation }) => (
            <CreateOrderScreen
              equipments={equipments}
              onCreateOrder={(equipmentId) =>
                createOrder(equipmentId, navigation)
              }
              onBack={() => navigation.goBack()}
            />
          )}
        </Stack.Screen>

        <Stack.Screen
          name="OrderDetail"
          options={{
            gestureEnabled: true,
          }}
        >
          {({ navigation, route }) => {
            const order = orders.find(
              (item) => item.id === route.params?.orderId
            );

            return (
              <OrderDetailScreen
                order={order}
                onBack={() => navigation.goBack()}
                onUpdateStatus={updateOrderStatus}
                onAddObservation={addOrderObservation}
              />
            );
          }}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}