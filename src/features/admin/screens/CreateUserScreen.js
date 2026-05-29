import { useRef, useState } from "react";
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { ScreenContainer } from "../../../shared/components/ScreenContainer";
import { colors } from "../../../shared/theme/colors";

export function CreateUserScreen({ onBack, onSave }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "tecnico",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const submitLockRef = useRef(false);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (submitLockRef.current || isSaving) return;

    if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
      Alert.alert("Error", "Completa nombre, correo y contrasena.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(form.email.trim())) {
      Alert.alert("Correo invalido", "Ingresa un correo electronico valido.");
      return;
    }

    if (form.password.trim().length < 6) {
      Alert.alert("Contrasena invalida", "La contrasena debe tener al menos 6 caracteres.");
      return;
    }

    submitLockRef.current = true;
    setIsSaving(true);

    try {
      await onSave?.({
        ...form,
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password.trim(),
      });
    } catch (error) {
      Alert.alert("No se pudo guardar", error.message || "Intenta nuevamente.");
    } finally {
      submitLockRef.current = false;
      setIsSaving(false);
    }
  };

  return (
    <ScreenContainer backgroundColor={colors.dashboardBg} edges={["top"]}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable onPress={onBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={22} color="#111827" />
          </Pressable>

          <View style={styles.headerText}>
            <Text style={styles.title}>Crear usuario</Text>
            <Text style={styles.subtitle}>Asigna acceso a tecnico o ventas</Text>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <View style={styles.formCard}>
            <Field
              label="Nombre completo"
              icon="person-outline"
              placeholder="Ingrese nombre completo"
              value={form.name}
              onChangeText={(value) => handleChange("name", value)}
            />

            <Field
              label="Correo"
              icon="mail-outline"
              placeholder="usuario@servitech.com"
              value={form.email}
              keyboardType="email-address"
              autoCapitalize="none"
              onChangeText={(value) => handleChange("email", value)}
            />

            <Field
              label="Contrasena"
              icon="lock-closed-outline"
              placeholder="Contrasena inicial"
              value={form.password}
              secureTextEntry={!showPassword}
              rightIcon={showPassword ? "eye-outline" : "eye-off-outline"}
              onPressRightIcon={() => setShowPassword((value) => !value)}
              onChangeText={(value) => handleChange("password", value)}
            />

            <Text style={styles.fieldLabel}>Rol del usuario</Text>

            <View style={styles.rolesRow}>
              <RoleButton
                label="Tecnico"
                active={form.role === "tecnico"}
                onPress={() => handleChange("role", "tecnico")}
              />
              <RoleButton
                label="Ventas"
                active={form.role === "ventas"}
                onPress={() => handleChange("role", "ventas")}
              />
            </View>
          </View>

          <Pressable
            style={[styles.saveButton, isSaving && styles.disabledButton]}
            onPress={handleSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.saveButtonText}>Guardar usuario</Text>
            )}
          </Pressable>
        </ScrollView>
      </View>
    </ScreenContainer>
  );
}

function Field({
  label,
  icon,
  placeholder,
  value,
  onChangeText,
  keyboardType = "default",
  autoCapitalize = "sentences",
  secureTextEntry = false,
  rightIcon,
  onPressRightIcon,
}) {
  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.fieldLabel}>{label}</Text>

      <View style={styles.inputShell}>
        <Ionicons name={icon} size={18} color="#8C8C8C" />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#8C8C8C"
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          secureTextEntry={secureTextEntry}
          style={styles.input}
        />
        {rightIcon ? (
          <Pressable onPress={onPressRightIcon} hitSlop={10}>
            <Ionicons name={rightIcon} size={18} color="#8C8C8C" />
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

function RoleButton({ label, active, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.roleButton, active && styles.roleButtonActive]}
    >
      <Text style={[styles.roleButtonText, active && styles.roleButtonTextActive]}>
        {label}
      </Text>
    </Pressable>
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
    paddingBottom: 120,
  },
  formCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 16,
    marginBottom: 16,
  },
  fieldGroup: {
    marginBottom: 16,
  },
  fieldLabel: {
    marginBottom: 8,
    fontSize: 12,
    fontWeight: "700",
    color: "#4B4B4B",
    letterSpacing: 1.1,
    textTransform: "uppercase",
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
  input: {
    flex: 1,
    color: "#111111",
    fontSize: 15,
    paddingVertical: 0,
  },
  rolesRow: {
    flexDirection: "row",
    columnGap: 10,
  },
  roleButton: {
    flex: 1,
    height: 48,
    borderRadius: 16,
    backgroundColor: "#F5F5F7",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#EBEBEB",
  },
  roleButtonActive: {
    backgroundColor: "#5655B9",
    borderColor: "#5655B9",
  },
  roleButtonText: {
    fontSize: 15,
    fontWeight: "800",
    color: "#6B7280",
  },
  roleButtonTextActive: {
    color: "#FFFFFF",
  },
  saveButton: {
    height: 54,
    borderRadius: 18,
    backgroundColor: "#5655B9",
    alignItems: "center",
    justifyContent: "center",
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },
  disabledButton: {
    opacity: 0.7,
  },
});
