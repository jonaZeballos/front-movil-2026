import { useState } from "react";
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { colors } from "../../../shared/theme/colors";
import { sendQuotationByEmail } from "../services";

export function ShareQuotationEmailButton({ quotation, style }) {
  const [isSending, setIsSending] = useState(false);

  const handleSend = async () => {
    if (!quotation || isSending) return;

    setIsSending(true);
    try {
      await sendQuotationByEmail(quotation);
    } catch (error) {
      const message = error.message || "No se pudo preparar el correo.";
      Alert.alert(
        message.includes("correo registrado") ? "Correo no registrado" : "No se pudo enviar por correo",
        message
      );
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        pressed && styles.buttonPressed,
        isSending && styles.buttonDisabled,
        style,
      ]}
      onPress={handleSend}
      disabled={isSending}
    >
      {isSending ? (
        <ActivityIndicator color="#FFFFFF" />
      ) : (
        <>
          <Ionicons name="mail-outline" size={20} color="#FFFFFF" />
          <Text style={styles.buttonText}>Enviar por correo</Text>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 52,
    borderRadius: 18,
    backgroundColor: colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: 16,
  },
  buttonPressed: {
    opacity: 0.88,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
    textAlign: "center",
  },
});
