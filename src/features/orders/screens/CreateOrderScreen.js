import { useRef, useState } from "react";
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

import { ScreenContainer } from "../../../shared/components/ScreenContainer";
import { colors } from "../../../shared/theme/colors";

export function CreateOrderScreen({ equipments, onCreateOrder, onBack }) {
  const [selectedEquipmentId, setSelectedEquipmentId] = useState(null);
  const [diagnostico, setDiagnostico] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const isCreatingRef = useRef(false);

  const selectedEquipment = equipments.find((item) => item.id === selectedEquipmentId);

  const handleCreate = async () => {
    if (isCreatingRef.current) return;

    if (!selectedEquipmentId) {
      Alert.alert("Equipo obligatorio", "Selecciona un equipo registrado para crear la orden.");
      return;
    }

    if (!diagnostico.trim()) {
      Alert.alert("Diagnostico obligatorio", "Describe la falla reportada para crear la orden.");
      return;
    }

    try {
      isCreatingRef.current = true;
      setIsCreating(true);
      await onCreateOrder(selectedEquipmentId, diagnostico.trim());
      Alert.alert("Confirmacion", "Orden creada correctamente.");
    } catch (error) {
      Alert.alert("Error", error.message || "No se pudo crear la orden.");
      isCreatingRef.current = false;
      setIsCreating(false);
    }
  };

  return (
    <ScreenContainer backgroundColor={colors.dashboardBg} edges={["top"]}>
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable onPress={onBack} style={styles.backButton} disabled={isCreating}>
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
          keyboardShouldPersistTaps="handled"
          renderItem={({ item }) => {
            const selected = selectedEquipmentId === item.id;

            return (
              <Pressable
                style={[styles.equipmentCard, selected && styles.equipmentCardSelected]}
                onPress={() => {
                  if (!isCreating) setSelectedEquipmentId(item.id);
                }}
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
            <TextInput
              value={diagnostico}
              onChangeText={setDiagnostico}
              editable={!isCreating}
              placeholder="Describe la falla o diagnostico inicial"
              placeholderTextColor="#8C8C8C"
              multiline
              style={styles.diagnosticInput}
            />
          </View>
        ) : null}

        <Pressable
          style={[styles.createButton, isCreating && styles.disabledButton]}
          onPress={handleCreate}
          disabled={isCreating}
        >
          <Text style={styles.createButtonText}>{isCreating ? "Creando..." : "Crear orden"}</Text>
        </Pressable>
      </View>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 14,
  },
  keyboardContainer: {
    flex: 1,
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
  diagnosticInput: {
    minHeight: 88,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 14,
    padding: 12,
    marginTop: 12,
    color: "#111827",
    textAlignVertical: "top",
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
  disabledButton: {
    opacity: 0.65,
  },
});
