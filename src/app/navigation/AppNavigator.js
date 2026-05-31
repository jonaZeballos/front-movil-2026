import { useEffect, useRef, useState } from "react";
import { Alert, BackHandler } from "react-native";
import {
  NavigationContainer,
  CommonActions,
  useNavigationContainerRef,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Asset } from "expo-asset";

import {
  AdminDashboardScreen,
  UsersManagementScreen,
  CreateUserScreen,
} from "../../features/admin";
import { RolesPermissionsScreen } from "../../features/admin/screens/RolesPermissionsScreen";
import {
  AuthEntryScreen,
  LoginScreen,
  RegisterStepOneScreen,
  RegisterStepTwoScreen,
  RegisterSuccessScreen,
} from "../../features/auth";
import { HomeScreen } from "../../features/home";
import { OnboardingScreen } from "../../features/onboarding";
import {
  SalesDashboardScreen,
  RegisterSaleScreen,
  SaleSummaryScreen,
  ElectronicReceiptScreen,
} from "../../features/sales";
import { SplashScreen } from "../../features/splash";
import {
  CotizacionesScreen,
  GenerateQuotationScreen,
  QuotationSummaryScreen,
} from "../../features/cotizaciones";
import { ReportsStack } from "../../features/reports";
import {
  NotificationsStack,
  addNotification,
  buildOrderStatusNotification,
  buildSaleNotification,
  getInitialNotifications,
  getUnreadNotificationsCount,
  fetchNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
  markAllNotificationsAsReadRemote,
  markNotificationAsReadRemote,
} from "../../features/notifications";

import { onboardingPreloadAssets } from "../../shared/assets";
import {
  login as loginRequest,
  logout,
  registerBusinessOwner,
} from "../../features/auth/services/authApi";
import {
  createUser as createUserRequest,
  listUsers,
} from "../../features/admin/services/usersApi";
import {
  listClientes,
  createCliente,
} from "../../features/clientes/services/clientesApi";
import {
  listEquipos,
  createEquipo,
} from "../../features/equipos/services/equiposApi";
import {
  listOrdenes,
  createOrden,
  createOrdenesLote,
  updateOrden,
} from "../../features/orders/services/ordersApi";
import { listProductos } from "../../features/productos/services";
import { listVentas } from "../../features/sales/services/salesApi";
import { createCotizacion } from "../../features/cotizaciones/services";

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

const LOGOUT_CONFIRM_ROUTES = ["AdminDashboard", "SalesDashboard", "Home"];

export function AppNavigator() {
  const navigationRef = useNavigationContainerRef();
  const navigationActionLockRef = useRef({ key: null, expiresAt: 0 });

  const [isSplashVisible, setIsSplashVisible] = useState(true);
  const [session, setSession] = useState(null);
  const [currentRouteName, setCurrentRouteName] = useState(null);

  const [orders, setOrders] = useState([]);
  const [equipments, setEquipments] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [registerDraft, setRegisterDraft] = useState(null);

  const [salesReports, setSalesReports] = useState([]);
  const [notifications, setNotifications] = useState(getInitialNotifications);

  const unreadNotificationsCount = getUnreadNotificationsCount(notifications);

  const runNavigationOnce = (key, action, lockMs = 700) => {
    const now = Date.now();
    const lock = navigationActionLockRef.current;

    if (lock.key === key && now < lock.expiresAt) {
      return;
    }

    navigationActionLockRef.current = {
      key,
      expiresAt: now + lockMs,
    };

    action();
  };

  const pushOnce = (navigation, routeName, params) => {
    runNavigationOnce(`push:${routeName}`, () => navigation.push(routeName, params));
  };

  const navigateOnce = (navigation, routeName, params) => {
    runNavigationOnce(`navigate:${routeName}`, () => navigation.navigate(routeName, params));
  };

  const replaceOnce = (navigation, routeName, params) => {
    runNavigationOnce(`replace:${routeName}`, () => navigation.replace(routeName, params));
  };

  const goBackOnce = (navigation) => {
    runNavigationOnce("goBack", () => navigation.goBack(), 400);
  };

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
    const [
      clientesData,
      equiposData,
      ordenesData,
      productsData,
      ventasData,
      notificationsData,
    ] = await Promise.all([
      listClientes().catch(() => []),
      listEquipos().catch(() => []),
      listOrdenes().catch(() => []),
      listProductos().catch(() => []),
      listVentas().catch(() => []),
      fetchNotifications().catch(() => []),
    ]);

    setClientes(clientesData);
    setEquipments(equiposData);
    setOrders(ordenesData);
    setProducts(productsData);
    setSalesReports(ventasData);
    setNotifications(notificationsData);

    if (role === "admin") {
      const usersData = await listUsers();
      setUsers(usersData);
    }
  };

  const handleRegisterOwner = async (passwordData, navigation) => {
    if (!registerDraft) {
      return { success: false, message: "Completa primero la informacion principal." };
    }

    try {
      await registerBusinessOwner({
        ...registerDraft,
        password: passwordData.password,
      });
      setRegisterDraft(null);
      replaceOnce(navigation, "RegisterSuccess");
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.message || "No se pudo registrar la cuenta.",
      };
    }
  };

  const resetToRoute = (navigation, routeName, params) => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: routeName, params }],
      })
    );
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

      setUsers([]);
      setClientes([]);
      setEquipments([]);
      setOrders([]);
      setProducts([]);
      setSalesReports([]);
      setNotifications([]);

      refreshSprintData(role).catch((error) => {
        console.warn("No se pudo cargar la informacion inicial.", error);
      });

      const dashboardRoute =
        role === "admin" ? "AdminDashboard" : role === "ventas" ? "SalesDashboard" : "Home";

      resetToRoute(navigation, dashboardRoute);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.message || "Credenciales invalidas.",
      };
    }
  };

  const handleLogout = () => {
    logout();

    setSession(null);
    setUsers([]);
    setClientes([]);
    setEquipments([]);
    setOrders([]);
    setProducts([]);
    setSalesReports([]);
    setNotifications(getInitialNotifications());

    if (navigationRef.isReady()) {
      navigationRef.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: "Login" }],
        })
      );
    }
  };

  const confirmLogout = () => {
    Alert.alert(
      "Cerrar sesion",
      "Vas a salir de tu cuenta. ¿Deseas continuar?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Salir",
          style: "destructive",
          onPress: handleLogout,
        },
      ]
    );
  };

  useEffect(() => {
    const subscription = BackHandler.addEventListener("hardwareBackPress", () => {
      if (!LOGOUT_CONFIRM_ROUTES.includes(currentRouteName)) {
        return false;
      }

      confirmLogout();
      return true;
    });

    return () => subscription.remove();
  }, [currentRouteName]);

  const handleOpenNotifications = (navigation) => {
    pushOnce(navigation, "Notifications");
  };

  const handleMarkNotificationAsRead = (notificationId) => {
    setNotifications((prevNotifications) =>
      markNotificationAsRead(prevNotifications, notificationId)
    );
    markNotificationAsReadRemote(notificationId).catch(() => {});
  };

  const handleMarkAllNotificationsAsRead = () => {
    setNotifications((prevNotifications) =>
      markAllNotificationsAsRead(prevNotifications)
    );
    markAllNotificationsAsReadRemote().catch(() => {});
  };

  const createServiceOrder = async (
    equipmentId,
    navigation,
    providedEquipment,
    orderDraft
  ) => {
    const equipment = providedEquipment || equipments.find((item) => item.id === equipmentId);

    if (!equipment) return;
    const draft =
      typeof orderDraft === "string"
        ? { diagnostico: orderDraft }
        : orderDraft || {};
    const equipmentIds = Array.isArray(draft.equipoIds) && draft.equipoIds.length
      ? draft.equipoIds
      : [equipment.id];

    if (equipmentIds.length > 1) {
      const createdOrders = await createOrdenesLote({
        equipoIds: equipmentIds,
        diagnostico: draft.diagnostico || draft.failure || "Diagnostico pendiente",
        prioridad: draft.prioridad || "Normal",
        estado: draft.estado || "Recibido",
        observaciones: draft.observaciones,
      });

      setOrders((prevOrders) => [...createdOrders, ...prevOrders]);
      setNotifications((prevNotifications) =>
        addNotification(prevNotifications, {
          type: "order",
          title: "Ordenes registradas",
          message: `Se crearon ${createdOrders.length} ordenes de servicio.`,
          priority: "high",
          payload: createdOrders,
        })
      );
      Alert.alert("Ordenes creadas", `Se crearon ${createdOrders.length} ordenes de servicio.`);
      replaceOnce(navigation, "OrdersList");
      return;
    }

    const newOrder = await createOrden({
      equipoId: equipment.id,
      diagnostico: draft.diagnostico || draft.failure || equipment.failure || "Diagnostico pendiente",
      prioridad: draft.prioridad || "Normal",
      estado: draft.estado || "Recibido",
      observaciones: draft.observaciones,
    });

    setOrders((prevOrders) => [newOrder, ...prevOrders]);

    setNotifications((prevNotifications) =>
      addNotification(prevNotifications, {
        type: "order",
        title: "Nueva orden registrada",
        message: `Se creó una nueva orden de servicio ${newOrder.code || newOrder.codigo || ""}.`,
        priority: "high",
        payload: newOrder,
      })
    );

    replaceOnce(navigation, "OrderDetail", { orderId: newOrder.id });
  };

  const updateOrderStatus = async (orderId, status) => {
    const updatedOrder = await updateOrden(orderId, { estado: status });

    setOrders((prevOrders) =>
      prevOrders.map((order) => (order.id === orderId ? updatedOrder : order))
    );

    setNotifications((prevNotifications) =>
      addNotification(prevNotifications, buildOrderStatusNotification(updatedOrder))
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
    const equipmentWithFailure = { ...savedEquipment, failure: equipmentData.initialFailure || "" };

    setEquipments((prevEquipments) => [equipmentWithFailure, ...prevEquipments]);

    setNotifications((prevNotifications) =>
      addNotification(prevNotifications, {
        type: "system",
        title: "Equipo registrado",
        message: `Se registró un nuevo equipo ${equipmentWithFailure.type || equipmentWithFailure.tipo || ""}.`,
        priority: "normal",
        payload: equipmentWithFailure,
      })
    );

    return equipmentWithFailure;
  };

  const refreshClientes = async () => {
    const clientesData = await listClientes();
    setClientes(clientesData);
    return clientesData;
  };

  const saveUser = async (userData) => {
    await createUserRequest(userData);
    const usersData = await listUsers();

    setUsers(usersData);
  };

  const saveCliente = async (clienteData) => {
    const savedCliente = await createCliente(clienteData);

    setClientes((prevClientes) => [savedCliente, ...prevClientes]);

    setNotifications((prevNotifications) =>
      addNotification(prevNotifications, {
        type: "system",
        title: "Cliente registrado",
        message: `Se registró el cliente ${savedCliente.nombre || clienteData.nombre || "nuevo"}.`,
        priority: "normal",
        payload: savedCliente,
      })
    );

    return savedCliente;
  };

  if (isSplashVisible) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer
      ref={navigationRef}
      onReady={() => setCurrentRouteName(navigationRef.getCurrentRoute()?.name)}
      onStateChange={() => setCurrentRouteName(navigationRef.getCurrentRoute()?.name)}
    >
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
            <OnboardingScreen onComplete={() => replaceOnce(navigation, "AuthEntry")} />
          )}
        </Stack.Screen>

        <Stack.Screen name="AuthEntry" options={{ gestureEnabled: false }}>
          {({ navigation }) => (
            <AuthEntryScreen
              onLogin={() => pushOnce(navigation, "Login")}
              onRegister={() => pushOnce(navigation, "RegisterStepOne")}
              onGoogle={() => {}}
              onFacebook={() => {}}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="Login">
          {({ navigation }) => (
            <LoginScreen
              onLogin={(credentials) => handleLogin(credentials, navigation)}
              onBack={() => resetToRoute(navigation, "AuthEntry")}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="RegisterStepOne">
          {({ navigation }) => (
            <RegisterStepOneScreen
              onBack={() => resetToRoute(navigation, "Login")}
              onNext={(data) => {
                setRegisterDraft(data);
                pushOnce(navigation, "RegisterStepTwo");
              }}
              onGoToLogin={() => resetToRoute(navigation, "Login")}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="RegisterStepTwo">
          {({ navigation }) => (
            <RegisterStepTwoScreen
              onBack={() => navigateOnce(navigation, "RegisterStepOne")}
              onFinish={(data) => handleRegisterOwner(data, navigation)}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="RegisterSuccess" options={{ gestureEnabled: false }}>
          {({ navigation }) => (
            <RegisterSuccessScreen onOk={() => replaceOnce(navigation, "Login")} />
          )}
        </Stack.Screen>

        <Stack.Screen name="AdminDashboard">
          {({ navigation }) => (
            <AdminDashboardScreen
              user={session?.user}
              stats={{
                users: users.length,
                orders: orders.length,
                sales: salesReports.length,
              }}
              unreadNotificationsCount={unreadNotificationsCount}
              onOpenNotifications={() => handleOpenNotifications(navigation)}
              onLogout={() => confirmLogout()}
              onOpenUsers={() => pushOnce(navigation, "UsersManagement")}
              onOpenClientes={() => pushOnce(navigation, "Clientes")}
              onOpenEquipos={() => pushOnce(navigation, "EquipmentList")}
              onOpenOrders={() => pushOnce(navigation, "OrdersList")}
              onOpenSales={() => pushOnce(navigation, "RegisterSale")}
              onOpenInventory={() => navigateOnce(navigation, "Inventario")}
              onOpenQuotations={() => pushOnce(navigation, "Cotizaciones")}
              onOpenReports={() => pushOnce(navigation, "Reports")}
              onOpenRolesPermissions={() => pushOnce(navigation, "RolesPermissions")}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="RolesPermissions">
          {({ navigation }) => (
            <RolesPermissionsScreen onBack={() => goBackOnce(navigation)} />
          )}
        </Stack.Screen>

        <Stack.Screen name="UsersManagement">
          {({ navigation }) => (
            <UsersManagementScreen
              users={users}
              onBack={() => goBackOnce(navigation)}
              onCreateUser={() => pushOnce(navigation, "CreateUser")}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="CreateUser">
          {({ navigation }) => (
            <CreateUserScreen
              onBack={() => goBackOnce(navigation)}
              onSave={async (userData) => {
                await saveUser(userData);
                replaceOnce(navigation, "UsersManagement");
              }}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="SalesDashboard">
          {({ navigation }) => (
            <SalesDashboardScreen
              user={session?.user}
              stats={{
                ventas: salesReports.length,
                ingresos: salesReports.reduce((sum, venta) => sum + Number(venta.total || 0), 0),
                stockBajo: products.filter((product) => Number(product.stock || 0) <= Number(product.stockMinimo || 1)).length,
              }}
              unreadNotificationsCount={unreadNotificationsCount}
              onOpenNotifications={() => handleOpenNotifications(navigation)}
              onLogout={() => confirmLogout()}
              onOpenClientes={() => pushOnce(navigation, "Clientes")}
              onOpenInventory={() => navigateOnce(navigation, "Inventario")}
              onOpenSales={() => pushOnce(navigation, "RegisterSale")}
              onOpenReports={() => pushOnce(navigation, "Reports")}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="RegisterSale">
          {({ navigation }) => (
            <RegisterSaleScreen
              clientes={clientes}
              productos={products}
              onBack={() => goBackOnce(navigation)}
              onContinue={(saleDraft) =>
                pushOnce(navigation, "SaleSummary", { saleDraft })
              }
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="SaleSummary">
          {({ navigation, route }) => (
            <SaleSummaryScreen
              saleDraft={route.params?.saleDraft}
              user={session?.user}
              onBack={() => goBackOnce(navigation)}
              onConfirm={(receipt) => {
                setSalesReports((prevReports) => [receipt, ...prevReports]);
                listProductos().then(setProducts).catch(() => {});

                setNotifications((prevNotifications) =>
                  addNotification(prevNotifications, buildSaleNotification(receipt))
                );

                replaceOnce(navigation, "ElectronicReceipt", { receipt });
              }}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="ElectronicReceipt">
          {({ navigation, route }) => (
            <ElectronicReceiptScreen
              receipt={route.params?.receipt}
              onBackToSales={() => navigateOnce(navigation, "SalesDashboard")}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="Reports">
          {() => (
            <ReportsStack
              ventas={salesReports}
              ordenes={orders}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="Notifications">
          {() => (
            <NotificationsStack
              notifications={notifications}
              onMarkAsRead={handleMarkNotificationAsRead}
              onMarkAllAsRead={handleMarkAllNotificationsAsRead}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="SalesRegister">
          {({ navigation }) => (
            <SalesRegisterScreen onBack={() => goBackOnce(navigation)} />
          )}
        </Stack.Screen>

        <Stack.Screen name="Home">
          {({ navigation }) => (
            <HomeScreen
              user={session?.user}
              stats={{
                ordenes: orders.length,
                equipos: equipments.length,
                clientes: clientes.length,
              }}
              unreadNotificationsCount={unreadNotificationsCount}
              onOpenNotifications={() => handleOpenNotifications(navigation)}
              onBackToAuth={() => confirmLogout()}
              onOpenOrders={() => pushOnce(navigation, "OrdersList")}
              onOpenEquipos={() => pushOnce(navigation, "EquipmentList")}
              onOpenClientes={() => pushOnce(navigation, "Clientes")}
              onOpenQuotations={() => pushOnce(navigation, "Cotizaciones")}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="Clientes">
          {() => (
            <RegisterStack
              clientes={clientes}
              ordenes={orders}
              equipos={equipments}
              onGuardarCliente={saveCliente}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="Inventario">
          {() => <InventarioStack onProductsChange={setProducts} />}
        </Stack.Screen>

        <Stack.Screen name="Cotizaciones">
          {({ navigation }) => (
            <CotizacionesScreen
              orders={orders}
              onBack={() => goBackOnce(navigation)}
              onGenerateQuotation={(order, selectedOrders) =>
                pushOnce(navigation, "GenerateQuotation", { order, selectedOrders })
              }
              onViewQuotation={(quotation) =>
                pushOnce(navigation, "QuotationSummary", { quotation, returnToPrevious: true })
              }
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="GenerateQuotation">
          {({ navigation, route }) => (
            <GenerateQuotationScreen
              order={route.params?.order}
              selectedOrders={route.params?.selectedOrders}
              onBack={() => goBackOnce(navigation)}
              onCancel={() => goBackOnce(navigation)}
              onSave={async (quotation) => {
                const savedQuotation = await createCotizacion(quotation);
                const displayQuotation = {
                  ...savedQuotation,
                  realizadoPor: savedQuotation.realizadoPor || session?.user,
                };
                if (savedQuotation.cotizacionActiva && savedQuotation.yaExistia) {
                  Alert.alert(
                    "Cotizacion activa",
                    "Esta orden ya tiene una cotizacion activa. Se mostrara la cotizacion existente."
                  );
                }
                setOrders((prevOrders) =>
                  prevOrders.map((order) =>
                    (displayQuotation.ordenIds || displayQuotation.ordenes?.map((item) => item.id) || [savedQuotation.ordenId]).includes(order.id)
                      ? {
                          ...order,
                          cotizacion: displayQuotation,
                          cotizaciones: [displayQuotation, ...(order.cotizaciones || [])],
                          status: "Cotizado",
                          estado: "Cotizado",
                        }
                      : order
                  )
                );
                replaceOnce(navigation, "QuotationSummary", { quotation: displayQuotation });
              }}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="QuotationSummary">
          {({ navigation, route }) => (
            <QuotationSummaryScreen
              quotation={route.params?.quotation}
              onBackToOrders={() =>
                route.params?.returnToPrevious ? goBackOnce(navigation) : navigateOnce(navigation, "Cotizaciones")
              }
              onViewDetail={() => {}}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="OrdersList">
          {({ navigation }) => (
            <OrdersListScreen
              orders={orders}
              onCreateOrder={() => pushOnce(navigation, "CreateOrder")}
              onOpenOrder={(order) =>
                pushOnce(navigation, "OrderDetail", { orderId: order.id })
              }
              onBack={() => goBackOnce(navigation)}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="CreateOrder">
          {({ navigation }) => (
            <CreateOrderScreen
              clientes={clientes}
              equipments={equipments}
              onCreateOrder={(equipmentId, orderData) =>
                createServiceOrder(equipmentId, navigation, null, orderData)
              }
              onBack={() => goBackOnce(navigation)}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="OrderDetail">
          {({ navigation, route }) => {
            const order = orders.find((item) => item.id === route.params?.orderId);

            return (
              <OrderDetailScreen
                order={order}
                onBack={() => goBackOnce(navigation)}
                onUpdateStatus={updateOrderStatus}
                onAddObservation={addOrderObservation}
                onViewQuotation={(quotation) =>
                pushOnce(navigation, "QuotationSummary", { quotation, returnToPrevious: true })
                }
                onGenerateQuotation={(orderToQuote) =>
                  pushOnce(navigation, "GenerateQuotation", { order: orderToQuote })
                }
              />
            );
          }}
        </Stack.Screen>

        <Stack.Screen name="EquipmentList">
          {({ navigation }) => (
            <EquipmentListScreen
              equipments={equipments}
              onRegister={async () => {
                await refreshClientes().catch(() => {});
                pushOnce(navigation, "RegisterEquipment");
              }}
              onBack={() => goBackOnce(navigation)}
              onOpenEquipment={(equipment) =>
                pushOnce(navigation, "EquipmentDetail", { equipmentId: equipment.id })
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
                onBack={() => goBackOnce(navigation)}
              />
            );
          }}
        </Stack.Screen>

        <Stack.Screen name="RegisterEquipment">
          {({ navigation }) => (
            <RegisterEquipmentScreen
              clientes={clientes}
              onBack={() => goBackOnce(navigation)}
              onCreateClient={() => navigateOnce(navigation, "Clientes")}
              onRefreshClientes={refreshClientes}
              onSave={async (equipmentData) => {
                await saveEquipment(equipmentData);
                replaceOnce(navigation, "EquipmentList");
              }}
              onSaveAndCreateOrder={async (equipmentData) => {
                const newEquipment = await saveEquipment(equipmentData);

                await createServiceOrder(
                  newEquipment.id,
                  navigation,
                  newEquipment,
                  {
                    diagnostico: equipmentData.diagnostico || equipmentData.failure,
                    prioridad: equipmentData.prioridad,
                    observaciones: equipmentData.observaciones,
                  }
                );
              }}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
