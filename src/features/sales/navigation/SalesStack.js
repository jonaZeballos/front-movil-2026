import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { SalesDashboardScreen } from "../screens/SalesDashboardScreen";
import { RegisterSaleScreen } from "../screens/RegisterSaleScreen";
import { SaleSummaryScreen } from "../screens/SaleSummaryScreen";
import { ElectronicReceiptScreen } from "../screens/ElectronicReceiptScreen";
import { useNavigationActionGuard } from "../../../shared/navigation/useNavigationActionGuard";

const Stack = createNativeStackNavigator();

export function SalesStack({ user, clientes = [], onLogout }) {
  const { createGuardedNavigation } = useNavigationActionGuard();

  return (
    <Stack.Navigator
      initialRouteName="SalesDashboard"
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="SalesDashboard">
        {({ navigation }) => {
          const guardedNavigation = createGuardedNavigation(navigation);

          return (
            <SalesDashboardScreen
              user={user}
              onLogout={onLogout}
              onOpenClientes={() => {}}
              onOpenInventory={() => {}}
              onOpenSales={() => guardedNavigation.push("RegisterSale")}
            />
          );
        }}
      </Stack.Screen>

      <Stack.Screen name="RegisterSale">
        {({ navigation }) => {
          const guardedNavigation = createGuardedNavigation(navigation);

          return (
            <RegisterSaleScreen
              clientes={clientes}
              onBack={() => guardedNavigation.goBack()}
              onContinue={(saleDraft) =>
                guardedNavigation.push("SaleSummary", { saleDraft })
              }
            />
          );
        }}
      </Stack.Screen>

      <Stack.Screen name="SaleSummary">
        {({ navigation, route }) => (
          <SaleSummaryScreen
            saleDraft={route.params?.saleDraft}
            onBack={() => createGuardedNavigation(navigation).goBack()}
            onConfirm={(receipt) =>
              createGuardedNavigation(navigation).replace("ElectronicReceipt", { receipt })
            }
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="ElectronicReceipt">
        {({ navigation, route }) => (
          <ElectronicReceiptScreen
            receipt={route.params?.receipt}
            onBackToSales={() => createGuardedNavigation(navigation).navigate("SalesDashboard")}
          />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}
