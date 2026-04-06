import Svg, { Path } from "react-native-svg";

export function AppLogo({ width = 180, height = 109, color = "#000000" }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 180 109" fill="none">
      <Path d="M49.1824 108.717H13.8062L49.1824 55.2211H84.5586L49.1824 108.717Z" fill={color} />
      <Path d="M36.239 0H72.4781L36.239 55.2214H0L36.239 0Z" fill={color} />
      <Path d="M119.885 20.5543H85V0H180V20.5543H145.115V109H119.885V20.5543Z" fill={color} />
    </Svg>
  );
}
