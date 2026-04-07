import { Text, View, useWindowDimensions } from "react-native";

import { AppLogoFull } from "../../../shared/components/AppLogoFull";
import { AnimatedAppLogo } from "../../../shared/components/AnimatedAppLogo";
import { AppButton } from "../../../shared/components/buttons";
import { ScreenContainer } from "../../../shared/components/ScreenContainer";
import { colors } from "../../../shared/theme/colors";
import { textPresets } from "../../../shared/theme/typography";
import tw from "../../../shared/styles/tw";

export function AuthEntryScreen({ onLogin, onRegister, onGoogle, onFacebook }) {
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

        <View
          style={[
            tw`items-center`,
            {
              width: contentWidth,
              marginTop: isVeryCompactHeight ? 28 : 40,
            },
          ]}
        >
          <Text
            style={[
              textPresets.bodyMuted,
              {
                fontSize: 16,
                lineHeight: 22,
                color: "#C7CBD4",
              },
            ]}
          >
            continua con
          </Text>

          <View
            style={{
              width: "100%",
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 18,
              columnGap: 12,
            }}
          >
            <AppButton
              title="GOOGLE"
              onPress={onGoogle}
              backgroundColor="#F7D9D6"
              textColor="#E2583E"
              width={(contentWidth - 12) / 2}
              minHeight={50}
              style={{ paddingVertical: 14 }}
              textStyle={{ fontSize: 14, lineHeight: 18, letterSpacing: 2.4 }}
            />

            <AppButton
              title="FACEBOOK"
              onPress={onFacebook}
              backgroundColor="#D8E1F4"
              textColor="#4C6FB8"
              width={(contentWidth - 12) / 2}
              minHeight={50}
              style={{ paddingVertical: 14 }}
              textStyle={{ fontSize: 14, lineHeight: 18, letterSpacing: 2.1 }}
            />
          </View>
        </View>
      </View>
    </ScreenContainer>
  );
}
