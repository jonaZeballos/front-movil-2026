import { Platform } from "react-native";

export const bottomActionMargin = Platform.select({
  ios: 104,
  android: 72,
  default: 72,
});

export const clientBottomActionMargin = Platform.select({
  ios: 60,
  android: 56,
  default: 56,
});
