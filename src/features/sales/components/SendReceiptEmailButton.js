import { useState } from "react";
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { fontFamilies } from "../../../shared/theme/fonts";
import { sendReceiptByEmail } from "../services/receiptEmail";

export function SendReceiptEmailButton({ receipt, style }) {
  const [isSending, setIsSending] = useState(false);

  const handleSend = async () => {
    if (!receipt || isSending) return;

    setIsSending(true);
    try {
      await sendReceiptByEmail(receipt);
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
        <ActivityIndicator color="#2386F5" />
      ) : (
        <>
          <Ionicons name="mail-outline" size={19} color="#2386F5" />
          <Text style={styles.buttonText}>Enviar recibo por correo</Text>
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
    borderColor: "#DCEBFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  buttonPressed: { opacity: 0.88 },
  buttonDisabled: { opacity: 0.7 },
  buttonText: {
    color: "#2386F5",
    fontFamily: fontFamilies.bold,
    fontSize: 15,
  },
});
