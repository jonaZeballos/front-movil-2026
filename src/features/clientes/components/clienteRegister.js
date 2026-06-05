import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { Feather } from "@expo/vector-icons";

import { colors } from "../../../shared/theme/colors";
import {
  BOLIVIAN_CI_MESSAGE,
  BOLIVIAN_MOBILE_MESSAGE,
  EMAIL_FORMAT_MESSAGE,
  isInternalEmail,
  isValidBolivianCI,
  isValidBolivianMobile,
  isValidEmail,
  normalizeBolivianPhone,
  normalizeDigits,
} from "../../../shared/utils/validators";

export default function RegistrarCliente({ onVolver, onGuardar, isSaving = false }) {
  const [form, setForm] = useState({
    nombres: "",
    apellidos: "",
    numeroDocumento: "",
    telefono: "",
    correo: "",
    direccion: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (campo, value) => {
    setForm((prev) => ({ ...prev, [campo]: value }));
    setErrors((prev) => {
      if (!prev[campo]) return prev;
      const next = { ...prev };
      delete next[campo];
      return next;
    });
  };

  const validate = () => {
    const nextErrors = {};
    const nombres = form.nombres.trim();
    const apellidos = form.apellidos.trim();
    const documentoRaw = form.numeroDocumento.trim();
    const documento = normalizeDigits(documentoRaw);
    const telefonoRaw = form.telefono.trim();
    const telefono = normalizeBolivianPhone(telefonoRaw);
    const correo = form.correo.trim();
    const direccion = form.direccion.trim();

    if (nombres.length < 2) {
      nextErrors.nombres = "Ingrese nombres validos.";
    }

    if (apellidos.length < 2) {
      nextErrors.apellidos = "Ingrese apellidos validos.";
    }

    if (!documentoRaw) {
      nextErrors.numeroDocumento = BOLIVIAN_CI_MESSAGE;
    } else if (documentoRaw !== documento) {
      nextErrors.numeroDocumento = BOLIVIAN_CI_MESSAGE;
    } else if (!isValidBolivianCI(documento)) {
      nextErrors.numeroDocumento = BOLIVIAN_CI_MESSAGE;
    }

    if (!telefonoRaw || !isValidBolivianMobile(telefono)) {
      nextErrors.telefono = BOLIVIAN_MOBILE_MESSAGE;
    }

    if (!correo || !isValidEmail(correo) || isInternalEmail(correo)) {
      nextErrors.correo = EMAIL_FORMAT_MESSAGE;
    }

    if (direccion && direccion.length < 5) {
      nextErrors.direccion = "La direccion debe tener al menos 5 caracteres.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleGuardar = () => {
    if (isSaving) return;
    if (!validate()) return;

    const documento = normalizeDigits(form.numeroDocumento);
    const telefono = normalizeBolivianPhone(form.telefono);
    const nombres = form.nombres.trim();
    const apellidos = form.apellidos.trim();
    const nombre = [nombres, apellidos].join(" ");

    onGuardar?.({
      ...form,
      nombres,
      apellidos,
      nombre,
      razonSocial: nombre,
      numeroDocumento: documento,
      telefono,
      correo: form.correo.trim().toLowerCase(),
      direccion: form.direccion.trim(),
    });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={onVolver}>
            <Feather name="arrow-left" size={20} color="#111827" />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerTitle}>Registrar cliente</Text>
            <Text style={styles.headerSubtitle}>
              Completa el formulario para registrar{"\n"}un nuevo cliente
            </Text>
          </View>
        </View>

        <View style={styles.formCard}>
          <Field
            label="Nombres"
            icon="user"
            placeholder="Ingrese nombres"
            value={form.nombres}
            error={errors.nombres}
            onChangeText={(value) => handleChange("nombres", value)}
          />

          <Field
            label="Apellidos"
            icon="user"
            placeholder="Ingrese apellidos"
            value={form.apellidos}
            error={errors.apellidos}
            onChangeText={(value) => handleChange("apellidos", value)}
          />

          <Field
            label="CI"
            icon="credit-card"
            placeholder="Ingrese CI de 5 a 8 digitos"
            keyboardType="number-pad"
            value={form.numeroDocumento}
            error={errors.numeroDocumento}
            onChangeText={(value) => handleChange("numeroDocumento", normalizeDigits(value).slice(0, 8))}
          />

          <Field
            label="Telefono"
            icon="phone"
            placeholder="Ingresa tu numero de telefono"
            keyboardType="phone-pad"
            value={form.telefono}
            error={errors.telefono}
            onChangeText={(value) => handleChange("telefono", normalizeBolivianPhone(value).slice(0, 8))}
          />

          <Field
            label="Correo electronico"
            icon="mail"
            placeholder="cliente@correo.com"
            keyboardType="email-address"
            autoCapitalize="none"
            value={form.correo}
            error={errors.correo}
            onChangeText={(value) => handleChange("correo", value)}
          />

          <Field
            label="Direccion"
            optional
            icon="map-pin"
            placeholder="Ingrese la direccion"
            value={form.direccion}
            error={errors.direccion}
            onChangeText={(value) => handleChange("direccion", value)}
          />
        </View>

        <TouchableOpacity
          style={[styles.saveBtn, isSaving && styles.disabledButton]}
          onPress={handleGuardar}
          disabled={isSaving}
        >
          {isSaving ? (
            <View style={styles.loadingRow}>
              <ActivityIndicator color={colors.surface} />
              <Text style={styles.saveBtnText}>Guardando cliente...</Text>
            </View>
          ) : (
            <Text style={styles.saveBtnText}>Guardar cliente</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function Field({
  label,
  optional = false,
  icon,
  placeholder,
  value,
  error,
  onChangeText,
  keyboardType = "default",
  autoCapitalize = "sentences",
}) {
  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.fieldLabel}>
        {label} {optional ? <Text style={styles.optionalTag}>(opcional)</Text> : null}
      </Text>
      <View style={[styles.inputRow, !!error && styles.inputRowError]}>
        <Feather name={icon} size={18} color={error ? "#D14343" : "#8C8C8C"} />
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#8C8C8C"
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          value={value}
          onChangeText={onChangeText}
        />
      </View>
      {!!error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  scrollContent: {
    paddingBottom: 140,
  },
  header: {
    backgroundColor: colors.surface,
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 18,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  backBtn: {
    width: 42,
    height: 42,
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: 0.5,
    borderColor: "#ddd",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: "#111827",
  },
  headerSubtitle: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 3,
    lineHeight: 18,
  },
  formCard: {
    backgroundColor: colors.surface,
    marginHorizontal: 14,
    marginTop: 12,
    marginBottom: 14,
    borderRadius: 18,
    padding: 16,
  },
  fieldGroup: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#4B4B4B",
    letterSpacing: 1.1,
    marginBottom: 8,
    textTransform: "uppercase",
  },
  optionalTag: {
    fontWeight: "600",
    color: "#9CA3AF",
    fontSize: 12,
    textTransform: "none",
    letterSpacing: 0,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#f7f7f7",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 13,
    borderWidth: 0.5,
    borderColor: "#e5e5e5",
  },
  inputRowError: {
    borderColor: "#D14343",
    backgroundColor: "#FFF7F7",
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: colors.black,
  },
  errorText: {
    marginTop: 6,
    color: "#D14343",
    fontSize: 12,
    lineHeight: 16,
  },
  saveBtn: {
    marginHorizontal: 14,
    marginTop: 0,
    marginBottom: 18,
    minHeight: 56,
    backgroundColor: "#534AB7",
    borderRadius: 18,
    paddingHorizontal: 20,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  saveBtnText: {
    color: colors.surface,
    fontSize: 16,
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
});
