import { useRef } from "react";
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
  pressLockMs = 700,
  style,
  textStyle,
}) {
  const pressLockRef = useRef(false);

  const handlePress = () => {
    if (disabled || pressLockRef.current) return;

    pressLockRef.current = true;
    let pressResult;

    try {
      pressResult = onPress?.();
    } catch (error) {
      pressLockRef.current = false;
      throw error;
    }

    Promise.resolve(pressResult).finally(() => {
      setTimeout(() => {
        pressLockRef.current = false;
      }, pressLockMs);
    });
  };

  return (
    <Pressable
      disabled={disabled}
      onPress={handlePress}
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
