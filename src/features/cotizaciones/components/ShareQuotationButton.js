import { useState } from "react";
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { colors } from "../../../shared/theme/colors";
import { fontFamilies } from "../../../shared/theme/fonts";
import { sendQuotationByWhatsApp } from "../services";

export function ShareQuotationButton({ quotation, style }) {
  const [isSending, setIsSending] = useState(false);

  const handleSend = async () => {
    if (!quotation) {
      Alert.alert("Cotizacion no disponible", "No hay datos para enviar por WhatsApp.");
      return;
    }

    setIsSending(true);

    try {
      await sendQuotationByWhatsApp(quotation);
    } catch (error) {
      const message = error.message || "Ocurrio un error al enviar la cotizacion.";
      Alert.alert(
        message.includes("teléfono") ? "Teléfono no registrado" : "No se pudo abrir WhatsApp",
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
          <Ionicons name="logo-whatsapp" size={20} color="#FFFFFF" />
          <Text style={styles.buttonText}>Enviar cotizacion por WhatsApp</Text>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 52,
    borderRadius: 18,
    backgroundColor: "#25D366",
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
    fontFamily: fontFamilies.bold,
    fontSize: 15,
    textAlign: "center",
  },
});
