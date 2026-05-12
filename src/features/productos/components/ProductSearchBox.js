import { StyleSheet, Text, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export function ProductSearchBox({ value, onChangeText }) {
  return (
    <View style={styles.searchBox}>
      <Text style={styles.searchLabel}>Buscar producto</Text>
      <View style={styles.searchInput}>
        <Ionicons name="search-outline" size={18} color="#8C8C8C" />
        <TextInput
          style={styles.inputText}
          placeholder="Por nombre, marca o modelo"
          placeholderTextColor="#7A7A82"
          value={value}
          onChangeText={onChangeText}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  searchBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 16,
    marginBottom: 16,
  },
  searchLabel: {
    marginBottom: 8,
    fontSize: 12,
    fontWeight: "700",
    color: "#4B4B4B",
    letterSpacing: 1.3,
    textTransform: "uppercase",
  },
  searchInput: {
    minHeight: 56,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#EBEBEB",
    backgroundColor: "#F9FAFB",
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    columnGap: 10,
  },
  inputText: {
    flex: 1,
    color: "#111111",
    fontSize: 15,
    paddingVertical: 0,
  },
});
