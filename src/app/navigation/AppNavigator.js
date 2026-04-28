import { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Asset } from "expo-asset";

import {
  AuthEntryScreen,
  LoginScreen,
  RegisterStepOneScreen,
  RegisterStepTwoScreen,
  RegisterSuccessScreen,
} from "../../features/auth";
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
import {
  EquipmentDetailScreen,
  EquipmentListScreen,
  RegisterEquipmentScreen,
} from "../../features/equipos";
import { RegisterStack } from "../../features/clientes/navigation/RegisterStack";

const Stack = createNativeStackNavigator();

export function AppNavigator() {
  const [isSplashVisible, setIsSplashVisible] = useState(true);
  const [orders, setOrders] = useState(mockOrders);
  const [equipments, setEquipments] = useState(mockEquipments);

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

  const createOrder = (equipmentId, navigation, providedEquipment) => {
    const equipment = providedEquipment || equipments.find((item) => item.id === equipmentId);

    if (!equipment) return;

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

  const saveEquipment = (equipmentData) => {
    const normalizedEquipment = {
      id: `eq-${Date.now()}`,
      clientName: equipmentData.clientName,
      type: equipmentData.type,
      brand: equipmentData.brand,
      model: equipmentData.model,
      serial: equipmentData.serial,
      failure: equipmentData.failure,
    };

    setEquipments((prevEquipments) => [normalizedEquipment, ...prevEquipments]);

    return normalizedEquipment;
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
              onRegister={() => navigation.push("RegisterStepOne")}
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
          name="RegisterStepOne"
          options={{
            gestureEnabled: true,
          }}
        >
          {({ navigation }) => (
            <RegisterStepOneScreen
              onBack={() => navigation.goBack()}
              onNext={() => navigation.push("RegisterStepTwo")}
              onGoToLogin={() => navigation.push("Login")}
            />
          )}
        </Stack.Screen>

        <Stack.Screen
          name="RegisterStepTwo"
          options={{
            gestureEnabled: true,
          }}
        >
          {({ navigation }) => (
            <RegisterStepTwoScreen
              onBack={() => navigation.goBack()}
              onFinish={() => navigation.replace("RegisterSuccess")}
            />
          )}
        </Stack.Screen>

        <Stack.Screen
          name="RegisterSuccess"
          options={{
            gestureEnabled: false,
          }}
        >
          {({ navigation }) => (
            <RegisterSuccessScreen onOk={() => navigation.replace("Login")} />
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
              onOpenEquipos={() => navigation.push("EquipmentList")}
              onOpenClientes={() => navigation.push("Clientes")}
            />
          )}
        </Stack.Screen>

        <Stack.Screen
          name="Clientes"
          options={{
            gestureEnabled: true,
          }}
        >
          {() => <RegisterStack />}
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

        <Stack.Screen
          name="EquipmentList"
          options={{
            gestureEnabled: true,
          }}
        >
          {({ navigation }) => (
            <EquipmentListScreen
              equipments={equipments}
              onRegister={() => navigation.push("RegisterEquipment")}
              onBack={() => navigation.goBack()}
              onOpenEquipment={(equipment) =>
                navigation.push("EquipmentDetail", {
                  equipmentId: equipment.id,
                })
              }
            />
          )}
        </Stack.Screen>

        <Stack.Screen
          name="EquipmentDetail"
          options={{
            gestureEnabled: true,
          }}
        >
          {({ navigation, route }) => {
            const equipment = equipments.find(
              (item) => item.id === route.params?.equipmentId
            );

            return (
              <EquipmentDetailScreen
                equipment={equipment}
                onBack={() => navigation.goBack()}
              />
            );
          }}
        </Stack.Screen>

        <Stack.Screen
          name="RegisterEquipment"
          options={{
            gestureEnabled: true,
          }}
        >
          {({ navigation }) => (
            <RegisterEquipmentScreen
              onBack={() => navigation.goBack()}
              onSave={(equipmentData) => {
                saveEquipment(equipmentData);
                navigation.replace("EquipmentList");
              }}
              onSaveAndCreateOrder={(equipmentData) => {
                const newEquipment = saveEquipment(equipmentData);
                createOrder(newEquipment.id, navigation, newEquipment);
              }}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
