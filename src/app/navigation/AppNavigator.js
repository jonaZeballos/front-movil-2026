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
import { login as loginRequest, logout } from "../../features/auth/services/authApi";
import { createUser as createUserRequest, listUsers } from "../../features/admin/services/usersApi";
import { listClientes, createCliente } from "../../features/clientes/services/clientesApi";
import { listEquipos, createEquipo } from "../../features/equipos/services/equiposApi";
import { listOrdenes, createOrden, updateOrden } from "../../features/orders/services/ordersApi";

import {
  OrdersListScreen,
  CreateOrderScreen,
  OrderDetailScreen,
} from "../../features/orders";
import {
  EquipmentDetailScreen,
  EquipmentListScreen,
  RegisterEquipmentScreen,
} from "../../features/equipos";
import { RegisterStack } from "../../features/clientes/navigation/RegisterStack";
import { InventarioStack } from "../../features/productos/navigation/InventarioStack";

const Stack = createNativeStackNavigator();

export function AppNavigator() {
  const [isSplashVisible, setIsSplashVisible] = useState(true);
  const [session, setSession] = useState(null);
  const [orders, setOrders] = useState([]);
  const [equipments, setEquipments] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [users, setUsers] = useState([]);

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

  const refreshSprintData = async (role) => {
    const [clientesData, equiposData, ordenesData] = await Promise.all([
      listClientes(),
      listEquipos(),
      listOrdenes(),
    ]);

    setClientes(clientesData);
    setEquipments(equiposData);
    setOrders(ordenesData);

    if (role === "admin") {
      const usersData = await listUsers();
      setUsers(usersData);
    }
  };

  const handleLogin = async ({ email, password }, navigation) => {
    try {
      const loginData = await loginRequest({ email, password });
      const loggedUser = loginData.usuario;
      const role = (loggedUser.rol || loggedUser.tipoUsuario || "").toLowerCase();

      setSession({
        token: loginData.token,
        user: loggedUser,
        role,
      });
      await refreshSprintData(role);

      if (role === "admin") {
        navigation.replace("AdminDashboard");
      } else if (role === "ventas") {
        navigation.replace("SalesDashboard");
      } else {
        navigation.replace("Home");
      }

      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Credenciales invalidas.",
      };
    }
  };

  const handleLogout = (navigation) => {
    logout();
    setSession(null);
    setUsers([]);
    setClientes([]);
    setEquipments([]);
    setOrders([]);
    navigation.replace("Login");
  };

  const createServiceOrder = async (equipmentId, navigation, providedEquipment, diagnostico) => {
    const equipment = providedEquipment || equipments.find((item) => item.id === equipmentId);

    if (!equipment) return;

    const newOrder = await createOrden({
      equipoId: equipment.id,
      diagnostico: diagnostico || equipment.failure || "Diagnostico pendiente",
    });

    setOrders((prevOrders) => [newOrder, ...prevOrders]);
    navigation.replace("OrderDetail", { orderId: newOrder.id });
  };

  const updateOrderStatus = async (orderId, status) => {
    const updatedOrder = await updateOrden(orderId, { estado: status });
    setOrders((prevOrders) =>
      prevOrders.map((order) => (order.id === orderId ? updatedOrder : order))
    );
  };

  const addOrderObservation = async (orderId, observation) => {
    const updatedOrder = await updateOrden(orderId, { observacion: observation });
    setOrders((prevOrders) =>
      prevOrders.map((order) => (order.id === orderId ? updatedOrder : order))
    );
  };

  const saveEquipment = async (equipmentData) => {
    const savedEquipment = await createEquipo(equipmentData);
    const equipmentWithFailure = { ...savedEquipment, failure: equipmentData.failure };

    setEquipments((prevEquipments) => [equipmentWithFailure, ...prevEquipments]);
    return equipmentWithFailure;
  };

  const saveUser = async (userData) => {
    await createUserRequest(userData);
    const usersData = await listUsers();
    setUsers(usersData);
  };

  const saveCliente = async (clienteData) => {
    const savedCliente = await createCliente(clienteData);
    setClientes((prevClientes) => [savedCliente, ...prevClientes]);
    return savedCliente;
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
            <OnboardingScreen onComplete={() => navigation.replace("AuthEntry")} />
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
              onOpenInventory={() => navigation.navigate("Inventario")}
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
              onSave={async (userData) => {
                await saveUser(userData);
                navigation.replace("UsersManagement");
              }}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="SalesDashboard">
          {({ navigation }) => (
            <SalesDashboardScreen
              user={session?.user}
              onLogout={() => handleLogout(navigation)}
              onOpenClientes={() => navigation.push("Clientes")}
              onOpenInventory={() => {}}
              onOpenSales={() => {}}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="Home">
          {({ navigation }) => (
            <HomeScreen
              user={session?.user}
              onBackToAuth={() => handleLogout(navigation)}
              onOpenOrders={() => navigation.push("OrdersList")}
              onOpenEquipos={() => navigation.push("EquipmentList")}
              onOpenClientes={() => navigation.push("Clientes")}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="Clientes">
          {() => <RegisterStack clientes={clientes} onGuardarCliente={saveCliente} />}
        </Stack.Screen>

        <Stack.Screen name="Inventario">
          {() => <InventarioStack />}
        </Stack.Screen>

        <Stack.Screen name="OrdersList">
          {({ navigation }) => (
            <OrdersListScreen
              orders={orders}
              onCreateOrder={() => navigation.push("CreateOrder")}
              onOpenOrder={(order) => navigation.push("OrderDetail", { orderId: order.id })}
              onBack={() => navigation.goBack()}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="CreateOrder">
          {({ navigation }) => (
            <CreateOrderScreen
              equipments={equipments}
              onCreateOrder={(equipmentId, diagnostico) =>
                createServiceOrder(equipmentId, navigation, null, diagnostico)
              }
              onBack={() => navigation.goBack()}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="OrderDetail">
          {({ navigation, route }) => {
            const order = orders.find((item) => item.id === route.params?.orderId);

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
                navigation.push("EquipmentDetail", { equipmentId: equipment.id })
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
              clientes={clientes}
              onBack={() => navigation.goBack()}
              onSave={async (equipmentData) => {
                await saveEquipment(equipmentData);
                navigation.replace("EquipmentList");
              }}
              onSaveAndCreateOrder={async (equipmentData) => {
                const newEquipment = await saveEquipment(equipmentData);
                await createServiceOrder(
                  newEquipment.id,
                  navigation,
                  newEquipment,
                  equipmentData.failure
                );
              }}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
