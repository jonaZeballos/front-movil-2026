import { useEffect, useRef } from "react";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";

import { AppProviders } from "./providers/AppProviders";
import { AppNavigator } from "./navigation/AppNavigator";
import { colors } from "../shared/theme/colors";
import { applyGlobalTextDefaults, useAppFonts } from "../shared/theme/fonts";

export default function AppRoot() {
  const [fontsLoaded] = useAppFonts();
  const typographyWasApplied = useRef(false);

  useEffect(() => {
    if (fontsLoaded && !typographyWasApplied.current) {
      applyGlobalTextDefaults();
      typographyWasApplied.current = true;
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return <View style={{ flex: 1, backgroundColor: colors.primary }} />;
  }

  return (
    <AppProviders>
      <StatusBar style="light" backgroundColor={colors.primary} />
      <AppNavigator />
    </AppProviders>
  );
}
