import { useState } from "react";
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { colors } from "../../../shared/theme/colors";
import { shareQuotationPdf } from "../services";

export function ShareQuotationPdfButton({ quotation, style }) {
  const [isSharing, setIsSharing] = useState(false);

  const handleShare = async () => {
    if (!quotation || isSharing) return;

    setIsSharing(true);
    try {
      await shareQuotationPdf(quotation);
    } catch (error) {
      Alert.alert("No se pudo compartir PDF", error.message || "Intenta nuevamente.");
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        pressed && styles.buttonPressed,
        isSharing && styles.buttonDisabled,
        style,
      ]}
      onPress={handleShare}
      disabled={isSharing}
    >
      {isSharing ? (
        <ActivityIndicator color="#FFFFFF" />
      ) : (
        <>
          <Ionicons name="document-text-outline" size={20} color="#FFFFFF" />
          <Text style={styles.buttonText}>Compartir PDF</Text>
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
