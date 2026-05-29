import { Text, TextInput, View } from "react-native";
import { Feather } from "@expo/vector-icons";

import { colors } from "../../../shared/theme/colors";
import { textPresets } from "../../../shared/theme/typography";

export function AuthInput({
  value,
  onChangeText,
  placeholder,
  icon = "user",
  keyboardType = "default",
  autoCapitalize = "sentences",
  error,
  ...textInputProps
}) {
  return (
    <View>
      <View
        style={{
          height: 54,
          borderRadius: 14,
          backgroundColor: "#F5F5F5",
          borderWidth: error ? 1 : 0,
          borderColor: error ? "#D14343" : "transparent",
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 14,
        }}
      >
        <Feather
          name={icon}
          size={18}
          color={error ? "#D14343" : "#B8B8B8"}
          style={{ marginRight: 10 }}
        />

        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#B8B8B8"
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          {...textInputProps}
          style={{
            flex: 1,
            color: colors.black,
            fontSize: 15,
          }}
        />
      </View>

      {!!error && (
        <Text style={[textPresets.bodyMuted, { color: "#D14343", marginTop: 6, lineHeight: 18 }]}>
          {error}
        </Text>
      )}
    </View>
  );
}
