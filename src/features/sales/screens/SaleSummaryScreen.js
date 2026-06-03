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
import { SaleSummaryBox } from "../components/SaleSummaryBox";
import {
  buildElectronicReceipt,
  createSale,
  formatCurrency,
  generateReceipt,
} from "../services/salesApi";
import { getRealEmail } from "../services/receiptFormatters";

export function SaleSummaryScreen({ saleDraft, user, onBack, onConfirm }) {
  const [isSaving, setIsSaving] = useState(false);

  const handleConfirm = async () => {
    if (!saleDraft) {
      Alert.alert("Venta no disponible", "No se encontraron datos de la venta.");
      return;
    }

    if (!saleDraft.metodoPago) {
      Alert.alert("Metodo de pago", "Seleccione un método de pago.");
      return;
    }

    setIsSaving(true);

    try {
      const savedSale = await createSale({
        clienteId: saleDraft.cliente?.id,
        clienteNombre: getClientName(saleDraft.cliente),
        productos: saleDraft.productos.map((item) => ({
          productoId: item.productoId || item.id,
          cantidad: item.quantity,
          precioUnitario: item.unitPrice,
          subtotal: item.total,
        })),
        metodoPago: saleDraft.metodoPago,
        subtotal: saleDraft.subtotal,
        descuento: saleDraft.descuento,
        total: saleDraft.total,
      });

      const saleId = savedSale?.id || savedSale?.ventaId;
      const receipt = saleId ? await generateReceipt(saleId) : null;

      const finalReceipt = receipt || buildElectronicReceipt(saleDraft, savedSale);

      onConfirm?.({
        ...finalReceipt,
        realizadoPor: finalReceipt.realizadoPor || user,
      });
    } catch (error) {
      Alert.alert("No se pudo registrar la venta", error.message || "Intenta nuevamente.");
    } finally {
      setIsSaving(false);
    }
  };

  if (!saleDraft) {
    return (
      <ScreenContainer backgroundColor={colors.primary} edges={["top"]}>
        <View style={styles.emptyRoot}>
          <Ionicons name="alert-circle-outline" size={54} color="#FFFFFF" />
          <Text style={styles.emptyTitle}>No hay venta para resumir</Text>
          <Pressable style={styles.emptyButton} onPress={onBack}>
            <Text style={styles.emptyButtonText}>Volver</Text>
          </Pressable>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer backgroundColor={colors.primary} edges={["top"]}>
      <View style={styles.root}>
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={onBack}>
            <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
          </Pressable>

          <View>
            <Text style={styles.headerTitle}>Resumen</Text>
            <Text style={styles.headerSubtitle}>Verifica los datos antes de confirmar</Text>
          </View>

          <View style={styles.headerIcon}>
            <Ionicons name="document-text-outline" size={24} color="#FFFFFF" />
          </View>
        </View>

        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.clientCard}>
            <Text style={styles.cardLabel}>Cliente</Text>
            <Text style={styles.clientName}>{getClientName(saleDraft.cliente)}</Text>
            <Text style={styles.clientMeta}>
              {getRealEmail(
                saleDraft.cliente?.email,
                saleDraft.cliente?.correo,
                saleDraft.cliente?.emailReal
              ) || "Sin correo registrado"}
            </Text>
          </View>

          <Text style={styles.sectionTitle}>Detalle de productos</Text>

          {saleDraft.productos.map((item) => (
            <View key={item.id} style={styles.productCard}>
              <View style={styles.productInfo}>
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.productMeta}>
                  {item.quantity} x {formatCurrency(item.unitPrice)}
                </Text>
              </View>

              <Text style={styles.productTotal}>{formatCurrency(item.total)}</Text>
            </View>
          ))}

          <View style={styles.paymentCard}>
            <View style={styles.paymentIcon}>
              <Ionicons
                name={saleDraft.metodoPago?.iconName || "cash-outline"}
                size={22}
                color="#2386F5"
              />
            </View>

            <View>
              <Text style={styles.cardLabel}>Método de pago</Text>
              <Text style={styles.paymentText}>{saleDraft.metodoPago?.label || "No registrado"}</Text>
            </View>
          </View>

          <SaleSummaryBox
            subtotal={saleDraft.subtotal}
            discount={saleDraft.descuento}
            total={saleDraft.total}
          />

          <Pressable
            style={[styles.primaryButton, isSaving && styles.primaryButtonDisabled]}
            onPress={handleConfirm}
            disabled={isSaving}
          >
            {isSaving ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Text style={styles.primaryButtonText}>Confirmar y generar recibo</Text>
                <Ionicons name="receipt-outline" size={20} color="#FFFFFF" />
              </>
            )}
          </Pressable>
        </ScrollView>
      </View>
    </ScreenContainer>
  );
}

function getClientName(client) {
  const fullName = [client?.nombres, client?.apellidos].filter(Boolean).join(" ").trim();
  return fullName || client?.nombre || client?.razonSocial || "Cliente";
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.dashboardBg,
  },
  header: {
    backgroundColor: colors.primary,
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 24,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(255,255,255,0.14)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    color: "#FFFFFF",
    fontFamily: fontFamilies.bold,
    fontSize: 23,
  },
  headerSubtitle: {
    marginTop: 2,
    color: "#DEE1FF",
    fontFamily: fontFamilies.medium,
    fontSize: 13,
  },
  headerIcon: {
    marginLeft: "auto",
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "rgba(255,255,255,0.14)",
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flex: 1,
    marginTop: -8,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    backgroundColor: colors.dashboardBg,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 34,
  },
  clientCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "#EFEFF5",
  },
  cardLabel: {
    color: "#8B8B96",
    fontFamily: fontFamilies.medium,
    fontSize: 12,
  },
  clientName: {
    marginTop: 4,
    color: "#111111",
    fontFamily: fontFamilies.bold,
    fontSize: 18,
  },
  clientMeta: {
    marginTop: 3,
    color: "#777782",
    fontFamily: fontFamilies.medium,
    fontSize: 13,
  },
  sectionTitle: {
    marginTop: 18,
    marginBottom: 10,
    color: "#111111",
    fontFamily: fontFamilies.bold,
    fontSize: 18,
  },
  productCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#EFEFF5",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    color: "#111111",
    fontFamily: fontFamilies.semibold,
    fontSize: 15,
  },
  productMeta: {
    marginTop: 4,
    color: "#8B8B96",
    fontFamily: fontFamilies.medium,
    fontSize: 12,
  },
  productTotal: {
    color: "#2386F5",
    fontFamily: fontFamilies.bold,
    fontSize: 16,
  },
  paymentCard: {
    marginTop: 6,
    marginBottom: 14,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "#EFEFF5",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  paymentIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#EEF5FF",
    alignItems: "center",
    justifyContent: "center",
  },
  paymentText: {
    marginTop: 3,
    color: "#111111",
    fontFamily: fontFamilies.bold,
    fontSize: 15,
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
  primaryButtonDisabled: {
    opacity: 0.7,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontFamily: fontFamilies.bold,
    fontSize: 15,
  },
  emptyRoot: {
    flex: 1,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  emptyTitle: {
    marginTop: 14,
    color: "#FFFFFF",
    fontFamily: fontFamilies.bold,
    fontSize: 20,
    textAlign: "center",
  },
  emptyButton: {
    marginTop: 18,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  emptyButtonText: {
    color: colors.primary,
    fontFamily: fontFamilies.bold,
    fontSize: 14,
  },
});
