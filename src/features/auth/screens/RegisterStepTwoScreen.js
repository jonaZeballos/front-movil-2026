import { useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";

import { AppLogoFull } from "../../../shared/components/AppLogoFull";
import { AppButton } from "../../../shared/components/buttons";
import { ScreenContainer } from "../../../shared/components/ScreenContainer";
import tw from "../../../shared/styles/tw";
import { colors } from "../../../shared/theme/colors";
import { textPresets } from "../../../shared/theme/typography";
import { AuthTopBar } from "../components/AuthTopBar";
import { PasswordInput } from "../components/PasswordInput";

export function RegisterStepTwoScreen({ onBack, onFinish }) {
  const { width: screenWidth } = useWindowDimensions();

  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [termsVisible, setTermsVisible] = useState(false);

  const horizontalPadding = screenWidth < 380 ? 20 : 24;
  const contentWidth = Math.min(screenWidth - horizontalPadding * 2, 360);

  const clearFieldError = (field) => {
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
    if (generalError) setGeneralError("");
  };

  const handleFinish = async () => {
    if (isSubmitting) return;

    const trimmedPassword = password.trim();
    const trimmedRepeatPassword = repeatPassword.trim();
    const nextErrors = {};

    if (!trimmedPassword) {
      nextErrors.password = "Ingrese una contrasena.";
    } else if (trimmedPassword.length < 6) {
      nextErrors.password = "La contrasena debe tener al menos 6 caracteres.";
    }

    if (!trimmedRepeatPassword) {
      nextErrors.repeatPassword = "Repita la contrasena.";
    } else if (trimmedPassword !== trimmedRepeatPassword) {
      nextErrors.repeatPassword = "Las contrasenas no coinciden.";
    }

    if (!acceptedTerms) {
      nextErrors.terms = "Debe aceptar los terminos para continuar.";
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setGeneralError("");
    setIsSubmitting(true);

    try {
      const result = await onFinish?.({ password: trimmedPassword, repeatPassword: trimmedRepeatPassword, acceptedTerms });
      if (result && result.success === false) {
        setGeneralError(result.message || "No se pudo completar el registro.");
      }
    } catch (error) {
      setGeneralError(error.message || "No se pudo completar el registro.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScreenContainer backgroundColor={colors.surface}>
      <AuthTopBar title="Informacion principal" onBack={onBack} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            alignItems: "center",
            paddingHorizontal: horizontalPadding,
            paddingTop: 18,
            paddingBottom: 96,
          }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={{ width: contentWidth }}>
            <View style={[tw`items-center`, { marginBottom: 14 }]}>
              <AppLogoFull width={176} height={36} color={colors.black} />
            </View>

            <Text style={[textPresets.headingDark, { fontSize: 22, lineHeight: 30, color: colors.black, marginBottom: 6 }]}>
              Protege tu cuenta
            </Text>

            <Text style={[textPresets.bodyMuted, { color: "#6B7280", marginBottom: 18, lineHeight: 20 }]}>
              Define la contrasena del administrador del negocio.
            </Text>

            <Text style={[textPresets.bodyDark, { color: colors.black, fontWeight: "700", marginBottom: 14 }]}>
              Seguridad
            </Text>

            <View style={{ rowGap: 12 }}>
              <View>
                <Text style={[textPresets.bodyDark, { color: colors.black, marginBottom: 8 }]}>
                  Contrasena
                </Text>
                <PasswordInput value={password} onChangeText={(text) => { setPassword(text); clearFieldError("password"); }} error={errors.password} />
              </View>

              <View>
                <Text style={[textPresets.bodyDark, { color: colors.black, marginBottom: 8 }]}>
                  Repetir contrasena
                </Text>
                <PasswordInput value={repeatPassword} onChangeText={(text) => { setRepeatPassword(text); clearFieldError("repeatPassword"); }} placeholder="Repetir contrasena" error={errors.repeatPassword} />
              </View>
            </View>

            <View style={{ flexDirection: "row", alignItems: "flex-start", marginTop: 18 }}>
              <Pressable
                onPress={() => { setAcceptedTerms((prev) => !prev); clearFieldError("terms"); }}
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 4,
                  borderWidth: 1.5,
                  borderColor: errors.terms ? "#D14343" : "#C7CBD4",
                  backgroundColor: acceptedTerms ? colors.primary : "transparent",
                  marginTop: 2,
                  marginRight: 10,
                }}
              />

              <Text style={[textPresets.bodyMuted, { color: "#7B7B7B", flex: 1, lineHeight: 20 }]}>
                <Text onPress={() => { setAcceptedTerms((prev) => !prev); clearFieldError("terms"); }}>
                  Creando tu cuenta estas de acuerdo con nuestros{" "}
                  <Text style={{ color: colors.black, fontWeight: "700" }}>Terminos y condiciones</Text>
                </Text>
                {". "}
                <Text
                  onPress={() => setTermsVisible(true)}
                  style={{ color: colors.primary, fontWeight: "700", textDecorationLine: "underline" }}
                >
                  Ver términos y condiciones
                </Text>
              </Text>
            </View>

            {!!errors.terms && (
              <Text style={[textPresets.bodyMuted, { color: "#D14343", marginTop: 8, lineHeight: 18 }]}>
                {errors.terms}
              </Text>
            )}

            {!!generalError && (
              <Text style={[textPresets.bodyMuted, { color: "#D14343", marginTop: 14, lineHeight: 20 }]}>
                {generalError}
              </Text>
            )}

            <View style={{ marginTop: 24 }}>
              <AppButton
                title={isSubmitting ? "Registrando..." : "Terminar Registro"}
                onPress={handleFinish}
                backgroundColor={isSubmitting ? "#B8B8B8" : colors.primary}
                minHeight={54}
                disabled={isSubmitting}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <TermsModal visible={termsVisible} onClose={() => setTermsVisible(false)} />
    </ScreenContainer>
  );
}

function TermsModal({ visible, onClose }) {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Términos y condiciones de uso</Text>
            <Pressable onPress={onClose} style={styles.closeIconButton} hitSlop={10}>
              <Text style={styles.closeIconText}>✕</Text>
            </Pressable>
          </View>

          {/* Scrollable Content */}
          <ScrollView 
            style={styles.scrollContainer}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={true}
          >
            <Text style={styles.introText}>
              Al crear una cuenta administrativa en ServiTech, el administrador del negocio acepta usar el sistema de forma responsable para gestionar clientes, empleados, equipos, órdenes, cotizaciones, inventario y ventas.
            </Text>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>1. Responsabilidad del administrador</Text>
              <Text style={styles.bulletPoint}>• El administrador es responsable de la información registrada en el sistema.</Text>
              <Text style={styles.bulletPoint}>• Debe crear usuarios reales para técnicos y personal de ventas.</Text>
              <Text style={styles.bulletPoint}>• Debe bloquear o desactivar usuarios solo cuando corresponda.</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>2. Uso de datos de clientes</Text>
              <Text style={styles.bulletPoint}>• Los datos de clientes deben registrarse con fines de atención técnica, ventas, cotizaciones y seguimiento.</Text>
              <Text style={styles.bulletPoint}>• El negocio debe evitar registrar información falsa o innecesaria.</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>3. Lista negra y restricciones</Text>
              <Text style={styles.bulletPoint}>• Si el sistema permite marcar clientes en lista negra, debe existir un motivo claro y justificable.</Text>
              <Text style={styles.bulletPoint}>• La lista negra debe usarse únicamente para casos relacionados con atención, deudas, abandono de equipos, mal uso del servicio o conflictos documentados.</Text>
              <Text style={styles.bulletPoint}>• No debe usarse de forma discriminatoria o arbitraria.</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>4. Empleados y roles</Text>
              <Text style={styles.bulletPoint}>• El administrador puede crear usuarios técnicos y de ventas.</Text>
              <Text style={styles.bulletPoint}>• Los cambios de rol, bloqueos o desbloqueos deben realizarse de forma responsable.</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>5. Uso correcto del sistema</Text>
              <Text style={styles.bulletPoint}>• ServiTech es una herramienta de gestión; la responsabilidad operativa y legal del uso de la información corresponde al negocio registrado.</Text>
              <Text style={styles.bulletPoint}>• El uso indebido del sistema puede afectar la trazabilidad de órdenes, ventas y clientes.</Text>
            </View>

            <Text style={styles.footerText}>
              Al aceptar estos términos, confirmo que entiendo y acepto las responsabilidades asociadas al uso administrativo de ServiTech.
            </Text>
          </ScrollView>

          {/* Footer Close Button */}
          <View style={styles.modalFooter}>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Cerrar</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    maxHeight: "82%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    overflow: "hidden",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F2937",
    flex: 1,
    marginRight: 10,
  },
  closeIconButton: {
    padding: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  closeIconText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#9CA3AF",
  },
  scrollContainer: {
    maxHeight: 380,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 32,
  },
  introText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#4B5563",
    marginBottom: 20,
  },
  section: {
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 8,
  },
  bulletPoint: {
    fontSize: 14,
    lineHeight: 20,
    color: "#4B5563",
    marginBottom: 6,
    paddingLeft: 4,
  },
  footerText: {
    fontSize: 14,
    fontWeight: "600",
    lineHeight: 20,
    color: "#1F2937",
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    paddingTop: 16,
  },
  modalFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    alignItems: "stretch",
  },
  closeButton: {
    backgroundColor: colors.primary || "#10B981",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  closeButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});
