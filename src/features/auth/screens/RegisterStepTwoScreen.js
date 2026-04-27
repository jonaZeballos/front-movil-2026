import { useState } from "react";
import { Image, Pressable, Text, View, useWindowDimensions } from "react-native";

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
  const [errorMessage, setErrorMessage] = useState("");

  const horizontalPadding = screenWidth < 380 ? 20 : 24;
  const contentWidth = Math.min(screenWidth - horizontalPadding * 2, 360);
  const isDisabled = !password.trim() || !repeatPassword.trim() || !acceptedTerms;

  const handleFinish = () => {
    const trimmedPassword = password.trim();
    const trimmedRepeatPassword = repeatPassword.trim();

    if (!trimmedPassword) return setErrorMessage("La contraseña es obligatoria.");
    if (!trimmedRepeatPassword) return setErrorMessage("Debes repetir la contraseña.");
    if (trimmedPassword.length < 6) return setErrorMessage("La contraseña debe tener al menos 6 caracteres.");
    if (trimmedPassword !== trimmedRepeatPassword) return setErrorMessage("Las contraseñas no coinciden.");
    if (!acceptedTerms) return setErrorMessage("Debes aceptar los términos y condiciones.");

    setErrorMessage("");
    onFinish?.({ password: trimmedPassword, repeatPassword: trimmedRepeatPassword, acceptedTerms });
  };

  return (
    <ScreenContainer backgroundColor={colors.surface}>
      <AuthTopBar title="Informacion principal" onBack={onBack} />

      <View style={[tw`flex-1 items-center`, { paddingHorizontal: horizontalPadding, paddingTop: 20, paddingBottom: 24 }]}>
        <View style={{ width: contentWidth }}>
          <Text style={[textPresets.headingDark, { fontSize: 22, lineHeight: 30, color: colors.black, marginBottom: 16 }]}>
            Crea tu cuenta
          </Text>

          <View style={[tw`items-center`, { marginBottom: 18 }]}>
            <Image
              source={require("../../../../assets/images/register-security.png")}
              style={{ width: 184, height: 143 }}
              resizeMode="contain"
            />
          </View>

          <Text style={[textPresets.bodyDark, { color: colors.black, fontWeight: "700", marginBottom: 16 }]}>
            Seguridad
          </Text>

          <View style={{ rowGap: 14 }}>
            <View>
              <Text style={[textPresets.bodyDark, { color: colors.black, marginBottom: 8 }]}>
                Introduce la contraseña
              </Text>
              <PasswordInput value={password} onChangeText={(text) => { setPassword(text); if (errorMessage) setErrorMessage(""); }} />
            </View>

            <View>
              <Text style={[textPresets.bodyDark, { color: colors.black, marginBottom: 8 }]}>
                Repite la contraseña
              </Text>
              <PasswordInput value={repeatPassword} onChangeText={(text) => { setRepeatPassword(text); if (errorMessage) setErrorMessage(""); }} />
            </View>
          </View>

          <Pressable
            onPress={() => { setAcceptedTerms((prev) => !prev); if (errorMessage) setErrorMessage(""); }}
            style={{ flexDirection: "row", alignItems: "flex-start", marginTop: 18 }}
          >
            <View style={{
              width: 20, height: 20, borderRadius: 4, borderWidth: 1.5,
              borderColor: "#C7CBD4", backgroundColor: acceptedTerms ? colors.primary : "transparent",
              marginTop: 2, marginRight: 10,
            }} />

            <Text style={[textPresets.bodyMuted, { color: "#7B7B7B", flex: 1, lineHeight: 20 }]}>
              Creando tu cuenta estás de acuerdo con nuestros{" "}
              <Text style={{ color: colors.black, fontWeight: "700" }}>Términos y condiciones</Text>
            </Text>
          </Pressable>

          {!!errorMessage && (
            <Text style={[textPresets.bodyMuted, { color: "#D14343", marginTop: 14, lineHeight: 20 }]}>
              {errorMessage}
            </Text>
          )}

          <View style={{ marginTop: 28 }}>
            <AppButton title="Terminar Registro" onPress={handleFinish} backgroundColor={isDisabled ? "#B8B8B8" : colors.primary} minHeight={54} />
          </View>
        </View>
      </View>
    </ScreenContainer>
  );
}