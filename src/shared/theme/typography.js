import { colors } from "./colors";
import { fontFamilies } from "./fonts";

export const typography = {
  label: {
    fontSize: 12,
    fontFamily: fontFamilies.semibold,
    color: colors.gray600,
  },
  title: {
    fontSize: 36,
    fontFamily: fontFamilies.bold,
    color: colors.textStrong,
  },
  body: {
    fontSize: 16,
    fontFamily: fontFamilies.regular,
    color: colors.mutedText,
  },
};

export const textPresets = {
  heroBlack: {
    fontFamily: fontFamilies.bold,
    fontSize: 40,
    lineHeight: 48,
    color: colors.black,
  },
  headingDark: {
    fontFamily: fontFamilies.bold,
    fontSize: 28,
    lineHeight: 34,
    color: colors.textStrong,
  },
  titleGray: {
    fontFamily: fontFamilies.semibold,
    fontSize: 22,
    lineHeight: 28,
    color: colors.gray700,
  },
  bodyDark: {
    fontFamily: fontFamilies.regular,
    fontSize: 16,
    lineHeight: 24,
    color: colors.textSoft,
  },
  bodyMuted: {
    fontFamily: fontFamilies.regular,
    fontSize: 16,
    lineHeight: 24,
    color: colors.gray600,
  },
  captionGray: {
    fontFamily: fontFamilies.medium,
    fontSize: 12,
    lineHeight: 18,
    color: colors.gray500,
  },
};
