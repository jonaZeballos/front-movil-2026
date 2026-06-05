import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { ScreenContainer } from "../../../shared/components/ScreenContainer";
import { colors } from "../../../shared/theme/colors";
import { fontFamilies } from "../../../shared/theme/fonts";
import { ElectronicReceiptCard } from "../components/ElectronicReceiptCard";
import { SendReceiptEmailButton } from "../components/SendReceiptEmailButton";
import { SendReceiptWhatsappButton } from "../components/SendReceiptWhatsappButton";
import { downloadReceiptPdf } from "../services/receiptPdf";

export function ElectronicReceiptScreen({ receipt }) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadPdf = async () => {
    if (!receipt) {
      Alert.alert("Recibo no disponible", "No hay datos para generar el PDF.");
      return;
    }

    setIsDownloading(true);

    try {
      await downloadReceiptPdf(receipt);
    } catch (error) {
      Alert.alert(
        "No se pudo generar el PDF",
        error.message || "Ocurrió un error al generar el recibo."
      );
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <ScreenContainer backgroundColor={colors.primary} edges={["top"]}>
      <View style={styles.root}>
        <View style={styles.header}>
          <View style={styles.successIcon}>
            <Ionicons name="checkmark" size={34} color="#FFFFFF" />
          </View>

          <Text style={styles.headerTitle}>Venta registrada</Text>
          <Text style={styles.headerSubtitle}>
            El recibo electrónico fue generado correctamente
          </Text>
        </View>

        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <ElectronicReceiptCard receipt={receipt} />

          <SendReceiptWhatsappButton receipt={receipt} />
          <SendReceiptEmailButton receipt={receipt} />

          <Pressable
            style={[styles.secondaryButton, isDownloading && styles.buttonDisabled]}
            onPress={handleDownloadPdf}
            disabled={isDownloading}
          >
            {isDownloading ? (
              <ActivityIndicator color="#2386F5" />
            ) : (
              <>
                <Ionicons name="download-outline" size={19} color="#2386F5" />
                <Text style={styles.secondaryButtonText}>Descargar recibo en PDF</Text>
              </>
            )}
          </Pressable>
        </ScrollView>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.dashboardBg,
  },
  header: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 28,
    alignItems: "center",
  },
  successIcon: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: "#10B981",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 4,
    borderColor: "rgba(255,255,255,0.28)",
  },
  headerTitle: {
    marginTop: 12,
    color: "#FFFFFF",
    fontFamily: fontFamilies.bold,
    fontSize: 25,
  },
  headerSubtitle: {
    marginTop: 4,
    color: "#DEE1FF",
    fontFamily: fontFamilies.medium,
    fontSize: 13,
    textAlign: "center",
  },
  content: {
    flex: 1,
    marginTop: -14,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: colors.dashboardBg,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 118,
  },
  primaryButton: {
    marginTop: 18,
    height: 54,
    borderRadius: 18,
    backgroundColor: "#2386F5",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontFamily: fontFamilies.bold,
    fontSize: 15,
  },
  secondaryButton: {
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
  secondaryButtonText: {
    color: "#2386F5",
    fontFamily: fontFamilies.bold,
    fontSize: 15,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
});
