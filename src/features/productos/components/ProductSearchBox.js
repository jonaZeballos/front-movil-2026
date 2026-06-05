import { StyleSheet, View } from "react-native";

import { SearchInput } from "../../../shared/components/SearchInput";

export function ProductSearchBox({ value, onChangeText }) {
  return (
    <View style={styles.searchBox}>
      <SearchInput
        value={value}
        onChangeText={onChangeText}
        placeholder="Buscar por nombre, marca o modelo"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  searchBox: {
    marginBottom: 14,
  },
});
