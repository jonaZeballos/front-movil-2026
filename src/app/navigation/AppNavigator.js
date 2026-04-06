import { useEffect, useState } from "react";

import { HomeScreen } from "../../features/home";
import { SplashScreen } from "../../features/splash";

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

  return <HomeScreen />;
}
