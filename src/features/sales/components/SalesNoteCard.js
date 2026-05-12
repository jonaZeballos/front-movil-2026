import { StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";

import { colors } from "../../../shared/theme/colors";
import { fontFamilies } from "../../../shared/theme/fonts";

export function SalesNoteCard() {
  return (
    <View style={styles.noteCard}>
      <View style={styles.noteIcon}>
        <Feather name="info" size={18} color="#FFFFFF" />
      </View>

      <View style={{ flex: 1 }}>
        <Text style={styles.noteTitle}>Resumen comercial</Text>
        <Text style={styles.noteText}>
          Revisa productos disponibles, registra ventas y consulta clientes
          antes de completar una operacion.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  noteCard: {
    backgroundColor: "#F5F5F7",
    borderRadius: 14,
    padding: 14,
    flexDirection: "row",
    gap: 12,
  },
  noteIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  noteTitle: {
    fontFamily: fontFamilies.semibold,
    fontSize: 15,
    color: "#111111",
  },
  noteText: {
    marginTop: 4,
    fontFamily: fontFamilies.regular,
    fontSize: 12,
    lineHeight: 17,
    color: "#7A7A82",
  },
});
