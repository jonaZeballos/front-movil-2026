import { useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, Text, View, useWindowDimensions } from "react-native";

import { AppLogoFull } from "../../../shared/components/AppLogoFull";
import { AppButton } from "../../../shared/components/buttons";
import { ScreenContainer } from "../../../shared/components/ScreenContainer";
import tw from "../../../shared/styles/tw";
import { colors } from "../../../shared/theme/colors";
import { textPresets } from "../../../shared/theme/typography";
import {
  BOLIVIAN_MOBILE_MESSAGE,
  EMAIL_FORMAT_MESSAGE,
  isInternalEmail,
  isValidBolivianMobile,
  isValidEmail,
  normalizeBolivianPhone,
} from "../../../shared/utils/validators";
import { AuthInput } from "../components/AuthInput";
import { AuthTopBar } from "../components/AuthTopBar";

const PERSON_NAME_REGEX = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+(?:\s+[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+)*$/;
const INVALID_PERSON_NAME_CHARS_REGEX = /[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ\s]/g;

const sanitizePersonName = (value) =>
  value.replace(INVALID_PERSON_NAME_CHARS_REGEX, "").replace(/\s{2,}/g, " ");

export function RegisterStepOneScreen({ onBack, onNext, onGoToLogin }) {
  const { width: screenWidth } = useWindowDimensions();

  const [nombres, setNombres] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState({});

  const horizontalPadding = screenWidth < 380 ? 20 : 24;
  const contentWidth = Math.min(screenWidth - horizontalPadding * 2, 360);

  const clearFieldError = (field) => {
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleNext = () => {
    const trimmedNombres = nombres.trim();
    const trimmedApellidos = apellidos.trim();
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedUsername = username.trim();
    const trimmedBusinessName = businessName.trim();
    const trimmedPhone = normalizeBolivianPhone(phone);
    const nextErrors = {};

    if (!trimmedNombres || trimmedNombres.length < 2) {
      nextErrors.nombres = "Ingrese al menos 2 caracteres.";
    } else if (!PERSON_NAME_REGEX.test(trimmedNombres)) {
      nextErrors.nombres = "Use solo letras y espacios.";
    }

    if (!trimmedApellidos || trimmedApellidos.length < 2) {
      nextErrors.apellidos = "Ingrese al menos 2 caracteres.";
    } else if (!PERSON_NAME_REGEX.test(trimmedApellidos)) {
      nextErrors.apellidos = "Use solo letras y espacios.";
    }

    if (!trimmedEmail) {
      nextErrors.email = "Ingrese un correo electronico.";
    } else if (!isValidEmail(trimmedEmail) || isInternalEmail(trimmedEmail)) {
      nextErrors.email = EMAIL_FORMAT_MESSAGE;
    }

    if (!trimmedUsername) {
      nextErrors.username = "Ingrese un nombre de usuario.";
    } else if (!/^[a-zA-Z0-9._-]+$/.test(trimmedUsername)) {
      nextErrors.username = "Use solo letras, numeros, punto, guion o guion bajo.";
    } else if (trimmedUsername.length < 4) {
      nextErrors.username = "Ingrese al menos 4 caracteres.";
    }

    if (!trimmedBusinessName) {
      nextErrors.businessName = "Ingrese el nombre de su negocio.";
    }

    if (!trimmedPhone) {
      nextErrors.phone = "Ingrese un numero de telefono.";
    } else if (!isValidBolivianMobile(trimmedPhone)) {
      nextErrors.phone = BOLIVIAN_MOBILE_MESSAGE;
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    onNext?.({
      nombres: trimmedNombres,
      apellidos: trimmedApellidos,
      email: trimmedEmail,
      username: trimmedUsername,
      negocioNombre: trimmedBusinessName,
      numero: trimmedPhone,
    });
  };

  return (
    <ScreenContainer backgroundColor={colors.surface}>
      <AuthTopBar title="Inicia Sesion" onBack={onBack} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={[
            tw`items-center`,
            { flexGrow: 1, paddingHorizontal: horizontalPadding, paddingTop: 18, paddingBottom: 96 },
          ]}
        >
          <View style={{ width: contentWidth }}>
            <View style={[tw`items-center`, { marginBottom: 14 }]}>
              <AppLogoFull width={176} height={36} color={colors.black} />
            </View>

            <Text style={[textPresets.headingDark, { fontSize: 22, lineHeight: 30, color: colors.black, marginBottom: 6 }]}>
              Crea tu cuenta
            </Text>

            <Text style={[textPresets.bodyMuted, { color: "#6B7280", marginBottom: 18, lineHeight: 20 }]}>
              Registra tu negocio y la cuenta administradora.
            </Text>

            <Text style={[textPresets.bodyDark, { color: colors.black, fontWeight: "700", marginBottom: 14 }]}>
              Informacion principal
            </Text>

            <View style={{ rowGap: 12 }}>
              <AuthInput value={nombres} onChangeText={(text) => { setNombres(sanitizePersonName(text)); clearFieldError("nombres"); }} placeholder="Nombres" icon="user" error={errors.nombres} />
              <AuthInput value={apellidos} onChangeText={(text) => { setApellidos(sanitizePersonName(text)); clearFieldError("apellidos"); }} placeholder="Apellidos" icon="user" error={errors.apellidos} />
              <AuthInput value={email} onChangeText={(text) => { setEmail(text); clearFieldError("email"); }} placeholder="Email" icon="mail" keyboardType="email-address" autoCapitalize="none" error={errors.email} />
              <AuthInput value={username} onChangeText={(text) => { setUsername(text); clearFieldError("username"); }} placeholder="Nombre de usuario" icon="smile" autoCapitalize="none" error={errors.username} />
              <AuthInput value={businessName} onChangeText={(text) => { setBusinessName(text); clearFieldError("businessName"); }} placeholder="Nombre del negocio" icon="briefcase" error={errors.businessName} />
              <AuthInput
                value={phone}
                onChangeText={(text) => { setPhone(normalizeBolivianPhone(text).slice(0, 8)); clearFieldError("phone"); }}
                placeholder="Ingrese numero de celular"
                icon="phone"
                keyboardType="number-pad"
                maxLength={8}
                error={errors.phone}
              />
            </View>

            <View style={{ marginTop: 24 }}>
              <AppButton title="Siguiente" onPress={handleNext} backgroundColor={colors.primary} minHeight={54} />
            </View>

            <View style={[tw`items-center`, { marginTop: 20 }]}>
              <Text style={[textPresets.bodyMuted, { color: "#7B7B7B" }]}>
                Tienes una cuenta?{" "}
                <Text onPress={onGoToLogin} style={{ color: colors.black, fontWeight: "700" }}>
                  Inicia Sesion
                </Text>
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}
