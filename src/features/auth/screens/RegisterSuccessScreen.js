import { Image, Text, View, useWindowDimensions } from "react-native";

import { AppButton } from "../../../shared/components/buttons";
import { ScreenContainer } from "../../../shared/components/ScreenContainer";
import tw from "../../../shared/styles/tw";
import { colors } from "../../../shared/theme/colors";
import { textPresets } from "../../../shared/theme/typography";

export function RegisterSuccessScreen({ onOk }) {
  const { width: screenWidth } = useWindowDimensions();

  const horizontalPadding = screenWidth < 380 ? 20 : 24;
  const contentWidth = Math.min(screenWidth - horizontalPadding * 2, 360);

  return (
    <ScreenContainer backgroundColor={colors.black}>
      <View style={[tw`flex-1 items-center justify-center`, { paddingHorizontal: horizontalPadding, paddingVertical: 32 }]}>
        <View style={{ width: contentWidth }}>
          <Text style={[textPresets.headingDark, { color: colors.surface, fontSize: 24, lineHeight: 32, marginBottom: 30 }]}>
            ¡FELICITACIONES!
          </Text>

          <View style={[tw`items-center justify-center`, { marginBottom: 30 }]}>
            <Image
              source={require("../../../../assets/images/register-success.png")}
              style={{ width: 260, height: 190 }}
              resizeMode="contain"
            />
          </View>

          <Text style={[textPresets.headingDark, { color: colors.surface, fontSize: 28, lineHeight: 34, marginBottom: 36 }]}>
            Creaste tu cuenta satisfactoriamente
          </Text>

          <AppButton title="OK" onPress={onOk} backgroundColor={colors.primary} minHeight={54} />
        </View>
      </View>
    </ScreenContainer>
  );
}