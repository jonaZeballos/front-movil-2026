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

export function LoginScreen({ onBack, onLoginSuccess }) {
  const { width: screenWidth } = useWindowDimensions();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const horizontalPadding = screenWidth < 380 ? 20 : 24;
  const contentWidth = Math.min(screenWidth - horizontalPadding * 2, 360);
  const isDisabled = !username.trim() || !password.trim();

  const handleLogin = () => {
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    if (!trimmedUsername) {
      setErrorMessage("Ingresa tu usuario o correo.");
      return;
    }

    if (!trimmedPassword) {
      setErrorMessage("Ingresa tu contraseña.");
      return;
    }

    setErrorMessage("");
    onLoginSuccess?.();
  };

  return (
    <ScreenContainer backgroundColor={colors.surface}>
      <AuthTopBar title="Volver" onBack={onBack} />

      <View
        style={[
          tw`flex-1 items-center`,
          {
            paddingHorizontal: horizontalPadding,
            paddingTop: 20,
            paddingBottom: 24,
          },
        ]}
      >
        <View style={{ width: contentWidth }}>
          <Text
            style={[
              textPresets.headingDark,
              {
                fontSize: 24,
                lineHeight: 32,
                color: colors.black,
                marginBottom: 24,
              },
            ]}
          >
            Inicio de sesión
          </Text>

          <View style={tw`items-center mb-8`}>
            <AppLogoFull width={170} height={36} color={colors.black} />
          </View>

          <View style={{ rowGap: 14 }}>
            <View>
              <Text
                style={[
                  textPresets.bodyDark,
                  {
                    color: colors.black,
                    marginBottom: 8,
                  },
                ]}
              >
                Nombre de usuario o correo
              </Text>

              <AuthInput
                value={username}
                onChangeText={(text) => {
                  setUsername(text);
                  if (errorMessage) setErrorMessage("");
                }}
                placeholder="nombre de usuario o correo"
                icon="user"
                autoCapitalize="none"
              />
            </View>

            <View>
              <Text
                style={[
                  textPresets.bodyDark,
                  {
                    color: colors.black,
                    marginBottom: 8,
                  },
                ]}
              >
                Contraseña
              </Text>

              <PasswordInput
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (errorMessage) setErrorMessage("");
                }}
                placeholder="••••••••••"
              />
            </View>
          </View>

          {!!errorMessage && (
            <Text
              style={[
                textPresets.bodyMuted,
                {
                  color: "#D14343",
                  marginTop: 14,
                  lineHeight: 20,
                },
              ]}
            >
              {errorMessage}
            </Text>
          )}

          <View style={{ marginTop: 28 }}>
            <AppButton
              title="Iniciar Sesión"
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