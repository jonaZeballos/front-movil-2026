import { useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { ReportsDashboardScreen } from "../screens/ReportsDashboardScreen";
import { SalesReportScreen } from "../screens/SalesReportScreen";
import { ServicesReportScreen } from "../screens/ServicesReportScreen";
import { getReportsSummary, getSalesReport, getServicesReport } from "../services";

const Stack = createNativeStackNavigator();

export function ReportsStack({ ventas = [], ordenes = [] }) {
  const [summary, setSummary] = useState(null);
  const [salesReport, setSalesReport] = useState(null);
  const [servicesReport, setServicesReport] = useState(null);

  useEffect(() => {
    let isMounted = true;

    Promise.all([
      getReportsSummary().catch(() => null),
      getSalesReport().catch(() => null),
      getServicesReport().catch(() => null),
    ]).then(([summaryData, salesData, servicesData]) => {
      if (!isMounted) return;
      setSummary(summaryData);
      setSalesReport(salesData);
      setServicesReport(servicesData);
    });

    return () => {
      isMounted = false;
    };
  }, []);

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
            summary={summary}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="SalesReport">
        {({ navigation }) => (
          <SalesReportScreen navigation={navigation} ventas={ventas} salesReport={salesReport} />
        )}
      </Stack.Screen>

      <Stack.Screen name="ServicesReport">
        {({ navigation }) => (
          <ServicesReportScreen navigation={navigation} ordenes={ordenes} servicesReport={servicesReport} />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}
