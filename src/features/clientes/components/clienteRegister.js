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
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 14,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  backBtn: {
    width: 36,
    height: 36,
    backgroundColor: colors.surface,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: "#ddd",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.black,
  },
  headerSubtitle: {
    fontSize: 12,
    color: "#888",
    marginTop: 2,
    lineHeight: 16,
  },
  formCard: {
    backgroundColor: colors.surface,
    marginHorizontal: 12,
    marginVertical: 10,
    borderRadius: 16,
    padding: 16,
  },
  fieldLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: "#888",
    letterSpacing: 0.5,
    marginBottom: 6,
    textTransform: "uppercase",
  },
  optionalTag: {
    fontWeight: "400",
    color: "#bbb",
    fontSize: 10,
    textTransform: "none",
    letterSpacing: 0,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    backgroundColor: "#f7f7f7",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 11,
    borderWidth: 0.5,
    borderColor: "#e5e5e5",
  },
  input: {
    flex: 1,
    fontSize: 13,
    color: colors.black,
  },
  saveBtn: {
    marginHorizontal: 12,
    marginVertical: 8,
    backgroundColor: "#534AB7",
    borderRadius: 14,
    padding: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  saveBtnText: {
    color: colors.surface,
    fontSize: 15,
    fontWeight: "500",
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
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onVolver}>
          <Feather name="arrow-left" size={14} color="#555" />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Registrar cliente</Text>
          <Text style={styles.headerSubtitle}>
            Completa el formulario para registrar{"\n"}un nuevo cliente
          </Text>
        </View>
      </View>

      {/* Formulario */}
      <View style={styles.formCard}>
        {/* Nombre */}
        <View>
          <Text style={styles.fieldLabel}>Nombre completo</Text>
          <View style={styles.inputRow}>
            <Feather name="user" size={15} color="#aaa" />
            <TextInput
              style={styles.input}
              placeholder="Ingresa el nombre completo"
              placeholderTextColor="#B8B8B8"
              value={form.nombre}
              onChangeText={(value) => handleChange("nombre", value)}
            />
          </View>
        </View>

        {/* Teléfono */}
        <View style={{ marginTop: 14 }}>
          <Text style={styles.fieldLabel}>Teléfono</Text>
          <View style={styles.inputRow}>
            <Feather name="phone" size={15} color="#aaa" />
            <TextInput
              style={styles.input}
              placeholder="Ingresa el teléfono"
              placeholderTextColor="#B8B8B8"
              keyboardType="phone-pad"
              value={form.telefono}
              onChangeText={(value) => handleChange("telefono", value)}
            />
          </View>
        </View>

        {/* Correo */}
        <View style={{ marginTop: 14 }}>
          <Text style={styles.fieldLabel}>Correo electrónico</Text>
          <View style={styles.inputRow}>
            <Feather name="mail" size={15} color="#aaa" />
            <TextInput
              style={styles.input}
              placeholder="Ingresa el correo electrónico"
              placeholderTextColor="#B8B8B8"
              keyboardType="email-address"
              autoCapitalize="none"
              value={form.correo}
              onChangeText={(value) => handleChange("correo", value)}
            />
          </View>
        </View>

        {/* Dirección */}
        <View style={{ marginTop: 14 }}>
          <Text style={styles.fieldLabel}>
            Dirección <Text style={styles.optionalTag}>(opcional)</Text>
          </Text>
          <View style={styles.inputRow}>
            <Feather name="map-pin" size={15} color="#aaa" />
            <TextInput
              style={styles.input}
              placeholder="Ingresa la dirección"
              placeholderTextColor="#B8B8B8"
              value={form.direccion}
              onChangeText={(value) => handleChange("direccion", value)}
            />
          </View>
        </View>
      </View>

      {/* Botón guardar */}
      <TouchableOpacity style={styles.saveBtn} onPress={handleGuardar}>
        <Text style={styles.saveBtnText}>Guardar cliente</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}