import { useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { ScreenContainer } from "../../../shared/components/ScreenContainer";
import { colors } from "../../../shared/theme/colors";

const USERNAME_REGEX = /^[a-zA-Z0-9._-]+$/;
const EMAIL_REGEX = /\S+@\S+\.\S+/;

export function CreateUserScreen({ onBack, onSave }) {
  const [form, setForm] = useState({
    nombres: "",
    apellidos: "",
    username: "",
    email: "",
    password: "",
    role: "tecnico",
  });
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const submitLockRef = useRef(false);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const validate = () => {
    const nextErrors = {};
    const nombres = form.nombres.trim();
    const apellidos = form.apellidos.trim();
    const username = form.username.trim();
    const email = form.email.trim();
    const password = form.password.trim();

    if (nombres.length < 2) {
      nextErrors.nombres = "Ingrese al menos 2 caracteres.";
    }

    if (apellidos.length < 2) {
      nextErrors.apellidos = "Ingrese al menos 2 caracteres.";
    }

    if (!username) {
      nextErrors.username = "Ingrese un nombre de usuario.";
    } else if (!USERNAME_REGEX.test(username)) {
      nextErrors.username = "Use solo letras, numeros, punto, guion o guion bajo.";
    }

    if (!email) {
      nextErrors.email = "Ingrese un correo electronico.";
    } else if (!EMAIL_REGEX.test(email)) {
      nextErrors.email = "Ingrese un correo valido, ejemplo: usuario@correo.com.";
    }

    if (!password) {
      nextErrors.password = "Ingrese una contrasena.";
    } else if (password.length < 6) {
      nextErrors.password = "La contrasena debe tener al menos 6 caracteres.";
    }

    if (!["tecnico", "ventas"].includes(form.role)) {
      nextErrors.role = "Seleccione el rol del usuario.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSave = async () => {
    if (submitLockRef.current || isSaving) return;
    if (!validate()) return;

    const nombres = form.nombres.trim();
    const apellidos = form.apellidos.trim();
    const username = form.username.trim();
    const email = form.email.trim().toLowerCase();
    const password = form.password.trim();
    const name = [nombres, apellidos].filter(Boolean).join(" ").trim();

    submitLockRef.current = true;
    setIsSaving(true);

    try {
      await onSave?.({
        nombres,
        apellidos,
        username,
        name,
        email,
        password,
        role: form.role,
      });
    } catch (error) {
      Alert.alert("No se pudo crear el usuario", error.message || "Intenta nuevamente.");
    } finally {
      submitLockRef.current = false;
      setIsSaving(false);
    }
  };

  return (
    <ScreenContainer backgroundColor={colors.dashboardBg} edges={["top"]}>
      <KeyboardAvoidingView
        style={styles.keyboard}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
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

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.formCard}>
              <Field
                label="Nombres"
                icon="person-outline"
                placeholder="Ingrese nombres"
                value={form.nombres}
                error={errors.nombres}
                onChangeText={(value) => handleChange("nombres", value)}
              />

              <Field
                label="Apellidos"
                icon="person-outline"
                placeholder="Ingrese apellidos"
                value={form.apellidos}
                error={errors.apellidos}
                onChangeText={(value) => handleChange("apellidos", value)}
              />

              <Field
                label="Username"
                icon="at-outline"
                placeholder="usuario.tecnico"
                value={form.username}
                error={errors.username}
                autoCapitalize="none"
                onChangeText={(value) => handleChange("username", value)}
              />

              <Field
                label="Correo"
                icon="mail-outline"
                placeholder="usuario@servitech.com"
                value={form.email}
                error={errors.email}
                keyboardType="email-address"
                autoCapitalize="none"
                onChangeText={(value) => handleChange("email", value)}
              />

              <Field
                label="Contrasena"
                icon="lock-closed-outline"
                placeholder="Contrasena inicial"
                value={form.password}
                error={errors.password}
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

              {!!errors.role && <Text style={styles.errorText}>{errors.role}</Text>}
            </View>

            <Pressable
              style={[styles.saveButton, isSaving && styles.disabledButton]}
              onPress={handleSave}
              disabled={isSaving}
            >
              {isSaving ? (
                <View style={styles.loadingRow}>
                  <ActivityIndicator color="#FFFFFF" />
                  <Text style={styles.saveButtonText}>Creando usuario...</Text>
                </View>
              ) : (
                <Text style={styles.saveButtonText}>Guardar usuario</Text>
              )}
            </Pressable>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

function Field({
  label,
  icon,
  placeholder,
  value,
  error,
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

      <View style={[styles.inputShell, !!error && styles.inputShellError]}>
        <Ionicons name={icon} size={18} color={error ? "#D14343" : "#8C8C8C"} />
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

      {!!error && <Text style={styles.errorText}>{error}</Text>}
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
  keyboard: {
    flex: 1,
  },
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
    paddingBottom: 40,
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
  inputShellError: {
    borderColor: "#D14343",
    backgroundColor: "#FFF7F7",
  },
  input: {
    flex: 1,
    color: "#111111",
    fontSize: 15,
    paddingVertical: 0,
  },
  errorText: {
    marginTop: 6,
    color: "#D14343",
    fontSize: 12,
    lineHeight: 16,
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
  loadingRow: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 10,
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
