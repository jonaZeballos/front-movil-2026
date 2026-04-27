import { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, Text, TextInput, View } from "react-native";

import { AppButton } from "../../../shared/components/buttons";
import { ScreenContainer } from "../../../shared/components/ScreenContainer";
import { colors } from "../../../shared/theme/colors";
import tw from "../../../shared/styles/tw";

const API_URL = "https://movil-backend.vercel.app";

export function LoginScreen({ onLoginSuccess, onBack }) {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!usuario.trim() || !password.trim()) {
      Alert.alert("Campos obligatorios", "Ingresa usuario y contraseña.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/api/usuarios/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          usuario: usuario.trim(),
          password: password.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        Alert.alert("Error", data.error || "Credenciales incorrectas.");
        return;
      }

      onLoginSuccess(data.data);
    } catch (error) {
      Alert.alert("Error", "No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer backgroundColor={colors.surface}>
      <KeyboardAvoidingView
        style={tw`flex-1 justify-center px-6`}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Text style={tw`text-3xl font-bold text-black mb-2`}>Iniciar sesión</Text>
        <Text style={tw`text-base text-gray-500 mb-8`}>
          Ingresa tus credenciales para acceder al sistema.
        </Text>

        <Text style={tw`text-black mb-2`}>Usuario</Text>
        <TextInput
          value={usuario}
          onChangeText={setUsuario}
          placeholder="Ej: tecnico01"
          autoCapitalize="none"
          style={tw`border border-gray-300 rounded-2xl px-4 py-4 mb-4 text-black`}
        />

        <Text style={tw`text-black mb-2`}>Contraseña</Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Ingresa tu contraseña"
          secureTextEntry
          style={tw`border border-gray-300 rounded-2xl px-4 py-4 mb-6 text-black`}
        />

        <AppButton
          title={loading ? "Validando..." : "Iniciar sesión"}
          onPress={handleLogin}
          disabled={loading}
          backgroundColor={colors.black}
        />

        <View style={tw`mt-4`}>
          <AppButton
            title="Volver"
            onPress={onBack}
            backgroundColor="#EFEFEF"
            textColor="#555"
          />
        </View>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}