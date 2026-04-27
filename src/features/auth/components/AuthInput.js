import { TextInput, View } from "react-native";
import { Feather } from "@expo/vector-icons";

import { colors } from "../../../shared/theme/colors";

export function AuthInput({
  value,
  onChangeText,
  placeholder,
  icon = "user",
  keyboardType = "default",
  autoCapitalize = "sentences",
}) {
  return (
    <View
      style={{
        height: 54,
        borderRadius: 14,
        backgroundColor: "#F5F5F5",
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 14,
      }}
    >
      <Feather
        name={icon}
        size={18}
        color="#B8B8B8"
        style={{ marginRight: 10 }}
      />

      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#B8B8B8"
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        style={{
          flex: 1,
          color: colors.black,
          fontSize: 15,
        }}
      />
    </View>
  );
}