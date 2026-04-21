import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  useFonts,
} from "@expo-google-fonts/poppins";
import { Text, TextInput } from "react-native";

export const fontFamilies = {
  regular: "Poppins_400Regular",
  medium: "Poppins_500Medium",
  semibold: "Poppins_600SemiBold",
  bold: "Poppins_700Bold",
};

export function useAppFonts() {
  return useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });
}

function withDefaultFont(existingStyle) {
  const baseStyle = { fontFamily: fontFamilies.regular };

  if (!existingStyle) {
    return baseStyle;
  }

  return [baseStyle, existingStyle];
}

export function applyGlobalTextDefaults() {
  Text.defaultProps = Text.defaultProps || {};
  Text.defaultProps.style = withDefaultFont(Text.defaultProps.style);

  TextInput.defaultProps = TextInput.defaultProps || {};
  TextInput.defaultProps.style = withDefaultFont(TextInput.defaultProps.style);
}
