import { Pressable, StatusBar, Text, View } from "react-native";

import tw from "../../../shared/styles/tw";
import { colors } from "../../../shared/theme/colors";
import { textPresets } from "../../../shared/theme/typography";

export function AuthTopBar({ title, onBack }) {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={colors.black} />

      <View
        style={[
          tw`w-full`,
          {
            backgroundColor: colors.black,
            paddingHorizontal: 20,
            paddingTop: 18,
            paddingBottom: 18,
          },
        ]}
      >
        <Pressable
          onPress={onBack}
          hitSlop={12}
          style={tw`self-start flex-row items-center`}
        >
          <Text
            style={[
              textPresets.bodyDark,
              {
                color: colors.surface,
                fontSize: 15,
                lineHeight: 20,
                fontWeight: "600",
              },
            ]}
          >
            ← {title}
          </Text>
        </Pressable>
      </View>
    </>
  );
}