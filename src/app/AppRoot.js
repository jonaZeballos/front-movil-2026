import { StatusBar } from "expo-status-bar";
import { View } from "react-native";

import { AppProviders } from "./providers/AppProviders";
import { AppNavigator } from "./navigation/AppNavigator";
import { colors } from "../shared/theme/colors";
import { useAppFonts } from "../shared/theme/fonts";

export default function AppRoot() {
  const [fontsLoaded] = useAppFonts();

  if (!fontsLoaded) {
    return <View style={{ flex: 1, backgroundColor: colors.background }} />;
  }

  return (
    <AppProviders>
      <StatusBar style="dark" backgroundColor={colors.backgroundSoft} />
      <AppNavigator />
    </AppProviders>
  );
}
