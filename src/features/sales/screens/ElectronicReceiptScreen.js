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
import { useNavigation } from "@react-navigation/native";

import { ScreenContainer } from "../../../shared/components/ScreenContainer";
import { colors } from "../../../shared/theme/colors";
import { fontFamilies } from "../../../shared/theme/fonts";
import { ElectronicReceiptCard } from "../components/ElectronicReceiptCard";
import { SendReceiptEmailButton } from "../components/SendReceiptEmailButton";
import { SendReceiptWhatsappButton } from "../components/SendReceiptWhatsappButton";
import { downloadReceiptPdf } from "../services/receiptPdf";

export function ElectronicReceiptScreen({ receipt, onBackToMainMenu, onBackToSales }) {
  const navigation = useNavigation();
  const [isDownloading, setIsDownloading] = useState(false);
  const handleBackToMainMenu = onBackToMainMenu || onBackToSales || (() => navigation.navigate("SalesDashboard"));

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
    <ScreenContainer backgroundColor={colors.dashboardBg} edges={["top"]}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable onPress={handleBackToMainMenu} style={styles.backButton}>
            <Ionicons name="arrow-back" size={22} color="#111827" />
          </Pressable>

          <View style={styles.headerText}>
            <Text style={styles.title}>Venta registrada</Text>
            <Text style={styles.subtitle}>
              El recibo electrónico fue generado correctamente
            </Text>
          </View>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
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
                <Ionicons name="share-social-outline" size={20} color="#2386F5" />
                <Text style={styles.secondaryButtonText}>Compartir PDF</Text>
              </>
            )}
          </Pressable>

          <Pressable style={styles.primaryButton} onPress={handleBackToMainMenu}>
            <Ionicons name="home-outline" size={20} color="#FFFFFF" />
            <Text style={styles.primaryButtonText}>Volver al menu principal</Text>
          </Pressable>
        </ScrollView>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 14,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    color: "#111827",
    fontFamily: fontFamilies.bold,
  },
  subtitle: {
    marginTop: 3,
    color: "#6B7280",
    fontSize: 13,
    fontFamily: fontFamilies.medium,
  },
  content: {
    paddingBottom: 118,
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
  primaryButton: {
    marginTop: 10,
    height: 52,
    borderRadius: 18,
    backgroundColor: colors.primary,
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
  buttonDisabled: {
    opacity: 0.7,
  },
});
