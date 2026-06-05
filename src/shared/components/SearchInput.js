import { StyleSheet, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export function SearchInput({
  value,
  onChangeText,
  placeholder,
  iconName = "search-outline",
  style,
}) {
  return (
    <View style={[styles.container, style]}>
      <Ionicons name={iconName} size={18} color="#8A8A8A" />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#8A8A8A"
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 56,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    columnGap: 10,
  },
  input: {
    flex: 1,
    color: "#111827",
    fontSize: 14,
    paddingVertical: 0,
  },
});
