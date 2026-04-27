import { useState } from "react";
import { Image, Text, View, useWindowDimensions } from "react-native";

import { AppButton } from "../../../shared/components/buttons";
import { ScreenContainer } from "../../../shared/components/ScreenContainer";
import tw from "../../../shared/styles/tw";
import { colors } from "../../../shared/theme/colors";
import { textPresets } from "../../../shared/theme/typography";
import { AuthInput } from "../components/AuthInput";
import { AuthTopBar } from "../components/AuthTopBar";

export function RegisterStepOneScreen({ onBack, onNext, onGoToLogin }) {
  const { width: screenWidth } = useWindowDimensions();

  const [names, setNames] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const horizontalPadding = screenWidth < 380 ? 20 : 24;
  const contentWidth = Math.min(screenWidth - horizontalPadding * 2, 360);
  const isDisabled = !names.trim() || !email.trim() || !username.trim();

  const isValidEmail = (value) => /\S+@\S+\.\S+/.test(value);

  const handleNext = () => {
    const trimmedNames = names.trim();
    const trimmedEmail = email.trim();
    const trimmedUsername = username.trim();

    if (!trimmedNames) return setErrorMessage("Los nombres son obligatorios.");
    if (trimmedNames.length < 3) return setErrorMessage("Los nombres deben tener al menos 3 caracteres.");
    if (!trimmedEmail) return setErrorMessage("El email es obligatorio.");
    if (!isValidEmail(trimmedEmail)) return setErrorMessage("Ingresa un correo electrónico válido.");
    if (!trimmedUsername) return setErrorMessage("El nombre de usuario es obligatorio.");
    if (trimmedUsername.length < 4) return setErrorMessage("El nombre de usuario debe tener al menos 4 caracteres.");

    setErrorMessage("");
    onNext?.({ names: trimmedNames, email: trimmedEmail, username: trimmedUsername });
  };

  return (
    <ScreenContainer backgroundColor={colors.surface}>
      <AuthTopBar title="Inicia Sesion" onBack={onBack} />

      <View style={[tw`flex-1 items-center`, { paddingHorizontal: horizontalPadding, paddingTop: 20, paddingBottom: 24 }]}>
        <View style={{ width: contentWidth }}>
          <Text style={[textPresets.headingDark, { fontSize: 22, lineHeight: 30, color: colors.black, marginBottom: 16 }]}>
            Crea tu cuenta
          </Text>

          <View style={[tw`items-center`, { marginBottom: 18 }]}>
            <Image
              source={require("../../../../assets/images/register-personal.png")}
              style={{ width: 184, height: 143 }}
              resizeMode="contain"
            />
          </View>

          <Text style={[textPresets.bodyDark, { color: colors.black, fontWeight: "700", marginBottom: 16 }]}>
            Información personal
          </Text>

          <View style={{ rowGap: 14 }}>
            <AuthInput value={names} onChangeText={(text) => { setNames(text); if (errorMessage) setErrorMessage(""); }} placeholder="Nombres" icon="user" />
            <AuthInput value={email} onChangeText={(text) => { setEmail(text); if (errorMessage) setErrorMessage(""); }} placeholder="Email" icon="mail" keyboardType="email-address" autoCapitalize="none" />
            <AuthInput value={username} onChangeText={(text) => { setUsername(text); if (errorMessage) setErrorMessage(""); }} placeholder="Nombre de usuario" icon="smile" autoCapitalize="none" />
          </View>

          {!!errorMessage && (
            <Text style={[textPresets.bodyMuted, { color: "#D14343", marginTop: 14, lineHeight: 20 }]}>
              {errorMessage}
            </Text>
          )}

          <View style={{ marginTop: 28 }}>
            <AppButton title="Siguiente" onPress={handleNext} backgroundColor={isDisabled ? "#B8B8B8" : colors.primary} minHeight={54} />
          </View>

          <View style={[tw`items-center`, { marginTop: 22 }]}>
            <Text style={[textPresets.bodyMuted, { color: "#7B7B7B" }]}>
              ¿Tienes una cuenta?{" "}
              <Text onPress={onGoToLogin} style={{ color: colors.black, fontWeight: "700" }}>
                Inicia Sesión
              </Text>
            </Text>
          </View>
        </View>
      </View>
    </ScreenContainer>
  );
}