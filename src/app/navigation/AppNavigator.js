import { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Asset } from "expo-asset";

import {
  AdminDashboardScreen,
  UsersManagementScreen,
  CreateUserScreen,
} from "../../features/admin";
import {
  AuthEntryScreen,
  LoginScreen,
  RegisterStepOneScreen,
  RegisterStepTwoScreen,
  RegisterSuccessScreen,
} from "../../features/auth";
import { HomeScreen } from "../../features/home";
import { OnboardingScreen } from "../../features/onboarding";
import { SalesDashboardScreen } from "../../features/sales";
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

const adminUser = {
  id: "admin-1",
  name: "Administrador",
  email: "admin@servitech.com",
  password: "123456",
  role: "admin",
  initials: "AD",
};

const initialUsers = [
  {
    id: "u1",
    name: "Carlos Técnico",
    email: "tecnico@servitech.com",
    password: "123456",
    role: "tecnico",
    initials: "CT",
  },
  {
    id: "u2",
    name: "Laura Ventas",
    email: "ventas@servitech.com",
    password: "123456",
    role: "ventas",
    initials: "LV",
  },
];

export function AppNavigator() {
  const [isSplashVisible, setIsSplashVisible] = useState(true);
  const [orders, setOrders] = useState(mockOrders);
  const [equipments, setEquipments] = useState(mockEquipments);
  const [users, setUsers] = useState(initialUsers);

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

  const handleLogin = ({ email, password }, navigation) => {
    const allUsers = [adminUser, ...users];

    const foundUser = allUsers.find(
      (user) =>
        user.email.toLowerCase() === email.toLowerCase() &&
        user.password === password
    );

    if (!foundUser) {
      return {
        success: false,
        message: "Credenciales inválidas.",
      };
    }

    if (foundUser.role === "admin") {
      navigation.replace("AdminDashboard");
    }

    if (foundUser.role === "tecnico") {
      navigation.replace("Home");
    }

    if (foundUser.role === "ventas") {
      navigation.replace("SalesDashboard");
    }

    return { success: true };
  };

  const createOrder = (equipmentId, navigation, providedEquipment) => {
    const equipment =
      providedEquipment || equipments.find((item) => item.id === equipmentId);

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

  const saveUser = (userData) => {
    const names = userData.name.trim().split(" ");
    const initials = names
      .slice(0, 2)
      .map((word) => word[0])
      .join("")
      .toUpperCase();

    const newUser = {
      id: `user-${Date.now()}`,
      name: userData.name.trim(),
      email: userData.email.trim().toLowerCase(),
      password: userData.password.trim(),
      role: userData.role,
      initials,
    };

    setUsers((prevUsers) => [newUser, ...prevUsers]);
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
        <Stack.Screen name="Onboarding" options={{ gestureEnabled: false }}>
          {({ navigation }) => (
            <OnboardingScreen
              onComplete={() => navigation.replace("AuthEntry")}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="AuthEntry" options={{ gestureEnabled: false }}>
          {({ navigation }) => (
            <AuthEntryScreen
              onLogin={() => navigation.push("Login")}
              onRegister={() => navigation.push("RegisterStepOne")}
              onGoogle={() => {}}
              onFacebook={() => {}}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="Login">
          {({ navigation }) => (
            <LoginScreen
              onLogin={(credentials) => handleLogin(credentials, navigation)}
              onBack={() => navigation.goBack()}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="RegisterStepOne">
          {({ navigation }) => (
            <RegisterStepOneScreen
              onBack={() => navigation.goBack()}
              onNext={() => navigation.push("RegisterStepTwo")}
              onGoToLogin={() => navigation.push("Login")}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="RegisterStepTwo">
          {({ navigation }) => (
            <RegisterStepTwoScreen
              onBack={() => navigation.goBack()}
              onFinish={() => navigation.replace("RegisterSuccess")}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="RegisterSuccess" options={{ gestureEnabled: false }}>
          {({ navigation }) => (
            <RegisterSuccessScreen onOk={() => navigation.replace("Login")} />
          )}
        </Stack.Screen>

        <Stack.Screen name="AdminDashboard">
          {({ navigation }) => (
            <AdminDashboardScreen
              onOpenUsers={() => navigation.push("UsersManagement")}
              onOpenClientes={() => navigation.push("Clientes")}
              onOpenEquipos={() => navigation.push("EquipmentList")}
              onOpenOrders={() => navigation.push("OrdersList")}
              onOpenSales={() => {}}
              onOpenInventory={() => {}}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="UsersManagement">
          {({ navigation }) => (
            <UsersManagementScreen
              users={users}
              onBack={() => navigation.goBack()}
              onCreateUser={() => navigation.push("CreateUser")}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="CreateUser">
          {({ navigation }) => (
            <CreateUserScreen
              onBack={() => navigation.goBack()}
              onSave={(userData) => {
                saveUser(userData);
                navigation.replace("UsersManagement");
              }}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="SalesDashboard">
          {({ navigation }) => (
            <SalesDashboardScreen
              onOpenClientes={() => navigation.push("Clientes")}
              onOpenInventory={() => {}}
              onOpenSales={() => {}}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="Home">
          {({ navigation }) => (
            <HomeScreen
              onBackToAuth={() => navigation.replace("AuthEntry")}
              onOpenOrders={() => navigation.push("OrdersList")}
              onOpenEquipos={() => navigation.push("EquipmentList")}
              onOpenClientes={() => navigation.push("Clientes")}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="Clientes">
          {() => <RegisterStack />}
        </Stack.Screen>

        <Stack.Screen name="OrdersList">
          {({ navigation }) => (
            <OrdersListScreen
              orders={orders}
              onCreateOrder={() => navigation.push("CreateOrder")}
              onOpenOrder={(order) =>
                navigation.push("OrderDetail", { orderId: order.id })
              }
              onBack={() => navigation.goBack()}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="CreateOrder">
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

        <Stack.Screen name="OrderDetail">
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

        <Stack.Screen name="EquipmentList">
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

        <Stack.Screen name="EquipmentDetail">
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

        <Stack.Screen name="RegisterEquipment">
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