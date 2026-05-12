import { useState } from "react";
import { Text, View, useWindowDimensions } from "react-native";

import { AppLogoFull } from "../../../shared/components/AppLogoFull";
import { AppButton } from "../../../shared/components/buttons";
import { ScreenContainer } from "../../../shared/components/ScreenContainer";
import tw from "../../../shared/styles/tw";
import { colors } from "../../../shared/theme/colors";
import { textPresets } from "../../../shared/theme/typography";
import { AuthInput } from "../components/AuthInput";
import { AuthTopBar } from "../components/AuthTopBar";
import { PasswordInput } from "../components/PasswordInput";

export function LoginScreen({ onBack, onLogin }) {
  const { width: screenWidth } = useWindowDimensions();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const horizontalPadding = screenWidth < 380 ? 20 : 24;
  const contentWidth = Math.min(screenWidth - horizontalPadding * 2, 360);
  const isDisabled = isLoading || !username.trim() || !password.trim();

  const handleLogin = async () => {
    if (!username.trim()) return setErrorMessage("Ingresa tu usuario o correo.");
    if (!password.trim()) return setErrorMessage("Ingresa tu contraseña.");

    setIsLoading(true);
    const result = await onLogin?.({
      email: username.trim().toLowerCase(),
      password: password.trim(),
    });
    setIsLoading(false);

    if (!result?.success) {
      setErrorMessage(result?.message || "Credenciales inválidas.");
    }
  };

  return (
    <ScreenContainer backgroundColor={colors.surface}>
      <AuthTopBar title="Volver" onBack={onBack} />

      <View style={[tw`flex-1 items-center`, { paddingHorizontal: horizontalPadding, paddingTop: 20 }]}>
        <View style={{ width: contentWidth }}>
          <Text style={[textPresets.headingDark, { color: colors.black, marginBottom: 24 }]}>
            Inicio de sesión
          </Text>

          <View style={tw`items-center mb-8`}>
            <AppLogoFull width={170} height={36} color={colors.black} />
          </View>

          <View style={{ rowGap: 14 }}>
            <AuthInput
              value={username}
              onChangeText={(text) => {
                setUsername(text);
                if (errorMessage) setErrorMessage("");
              }}
              placeholder="correo"
              icon="mail"
              autoCapitalize="none"
            />

            <PasswordInput
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (errorMessage) setErrorMessage("");
              }}
            />
          </View>

          {!!errorMessage && (
            <Text style={{ color: "#D14343", marginTop: 14 }}>{errorMessage}</Text>
          )}

          <View style={{ marginTop: 28 }}>
            <AppButton
              title={isLoading ? "Ingresando..." : "Iniciar Sesión"}
              onPress={handleLogin}
              backgroundColor={isDisabled ? "#B8B8B8" : colors.primary}
              minHeight={54}
            />
          </View>
        </View>
      </View>
    </ScreenContainer>
  );
}
