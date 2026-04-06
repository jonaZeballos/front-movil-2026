import { Pressable } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";

import { colors } from "../../../shared/theme/colors";

export function OnboardingPaginationDot({ index, onPress, screenWidth, scrollX }) {
  const dotAnimatedStyle = useAnimatedStyle(() => {
    const inputRange = [(index - 1) * screenWidth, index * screenWidth, (index + 1) * screenWidth];

    return {
      width: interpolate(scrollX.value, inputRange, [8, 28, 8], Extrapolation.CLAMP),
      opacity: interpolate(scrollX.value, inputRange, [0.3, 1, 0.3], Extrapolation.CLAMP),
      transform: [
        {
          scale: interpolate(scrollX.value, inputRange, [0.94, 1, 0.94], Extrapolation.CLAMP),
        },
      ],
    };
  });

  return (
    <Pressable hitSlop={10} onPress={onPress}>
      <Animated.View
        style={[
          {
            height: 8,
            borderRadius: 999,
            backgroundColor: colors.black,
          },
          dotAnimatedStyle,
        ]}
      />
    </Pressable>
  );
}
