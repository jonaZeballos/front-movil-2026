import { Image, Text, View } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";

import { colors } from "../../../shared/theme/colors";
import { textPresets } from "../../../shared/theme/typography";
import tw from "../../../shared/styles/tw";

const AnimatedImage = Animated.createAnimatedComponent(Image);

export function OnboardingSlide({
  cardWidth,
  imageCardHeight,
  index,
  item,
  metrics,
  screenWidth,
  scrollX,
}) {
  const inputRange = [(index - 1) * screenWidth, index * screenWidth, (index + 1) * screenWidth];

  const cardAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(scrollX.value, inputRange, [0.58, 1, 0.58], Extrapolation.CLAMP),
      transform: [
        {
          translateX: interpolate(
            scrollX.value,
            inputRange,
            [screenWidth * 0.1, 0, -screenWidth * 0.1],
            Extrapolation.CLAMP
          ),
        },
        {
          scale: interpolate(scrollX.value, inputRange, [0.94, 1, 0.94], Extrapolation.CLAMP),
        },
      ],
    };
  });

  const imageAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: interpolate(scrollX.value, inputRange, [1.06, 1, 1.06], Extrapolation.CLAMP),
        },
        {
          translateX: interpolate(scrollX.value, inputRange, [-18, 0, 18], Extrapolation.CLAMP),
        },
      ],
    };
  });

  const copyAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(scrollX.value, inputRange, [0.28, 1, 0.28], Extrapolation.CLAMP),
      transform: [
        {
          translateY: interpolate(scrollX.value, inputRange, [14, 0, 14], Extrapolation.CLAMP),
        },
      ],
    };
  });

  return (
    <View
      style={{
        width: screenWidth,
        alignItems: "center",
        paddingHorizontal: metrics.horizontalPadding,
        paddingTop: metrics.slideTopPadding,
      }}
    >
      <Animated.View
        style={[
          {
            width: cardWidth,
            height: imageCardHeight,
            position: "relative",
            alignItems: "center",
            justifyContent: "center",
          },
          cardAnimatedStyle,
        ]}
      >
        <View
          pointerEvents="none"
          style={{
            position: "absolute",
            top: 20,
            right: 14,
            bottom: 20,
            left: 14,
            borderRadius: 40,
            backgroundColor: "#FFFFFF",
            opacity: 0.18,
            shadowColor: "#FFFFFF",
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.42,
            shadowRadius: 34,
          }}
        />
        <View
          pointerEvents="none"
          style={{
            position: "absolute",
            top: 10,
            right: 8,
            bottom: 10,
            left: 8,
            borderRadius: 36,
            backgroundColor: colors.black,
            opacity: 0.08,
            shadowColor: colors.black,
            shadowOffset: { width: 0, height: 16 },
            shadowOpacity: 0.2,
            shadowRadius: 28,
            elevation: 20,
          }}
        />
        <View
          style={{
            width: "100%",
            height: "100%",
            borderRadius: 28,
            overflow: "hidden",
            backgroundColor: colors.gray300,
            shadowColor: colors.black,
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.14,
            shadowRadius: 18,
            elevation: 12,
          }}
        >
          <AnimatedImage
            source={item.image}
            style={[tw`h-full w-full`, imageAnimatedStyle]}
            resizeMode="cover"
          />
        </View>
      </Animated.View>

      <Animated.View
        style={[
          {
            width: cardWidth,
            marginTop: metrics.copyTopMargin,
            alignItems: "center",
          },
          copyAnimatedStyle,
        ]}
      >
        <Text
          style={[
            textPresets.headingDark,
            {
              fontSize: metrics.titleFontSize,
              lineHeight: metrics.titleLineHeight,
              textAlign: "center",
              maxWidth: metrics.titleMaxWidth,
            },
          ]}
        >
          {item.title}
        </Text>

        <Text
          style={[
            textPresets.bodyMuted,
            {
              marginTop: metrics.descriptionTopMargin,
              fontSize: metrics.descriptionFontSize,
              lineHeight: metrics.descriptionLineHeight,
              textAlign: "center",
              color: "#6B7280",
              maxWidth: metrics.descriptionMaxWidth,
            },
          ]}
        >
          {item.description}
        </Text>
      </Animated.View>
    </View>
  );
}
