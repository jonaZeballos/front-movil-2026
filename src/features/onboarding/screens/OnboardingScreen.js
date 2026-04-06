import { useRef, useState } from "react";
import { FlatList, Pressable, Text, View, useWindowDimensions } from "react-native";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";

import { OnboardingPaginationDot } from "../components/OnboardingPaginationDot";
import { OnboardingSlide } from "../components/OnboardingSlide";
import { onboardingSlides } from "../data/onboardingSlides";
import { AppButton } from "../../../shared/components/buttons";
import { ScreenContainer } from "../../../shared/components/ScreenContainer";
import { colors } from "../../../shared/theme/colors";
import { textPresets } from "../../../shared/theme/typography";
import tw from "../../../shared/styles/tw";

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

export function OnboardingScreen({ onComplete }) {
  const listRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const scrollX = useSharedValue(0);
  const isCompactHeight = screenHeight < 760;
  const isVeryCompactHeight = screenHeight < 690;
  const horizontalPadding = screenWidth < 380 ? 22 : 28;
  const cardWidth = Math.min(screenWidth - horizontalPadding * 2, 360);
  const imageCardHeight = Math.min(
    Math.max(screenHeight * (isVeryCompactHeight ? 0.28 : isCompactHeight ? 0.32 : 0.38), 240),
    isVeryCompactHeight ? 290 : 380
  );
  const isLastSlide = currentIndex === onboardingSlides.length - 1;
  const metrics = {
    horizontalPadding,
    slideTopPadding: isVeryCompactHeight ? 10 : isCompactHeight ? 14 : 22,
    copyTopMargin: isVeryCompactHeight ? 20 : isCompactHeight ? 24 : 32,
    titleTopMargin: isVeryCompactHeight ? 12 : 16,
    titleFontSize: isVeryCompactHeight ? 24 : isCompactHeight ? 26 : 28,
    titleLineHeight: isVeryCompactHeight ? 31 : isCompactHeight ? 34 : 40,
    titleMaxWidth: Math.min(cardWidth - 10, 310),
    descriptionTopMargin: isVeryCompactHeight ? 10 : 14,
    descriptionFontSize: isVeryCompactHeight ? 14 : 16,
    descriptionLineHeight: isVeryCompactHeight ? 22 : isCompactHeight ? 24 : 28,
    descriptionMaxWidth: Math.min(cardWidth - 24, 300),
  };

  const handleScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  const scrollToSlide = (index) => {
    listRef.current?.scrollToIndex({
      index,
      animated: true,
    });
  };

  const skipToHome = () => {
    onComplete?.();
  };

  const goToNextSlide = () => {
    if (isLastSlide) {
      onComplete?.();
      return;
    }

    scrollToSlide(currentIndex + 1);
  };

  const handleMomentumScrollEnd = (event) => {
    const nextIndex = Math.round(event.nativeEvent.contentOffset.x / screenWidth);
    setCurrentIndex(nextIndex);
  };

  return (
    <ScreenContainer backgroundColor={colors.surface}>
      <View style={tw`flex-1`}>
        <View
          style={[
            tw`w-full flex-row items-center justify-end`,
            {
              paddingHorizontal: horizontalPadding,
              paddingTop: isVeryCompactHeight ? 10 : 18,
            },
          ]}
        >
          <Pressable hitSlop={12} onPress={skipToHome}>
            <Text
              style={[
                textPresets.bodyMuted,
                {
                  fontSize: 16,
                  lineHeight: 24,
                  color: "#9F9F9F",
                },
              ]}
            >
              Saltar
            </Text>
          </Pressable>
        </View>

        <AnimatedFlatList
          ref={listRef}
          data={onboardingSlides}
          horizontal
          pagingEnabled
          bounces={false}
          decelerationRate="fast"
          keyExtractor={(item) => item.key}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <OnboardingSlide
              item={item}
              index={index}
              scrollX={scrollX}
              screenWidth={screenWidth}
              cardWidth={cardWidth}
              imageCardHeight={imageCardHeight}
              metrics={metrics}
            />
          )}
          onMomentumScrollEnd={handleMomentumScrollEnd}
          onScroll={handleScroll}
          onScrollToIndexFailed={({ index }) => {
            listRef.current?.scrollToOffset({
              offset: index * screenWidth,
              animated: true,
            });
          }}
          scrollEventThrottle={16}
          getItemLayout={(_, index) => ({
            length: screenWidth,
            offset: screenWidth * index,
            index,
          })}
        />

        <View
          style={{
            paddingHorizontal: horizontalPadding,
            paddingTop: isVeryCompactHeight ? 2 : 8,
            paddingBottom: isVeryCompactHeight ? 16 : 24,
          }}
        >
          <View
            style={{
              width: cardWidth,
              alignSelf: "center",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <View style={[tw`flex-row items-center`, { columnGap: 8 }]}>
              {onboardingSlides.map((slide, index) => (
                <OnboardingPaginationDot
                  key={slide.key}
                  index={index}
                  screenWidth={screenWidth}
                  scrollX={scrollX}
                  onPress={() => scrollToSlide(index)}
                />
              ))}
            </View>

            <AppButton
              title={isLastSlide ? "Empezar" : "Siguiente"}
              onPress={goToNextSlide}
              width={isVeryCompactHeight ? 132 : 148}
              minHeight={isVeryCompactHeight ? 48 : 56}
              backgroundColor={colors.black}
              style={{
                paddingHorizontal: isVeryCompactHeight ? 18 : 20,
                paddingVertical: isVeryCompactHeight ? 14 : 16,
                shadowColor: colors.black,
                shadowOffset: { width: 0, height: 12 },
                shadowOpacity: 0.16,
                shadowRadius: 18,
                elevation: 12,
              }}
              textStyle={{
                fontSize: isVeryCompactHeight ? 14 : 15,
                lineHeight: 20,
              }}
            />
          </View>
        </View>
      </View>
    </ScreenContainer>
  );
}
