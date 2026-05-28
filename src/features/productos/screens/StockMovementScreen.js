import { useRef, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { AppButton } from "../../../shared/components/buttons";
import { ScreenContainer } from "../../../shared/components/ScreenContainer";
import { colors } from "../../../shared/theme/colors";
import { stockMovementTypes, stockQuickReasons } from "../data/stockMock";
import { createStockMovement, getProductStock } from "../services";
import { StockQuantityInput } from "../components/StockQuantityInput";

export default function StockMovementScreen({
  navigation,
  product,
  onSaveMovement,
}) {
  const [type, setType] = useState("entrada");
  const [quantity, setQuantity] = useState("");
  const [reason, setReason] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const submitLockRef = useRef(false);

  const currentStock = getProductStock(product);

  const handleSave = async () => {
    if (submitLockRef.current || isSaving) return;

    try {
      submitLockRef.current = true;
      setIsSaving(true);

      const movement = createStockMovement({
        product,
        type,
        quantity,
        reason,
      });

      await onSaveMovement?.(movement);

      Alert.alert("Stock actualizado", "El movimiento fue registrado correctamente.", [
        {
          text: "Aceptar",
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      Alert.alert("No se pudo actualizar", error.message);
    } finally {
      submitLockRef.current = false;
      setIsSaving(false);
    }
  };

  if (!product) {
    return (
      <ScreenContainer backgroundColor={colors.dashboardBg} edges={["top"]}>
        <View style={styles.container}>
          <View style={styles.emptyCard}>
            <Ionicons name="alert-circle-outline" size={42} color="#9CA3AF" />
            <Text style={styles.emptyTitle}>Producto no disponible</Text>
            <AppButton
              title="Volver"
              onPress={() => navigation.goBack()}
              backgroundColor={colors.primary}
              borderRadius={18}
              minHeight={52}
            />
          </View>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer backgroundColor={colors.dashboardBg} edges={["top"]} keyboardAvoiding>
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={22} color="#111827" />
          </Pressable>

          <View style={styles.headerText}>
            <Text style={styles.title}>Movimiento de stock</Text>
            <Text style={styles.subtitle}>{product.nombre}</Text>
          </View>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.content}
        >
          <View style={styles.productCard}>
            <Text style={styles.productName}>{product.nombre}</Text>
            <Text style={styles.productDetail}>
              Marca: {product.marca || "Sin marca"} · Modelo: {product.modelo || "Sin modelo"}
            </Text>
            <Text style={styles.stockText}>Stock actual: {currentStock} unidades</Text>
          </View>

          <Text style={styles.sectionTitle}>Tipo de movimiento</Text>

          <View style={styles.typeGrid}>
            {stockMovementTypes.map((item) => {
              const selected = type === item.id;

              return (
                <Pressable
                  key={item.id}
                  onPress={() => setType(item.id)}
                  style={[styles.typeCard, selected && styles.typeCardSelected]}
                >
                  <Text style={[styles.typeTitle, selected && styles.typeTitleSelected]}>
                    {item.label}
                  </Text>
                  <Text style={styles.typeDescription}>{item.description}</Text>
                </Pressable>
              );
            })}
          </View>

          <StockQuantityInput
            label={type === "ajuste" ? "Nuevo stock" : "Cantidad"}
            value={quantity}
            onChangeText={setQuantity}
            placeholder={type === "ajuste" ? String(currentStock) : "0"}
          />

          <View style={styles.reasonBox}>
            <Text style={styles.reasonLabel}>Observación</Text>

            <TextInput
              value={reason}
              onChangeText={setReason}
              placeholder="Ej: compra, venta, devolución..."
              placeholderTextColor="#9CA3AF"
              style={styles.reasonInput}
              multiline
            />

            <View style={styles.quickReasons}>
              {stockQuickReasons.map((item) => (
                <Pressable
                  key={item}
                  onPress={() => setReason(item)}
                  style={styles.reasonChip}
                >
                  <Text style={styles.reasonChipText}>{item}</Text>
                </Pressable>
              ))}
            </View>
          </View>

          <AppButton
            title={isSaving ? "Guardando..." : "Guardar movimiento"}
            onPress={handleSave}
            backgroundColor={colors.primary}
            borderRadius={18}
            minHeight={54}
            disabled={isSaving}
          />
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
    fontSize: 23,
    fontWeight: "900",
    color: "#111827",
  },
  subtitle: {
    marginTop: 3,
    color: "#6B7280",
    fontSize: 13,
  },
  content: {
    paddingBottom: 140,
  },
  productCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 16,
    marginBottom: 16,
  },
  productName: {
    color: "#111827",
    fontSize: 17,
    fontWeight: "900",
  },
  productDetail: {
    marginTop: 4,
    color: "#6B7280",
    fontSize: 13,
  },
  stockText: {
    marginTop: 10,
    color: colors.primary,
    fontSize: 15,
    fontWeight: "900",
  },
  sectionTitle: {
    marginBottom: 10,
    color: "#111827",
    fontSize: 16,
    fontWeight: "900",
  },
  typeGrid: {
    marginBottom: 14,
    rowGap: 10,
  },
  typeCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  typeCardSelected: {
    borderColor: colors.primary,
    backgroundColor: "#EEF2FF",
  },
  typeTitle: {
    color: "#111827",
    fontSize: 15,
    fontWeight: "900",
  },
  typeTitleSelected: {
    color: colors.primary,
  },
  typeDescription: {
    marginTop: 3,
    color: "#6B7280",
    fontSize: 12,
  },
  reasonBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 15,
    marginBottom: 16,
  },
  reasonLabel: {
    marginBottom: 8,
    color: "#374151",
    fontSize: 12,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  reasonInput: {
    minHeight: 80,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#F9FAFB",
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 14,
    color: "#111827",
    textAlignVertical: "top",
  },
  quickReasons: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 12,
  },
  reasonChip: {
    borderRadius: 999,
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 11,
    paddingVertical: 7,
  },
  reasonChipText: {
    color: "#374151",
    fontSize: 12,
    fontWeight: "800",
  },
  emptyCard: {
    marginTop: 80,
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 22,
    alignItems: "center",
    rowGap: 12,
  },
  emptyTitle: {
    color: "#111827",
    fontSize: 18,
    fontWeight: "900",
  },
});
