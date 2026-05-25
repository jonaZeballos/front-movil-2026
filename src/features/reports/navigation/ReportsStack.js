import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { ReportsDashboardScreen } from "../screens/ReportsDashboardScreen";
import { SalesReportScreen } from "../screens/SalesReportScreen";
import { ServicesReportScreen } from "../screens/ServicesReportScreen";

const Stack = createNativeStackNavigator();

export function ReportsStack({ ventas = [], ordenes = [] }) {
  return (
    <Stack.Navigator
      initialRouteName="ReportsDashboard"
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
        gestureEnabled: true,
      }}
    >
      <Stack.Screen name="ReportsDashboard">
        {({ navigation }) => (
          <ReportsDashboardScreen
            navigation={navigation}
            ventas={ventas}
            ordenes={ordenes}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="SalesReport">
        {({ navigation }) => (
          <SalesReportScreen navigation={navigation} ventas={ventas} />
        )}
      </Stack.Screen>

      <Stack.Screen name="ServicesReport">
        {({ navigation }) => (
          <ServicesReportScreen navigation={navigation} ordenes={ordenes} />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}