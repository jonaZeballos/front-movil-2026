import { useMemo, useState } from "react";
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

import { ScreenContainer } from "../../../shared/components/ScreenContainer";
import { colors } from "../../../shared/theme/colors";
import { fontFamilies } from "../../../shared/theme/fonts";
import { SaleProductItem } from "../components/SaleProductItem";
import { SaleSummaryBox } from "../components/SaleSummaryBox";
import { PaymentMethodSelector } from "../components/PaymentMethodSelector";
import { paymentMethods } from "../services/salesApi";

export function RegisterSaleScreen({ clientes = [], productos = [], onBack, onContinue }) {
  const clientesOptions = useMemo(() => {
    if (clientes.length > 0) return clientes;

    return [
      {
        id: "cliente-mostrador",
        nombres: "Cliente",
        apellidos: "Mostrador",
        email: "",
      },
    ];
  }, [clientes]);

  const [selectedClientId, setSelectedClientId] = useState(clientesOptions[0]?.id);
  const [quantities, setQuantities] = useState({});
  const [discount, setDiscount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState(paymentMethods[0]);

  const selectedClient = clientesOptions.find(
    (client) => client.id === selectedClientId
  );

  const selectedProducts = productos
    .map((product) => {
      const quantity = quantities[product.id] || 0;
      const unitPrice = Number(product.price || product.precio || 0);
      const total = quantity * unitPrice;

      return {
        ...product,
        name: product.name || product.nombre,
        quantity,
        unitPrice,
        total,
      };
    })
    .filter((product) => product.quantity > 0);

  const subtotal = selectedProducts.reduce((sum, item) => sum + item.total, 0);
  const discountAmount = Math.min(
    Number(String(discount).replace(",", ".")) || 0,
    subtotal
  );
  const total = Math.max(subtotal - discountAmount, 0);

  const updateQuantity = (productId, operation) => {
    setQuantities((prev) => {
      const current = prev[productId] || 0;
      const next = operation === "increment" ? current + 1 : Math.max(current - 1, 0);

      return {
        ...prev,
        [productId]: next,
      };
    });
  };

  const handleContinue = () => {
    if (!selectedClient) {
      Alert.alert("Cliente requerido", "Selecciona un cliente para registrar la venta.");
      return;
    }

    if (selectedProducts.length === 0) {
      Alert.alert("Productos requeridos", "Agrega al menos un producto o servicio.");
      return;
    }

    if (!paymentMethod) {
      Alert.alert("Método de pago", "Selecciona el método de pago de la venta.");
      return;
    }

    const saleDraft = {
      cliente: selectedClient,
      productos: selectedProducts,
      metodoPago: paymentMethod,
      subtotal,
      descuento: discountAmount,
      total,
      createdAt: new Date().toISOString(),
    };

    onContinue?.(saleDraft);
  };

  return (
    <ScreenContainer backgroundColor={colors.primary} edges={["top"]} keyboardAvoiding>
      <View style={styles.root}>
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={onBack}>
            <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
          </Pressable>

          <View>
            <Text style={styles.headerTitle}>Registrar venta</Text>
            <Text style={styles.headerSubtitle}>Selecciona cliente, productos y pago</Text>
          </View>

          <View style={styles.headerIcon}>
            <Ionicons name="cart-outline" size={24} color="#FFFFFF" />
          </View>
        </View>

        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.sectionTitle}>Cliente</Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.clientsRow}
          >
            {clientesOptions.map((client) => {
              const isSelected = client.id === selectedClientId;

              return (
                <Pressable
                  key={client.id}
                  style={[styles.clientChip, isSelected && styles.clientChipSelected]}
                  onPress={() => setSelectedClientId(client.id)}
                >
                  <Text
                    style={[
                      styles.clientChipText,
                      isSelected && styles.clientChipTextSelected,
                    ]}
                  >
                    {getClientName(client)}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          <Text style={styles.sectionTitle}>Productos y servicios</Text>

          {productos.length === 0 ? (
            <Text style={{ color: "#777782", fontFamily: fontFamilies.medium, fontSize: 13 }}>
              No hay productos registrados en inventario.
            </Text>
          ) : productos.map((product) => (
            <SaleProductItem
              key={product.id}
              product={{ ...product, name: product.name || product.nombre, price: product.price || product.precio }}
              quantity={quantities[product.id] || 0}
              onIncrement={() => updateQuantity(product.id, "increment")}
              onDecrement={() => updateQuantity(product.id, "decrement")}
            />
          ))}

          <Text style={styles.sectionTitle}>Método de pago</Text>

          <PaymentMethodSelector value={paymentMethod} onChange={setPaymentMethod} />

          <Text style={styles.sectionTitle}>Descuento</Text>

          <View style={styles.inputBox}>
            <Text style={styles.inputPrefix}>Bs</Text>
            <TextInput
              value={discount}
              onChangeText={setDiscount}
              placeholder="0.00"
              keyboardType="decimal-pad"
              style={styles.input}
              placeholderTextColor="#A6A6B0"
            />
          </View>

          <SaleSummaryBox
            subtotal={subtotal}
            discount={discountAmount}
            total={total}
          />

          <Pressable style={styles.primaryButton} onPress={handleContinue}>
            <Text style={styles.primaryButtonText}>Continuar al resumen</Text>
            <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
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
    paddingBottom: 140,
  },
  sectionTitle: {
    marginTop: 14,
    marginBottom: 10,
    color: "#111111",
    fontFamily: fontFamilies.bold,
    fontSize: 18,
  },
  clientsRow: {
    gap: 8,
    paddingRight: 16,
  },
  clientChip: {
    backgroundColor: "#FFFFFF",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderWidth: 1,
    borderColor: "#EFEFF5",
  },
  clientChipSelected: {
    backgroundColor: "#2386F5",
    borderColor: "#2386F5",
  },
  clientChipText: {
    color: "#777782",
    fontFamily: fontFamilies.medium,
    fontSize: 13,
  },
  clientChipTextSelected: {
    color: "#FFFFFF",
    fontFamily: fontFamilies.bold,
  },
  inputBox: {
    marginBottom: 14,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "#EFEFF5",
    flexDirection: "row",
    alignItems: "center",
  },
  inputPrefix: {
    color: "#2386F5",
    fontFamily: fontFamilies.bold,
    fontSize: 15,
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 48,
    color: "#111111",
    fontFamily: fontFamilies.semibold,
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
  primaryButtonText: {
    color: "#FFFFFF",
    fontFamily: fontFamilies.bold,
    fontSize: 16,
  },
});
