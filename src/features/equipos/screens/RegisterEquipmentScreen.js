import { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Platform,
  Keyboard,
  KeyboardAvoidingView,
} from "react-native";
import { Ionicons, MaterialCommunityIcons, Feather } from "@expo/vector-icons";

import { ScreenContainer } from "../../../shared/components/ScreenContainer";
import { SearchInput } from "../../../shared/components/SearchInput";
import { colors } from "../../../shared/theme/colors";
import { OrderFormModal } from "../../orders/components/OrderFormModal";

const equipmentTypeOptions = ["Laptop", "PC Escritorio", "Impresora"];

function SelectField({
  label,
  value,
  placeholder,
  icon,
  options,
  isOpen,
  error,
  onToggle,
  onSelect,
}) {
  return (
    <View style={styles.fieldBlock}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <Pressable
        onPress={onToggle}
        style={({ pressed }) => [
          styles.fieldShell,
          !!error && styles.fieldShellError,
          pressed && styles.pressed,
        ]}
      >
        <View style={styles.fieldContent}>
          <Feather name={icon} size={18} color={error ? "#D14343" : "#8A8A8A"} />
          <Text style={[styles.fieldText, !value && styles.placeholderText]}>
            {value || placeholder}
          </Text>
        </View>
        <Ionicons name={isOpen ? "chevron-up" : "chevron-down"} size={18} color="#8A8A8A" />
      </Pressable>

      {!!error && <Text style={styles.errorText}>{error}</Text>}

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

function InputField({
  label,
  value,
  onChangeText,
  placeholder,
  icon,
  error,
}) {
  return (
    <View style={styles.fieldBlock}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={[styles.fieldShell, !!error && styles.fieldShellError]}>
        <MaterialCommunityIcons name={icon} size={18} color={error ? "#D14343" : "#8A8A8A"} />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#8A8A8A"
          style={styles.input}
        />
      </View>
      {!!error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

function MultiLineField({ label, value, onChangeText, placeholder, error }) {
  return (
    <View style={styles.fieldBlock}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={[styles.fieldShell, styles.problemShell, !!error && styles.fieldShellError]}>
        <Feather
          name="alert-circle"
          size={18}
          color={error ? "#D14343" : "#8A8A8A"}
          style={styles.problemIcon}
        />
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
      {!!error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

export function RegisterEquipmentScreen({
  clientes = [],
  onSave,
  onSaveAndCreateOrder,
  onBack,
  onCreateClient,
  onRefreshClientes,
}) {
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedType, setSelectedType] = useState("");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [serial, setSerial] = useState("");
  const [initialFailure, setInitialFailure] = useState("");
  const [openField, setOpenField] = useState(null);
  const [clientModalVisible, setClientModalVisible] = useState(false);
  const [orderModalVisible, setOrderModalVisible] = useState(false);
  const [clientSearch, setClientSearch] = useState("");
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [savingMode, setSavingMode] = useState(null);
  const submitLockRef = useRef(false);

  useEffect(() => {
    if (clientes.length === 0) {
      onRefreshClientes?.().catch(() => {});
    }
  }, [clientes.length, onRefreshClientes]);

  const filteredClients = useMemo(() => {
    const term = clientSearch.trim().toLowerCase();
    const rawTerm = clientSearch.trim();

    return clientes.filter((cliente) => {
      const nombre = String(cliente.nombre || cliente.razonSocial || "").toLowerCase();
      const nombres = String(cliente.nombres || "").toLowerCase();
      const apellidos = String(cliente.apellidos || "").toLowerCase();
      const documento = String(cliente.numeroDocumento || cliente.documento || "");
      const telefono = String(cliente.telefono || "");
      const correo = String(cliente.correo || cliente.email || "").toLowerCase();

      return (
        !term ||
        nombre.includes(term) ||
        nombres.includes(term) ||
        apellidos.includes(term) ||
        documento.includes(rawTerm) ||
        telefono.includes(rawTerm) ||
        correo.includes(term)
      );
    });
  }, [clientSearch, clientes]);

  const clearError = (field) => {
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const buildPayload = () => ({
    clienteId: selectedClient?.id,
    clientName: selectedClient?.nombre || selectedClient?.razonSocial,
    type: selectedType,
    brand: brand.trim(),
    model: model.trim(),
    serial: serial.trim(),
    initialFailure: initialFailure.trim(),
  });

  const validate = () => {
    const nextErrors = {};

    if (!selectedClient?.id) nextErrors.client = "Seleccione un cliente.";
    if (!selectedType) nextErrors.type = "Seleccione el tipo de equipo.";
    if (!brand.trim()) nextErrors.brand = "Ingrese la marca del equipo.";
    if (!model.trim()) nextErrors.model = "Ingrese el modelo del equipo.";
    if (serial.trim() && serial.trim().length < 3) {
      nextErrors.serial = "El numero de serie debe tener al menos 3 caracteres.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const runSubmit = async (submitAction, mode, orderData = {}) => {
    if (submitLockRef.current || isSaving) return;
    if (!validate()) return;

    submitLockRef.current = true;
    setIsSaving(true);
    setSavingMode(mode);

    try {
      await submitAction({ ...buildPayload(), ...orderData });
    } catch (error) {
      const message = error?.message || "No se pudo registrar el equipo. Intenta nuevamente.";
      Alert.alert("No se pudo registrar", message);
    } finally {
      submitLockRef.current = false;
      setIsSaving(false);
      setSavingMode(null);
    }
  };

  const handleClientSelect = (cliente) => {
    if (cliente.enListaNegra) {
      Alert.alert(
        "Cliente en lista negra",
        cliente.motivoListaNegra || "Este cliente requiere revision del administrador."
      );
      return;
    }

    setSelectedClient(cliente);
    clearError("client");
    setClientModalVisible(false);
  };

  return (
    <ScreenContainer backgroundColor={colors.dashboardBg} edges={["top"]} keyboardAvoiding>
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable onPress={onBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={22} color="#111827" />
          </Pressable>

          <View style={styles.headerText}>
            <Text style={styles.title}>Registrar equipo</Text>
            <Text style={styles.subtitle}>Asocia el equipo a un cliente del negocio actual</Text>
          </View>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.formCard}>
            <View style={styles.fieldBlock}>
              <Text style={styles.fieldLabel}>CLIENTE</Text>
              <Pressable
                onPress={() => setClientModalVisible(true)}
                style={({ pressed }) => [
                  styles.fieldShell,
                  !!errors.client && styles.fieldShellError,
                  pressed && styles.pressed,
                ]}
              >
                <View style={styles.fieldContent}>
                  <Feather name="user" size={18} color={errors.client ? "#D14343" : "#8A8A8A"} />
                  <Text style={[styles.fieldText, !selectedClient && styles.placeholderText]}>
                    {selectedClient?.nombre || selectedClient?.razonSocial || "Seleccionar cliente"}
                  </Text>
                </View>
                <Ionicons name="search" size={18} color="#8A8A8A" />
              </Pressable>
              {!!errors.client && <Text style={styles.errorText}>{errors.client}</Text>}
            </View>

            {clientes.length === 0 ? (
              <View style={styles.emptyClientBox}>
                <Feather name="user-plus" size={22} color={colors.primary} />
                <View style={styles.emptyClientTextBox}>
                  <Text style={styles.emptyClientTitle}>No hay clientes registrados</Text>
                  <Text style={styles.emptyClientText}>
                    Registre un cliente primero para asociar el equipo.
                  </Text>
                </View>
                <Pressable style={styles.emptyClientButton} onPress={onCreateClient}>
                  <Text style={styles.emptyClientButtonText}>Registrar</Text>
                </Pressable>
              </View>
            ) : null}

            <SelectField
              label="TIPO DE EQUIPO"
              value={selectedType}
              placeholder="Selecciona una categoria"
              icon="triangle"
              options={equipmentTypeOptions}
              error={errors.type}
              isOpen={openField === "type"}
              onToggle={() => setOpenField((current) => (current === "type" ? null : "type"))}
              onSelect={(option) => {
                setSelectedType(option);
                clearError("type");
                setOpenField(null);
              }}
            />

            <InputField
              label="MARCA"
              value={brand}
              error={errors.brand}
              onChangeText={(value) => {
                setBrand(value);
                clearError("brand");
              }}
              placeholder="Ingresa la marca del equipo"
              icon="copyright"
            />

            <InputField
              label="MODELO"
              value={model}
              error={errors.model}
              onChangeText={(value) => {
                setModel(value);
                clearError("model");
              }}
              placeholder="Ingresa el modelo del equipo"
              icon="card-text-outline"
            />

            <InputField
              label="NUMERO DE SERIE"
              value={serial}
              error={errors.serial}
              onChangeText={(value) => {
                setSerial(value);
                clearError("serial");
              }}
              placeholder="Opcional. Minimo 3 caracteres si se ingresa"
              icon="numeric"
            />

            <MultiLineField
              label="FALLA REPORTADA INICIAL"
              value={initialFailure}
              onChangeText={setInitialFailure}
              placeholder="Opcional. Nota inicial del equipo, no crea una orden."
            />
          </View>

          <Pressable
            style={[styles.primaryButton, isSaving && styles.disabledButton]}
            onPress={() => runSubmit(onSave, "equipment")}
            disabled={isSaving}
          >
            {isSaving && savingMode === "equipment" ? (
              <View style={styles.loadingRow}>
                <ActivityIndicator color="#FFFFFF" />
                <Text style={styles.primaryButtonText}>Guardando...</Text>
              </View>
            ) : (
              <Text style={styles.primaryButtonText}>Guardar equipo</Text>
            )}
          </Pressable>

          <Pressable
            style={[styles.secondaryButton, isSaving && styles.disabledButton]}
            onPress={() => {
              if (validate()) setOrderModalVisible(true);
            }}
            disabled={isSaving}
          >
            <Text style={styles.secondaryButtonText}>Crear orden para este equipo</Text>
          </Pressable>
        </ScrollView>

        <ClientPickerModal
          visible={clientModalVisible}
          clients={filteredClients}
          search={clientSearch}
          onSearch={setClientSearch}
          onClose={() => setClientModalVisible(false)}
          onSelect={handleClientSelect}
          onCreateClient={onCreateClient}
        />

        <OrderFormModal
          visible={orderModalVisible}
          clientes={clientes}
          equipments={[]}
          initialClient={selectedClient}
          initialEquipment={{
            id: "nuevo-equipo",
            type: selectedType,
            brand,
            model,
            serial,
          }}
          lockClient
          lockEquipment
          submitLabel="Guardar equipo y crear orden"
          isSubmitting={isSaving && savingMode === "order"}
          onClose={() => setOrderModalVisible(false)}
          onSubmit={(orderData) => {
            runSubmit(onSaveAndCreateOrder, "order", orderData);
          }}
        />
      </View>
    </ScreenContainer>
  );
}

function ClientPickerModal({
  visible,
  clients,
  search,
  onSearch,
  onClose,
  onSelect,
  onCreateClient,
}) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.modalOverlay} onPress={Keyboard.dismiss}>
        <Pressable
          style={styles.modalCard}
          onPress={(e) => {
            e.stopPropagation();
            Keyboard.dismiss();
          }}
        >
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Seleccionar cliente</Text>
                <Text style={styles.modalSubtitle}>Busca por nombre, documento, telefono o correo</Text>
              </View>
              <Pressable style={styles.modalClose} onPress={onClose}>
                <Ionicons name="close" size={22} color="#111827" />
              </Pressable>
            </View>

            <SearchInput
              value={search}
              onChangeText={onSearch}
              placeholder="Buscar cliente por nombre, CI o telefono"
              style={styles.modalSearch}
            />

            <FlatList
              data={clients}
              keyExtractor={(item) => String(item.id)}
              keyboardShouldPersistTaps="handled"
              keyboardDismissMode="on-drag"
              style={styles.clientFlatList}
              contentContainerStyle={styles.clientList}
              renderItem={({ item }) => (
                <Pressable style={styles.clientItem} onPress={() => onSelect(item)}>
                  <View style={styles.clientAvatar}>
                    <Text style={styles.clientAvatarText}>{getInitials(item.nombre || item.razonSocial)}</Text>
                  </View>
                  <View style={styles.clientInfo}>
                    <Text style={styles.clientName}>{item.nombre || item.razonSocial || "Cliente sin nombre"}</Text>
                    {item.enListaNegra ? (
                      <Text style={styles.clientBlacklist}>Lista negra</Text>
                    ) : null}
                    <Text style={styles.clientMeta}>
                      Doc: {item.numeroDocumento || "Sin documento"} · {item.telefono || "Sin telefono"}
                    </Text>
                    <Text style={styles.clientMeta}>{item.correo || item.email || "Sin correo"}</Text>
                  </View>
                </Pressable>
              )}
              ListEmptyComponent={
                <View style={styles.modalEmpty}>
                  <Feather name="users" size={34} color="#9CA3AF" />
                  <Text style={styles.modalEmptyTitle}>No hay clientes registrados</Text>
                  <Text style={styles.modalEmptyText}>Registre un cliente primero.</Text>
                  <Pressable style={styles.modalCreateButton} onPress={onCreateClient}>
                    <Text style={styles.modalCreateButtonText}>Registrar cliente</Text>
                  </Pressable>
                </View>
              }
            />
          </Pressable>
      </Pressable>
    </Modal>
  );
}

function getInitials(name) {
  return String(name || "CL")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
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
    paddingBottom: 140,
  },
  formCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 16,
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: "#111827",
  },
  sectionDescription: {
    marginTop: 4,
    marginBottom: 14,
    color: "#6B7280",
    fontSize: 12,
    lineHeight: 17,
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
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 14,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    columnGap: 10,
  },
  fieldShellError: {
    borderColor: "#D14343",
    backgroundColor: "#FFF7F7",
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
  emptyClientBox: {
    marginTop: -4,
    marginBottom: 16,
    borderRadius: 16,
    backgroundColor: "#EEF2FF",
    borderWidth: 1,
    borderColor: "#C7D2FE",
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    columnGap: 10,
  },
  emptyClientTextBox: {
    flex: 1,
  },
  emptyClientTitle: {
    color: "#111827",
    fontSize: 13,
    fontWeight: "900",
  },
  emptyClientText: {
    marginTop: 2,
    color: "#6B7280",
    fontSize: 12,
    lineHeight: 16,
  },
  emptyClientButton: {
    borderRadius: 12,
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  emptyClientButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "900",
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
  errorText: {
    marginTop: 6,
    color: "#D14343",
    fontSize: 12,
    lineHeight: 16,
  },
  primaryButton: {
    minHeight: 56,
    borderRadius: 18,
    backgroundColor: "#111111",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },
  secondaryButton: {
    minHeight: 56,
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
  loadingRow: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 10,
  },
  disabledButton: {
    opacity: 0.7,
  },
  pressed: {
    opacity: 0.85,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  modalCard: {
    width: "100%",
    maxHeight: 480,
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 18,
  },
  clientFlatList: {
    maxHeight: 230,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    columnGap: 12,
  },
  modalTitle: {
    color: "#111827",
    fontSize: 19,
    fontWeight: "900",
  },
  modalSubtitle: {
    marginTop: 3,
    color: "#6B7280",
    fontSize: 12,
  },
  modalClose: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  modalSearch: {
    marginTop: 16,
  },
  clientList: {
    paddingTop: 12,
    paddingBottom: 12,
  },
  clientItem: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  clientAvatar: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "#EDEBFF",
    alignItems: "center",
    justifyContent: "center",
  },
  clientAvatarText: {
    color: colors.primary,
    fontWeight: "900",
    fontSize: 13,
  },
  clientInfo: {
    flex: 1,
  },
  clientName: {
    color: "#111827",
    fontWeight: "900",
    fontSize: 14,
  },
  clientBlacklist: {
    marginTop: 2,
    color: "#B91C1C",
    fontSize: 12,
    fontWeight: "900",
  },
  clientMeta: {
    marginTop: 2,
    color: "#6B7280",
    fontSize: 12,
  },
  modalEmpty: {
    alignItems: "center",
    paddingVertical: 34,
    rowGap: 8,
  },
  modalEmptyTitle: {
    color: "#111827",
    fontSize: 16,
    fontWeight: "900",
  },
  modalEmptyText: {
    color: "#6B7280",
    fontSize: 13,
  },
  modalCreateButton: {
    marginTop: 8,
    borderRadius: 14,
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 11,
  },
  modalCreateButtonText: {
    color: "#FFFFFF",
    fontWeight: "900",
    fontSize: 13,
  },
});
