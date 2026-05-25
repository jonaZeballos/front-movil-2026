import { useState } from "react";
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { fontFamilies } from "../../../shared/theme/fonts";
import { sendReceiptByWhatsApp } from "../services/receiptWhatsapp";

export function SendReceiptWhatsappButton({ receipt, style }) {
  const [isSending, setIsSending] = useState(false);

  const handleSend = async () => {
    if (!receipt) {
      Alert.alert("Recibo no disponible", "No hay datos para enviar por WhatsApp.");
      return;
    }

    setIsSending(true);

    try {
      await sendReceiptByWhatsApp(receipt);
    } catch (error) {
      Alert.alert(
        "No se pudo abrir WhatsApp",
        error.message || "Ocurrio un error al enviar el recibo."
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
        <ActivityIndicator color="#25D366" />
      ) : (
        <>
          <Ionicons name="logo-whatsapp" size={19} color="#25D366" />
          <Text style={styles.buttonText}>Enviar recibo por WhatsApp</Text>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    marginTop: 10,
    height: 52,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#BFEBD0",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  buttonPressed: {
    opacity: 0.88,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: "#25D366",
    fontFamily: fontFamilies.bold,
    fontSize: 15,
  },
});