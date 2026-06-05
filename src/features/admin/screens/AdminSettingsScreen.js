import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";

import { ScreenContainer } from "../../../shared/components/ScreenContainer";
import { colors } from "../../../shared/theme/colors";
import {
  getAdminSettings,
  updateAdminPassword,
  updateAdminProfile,
  updateBusinessSettings,
} from "../services/settingsApi";

const MAX_QR_DATA_URI_LENGTH = 450000;

export function AdminSettingsScreen({ onBack, onSessionUserUpdate }) {
  const [business, setBusiness] = useState(emptyBusiness);
  const [admin, setAdmin] = useState(emptyAdmin);
  const [passwordForm, setPasswordForm] = useState(emptyPasswordForm);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  useEffect(() => {
    let isMounted = true;

    getAdminSettings()
      .then((data) => {
        if (!isMounted) return;
        setBusiness(data.business);
        setAdmin(data.admin);
      })
      .catch((error) => {
        Alert.alert("No se pudo cargar", error.message || "Intenta nuevamente.");
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSave = async () => {
    if (isSaving) return;

    try {
      setIsSaving(true);
      const [savedBusiness, savedAdmin] = await Promise.all([
        updateBusinessSettings(business),
        updateAdminProfile(admin),
      ]);

      setBusiness(savedBusiness);
      setAdmin(savedAdmin);
      onSessionUserUpdate?.({
        nombres: savedAdmin.nombres,
        apellidos: savedAdmin.apellidos,
        email: savedAdmin.email,
        telefono: savedAdmin.telefono,
        negocio: {
          id: savedBusiness.id,
          nombre: savedBusiness.nombre,
          emailContacto: savedBusiness.emailContacto,
          telefono: savedBusiness.telefono,
          direccion: savedBusiness.direccion,
          qrPagoUrl: savedBusiness.qrPagoUrl,
        },
      });
      Alert.alert("Configuracion guardada", "Los datos fueron actualizados.");
    } catch (error) {
      Alert.alert("No se pudo guardar", error.message || "Intenta nuevamente.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (isSavingPassword) return;

    if (!passwordForm.currentPassword || !passwordForm.newPassword) {
      return Alert.alert("Datos incompletos", "Ingresa la contrasena actual y la nueva.");
    }

    if (passwordForm.newPassword.length < 6) {
      return Alert.alert("Contrasena invalida", "La nueva contrasena debe tener al menos 6 caracteres.");
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      return Alert.alert("No coincide", "La confirmacion debe ser igual a la nueva contrasena.");
    }

    try {
      setIsSavingPassword(true);
      await updateAdminPassword(passwordForm);
      setPasswordForm(emptyPasswordForm);
      Alert.alert("Contrasena actualizada", "Ya puedes usar la nueva contrasena en el proximo inicio.");
    } catch (error) {
      Alert.alert("No se pudo cambiar", error.message || "Intenta nuevamente.");
    } finally {
      setIsSavingPassword(false);
    }
  };

  const handlePickQr = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permiso requerido", "Permite acceder a tus fotos para seleccionar el QR.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.6,
      base64: false,
    });

    if (result.canceled) return;

    const asset = result.assets?.[0];
    if (!asset?.uri) {
      Alert.alert("No se pudo cargar", "Selecciona una imagen valida del QR.");
      return;
    }

    const optimized = await ImageManipulator.manipulateAsync(
      asset.uri,
      [{ resize: { width: 700, height: 700 } }],
      {
        compress: 0.65,
        format: ImageManipulator.SaveFormat.JPEG,
        base64: true,
      }
    );

    if (!optimized.base64) {
      Alert.alert("No se pudo cargar", "No se pudo procesar la imagen del QR.");
      return;
    }

    const dataUri = `data:image/jpeg;base64,${optimized.base64}`;
    if (dataUri.length > MAX_QR_DATA_URI_LENGTH) {
      Alert.alert("QR demasiado grande", "Selecciona una imagen mas pequena o recorta mejor el QR.");
      return;
    }

    setBusiness((prev) => ({
      ...prev,
      qrPagoUrl: dataUri,
    }));
  };

  return (
    <ScreenContainer>
      <KeyboardAvoidingView
        style={styles.root}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={onBack}>
            <Ionicons name="arrow-back" size={22} color="#111827" />
          </Pressable>
          <View style={styles.headerText}>
            <Text style={styles.title}>Configuracion</Text>
            <Text style={styles.subtitle}>Perfil del negocio y administrador</Text>
          </View>
        </View>

        {isLoading ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator color={colors.primary} />
          </View>
        ) : (
          <>
            <ScrollView
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.content}
            >
              <SectionTitle icon="briefcase" title="Perfil del negocio" />
              <Field
                label="Nombre del negocio"
                value={business.nombre}
                onChangeText={(nombre) => setBusiness((prev) => ({ ...prev, nombre }))}
              />
              <Field
                label="Correo de contacto"
                value={business.emailContacto}
                keyboardType="email-address"
                autoCapitalize="none"
                onChangeText={(emailContacto) =>
                  setBusiness((prev) => ({ ...prev, emailContacto }))
                }
              />
              <Field
                label="Telefono del negocio"
                value={business.telefono}
                keyboardType="phone-pad"
                onChangeText={(telefono) => setBusiness((prev) => ({ ...prev, telefono }))}
              />
              <Field
                label="Direccion"
                value={business.direccion}
                onChangeText={(direccion) => setBusiness((prev) => ({ ...prev, direccion }))}
              />
              <SectionTitle icon="credit-card" title="QR de pago" />
              <View style={styles.qrCard}>
                <Text style={styles.qrDescription}>
                  Selecciona la imagen QR que tus clientes escanearan al pagar.
                </Text>
                {business.qrPagoUrl ? (
                  <Image source={{ uri: business.qrPagoUrl }} style={styles.qrPreview} resizeMode="contain" />
                ) : (
                  <View style={styles.qrEmpty}>
                    <Feather name="image" size={24} color="#9CA3AF" />
                    <Text style={styles.qrEmptyText}>Sin QR configurado</Text>
                  </View>
                )}
                <View style={styles.qrActions}>
                  <Pressable style={styles.qrPickButton} onPress={handlePickQr}>
                    <Feather name="upload" size={17} color="#FFFFFF" />
                    <Text style={styles.qrPickButtonText}>
                      {business.qrPagoUrl ? "Cambiar QR" : "Seleccionar QR"}
                    </Text>
                  </Pressable>
                  {business.qrPagoUrl ? (
                    <Pressable
                      style={styles.qrRemoveButton}
                      onPress={() => setBusiness((prev) => ({ ...prev, qrPagoUrl: "" }))}
                    >
                      <Text style={styles.qrRemoveButtonText}>Quitar</Text>
                    </Pressable>
                  ) : null}
                </View>
              </View>

              <SectionTitle icon="user" title="Perfil del administrador" />
              <Field
                label="Nombres"
                value={admin.nombres}
                onChangeText={(nombres) => setAdmin((prev) => ({ ...prev, nombres }))}
              />
              <Field
                label="Apellidos"
                value={admin.apellidos}
                onChangeText={(apellidos) => setAdmin((prev) => ({ ...prev, apellidos }))}
              />
              <Field
                label="Correo electronico"
                value={admin.email}
                keyboardType="email-address"
                autoCapitalize="none"
                onChangeText={(email) => setAdmin((prev) => ({ ...prev, email }))}
              />
              <Field
                label="Telefono"
                value={admin.telefono}
                keyboardType="phone-pad"
                onChangeText={(telefono) => setAdmin((prev) => ({ ...prev, telefono }))}
              />

              <SectionTitle icon="lock" title="Seguridad" />
              <View style={styles.securityCard}>
                <Field
                  label="Contrasena actual"
                  value={passwordForm.currentPassword}
                  secureTextEntry
                  autoCapitalize="none"
                  onChangeText={(currentPassword) =>
                    setPasswordForm((prev) => ({ ...prev, currentPassword }))
                  }
                />
                <Field
                  label="Nueva contrasena"
                  value={passwordForm.newPassword}
                  secureTextEntry
                  autoCapitalize="none"
                  onChangeText={(newPassword) =>
                    setPasswordForm((prev) => ({ ...prev, newPassword }))
                  }
                />
                <Field
                  label="Confirmar nueva contrasena"
                  value={passwordForm.confirmPassword}
                  secureTextEntry
                  autoCapitalize="none"
                  onChangeText={(confirmPassword) =>
                    setPasswordForm((prev) => ({ ...prev, confirmPassword }))
                  }
                />
                <Pressable
                  style={[styles.passwordButton, isSavingPassword && styles.disabledButton]}
                  onPress={handleChangePassword}
                  disabled={isSavingPassword}
                >
                  {isSavingPassword ? (
                    <ActivityIndicator color={colors.primary} />
                  ) : (
                    <Text style={styles.passwordButtonText}>Cambiar contrasena</Text>
                  )}
                </Pressable>
              </View>
            </ScrollView>
            <View style={styles.saveFooter}>
            <Pressable
              style={[styles.saveButton, isSaving && styles.disabledButton]}
              onPress={handleSave}
              disabled={isSaving}
            >
              {isSaving ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.saveButtonText}>Guardar cambios</Text>
              )}
            </Pressable>
            </View>
          </>
        )}
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

const emptyBusiness = {
  nombre: "",
  emailContacto: "",
  telefono: "",
  direccion: "",
  qrPagoUrl: "",
};

const emptyAdmin = {
  nombres: "",
  apellidos: "",
  email: "",
  telefono: "",
};

const emptyPasswordForm = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

function SectionTitle({ icon, title }) {
  return (
    <View style={styles.sectionTitleRow}>
      <View style={styles.sectionIcon}>
        <Feather name={icon} size={16} color={colors.primary} />
      </View>
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );
}

function Field({
  label,
  value,
  onChangeText,
  keyboardType,
  autoCapitalize = "sentences",
  secureTextEntry = false,
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        autoCorrect={false}
        secureTextEntry={secureTextEntry}
        placeholderTextColor="#9CA3AF"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.dashboardBg,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 12,
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
    color: "#111827",
    fontSize: 24,
    fontWeight: "900",
  },
  subtitle: {
    color: "#6B7280",
    fontSize: 13,
    marginTop: 3,
  },
  loadingBox: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    paddingHorizontal: 18,
    paddingBottom: 24,
  },
  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 14,
    marginBottom: 12,
  },
  sectionIcon: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  sectionTitle: {
    color: "#111827",
    fontSize: 17,
    fontWeight: "900",
  },
  field: {
    marginBottom: 12,
  },
  label: {
    color: "#4B5563",
    fontSize: 12,
    fontWeight: "800",
    marginBottom: 7,
    textTransform: "uppercase",
  },
  input: {
    minHeight: 50,
    borderRadius: 15,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 14,
    color: "#111827",
    fontSize: 14,
  },
  securityCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginTop: 8,
    marginBottom: 18,
  },
  qrCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 18,
  },
  qrDescription: {
    color: "#6B7280",
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 12,
  },
  qrPreview: {
    width: "100%",
    height: 190,
    borderRadius: 16,
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  qrEmpty: {
    minHeight: 140,
    borderRadius: 16,
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
    rowGap: 8,
  },
  qrEmptyText: {
    color: "#6B7280",
    fontSize: 13,
    fontWeight: "800",
  },
  qrActions: {
    flexDirection: "row",
    columnGap: 10,
    marginTop: 12,
  },
  qrPickButton: {
    flex: 1,
    minHeight: 48,
    borderRadius: 15,
    backgroundColor: colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    columnGap: 8,
  },
  qrPickButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "900",
  },
  qrRemoveButton: {
    minHeight: 48,
    borderRadius: 15,
    backgroundColor: "#FEF2F2",
    borderWidth: 1,
    borderColor: "#FCA5A5",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  qrRemoveButtonText: {
    color: "#B91C1C",
    fontSize: 14,
    fontWeight: "900",
  },
  passwordButton: {
    minHeight: 48,
    borderRadius: 15,
    backgroundColor: "#EEF2FF",
    borderWidth: 1,
    borderColor: "#C7D2FE",
    alignItems: "center",
    justifyContent: "center",
  },
  passwordButtonText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "900",
  },
  saveButton: {
    minHeight: 54,
    borderRadius: 18,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  saveFooter: {
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 52,
    backgroundColor: colors.dashboardBg,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "900",
  },
  disabledButton: {
    opacity: 0.7,
  },
});
