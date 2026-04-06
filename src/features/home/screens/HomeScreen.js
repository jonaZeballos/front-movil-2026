import { Text, View } from "react-native";

import { ScreenContainer } from "../../../shared/components/ScreenContainer";
import { colors } from "../../../shared/theme/colors";
import { textPresets } from "../../../shared/theme/typography";
import tw from "../../../shared/styles/tw";

export function HomeScreen() {
  return (
    <ScreenContainer backgroundColor={colors.surface}>
      <View style={tw`flex-1 items-center justify-center px-6`}>
        <Text style={textPresets.headingDark}>Hola mundo</Text>
      </View>
    </ScreenContainer>
  );
}
