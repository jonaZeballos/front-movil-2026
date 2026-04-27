import { useState } from "react";
import { Pressable, TextInput, View } from "react-native";
import { Feather } from "@expo/vector-icons";

import { colors } from "../../../shared/theme/colors";

export function PasswordInput({
  value,
  onChangeText,
  placeholder = "••••••••••",
}) {
  const [isSecure, setIsSecure] = useState(true);

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
        name="lock"
        size={18}
        color="#B8B8B8"
        style={{ marginRight: 10 }}
      />

      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#B8B8B8"
        secureTextEntry={isSecure}
        style={{
          flex: 1,
          color: colors.black,
          fontSize: 15,
        }}
      />

      <Pressable onPress={() => setIsSecure((prev) => !prev)} hitSlop={10}>
        <Feather
          name={isSecure ? "eye-off" : "eye"}
          size={18}
          color="#B8B8B8"
        />
      </Pressable>
    </View>
  );
}