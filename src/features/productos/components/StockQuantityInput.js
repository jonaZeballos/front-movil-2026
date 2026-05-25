import { StyleSheet, Text, TextInput, View } from "react-native";

export function StockQuantityInput({
  label = "Cantidad",
  value,
  onChangeText,
  placeholder = "0",
}) {
  return (
    <View style={styles.box}>
      <Text style={styles.label}>{label}</Text>

      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        keyboardType="numeric"
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 15,
    marginBottom: 12,
  },
  label: {
    marginBottom: 8,
    color: "#374151",
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  input: {
    height: 54,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#F9FAFB",
    paddingHorizontal: 15,
    fontSize: 18,
    fontWeight: "900",
    color: "#111827",
  },
});