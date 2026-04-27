import { useState } from "react";
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

import { ScreenContainer } from "../../../shared/components/ScreenContainer";
import { colors } from "../../../shared/theme/colors";

export function CreateOrderScreen({ equipments, onCreateOrder, onBack }) {
  const [selectedEquipmentId, setSelectedEquipmentId] = useState(null);

  const selectedEquipment = equipments.find((item) => item.id === selectedEquipmentId);

  const handleCreate = () => {
    if (!selectedEquipmentId) {
      Alert.alert("Equipo obligatorio", "Selecciona un equipo registrado para crear la orden.");
      return;
    }

    onCreateOrder(selectedEquipmentId);
  };

  return (
    <ScreenContainer backgroundColor={colors.dashboardBg} edges={["top"]}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable onPress={onBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={22} color="#111827" />
          </Pressable>

          <View style={styles.headerText}>
            <Text style={styles.title}>Nueva orden</Text>
            <Text style={styles.subtitle}>Selecciona un equipo registrado</Text>
          </View>
        </View>

        <FlatList
          data={equipments}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => {
            const selected = selectedEquipmentId === item.id;

            return (
              <Pressable
                style={[styles.equipmentCard, selected && styles.equipmentCardSelected]}
                onPress={() => setSelectedEquipmentId(item.id)}
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

                  <Ionicons
                    name={selected ? "radio-button-on" : "radio-button-off"}
                    size={23}
                    color={selected ? "#5655B9" : "#9CA3AF"}
                  />
                </View>

                <Text style={styles.serial}>Serie: {item.serial}</Text>
                <Text style={styles.failure}>Falla reportada: {item.failure}</Text>
              </Pressable>
            );
          }}
        />

        {selectedEquipment ? (
          <View style={styles.summaryBox}>
            <Text style={styles.summaryTitle}>Cliente seleccionado automáticamente</Text>
            <Text style={styles.summaryText}>{selectedEquipment.clientName}</Text>
          </View>
        ) : null}

        <Pressable style={styles.createButton} onPress={handleCreate}>
          <Text style={styles.createButtonText}>Crear orden</Text>
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
  listContent: {
    paddingBottom: 16,
  },
  equipmentCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 16,
    marginBottom: 14,
    borderWidth: 2,
    borderColor: "transparent",
  },
  equipmentCardSelected: {
    borderColor: "#5655B9",
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
  summaryBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 14,
    marginBottom: 12,
  },
  summaryTitle: {
    fontSize: 12,
    color: "#6B7280",
  },
  summaryText: {
    marginTop: 4,
    fontSize: 16,
    fontWeight: "800",
    color: "#111827",
  },
  createButton: {
    height: 56,
    borderRadius: 18,
    backgroundColor: "#5655B9",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  createButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },
});