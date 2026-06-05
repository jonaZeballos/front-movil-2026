import { useEffect, useMemo, useRef, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";

import { ScreenContainer } from "../../../shared/components/ScreenContainer";
import { SearchInput } from "../../../shared/components/SearchInput";
import { colors } from "../../../shared/theme/colors";

export function EquipmentListScreen({ equipments, onRegister, onOpenEquipment, onBack }) {
  const [query, setQuery] = useState("");
  const isFocused = useIsFocused();
  const [isOpeningRegister, setIsOpeningRegister] = useState(false);
  const isOpeningRegisterRef = useRef(false);

  useEffect(() => {
    if (isFocused) {
      isOpeningRegisterRef.current = false;
      setIsOpeningRegister(false);
    }
  }, [isFocused]);

  const handleRegisterPress = async () => {
    if (isOpeningRegisterRef.current) return;

    isOpeningRegisterRef.current = true;
    setIsOpeningRegister(true);

    try {
      await onRegister?.();
    } catch (error) {
      isOpeningRegisterRef.current = false;
      setIsOpeningRegister(false);
    }
  };

  const filteredItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return equipments;
    }

    return equipments.filter((item) =>
      [item.clientName, item.type, item.brand, item.model, item.serial].some((value) =>
        String(value || "").toLowerCase().includes(normalizedQuery)
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
          <SearchInput
            value={query}
            onChangeText={setQuery}
            placeholder="Buscar por cliente, tipo o modelo"
          />
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

        </ScrollView>

        <Pressable
          style={[styles.createButton, isOpeningRegister && styles.disabledButton]}
          onPress={handleRegisterPress}
          disabled={isOpeningRegister}
        >
          {isOpeningRegister ? (
            <View style={styles.loadingRow}>
              <ActivityIndicator color="#FFFFFF" size="small" />
              <Text style={styles.createButtonText}>Abriendo...</Text>
            </View>
          ) : (
            <>
              <Ionicons name="add" size={22} color="#FFFFFF" />
              <Text style={styles.createButtonText}>Registrar equipo</Text>
            </>
          )}
        </Pressable>
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
    marginBottom: 14,
  },
  createButton: {
    height: 54,
    borderRadius: 18,
    backgroundColor: "#5655B9",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    columnGap: 8,
    marginTop: 10,
    marginBottom: 104,
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
    paddingBottom: 128,
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
  disabledButton: {
    opacity: 0.7,
  },
  loadingRow: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 8,
  },
});
