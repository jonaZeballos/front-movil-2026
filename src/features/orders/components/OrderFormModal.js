import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

import { SearchInput } from "../../../shared/components/SearchInput";
import { colors } from "../../../shared/theme/colors";

const PRIORITIES = ["Baja", "Media", "Alta", "Urgente"];
const INITIAL_STATUSES = ["Recibido", "En diagnostico"];

export function OrderFormModal({
  visible,
  clientes = [],
  equipments = [],
  initialClient = null,
  initialEquipment = null,
  lockClient = false,
  lockEquipment = false,
  allowMultipleEquipments = true,
  submitLabel = "Crear orden",
  isSubmitting = false,
  onClose,
  onSubmit,
}) {
  const [selectedClient, setSelectedClient] = useState(initialClient);
  const [selectedEquipment, setSelectedEquipment] = useState(initialEquipment);
  const [selectedEquipments, setSelectedEquipments] = useState(initialEquipment ? [initialEquipment] : []);
  const [clientSearch, setClientSearch] = useState("");
  const [equipmentSearch, setEquipmentSearch] = useState("");
  const [diagnostico, setDiagnostico] = useState("");
  const [prioridad, setPrioridad] = useState("Media");
  const [estado, setEstado] = useState("Recibido");
  const [observaciones, setObservaciones] = useState("");
  const [errors, setErrors] = useState({});
  const [picker, setPicker] = useState(null);

  useEffect(() => {
    if (!visible) return;
    setSelectedClient(initialClient || null);
    setSelectedEquipment(initialEquipment || null);
    setSelectedEquipments(initialEquipment ? [initialEquipment] : []);
    setErrors({});
    setPicker(null);
  }, [initialClient, initialEquipment, visible]);

  const filteredClients = useMemo(() => {
    const term = clientSearch.trim().toLowerCase();
    const rawTerm = clientSearch.trim();

    return clientes.filter((client) => {
      const name = String(client.nombre || client.razonSocial || "").toLowerCase();
      const nombres = String(client.nombres || "").toLowerCase();
      const apellidos = String(client.apellidos || "").toLowerCase();
      const documento = String(client.numeroDocumento || "");
      const telefono = String(client.telefono || "");
      const correo = String(client.correo || client.email || "").toLowerCase();

      return (
        !term ||
        name.includes(term) ||
        nombres.includes(term) ||
        apellidos.includes(term) ||
        documento.includes(rawTerm) ||
        telefono.includes(rawTerm) ||
        correo.includes(term)
      );
    });
  }, [clientSearch, clientes]);

  const filteredEquipments = useMemo(() => {
    const term = equipmentSearch.trim().toLowerCase();
    const clientId = selectedClient?.id;

    return equipments.filter((equipment) => {
      const equipmentClientId = equipment.clienteId || equipment.clientId || equipment.idCliente;
      if (clientId && String(equipmentClientId) !== String(clientId)) return false;

      const label = getEquipmentLabel(equipment).toLowerCase();
      const serial = String(equipment.serial || equipment.nroSerie || "").toLowerCase();
      return !term || label.includes(term) || serial.includes(term);
    });
  }, [equipmentSearch, equipments, selectedClient]);

  const clearError = (field) => {
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const validate = () => {
    const nextErrors = {};
    if (!selectedClient?.id) nextErrors.client = "Seleccione un cliente.";
    if (!selectedEquipments.length && !selectedEquipment?.id && !lockEquipment) {
      nextErrors.equipment = "Seleccione al menos un equipo.";
    }
    if (!diagnostico.trim()) nextErrors.diagnostico = "Ingrese el diagnostico o falla de la orden.";
    if (!prioridad) nextErrors.prioridad = "Seleccione la prioridad.";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = () => {
    if (isSubmitting) return;
    if (!validate()) return;

    onSubmit?.({
      clienteId: selectedClient?.id,
      equipoId: selectedEquipments[0]?.id || selectedEquipment?.id || initialEquipment?.id,
      equipoIds: selectedEquipments.map((equipment) => equipment.id).filter(Boolean),
      equipos: selectedEquipments,
      diagnostico: diagnostico.trim(),
      failure: diagnostico.trim(),
      prioridad,
      estado,
      observaciones: observaciones.trim(),
    });
  };

  const selectClient = (client) => {
    if (client.enListaNegra) {
      Alert.alert(
        "Cliente en lista negra",
        client.motivoListaNegra || "Este cliente requiere revision del administrador."
      );
      return;
    }

    setSelectedClient(client);
    setSelectedEquipment(null);
    setSelectedEquipments([]);
    setPicker(null);
    clearError("client");
  };

  const selectEquipment = (equipment) => {
    if (allowMultipleEquipments && !lockEquipment) {
      setSelectedEquipments((prev) => {
        const exists = prev.some((item) => String(item.id) === String(equipment.id));
        return exists
          ? prev.filter((item) => String(item.id) !== String(equipment.id))
          : [...prev, equipment];
      });
    } else {
      setSelectedEquipment(equipment);
      setSelectedEquipments([equipment]);
      setPicker(null);
    }
    clearError("equipment");
  };

  const closeEquipmentPicker = () => {
    setSelectedEquipment(selectedEquipments[0] || null);
    setPicker(null);
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboard}
        >
          <View style={styles.card}>
            <View style={styles.header}>
              <View>
                <Text style={styles.title}>Orden de servicio</Text>
                <Text style={styles.subtitle}>Completa los datos de atencion tecnica</Text>
              </View>
              <Pressable style={styles.closeButton} onPress={onClose}>
                <Ionicons name="close" size={22} color="#111827" />
              </Pressable>
            </View>

            <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
              <PickerField
                label="Cliente"
                value={getClientName(selectedClient)}
                placeholder="Seleccionar cliente"
                icon="user"
                disabled={lockClient}
                error={errors.client}
                onPress={() => setPicker("client")}
              />

              <PickerField
                label={allowMultipleEquipments && !lockEquipment ? "Equipos" : "Equipo"}
                value={getSelectedEquipmentsLabel(selectedEquipments, selectedEquipment || initialEquipment)}
                placeholder={allowMultipleEquipments && !lockEquipment ? "Seleccionar uno o varios equipos" : "Seleccionar equipo"}
                icon="monitor"
                disabled={lockEquipment}
                error={errors.equipment}
                onPress={() => setPicker("equipment")}
              />

              <TextArea
                label="Diagnostico o falla de la orden"
                value={diagnostico}
                error={errors.diagnostico}
                placeholder="Describe el problema actual que se atendera"
                onChangeText={(value) => {
                  setDiagnostico(value);
                  clearError("diagnostico");
                }}
              />

              <OptionGroup
                label="Prioridad"
                options={PRIORITIES}
                value={prioridad}
                error={errors.prioridad}
                onChange={(value) => {
                  setPrioridad(value);
                  clearError("prioridad");
                }}
              />

              <OptionGroup
                label="Estado inicial"
                options={INITIAL_STATUSES}
                value={estado}
                onChange={setEstado}
              />

              <TextArea
                label="Observacion inicial"
                value={observaciones}
                placeholder="Opcional. Agrega detalles adicionales."
                onChangeText={setObservaciones}
              />
            </ScrollView>

            <Pressable
              style={[styles.submitButton, isSubmitting && styles.disabledButton]}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              <Text style={styles.submitButtonText}>
                {isSubmitting ? "Creando orden..." : submitLabel}
              </Text>
            </Pressable>
          </View>
        </KeyboardAvoidingView>

        <SelectionModal
          visible={picker === "client"}
          title="Seleccionar cliente"
          subtitle="Busca por nombre, documento, teléfono o correo"
          searchPlaceholder="Buscar cliente por nombre, CI, teléfono o correo"
          search={clientSearch}
          onSearch={setClientSearch}
          emptyText="No hay clientes registrados."
          data={filteredClients}
          keyExtractor={(item) => String(item.id)}
          renderItem={(item) => (
            <SelectionItem
              title={getClientName(item)}
              subtitle={`${item.enListaNegra ? "Lista negra · " : ""}Doc: ${item.numeroDocumento || "Sin documento"} · ${item.telefono || "Sin telefono"}`}
              icon="account-outline"
              onPress={() => selectClient(item)}
            />
          )}
          onClose={() => setPicker(null)}
        />

        <SelectionModal
          visible={picker === "equipment"}
          title="Seleccionar equipo"
          subtitle="Busca por tipo, marca, modelo o número de serie"
          searchPlaceholder="Buscar equipo por tipo, marca, modelo o serie"
          search={equipmentSearch}
          onSearch={setEquipmentSearch}
          emptyText={selectedClient ? "Este cliente no tiene equipos registrados." : "Seleccione un cliente primero."}
          data={filteredEquipments}
          keyExtractor={(item) => String(item.id)}
          renderItem={(item) => (
            <SelectionItem
              title={getEquipmentLabel(item)}
              subtitle={`Serie: ${formatSerial(item.serial || item.nroSerie)} · Cliente: ${item.clientName || "Sin cliente"}`}
              icon="monitor"
              selected={selectedEquipments.some((equipment) => String(equipment.id) === String(item.id))}
              onPress={() => selectEquipment(item)}
            />
          )}
          footerText={
            allowMultipleEquipments && !lockEquipment
              ? `${selectedEquipments.length} equipo${selectedEquipments.length === 1 ? "" : "s"} seleccionado${selectedEquipments.length === 1 ? "" : "s"}`
              : ""
          }
          onClose={closeEquipmentPicker}
        />
      </View>
    </Modal>
  );
}

function PickerField({ label, value, placeholder, icon, error, disabled, onPress }) {
  return (
    <View style={styles.fieldBlock}>
      <Text style={styles.label}>{label}</Text>
      <Pressable
        onPress={disabled ? undefined : onPress}
        style={[styles.inputShell, !!error && styles.inputShellError, disabled && styles.disabledShell]}
      >
        <Feather name={icon} size={18} color={error ? "#D14343" : "#8A8A8A"} />
        <Text style={[styles.inputText, !value && styles.placeholder]}>{value || placeholder}</Text>
        {!disabled ? <Ionicons name="search" size={18} color="#8A8A8A" /> : null}
      </Pressable>
      {!!error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

function TextArea({ label, value, placeholder, error, onChangeText }) {
  return (
    <View style={styles.fieldBlock}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.textAreaShell, !!error && styles.inputShellError]}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#8A8A8A"
          style={styles.textArea}
          multiline
          textAlignVertical="top"
        />
      </View>
      {!!error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

function OptionGroup({ label, options, value, error, onChange }) {
  return (
    <View style={styles.fieldBlock}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.optionsRow}>
        {options.map((option) => {
          const active = option === value;
          return (
            <Pressable
              key={option}
              style={[styles.optionButton, active && styles.optionButtonActive]}
              onPress={() => onChange(option)}
            >
              <Text style={[styles.optionText, active && styles.optionTextActive]}>{option}</Text>
            </Pressable>
          );
        })}
      </View>
      {!!error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

function SelectionModal({
  visible,
  title,
  subtitle,
  searchPlaceholder,
  search,
  onSearch,
  emptyText,
  data,
  keyExtractor,
  renderItem,
  footerText,
  onClose,
}) {
  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.selectionOverlay}>
        <View style={styles.selectionCard}>
          <View style={styles.selectionHeader}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <Text style={styles.selectionTitle}>{title}</Text>
              {!!subtitle && (
                <Text style={styles.selectionSubtitle}>{subtitle}</Text>
              )}
            </View>
            <Pressable onPress={onClose}>
              <Ionicons name="close" size={22} color="#111827" />
            </Pressable>
          </View>
          <SearchInput
            value={search}
            onChangeText={onSearch}
            placeholder={searchPlaceholder || "Buscar"}
            style={styles.modalSearch}
          />
          <FlatList
            data={data}
            keyExtractor={keyExtractor}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.selectionList}
            renderItem={({ item }) => renderItem(item)}
            ListEmptyComponent={<Text style={styles.emptyText}>{emptyText}</Text>}
          />
          {!!footerText && (
            <Pressable style={styles.selectionDoneButton} onPress={onClose}>
              <Text style={styles.selectionDoneText}>{footerText} - Listo</Text>
            </Pressable>
          )}
        </View>
      </View>
    </Modal>
  );
}

function SelectionItem({ title, subtitle, icon, selected = false, onPress }) {
  return (
    <Pressable style={styles.selectionItem} onPress={onPress}>
      <View style={styles.selectionIcon}>
        <MaterialCommunityIcons name={icon} size={19} color="#5655B9" />
      </View>
      <View style={styles.selectionInfo}>
        <Text style={styles.selectionItemTitle}>{title}</Text>
        <Text style={styles.selectionItemSubtitle}>{subtitle}</Text>
      </View>
      {selected ? <Ionicons name="checkmark-circle" size={22} color="#5655B9" /> : null}
    </Pressable>
  );
}

function getClientName(client) {
  return client?.nombre || client?.razonSocial || [client?.nombres, client?.apellidos].filter(Boolean).join(" ");
}

function getEquipmentLabel(equipment) {
  if (!equipment) return "";
  return [equipment.type || equipment.tipo, equipment.brand || equipment.marca, equipment.model || equipment.modelo]
    .filter(Boolean)
    .join(" ");
}

function getSelectedEquipmentsLabel(selectedEquipments, fallbackEquipment) {
  if (selectedEquipments.length > 1) {
    return `${selectedEquipments.length} equipos seleccionados`;
  }

  return getEquipmentLabel(selectedEquipments[0] || fallbackEquipment);
}

function formatSerial(serial) {
  if (!serial || String(serial).startsWith("SIN-SERIE-")) return "Sin serie";
  return serial;
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.38)",
    justifyContent: "flex-end",
  },
  keyboard: {
    flex: 1,
    justifyContent: "flex-end",
  },
  card: {
    maxHeight: "90%",
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 18,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  title: {
    color: "#111827",
    fontSize: 20,
    fontWeight: "900",
  },
  subtitle: {
    marginTop: 3,
    color: "#6B7280",
    fontSize: 12,
  },
  closeButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  fieldBlock: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
    color: "#4B4B4B",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  inputShell: {
    minHeight: 56,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    columnGap: 10,
  },
  disabledShell: {
    backgroundColor: "#F9FAFB",
  },
  inputShellError: {
    borderColor: "#D14343",
    backgroundColor: "#FFF7F7",
  },
  inputText: {
    flex: 1,
    color: "#111827",
    fontSize: 14,
    fontWeight: "700",
  },
  placeholder: {
    color: "#8A8A8A",
    fontWeight: "500",
  },
  textAreaShell: {
    minHeight: 104,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  textArea: {
    minHeight: 84,
    color: "#111827",
    fontSize: 14,
  },
  optionsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  optionButton: {
    borderRadius: 999,
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 13,
    paddingVertical: 9,
  },
  optionButtonActive: {
    backgroundColor: "#5655B9",
  },
  optionText: {
    color: "#374151",
    fontSize: 12,
    fontWeight: "800",
  },
  optionTextActive: {
    color: "#FFFFFF",
  },
  errorText: {
    marginTop: 6,
    color: "#D14343",
    fontSize: 12,
  },
  submitButton: {
    minHeight: 54,
    borderRadius: 17,
    backgroundColor: "#5655B9",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "900",
  },
  disabledButton: {
    opacity: 0.7,
  },
  selectionOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    alignItems: "center",
    justifyContent: "center",
    padding: 18,
  },
  selectionCard: {
    width: "100%",
    maxHeight: "78%",
    borderRadius: 22,
    backgroundColor: "#FFFFFF",
    padding: 16,
  },
  selectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  selectionTitle: {
    color: "#111827",
    fontSize: 18,
    fontWeight: "900",
  },
  selectionSubtitle: {
    marginTop: 3,
    color: "#6B7280",
    fontSize: 12,
  },
  modalSearch: {
    marginTop: 14,
  },
  selectionList: {
    paddingTop: 10,
  },
  selectionItem: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 10,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  selectionIcon: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: "#EDEBFF",
    alignItems: "center",
    justifyContent: "center",
  },
  selectionInfo: {
    flex: 1,
  },
  selectionItemTitle: {
    color: "#111827",
    fontSize: 14,
    fontWeight: "900",
  },
  selectionItemSubtitle: {
    marginTop: 2,
    color: "#6B7280",
    fontSize: 12,
  },
  emptyText: {
    textAlign: "center",
    color: "#6B7280",
    fontSize: 13,
    paddingVertical: 22,
  },
  selectionDoneButton: {
    minHeight: 48,
    borderRadius: 15,
    backgroundColor: "#5655B9",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  selectionDoneText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "900",
  },
});
