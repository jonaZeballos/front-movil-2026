import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
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
import { AuthInput } from "../components/AuthInput";
import { AuthTopBar } from "../components/AuthTopBar";
import { PasswordInput } from "../components/PasswordInput";

export function LoginScreen({ onBack, onLogin }) {
  const { width: screenWidth } = useWindowDimensions();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const horizontalPadding = screenWidth < 380 ? 20 : 24;
  const contentWidth = Math.min(screenWidth - horizontalPadding * 2, 360);
  const isDisabled = isLoading || !username.trim() || !password.trim();

  const clearFieldError = (field) => {
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
    if (errorMessage) setErrorMessage("");
  };

  const validate = () => {
    const nextErrors = {};

    if (!username.trim()) {
      nextErrors.username = "Ingrese su usuario o correo.";
    }

    if (!password.trim()) {
      nextErrors.password = "Ingrese su contrasena.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleLogin = async () => {
    if (isLoading) return;
    if (!validate()) return;

    setIsLoading(true);
    setErrorMessage("");

    try {
      const result = await onLogin?.({
        email: username.trim().toLowerCase(),
        password: password.trim(),
      });

      if (!result?.success) {
        setErrorMessage(result?.message || "Credenciales invalidas.");
      }
    } catch (error) {
      setErrorMessage(error.message || "No se pudo iniciar sesion.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScreenContainer backgroundColor={colors.surface}>
      <AuthTopBar title="Volver" onBack={onBack} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            alignItems: "center",
            paddingHorizontal: horizontalPadding,
            paddingTop: 20,
            paddingBottom: 32,
          }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={{ width: contentWidth }}>
            <Text style={[textPresets.headingDark, { color: colors.black, marginBottom: 24 }]}>
              Inicio de sesion
            </Text>

            <View style={tw`items-center mb-8`}>
              <AppLogoFull width={170} height={36} color={colors.black} />
            </View>

            <View style={{ rowGap: 14 }}>
              <AuthInput
                value={username}
                onChangeText={(text) => {
                  setUsername(text);
                  clearFieldError("username");
                }}
                placeholder="Usuario o correo"
                icon="mail"
                autoCapitalize="none"
                error={errors.username}
              />

              <PasswordInput
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  clearFieldError("password");
                }}
                error={errors.password}
              />
            </View>

            {!!errorMessage && (
              <Text style={{ color: "#D14343", marginTop: 14 }}>{errorMessage}</Text>
            )}

            <View style={{ marginTop: 28 }}>
              <AppButton
                title={isLoading ? "Iniciando sesion..." : "Iniciar sesion"}
                onPress={handleLogin}
                disabled={isDisabled}
                backgroundColor={isDisabled ? "#B8B8B8" : colors.primary}
                minHeight={54}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}
