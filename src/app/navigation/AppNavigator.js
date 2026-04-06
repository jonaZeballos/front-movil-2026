import { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { AuthEntryScreen } from "../../features/auth";
import { HomeScreen } from "../../features/home";
import { OnboardingScreen } from "../../features/onboarding";
import { SplashScreen } from "../../features/splash";

const Stack = createNativeStackNavigator();

export function AppNavigator() {
  const [isSplashVisible, setIsSplashVisible] = useState(true);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setIsSplashVisible(false);
    }, 2800);

    return () => clearTimeout(timeoutId);
  }, []);

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
          {({ navigation }) => <OnboardingScreen onComplete={() => navigation.replace("AuthEntry")} />}
        </Stack.Screen>

        <Stack.Screen
          name="AuthEntry"
          options={{
            gestureEnabled: false,
          }}
        >
          {({ navigation }) => (
            <AuthEntryScreen
              onLogin={() => navigation.push("Home")}
              onRegister={() => navigation.push("Home")}
              onGoogle={() => navigation.push("Home")}
              onFacebook={() => navigation.push("Home")}
            />
          )}
        </Stack.Screen>

        <Stack.Screen
          name="Home"
          options={{
            gestureEnabled: true,
            fullScreenGestureEnabled: false,
          }}
        >
          {({ navigation }) => <HomeScreen onBackToAuth={() => navigation.goBack()} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
