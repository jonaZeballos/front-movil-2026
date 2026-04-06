import { Text, View } from "react-native";
import { useEffect } from "react";
import Animated, {
  Easing,
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import { AppLogo } from "../../../shared/components/AppLogo";
import { AppLogoFull } from "../../../shared/components/AppLogoFull";
import { ScreenContainer } from "../../../shared/components/ScreenContainer";
import { colors } from "../../../shared/theme/colors";
import { textPresets } from "../../../shared/theme/typography";
import tw from "../../../shared/styles/tw";

export function SplashScreen() {
  const logoOpacity = useSharedValue(1);
  const logoScale = useSharedValue(1);

  useEffect(() => {
    logoOpacity.value = withRepeat(
      withSequence(
        withTiming(0.12, {
          duration: 1800,
          easing: Easing.inOut(Easing.ease),
        }),
        withTiming(1, {
          duration: 1800,
          easing: Easing.inOut(Easing.ease),
        })
      ),
      -1,
      false
    );

    logoScale.value = withRepeat(
      withSequence(
        withTiming(0.96, {
          duration: 1800,
          easing: Easing.inOut(Easing.ease),
        }),
        withTiming(1, {
          duration: 1800,
          easing: Easing.inOut(Easing.ease),
        })
      ),
      -1,
      false
    );
  }, [logoOpacity, logoScale]);

  const logoAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: logoOpacity.value,
      transform: [{ scale: logoScale.value }],
    };
  });

  return (
    <ScreenContainer backgroundColor={colors.backgroundSoft}>
      <View style={tw`flex-1 px-6`}>
        <View style={tw`flex-1 items-center justify-center`}>
          <Animated.View style={logoAnimatedStyle}>
            <AppLogo width={182} height={110} color={colors.black} />
          </Animated.View>
        </View>

        <Animated.View entering={FadeIn.duration(600)} style={tw`items-center pb-12`}>
          <AppLogoFull width={182} height={37} color={colors.black} />
          <Text style={[tw`mt-2 text-center`, textPresets.captionGray, { color: colors.gray500 }]}>
            Version 1.0
          </Text>
        </Animated.View>
      </View>
    </ScreenContainer>
  );
}
