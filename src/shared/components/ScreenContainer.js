import { SafeAreaView } from "react-native-safe-area-context";

import { colors } from "../theme/colors";

export function ScreenContainer({ children, backgroundColor = colors.background }) {
  return <SafeAreaView style={{ flex: 1, backgroundColor }}>{children}</SafeAreaView>;
}
