import { Pressable, Text, View } from "react-native";

import { ScreenContainer } from "../../../shared/components/ScreenContainer";
import { colors } from "../../../shared/theme/colors";
import { textPresets } from "../../../shared/theme/typography";
import tw from "../../../shared/styles/tw";

export function HomeScreen({ onBackToAuth }) {
  return (
    <ScreenContainer backgroundColor={colors.surface}>
      <View style={tw`flex-1 px-6`}>
        <View style={tw`pt-4`}>
          <Pressable
            hitSlop={12}
            onPress={onBackToAuth}
            style={({ pressed }) => ({
              alignSelf: "flex-start",
              paddingHorizontal: 16,
              paddingVertical: 10,
              borderRadius: 999,
              backgroundColor: "#F3F4F6",
              opacity: pressed ? 0.82 : 1,
            })}
          >
            <Text
              style={[
                textPresets.bodyDark,
                {
                  color: colors.black,
                },
              ]}
            >
              Volver
            </Text>
          </Pressable>
        </View>

        <View style={tw`flex-1 items-center justify-center`}>
          <Text style={textPresets.headingDark}>Hola mundo</Text>
        </View>
      </View>
    </ScreenContainer>
  );
}
