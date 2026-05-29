import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
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

            <Pressable
              onPress={() => { setAcceptedTerms((prev) => !prev); clearFieldError("terms"); }}
              style={{ flexDirection: "row", alignItems: "flex-start", marginTop: 18 }}
            >
              <View style={{
                width: 20, height: 20, borderRadius: 4, borderWidth: 1.5,
                borderColor: errors.terms ? "#D14343" : "#C7CBD4",
                backgroundColor: acceptedTerms ? colors.primary : "transparent",
                marginTop: 2, marginRight: 10,
              }} />

              <Text style={[textPresets.bodyMuted, { color: "#7B7B7B", flex: 1, lineHeight: 20 }]}>
                Creando tu cuenta estas de acuerdo con nuestros{" "}
                <Text style={{ color: colors.black, fontWeight: "700" }}>Terminos y condiciones</Text>
              </Text>
            </Pressable>

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
    </ScreenContainer>
  );
}
