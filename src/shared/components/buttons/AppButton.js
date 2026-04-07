import { Pressable, Text } from "react-native";

import { colors } from "../../theme/colors";
import { textPresets } from "../../theme/typography";

export function AppButton({
  title,
  onPress,
  backgroundColor = colors.black,
  textColor = colors.surface,
  borderColor = "transparent",
  width = "100%",
  minHeight = 56,
  borderRadius = 999,
  fontSize = 16,
  lineHeight = 20,
  disabled = false,
  style,
  textStyle,
}) {
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        {
          width,
          minHeight,
          borderRadius,
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: 20,
          paddingVertical: 16,
          backgroundColor,
          borderWidth: borderColor === "transparent" ? 0 : 1,
          borderColor,
          opacity: disabled ? 0.6 : pressed ? 0.88 : 1,
        },
        style,
      ]}
    >
      <Text
        style={[
          textPresets.bodyDark,
          {
            color: textColor,
            textAlign: "center",
            fontSize,
            lineHeight,
          },
          textStyle,
        ]}
      >
        {title}
      </Text>
    </Pressable>
  );
}
