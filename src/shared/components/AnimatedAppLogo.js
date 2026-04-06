import { useEffect } from "react";
import Svg, { Path } from "react-native-svg";
import Animated, {
  Easing,
  useAnimatedProps,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

const AnimatedPath = Animated.createAnimatedComponent(Path);

export function AnimatedAppLogo({ width = 180, height = 109, color = "#000000" }) {
  const leftTopOpacity = useSharedValue(1);
  const leftBottomOpacity = useSharedValue(1);
  const rightOpacity = useSharedValue(1);

  useEffect(() => {
    const createPulse = (delay) =>
      withDelay(
        delay,
        withRepeat(
          withSequence(
            withTiming(0.2, {
              duration: 540,
              easing: Easing.inOut(Easing.ease),
            }),
            withTiming(1, {
              duration: 700,
              easing: Easing.inOut(Easing.ease),
            })
          ),
          -1,
          false
        )
      );

    leftTopOpacity.value = createPulse(0);
    leftBottomOpacity.value = createPulse(180);
    rightOpacity.value = createPulse(360);
  }, [leftBottomOpacity, leftTopOpacity, rightOpacity]);

  const leftTopAnimatedProps = useAnimatedProps(() => ({
    opacity: leftTopOpacity.value,
  }));

  const leftBottomAnimatedProps = useAnimatedProps(() => ({
    opacity: leftBottomOpacity.value,
  }));

  const rightAnimatedProps = useAnimatedProps(() => ({
    opacity: rightOpacity.value,
  }));

  return (
    <Svg width={width} height={height} viewBox="0 0 180 109" fill="none">
      <AnimatedPath
        d="M36.239 0H72.4781L36.239 55.2214H0L36.239 0Z"
        fill={color}
        animatedProps={leftTopAnimatedProps}
      />
      <AnimatedPath
        d="M49.1824 108.717H13.8062L49.1824 55.2211H84.5586L49.1824 108.717Z"
        fill={color}
        animatedProps={leftBottomAnimatedProps}
      />
      <AnimatedPath
        d="M119.885 20.5543H85V0H180V20.5543H145.115V109H119.885V20.5543Z"
        fill={color}
        animatedProps={rightAnimatedProps}
      />
    </Svg>
  );
}
