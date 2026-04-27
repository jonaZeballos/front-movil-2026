import { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

import { ScreenContainer } from "../../../shared/components/ScreenContainer";
import { colors } from "../../../shared/theme/colors";

export function EquipmentListScreen({ equipments, onRegister, onOpenEquipment, onBack }) {
  const [query, setQuery] = useState("");

  const filteredItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return equipments;
    }

    return equipments.filter((item) =>
      [item.clientName, item.type, item.brand, item.model, item.serial].some((value) =>
        value.toLowerCase().includes(normalizedQuery)
      )
    );
  }, [equipments, query]);

  return (
    <ScreenContainer backgroundColor={colors.dashboardBg} edges={["top"]}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable onPress={onBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={22} color="#111827" />
          </Pressable>

          <View style={styles.headerText}>
            <Text style={styles.title}>Gestión de equipos</Text>
            <Text style={styles.subtitle}>Registro y listado de equipos registrados</Text>
          </View>
        </View>

        <View style={styles.searchCard}>
          <Text style={styles.label}>BUSCAR POR CLIENTE O TIPO</Text>
          <View style={styles.inputShell}>
            <Ionicons name="search-outline" size={18} color="#8C8C8C" />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Busca por cliente o tipo"
              placeholderTextColor="#8C8C8C"
              style={styles.searchInput}
            />
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Equipos registrados</Text>
          <Text style={styles.sectionCount}>{filteredItems.length}</Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.listContent}>
          {filteredItems.map((item) => (
            <Pressable
              key={item.id}
              style={({ pressed }) => [styles.equipmentCard, pressed && styles.pressed]}
              onPress={() => onOpenEquipment?.(item)}
            >
              <View style={styles.cardHeader}>
                <View style={styles.iconBox}>
                  <MaterialCommunityIcons name="monitor-dashboard" size={22} color="#FFFFFF" />
                </View>

                <View style={styles.cardInfo}>
                  <Text style={styles.equipmentName}>
                    {item.type} {item.brand} {item.model}
                  </Text>
                  <Text style={styles.clientName}>Cliente: {item.clientName}</Text>
                </View>

                <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
              </View>

              <Text style={styles.serial}>Serie: {item.serial}</Text>
              <Text style={styles.failure}>Falla reportada: {item.failure}</Text>
            </Pressable>
          ))}

          {!filteredItems.length ? (
            <View style={styles.emptyBox}>
              <Ionicons name="hardware-chip-outline" size={46} color="#9CA3AF" />
              <Text style={styles.emptyTitle}>No hay resultados</Text>
              <Text style={styles.emptyText}>No se encontraron equipos para esa búsqueda.</Text>
            </View>
          ) : null}

          <Pressable style={styles.createButton} onPress={onRegister}>
            <Ionicons name="add" size={22} color="#FFFFFF" />
            <Text style={styles.createButtonText}>Registrar equipo</Text>
          </Pressable>
        </ScrollView>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 14,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "900",
    color: "#111827",
  },
  subtitle: {
    marginTop: 3,
    fontSize: 13,
    color: "#6B7280",
  },
  searchCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 16,
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
    fontSize: 12,
    fontWeight: "700",
    color: "#4B4B4B",
    letterSpacing: 1.3,
  },
  inputShell: {
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
  searchInput: {
    flex: 1,
    color: "#111111",
    fontSize: 15,
    paddingVertical: 0,
  },
  createButton: {
    height: 54,
    borderRadius: 18,
    backgroundColor: "#5655B9",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    columnGap: 8,
    marginTop: 8,
  },
  createButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#111827",
  },
  sectionCount: {
    fontSize: 13,
    fontWeight: "700",
    color: "#6B7280",
  },
  listContent: {
    paddingBottom: 24,
  },
  equipmentCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 16,
    marginBottom: 14,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#5655B9",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  cardInfo: {
    flex: 1,
  },
  equipmentName: {
    fontSize: 15,
    fontWeight: "800",
    color: "#111827",
  },
  clientName: {
    marginTop: 3,
    fontSize: 13,
    color: "#6B7280",
  },
  serial: {
    marginTop: 12,
    fontSize: 13,
    color: "#374151",
  },
  failure: {
    marginTop: 5,
    fontSize: 13,
    color: "#6B7280",
  },
  emptyBox: {
    marginTop: 40,
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
  },
  emptyTitle: {
    marginTop: 12,
    fontSize: 17,
    fontWeight: "800",
    color: "#111827",
  },
  emptyText: {
    marginTop: 6,
    fontSize: 13,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 19,
  },
  pressed: {
    opacity: 0.85,
  },
});
