import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { SalesDashboardScreen } from "../screens/SalesDashboardScreen";
import { RegisterSaleScreen } from "../screens/RegisterSaleScreen";
import { SaleSummaryScreen } from "../screens/SaleSummaryScreen";
import { ElectronicReceiptScreen } from "../screens/ElectronicReceiptScreen";

const Stack = createNativeStackNavigator();

export function SalesStack({ user, clientes = [], onLogout }) {
  return (
    <Stack.Navigator
      initialRouteName="SalesDashboard"
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="SalesDashboard">
        {({ navigation }) => (
          <SalesDashboardScreen
            user={user}
            onLogout={onLogout}
            onOpenClientes={() => {}}
            onOpenInventory={() => {}}
            onOpenSales={() => navigation.push("RegisterSale")}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="RegisterSale">
        {({ navigation }) => (
          <RegisterSaleScreen
            clientes={clientes}
            onBack={() => navigation.goBack()}
            onContinue={(saleDraft) =>
              navigation.push("SaleSummary", { saleDraft })
            }
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="SaleSummary">
        {({ navigation, route }) => (
          <SaleSummaryScreen
            saleDraft={route.params?.saleDraft}
            onBack={() => navigation.goBack()}
            onConfirm={(receipt) =>
              navigation.replace("ElectronicReceipt", { receipt })
            }
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="ElectronicReceipt">
        {({ navigation, route }) => (
          <ElectronicReceiptScreen
            receipt={route.params?.receipt}
            onBackToSales={() => navigation.navigate("SalesDashboard")}
          />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}