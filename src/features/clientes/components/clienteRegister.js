import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ScrollView } from "react-native";
import { Feather } from "@expo/vector-icons";

import { colors } from "../../../shared/theme/colors";
import { textPresets } from "../../../shared/theme/typography";
import tw from "../../../shared/styles/tw";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
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
    marginVertical: 12,
    borderRadius: 18,
    padding: 16,
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
  input: {
    flex: 1,
    fontSize: 15,
    color: colors.black,
  },
  saveBtn: {
    marginHorizontal: 14,
    marginVertical: 10,
    backgroundColor: "#534AB7",
    borderRadius: 18,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  saveBtnText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: "800",
  },
});

export default function RegistrarCliente({ onVolver, onGuardar }) {
  const [form, setForm] = useState({
    nombre: "",
    telefono: "",
    correo: "",
    direccion: "",
  });

  const handleChange = (campo, value) => {
    setForm({ ...form, [campo]: value });
  };

  const handleGuardar = () => {
    if (!form.nombre || !form.telefono || !form.correo) {
      Alert.alert("Error", "Por favor completa nombre, teléfono y correo.");
      return;
    }
    if (onGuardar) onGuardar(form);
  };

  return (
    <ScrollView style={styles.container}>
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
        <View>
          <Text style={styles.fieldLabel}>Nombre completo</Text>
          <View style={styles.inputRow}>
            <Feather name="user" size={18} color="#8C8C8C" />
            <TextInput
              style={styles.input}
              placeholder="Ingresa el nombre completo"
              placeholderTextColor="#8C8C8C"
              value={form.nombre}
              onChangeText={(value) => handleChange("nombre", value)}
            />
          </View>
        </View>

        <View style={{ marginTop: 16 }}>
          <Text style={styles.fieldLabel}>Teléfono</Text>
          <View style={styles.inputRow}>
            <Feather name="phone" size={18} color="#8C8C8C" />
            <TextInput
              style={styles.input}
              placeholder="Ingresa el teléfono"
              placeholderTextColor="#8C8C8C"
              keyboardType="phone-pad"
              value={form.telefono}
              onChangeText={(value) => handleChange("telefono", value)}
            />
          </View>
        </View>

        <View style={{ marginTop: 16 }}>
          <Text style={styles.fieldLabel}>Correo electrónico</Text>
          <View style={styles.inputRow}>
            <Feather name="mail" size={18} color="#8C8C8C" />
            <TextInput
              style={styles.input}
              placeholder="Ingresa el correo electrónico"
              placeholderTextColor="#8C8C8C"
              keyboardType="email-address"
              autoCapitalize="none"
              value={form.correo}
              onChangeText={(value) => handleChange("correo", value)}
            />
          </View>
        </View>

        <View style={{ marginTop: 16 }}>
          <Text style={styles.fieldLabel}>
            Dirección <Text style={styles.optionalTag}>(opcional)</Text>
          </Text>
          <View style={styles.inputRow}>
            <Feather name="map-pin" size={18} color="#8C8C8C" />
            <TextInput
              style={styles.input}
              placeholder="Ingresa la dirección"
              placeholderTextColor="#8C8C8C"
              value={form.direccion}
              onChangeText={(value) => handleChange("direccion", value)}
            />
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.saveBtn} onPress={handleGuardar}>
        <Text style={styles.saveBtnText}>Guardar cliente</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}