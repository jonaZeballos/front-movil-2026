import { Text, View, useWindowDimensions } from "react-native";

import { AppLogoFull } from "../../../shared/components/AppLogoFull";
import { AnimatedAppLogo } from "../../../shared/components/AnimatedAppLogo";
import { AppButton } from "../../../shared/components/buttons";
import { ScreenContainer } from "../../../shared/components/ScreenContainer";
import { colors } from "../../../shared/theme/colors";
import { textPresets } from "../../../shared/theme/typography";
import tw from "../../../shared/styles/tw";

export function AuthEntryScreen({ onLogin, onRegister }) {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const isCompactHeight = screenHeight < 760;
  const isVeryCompactHeight = screenHeight < 690;
  const horizontalPadding = screenWidth < 380 ? 20 : 24;
  const contentWidth = Math.min(screenWidth - horizontalPadding * 2, 360);
  const logoSize = isVeryCompactHeight ? 92 : isCompactHeight ? 104 : 116;

  return (
    <ScreenContainer backgroundColor={colors.surface}>
      <View
        style={[
          tw`flex-1 items-center`,
          {
            paddingHorizontal: horizontalPadding,
            paddingTop: isVeryCompactHeight ? 28 : 42,
            paddingBottom: isVeryCompactHeight ? 20 : 28,
          },
        ]}
      >
        <View style={[tw`items-center`, { marginTop: isVeryCompactHeight ? 18 : 34 }]}>
          <AnimatedAppLogo width={logoSize} height={logoSize * 0.61} color={colors.black} />
        </View>

        <View
          style={[
            tw`items-center`,
            {
              width: contentWidth,
              marginTop: isVeryCompactHeight ? 72 : isCompactHeight ? 94 : 120,
            },
          ]}
        >
          <Text
            style={[
              textPresets.headingDark,
              {
                fontSize: isVeryCompactHeight ? 24 : 28,
                lineHeight: isVeryCompactHeight ? 30 : 36,
                color: colors.black,
              },
            ]}
          >
            Bienvenido a
          </Text>

          <View style={{ marginTop: 6 }}>
            <AppLogoFull
              width={isVeryCompactHeight ? 178 : 198}
              height={isVeryCompactHeight ? 36 : 40}
              color={colors.black}
            />
          </View>
        </View>

        <View
          style={{
            width: contentWidth,
            marginTop: isVeryCompactHeight ? 56 : isCompactHeight ? 68 : 84,
            rowGap: 14,
          }}
        >
          <AppButton
            title="Inicia Sesion"
            onPress={onLogin}
            backgroundColor={colors.black}
            minHeight={54}
            style={{
              shadowColor: colors.black,
              shadowOffset: { width: 0, height: 10 },
              shadowOpacity: 0.12,
              shadowRadius: 14,
              elevation: 10,
            }}
          />

          <AppButton
            title="Registrarse"
            onPress={onRegister}
            backgroundColor="#EFEFEF"
            textColor="#B8B8B8"
            minHeight={54}
          />
        </View>
      </View>
    </ScreenContainer>
  );
}
