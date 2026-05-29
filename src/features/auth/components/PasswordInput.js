import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { Feather } from "@expo/vector-icons";

import { colors } from "../../../shared/theme/colors";
import { textPresets } from "../../../shared/theme/typography";

export function PasswordInput({
  value,
  onChangeText,
  placeholder = "Contrasena",
  error,
}) {
  const [isSecure, setIsSecure] = useState(true);

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
          name="lock"
          size={18}
          color={error ? "#D14343" : "#B8B8B8"}
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

      {!!error && (
        <Text style={[textPresets.bodyMuted, { color: "#D14343", marginTop: 6, lineHeight: 18 }]}>
          {error}
        </Text>
      )}
    </View>
  );
}
