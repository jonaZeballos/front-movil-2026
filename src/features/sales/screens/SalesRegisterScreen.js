import { useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { ScreenContainer } from "../../../shared/components/ScreenContainer";
import { colors } from "../../../shared/theme/colors";
import { bottomActionMargin } from "../../../shared/styles/bottomActions";
import { listProductos } from "../../productos/services/productosApi";
import { createVenta } from "../services/salesApi";

export function SalesRegisterScreen({ onBack }) {
  const [productos, setProductos] = useState([]);
  const [clienteNombre, setClienteNombre] = useState("");
  const [selectedItems, setSelectedItems] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const isSavingRef = useRef(false);

  useEffect(() => {
    listProductos()
      .then(setProductos)
      .catch((error) => Alert.alert("Error", error.message || "No se pudo cargar el inventario."));
  }, []);

  const items = useMemo(
    () =>
      Object.entries(selectedItems)
        .filter(([, cantidad]) => cantidad > 0)
        .map(([productoId, cantidad]) => {
          const producto = productos.find((item) => item.id === productoId);
          return {
            productoId,
            cantidad,
            precioUnitario: Number(producto?.precio || 0),
          };
        }),
    [productos, selectedItems]
  );

  const total = items.reduce((sum, item) => sum + item.cantidad * item.precioUnitario, 0);

  const updateQuantity = (producto, delta) => {
    if (isSavingRef.current) return;

    setSelectedItems((prev) => {
      const current = prev[producto.id] || 0;
      const next = Math.max(0, Math.min(producto.stock, current + delta));
      return { ...prev, [producto.id]: next };
    });
  };

  const handleSave = async () => {
    if (isSavingRef.current) return;

    if (!items.length) {
      Alert.alert("Productos obligatorios", "Selecciona al menos un producto para registrar la venta.");
      return;
    }

    try {
      isSavingRef.current = true;
      setIsSaving(true);
      const venta = await createVenta({ clienteNombre, items });
      Alert.alert("Venta registrada", `Recibo electronico ${venta.reciboCodigo}`);
      onBack?.();
    } catch (error) {
      Alert.alert("Error", error.message || "No se pudo registrar la venta.");
    } finally {
      isSavingRef.current = false;
      setIsSaving(false);
    }
  };

  return (
    <ScreenContainer backgroundColor={colors.dashboardBg} edges={["top"]}>
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable onPress={onBack} style={styles.backButton} disabled={isSaving}>
            <Ionicons name="arrow-back" size={22} color="#111827" />
          </Pressable>
          <View style={styles.headerText}>
            <Text style={styles.title}>Registrar venta</Text>
            <Text style={styles.subtitle}>Selecciona productos disponibles</Text>
          </View>
        </View>

        <TextInput
          value={clienteNombre}
          onChangeText={setClienteNombre}
          placeholder="Nombre del cliente (opcional)"
          placeholderTextColor="#8C8C8C"
          style={styles.input}
          editable={!isSaving}
        />

        <FlatList
          data={productos}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          keyboardShouldPersistTaps="handled"
          renderItem={({ item }) => {
            const quantity = selectedItems[item.id] || 0;

            return (
              <View style={styles.productCard}>
                <View style={styles.productInfo}>
                  <Text style={styles.productName}>{item.nombre}</Text>
                  <Text style={styles.productMeta}>Stock: {item.stock} | Bs. {Number(item.precio).toFixed(2)}</Text>
                </View>
                <View style={styles.stepper}>
                  <Pressable
                    style={[styles.stepButton, isSaving && styles.disabledButton]}
                    onPress={() => updateQuantity(item, -1)}
                    disabled={isSaving}
                  >
                    <Text style={styles.stepText}>-</Text>
                  </Pressable>
                  <Text style={styles.quantity}>{quantity}</Text>
                  <Pressable
                    style={[styles.stepButton, isSaving && styles.disabledButton]}
                    onPress={() => updateQuantity(item, 1)}
                    disabled={isSaving}
                  >
                    <Text style={styles.stepText}>+</Text>
                  </Pressable>
                </View>
              </View>
            );
          }}
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <Text style={styles.emptyTitle}>No hay productos para vender</Text>
              <Text style={styles.emptyText}>Registra productos en inventario primero.</Text>
            </View>
          }
        />

        <View style={styles.totalBox}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>Bs. {total.toFixed(2)}</Text>
        </View>

        <Pressable
          style={[styles.createButton, isSaving && styles.disabledButton]}
          onPress={handleSave}
          disabled={isSaving}
        >
          <Text style={styles.createButtonText}>{isSaving ? "Registrando..." : "Generar recibo"}</Text>
        </Pressable>
      </View>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 14,
  },
  keyboardContainer: {
    flex: 1,
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
    fontWeight: "900",
    color: "#111827",
  },
  subtitle: {
    marginTop: 3,
    fontSize: 13,
    color: "#6B7280",
  },
  input: {
    minHeight: 52,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 14,
    marginBottom: 14,
    color: "#111827",
  },
  listContent: {
    paddingBottom: 128,
  },
  productCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 14,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    color: "#111827",
    fontSize: 15,
    fontWeight: "800",
  },
  productMeta: {
    marginTop: 4,
    color: "#6B7280",
    fontSize: 12,
  },
  stepper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  stepButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  stepText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "900",
  },
  quantity: {
    minWidth: 26,
    minHeight: 24,
    textAlign: "center",
    color: "#111827",
    fontSize: 16,
    lineHeight: 20,
    fontWeight: "900",
    includeFontPadding: false,
  },
  emptyBox: {
    marginTop: 40,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 20,
    alignItems: "center",
  },
  emptyTitle: {
    color: "#111827",
    fontSize: 16,
    fontWeight: "800",
  },
  emptyText: {
    marginTop: 4,
    color: "#6B7280",
    fontSize: 13,
  },
  totalBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  totalLabel: {
    color: "#6B7280",
    fontSize: 13,
    fontWeight: "800",
  },
  totalValue: {
    color: colors.primary,
    fontSize: 20,
    fontWeight: "900",
  },
  createButton: {
    height: 54,
    borderRadius: 18,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: bottomActionMargin,
  },
  createButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "900",
  },
  disabledButton: {
    opacity: 0.65,
  },
});
