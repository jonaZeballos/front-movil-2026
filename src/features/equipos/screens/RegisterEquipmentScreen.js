import { useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { Ionicons, MaterialCommunityIcons, Feather } from "@expo/vector-icons";

import { ScreenContainer } from "../../../shared/components/ScreenContainer";
import { colors } from "../../../shared/theme/colors";

const clientOptions = ["Juan Soliz", "Pedro Perez", "Maria Lopez"];
const equipmentTypeOptions = ["Laptop", "PC Escritorio", "Impresora"];

function SelectField({ label, value, placeholder, icon, options, isOpen, onToggle, onSelect }) {
  return (
    <View style={styles.fieldBlock}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <Pressable onPress={onToggle} style={({ pressed }) => [styles.fieldShell, pressed && styles.pressed]}>
        <View style={styles.fieldContent}>
          <Feather name={icon} size={18} color="#8A8A8A" />
          <Text style={[styles.fieldText, !value && styles.placeholderText]}>{value || placeholder}</Text>
        </View>
        <Ionicons name={isOpen ? "chevron-up" : "chevron-down"} size={18} color="#8A8A8A" />
      </Pressable>

      {isOpen ? (
        <View style={styles.dropdownMenu}>
          {options.map((option) => (
            <Pressable
              key={option}
              onPress={() => onSelect(option)}
              style={({ pressed }) => [styles.dropdownItem, pressed && styles.pressed]}
            >
              <Text style={styles.dropdownItemText}>{option}</Text>
              {option === value ? <Ionicons name="checkmark" size={16} color="#5655B9" /> : null}
            </Pressable>
          ))}
        </View>
      ) : null}
    </View>
  );
}

function InputField({ label, value, onChangeText, placeholder, icon }) {
  return (
    <View style={styles.fieldBlock}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={styles.fieldShell}>
        <MaterialCommunityIcons name={icon} size={18} color="#8A8A8A" />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#8A8A8A"
          style={styles.input}
        />
      </View>
    </View>
  );
}

function MultiLineField({ label, value, onChangeText, placeholder }) {
  return (
    <View style={styles.fieldBlock}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={[styles.fieldShell, styles.problemShell]}>
        <Feather name="alert-circle" size={18} color="#8A8A8A" style={styles.problemIcon} />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#8A8A8A"
          style={[styles.input, styles.problemInput]}
          multiline
          textAlignVertical="top"
        />
      </View>
    </View>
  );
}

export function RegisterEquipmentScreen({ onSave, onSaveAndCreateOrder, onBack }) {
  const [selectedClient, setSelectedClient] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [serial, setSerial] = useState("");
  const [problem, setProblem] = useState("");
  const [openField, setOpenField] = useState(null);

  const equipmentPayload = {
    clientName: selectedClient,
    type: selectedType,
    brand,
    model,
    serial,
    failure: problem,
  };

  const isFormValid = [
    selectedClient,
    selectedType,
    brand.trim(),
    model.trim(),
    serial.trim(),
    problem.trim(),
  ].every(Boolean);

  const handleSave = () => {
    if (!isFormValid) {
      Alert.alert("Formulario incompleto", "Completa todos los campos antes de continuar.");
      return;
    }

    onSave?.(equipmentPayload);
  };

  const handleSaveAndCreateOrder = () => {
    if (!isFormValid) {
      Alert.alert("Formulario incompleto", "Completa todos los campos antes de continuar.");
      return;
    }

    onSaveAndCreateOrder?.(equipmentPayload);
  };

  return (
    <ScreenContainer backgroundColor={colors.dashboardBg} edges={["top"]}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable onPress={onBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={22} color="#111827" />
          </Pressable>

          <View style={styles.headerText}>
            <Text style={styles.title}>Registrar equipo</Text>
            <Text style={styles.subtitle}>Completa el formulario para registrar un nuevo equipo</Text>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <View style={styles.formCard}>
            <SelectField
              label="CLIENTE"
              value={selectedClient}
              placeholder="Selecciona un cliente"
              icon="user"
              options={clientOptions}
              isOpen={openField === "client"}
              onToggle={() => setOpenField((current) => (current === "client" ? null : "client"))}
              onSelect={(option) => {
                setSelectedClient(option);
                setOpenField(null);
              }}
            />

            <SelectField
              label="TIPO DE EQUIPO"
              value={selectedType}
              placeholder="Selecciona una categoría"
              icon="triangle"
              options={equipmentTypeOptions}
              isOpen={openField === "type"}
              onToggle={() => setOpenField((current) => (current === "type" ? null : "type"))}
              onSelect={(option) => {
                setSelectedType(option);
                setOpenField(null);
              }}
            />

            <InputField
              label="MARCA"
              value={brand}
              onChangeText={setBrand}
              placeholder="Ingresa la marca del equipo"
              icon="copyright"
            />

            <InputField
              label="MODELO"
              value={model}
              onChangeText={setModel}
              placeholder="Ingresa el modelo del equipo"
              icon="card-text-outline"
            />

            <InputField
              label="SERIE"
              value={serial}
              onChangeText={setSerial}
              placeholder="Ingresa el número de serie"
              icon="numeric"
            />

            <MultiLineField
              label="PROBLEMA"
              value={problem}
              onChangeText={setProblem}
              placeholder="Describe el problema del equipo"
            />
          </View>

          <Pressable
            style={styles.primaryButton}
            onPress={handleSave}
          >
            <Text style={styles.primaryButtonText}>Guardar equipo</Text>
          </Pressable>

          <Pressable
            style={styles.secondaryButton}
            onPress={handleSaveAndCreateOrder}
          >
            <Text style={styles.secondaryButtonText}>Guardar y crear orden</Text>
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
  scrollContent: {
    paddingBottom: 24,
  },
  formCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 16,
  },
  fieldBlock: {
    marginBottom: 16,
  },
  fieldLabel: {
    marginBottom: 10,
    fontSize: 12,
    fontWeight: "700",
    color: "#4B4B4B",
    letterSpacing: 1.3,
  },
  fieldShell: {
    minHeight: 56,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 14,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    columnGap: 10,
  },
  fieldContent: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 10,
    flex: 1,
  },
  fieldText: {
    flexShrink: 1,
    fontSize: 15,
    color: "#111827",
  },
  placeholderText: {
    color: "#8A8A8A",
  },
  dropdownMenu: {
    marginTop: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
  },
  dropdownItem: {
    minHeight: 48,
    paddingHorizontal: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  dropdownItemText: {
    fontSize: 15,
    color: "#111827",
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: "#111827",
    paddingVertical: 0,
  },
  problemShell: {
    minHeight: 116,
    alignItems: "flex-start",
    paddingTop: 16,
  },
  problemIcon: {
    marginTop: 2,
  },
  problemInput: {
    minHeight: 80,
  },
  primaryButton: {
    height: 56,
    borderRadius: 18,
    backgroundColor: "#111111",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 18,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },
  secondaryButton: {
    height: 56,
    borderRadius: 18,
    backgroundColor: "#5655B9",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
  },
  secondaryButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },
  pressed: {
    opacity: 0.85,
  },
});
