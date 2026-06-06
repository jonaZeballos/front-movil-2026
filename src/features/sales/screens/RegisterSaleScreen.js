import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import { ScreenContainer } from "../../../shared/components/ScreenContainer";
import { SearchInput } from "../../../shared/components/SearchInput";
import { colors } from "../../../shared/theme/colors";
import { fontFamilies } from "../../../shared/theme/fonts";
import { SaleProductItem } from "../components/SaleProductItem";
import { SaleSummaryBox } from "../components/SaleSummaryBox";
import { PaymentMethodSelector } from "../components/PaymentMethodSelector";
import { getBusinessPaymentSettings } from "../services/salesApi";

export function RegisterSaleScreen({ clientes = [], productos = [], onBack, onContinue }) {
  const navigation = useNavigation();

  const checkIsAdmin = (nav) => {
    if (!nav) return false;
    let currentNav = nav;
    while (currentNav) {
      const state = currentNav.getState();
      if (state?.routes) {
        for (const route of state.routes) {
          if (route.name === "AdminDashboard") return true;
          if (route.name === "SalesDashboard" || route.name === "Home") return false;
        }
      }
      currentNav = currentNav.getParent ? currentNav.getParent() : null;
    }
    return false;
  };

  const isAdmin = checkIsAdmin(navigation);

  const [selectedClientId, setSelectedClientId] = useState(null);
  const [clientModalVisible, setClientModalVisible] = useState(false);
  const [clientSearch, setClientSearch] = useState("");
  const [quantities, setQuantities] = useState({});
  const [quantityErrors, setQuantityErrors] = useState({});
  const [discount, setDiscount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [businessPayment, setBusinessPayment] = useState({ qrPagoUrl: "" });

  useEffect(() => {
    getBusinessPaymentSettings()
      .then(setBusinessPayment)
      .catch(() => setBusinessPayment({ qrPagoUrl: "" }));
  }, []);

  const filteredClients = useMemo(
    () => clientes.filter((client) => clientMatchesSearch(client, clientSearch)),
    [clientes, clientSearch]
  );

  const selectedClient = clientes.find(
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
      const product = productos.find((item) => String(item.id) === String(productId));
      const availableStock = Number(product?.stock ?? 0);
      const current = prev[productId] || 0;
      const next = operation === "increment"
        ? Math.min(current + 1, availableStock)
        : Math.max(current - 1, 0);

      return {
        ...prev,
        [productId]: next,
      };
    });
  };

  const setProductQuantity = (productId, rawValue) => {
    const product = productos.find((item) => String(item.id) === String(productId));
    const availableStock = Number(product?.stock ?? 0);
    const digits = String(rawValue || "").replace(/\D/g, "");
    const parsed = digits ? Number(digits) : 0;

    setQuantityErrors((prev) => {
      const next = { ...prev };
      if (parsed > availableStock) {
        next[productId] = "La cantidad no puede superar el stock disponible.";
      } else {
        delete next[productId];
      }
      return next;
    });

    setQuantities((prev) => ({
      ...prev,
      [productId]: Math.min(parsed, availableStock),
    }));
  };

  const handleContinue = () => {
    const rawDiscount = String(discount).trim();
    const parsedDiscount = Number(rawDiscount.replace(",", "."));

    if (!selectedClient) {
      Alert.alert("Cliente requerido", "Selecciona un cliente para registrar la venta.");
      return;
    }

    if (selectedProducts.length === 0) {
      Alert.alert("Productos requeridos", "Agrega al menos un producto del inventario.");
      return;
    }

    const invalidProduct = selectedProducts.find((product) => product.quantity > Number(product.stock ?? 0));
    if (invalidProduct) {
      Alert.alert("Stock insuficiente", `La cantidad de ${invalidProduct.name} supera el stock disponible.`);
      return;
    }

    if (!paymentMethod) {
      Alert.alert("Metodo de pago", "Seleccione un método de pago.");
      return;
    }

    if (paymentMethod.id === "qr" && !businessPayment.qrPagoUrl) {
      Alert.alert("QR no configurado", "El administrador debe configurar el QR de pago del negocio.");
      return;
    }

    if (rawDiscount && (!Number.isFinite(parsedDiscount) || parsedDiscount < 0)) {
      Alert.alert("Descuento invalido", "Ingresa un descuento valido mayor o igual a 0.");
      return;
    }

    if (parsedDiscount > subtotal) {
      Alert.alert("Descuento invalido", "El descuento no puede ser mayor al subtotal.");
      return;
    }

    const saleDraft = {
      cliente: selectedClient,
      productos: selectedProducts,
      metodoPago: paymentMethod,
      qrPagoUrl: paymentMethod.id === "qr" ? businessPayment.qrPagoUrl : "",
      subtotal,
      descuento: discountAmount,
      total,
      createdAt: new Date().toISOString(),
    };

    onContinue?.(saleDraft);
  };

  return (
    <ScreenContainer backgroundColor={colors.dashboardBg} edges={["top"]} keyboardAvoiding>
      <View style={styles.root}>
        <View style={styles.header}>
          <Pressable style={styles.backButton} onPress={onBack}>
            <Ionicons name="arrow-back" size={22} color="#111827" />
          </Pressable>

          <View style={styles.headerTextWrap}>
            <Text style={styles.headerTitle}>Registrar venta</Text>
            <Text style={styles.headerSubtitle}>Selecciona cliente, productos y pago</Text>
          </View>
        </View>

        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.sectionTitle}>Cliente</Text>

          <Pressable style={styles.clientPickerButton} onPress={() => setClientModalVisible(true)}>
            <Ionicons
              name="person-outline"
              size={19}
              color={selectedClient ? "#5655B9" : "#6B7280"}
            />
            <Text
              style={[
                styles.clientPickerTitle,
                !selectedClient && styles.clientPickerPlaceholder,
              ]}
              numberOfLines={1}
            >
              {selectedClient ? getClientName(selectedClient) : "Selecciona un cliente para la venta"}
            </Text>
            <Ionicons name="chevron-forward" size={20} color="#6B7280" />
          </Pressable>

          {selectedClient?.enListaNegra ? (
            <View style={styles.blacklistWarning}>
              <Ionicons name="warning" size={16} color="#B91C1C" />
              <Text style={styles.blacklistWarningText} numberOfLines={2}>
                Cliente en lista negra: {selectedClient.motivoListaNegra || "Sin motivo registrado"}
              </Text>
            </View>
          ) : null}

          <Text style={styles.sectionTitle}>Productos del inventario</Text>

          {productos.length === 0 ? (
            <Text style={{ color: "#777782", fontFamily: fontFamilies.medium, fontSize: 13 }}>
              No hay productos registrados en inventario.
            </Text>
          ) : productos.map((product) => (
            <SaleProductItem
              key={product.id}
              product={{ ...product, name: product.name || product.nombre, price: product.price || product.precio }}
              quantity={quantities[product.id] || 0}
              error={quantityErrors[product.id]}
              onIncrement={() => updateQuantity(product.id, "increment")}
              onDecrement={() => updateQuantity(product.id, "decrement")}
              onChangeQuantity={(value) => setProductQuantity(product.id, value)}
            />
          ))}

          <Text style={styles.sectionTitle}>Método de pago</Text>

          <PaymentMethodSelector value={paymentMethod} onChange={setPaymentMethod} />

          {paymentMethod?.id === "qr" ? (
            <View style={styles.qrBox}>
              {businessPayment.qrPagoUrl ? (
                <>
                  <Text style={styles.qrTitle}>QR de pago del negocio</Text>
                  <Image source={{ uri: businessPayment.qrPagoUrl }} style={styles.qrImage} resizeMode="contain" />
                </>
              ) : (
                <Text style={styles.qrEmpty}>El negocio no tiene QR de pago configurado.</Text>
              )}
            </View>
          ) : null}

          <Text style={styles.sectionTitle}>Descuento (opcional)</Text>

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

        <ClientPickerModal
          visible={clientModalVisible}
          clients={filteredClients}
          search={clientSearch}
          onSearch={setClientSearch}
          onClose={() => setClientModalVisible(false)}
          onSelect={(client) => {
            if (client.enListaNegra) {
              const motivo = client.motivoListaNegra || "Este cliente requiere revision del administrador.";
              if (isAdmin) {
                Alert.alert(
                  "Cliente en lista negra",
                  `Motivo: ${motivo}. ¿Deseas continuar de todas formas?`,
                  [
                    {
                      text: "Cancelar",
                      style: "cancel",
                    },
                    {
                      text: "Continuar",
                      onPress: () => {
                        setSelectedClientId(client.id);
                        setClientModalVisible(false);
                      },
                    },
                  ]
                );
              } else {
                Alert.alert(
                  "Cliente en lista negra",
                  `Motivo: ${motivo}. Solicita autorización del administrador para continuar.`,
                  [
                    {
                      text: "Entendido",
                      style: "default",
                    },
                  ]
                );
              }
            } else {
              setSelectedClientId(client.id);
              setClientModalVisible(false);
            }
          }}
        />
      </View>
    </ScreenContainer>
  );
}

function getClientName(client) {
  const fullName = [client?.nombres, client?.apellidos].filter(Boolean).join(" ").trim();
  return fullName || client?.nombre || client?.razonSocial || "Cliente";
}

function clientMatchesSearch(client, search) {
  const term = search.trim().toLowerCase();
  if (!term) return true;

  return [
    client?.nombres,
    client?.apellidos,
    client?.nombre,
    client?.razonSocial,
    client?.numeroDocumento,
    client?.documento,
    client?.telefono,
    client?.email,
    client?.correo,
    client?.direccion,
  ].filter(Boolean).join(" ").toLowerCase().includes(term);
}

function ClientPickerModal({ visible, clients, search, onSearch, onClose, onSelect }) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalCard}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Seleccionar cliente</Text>
            <Pressable onPress={onClose}>
              <Ionicons name="close" size={22} color="#111827" />
            </Pressable>
          </View>

          <SearchInput
            value={search}
            onChangeText={onSearch}
            placeholder="Buscar cliente por nombre, CI, telefono o correo"
            style={styles.modalSearch}
          />

          <FlatList
            data={clients}
            keyExtractor={(item) => String(item.id)}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.clientList}
            renderItem={({ item }) => (
              <Pressable style={styles.clientRow} onPress={() => onSelect(item)}>
                <View style={styles.clientIcon}>
                  <Ionicons name="person-outline" size={18} color={colors.primary} />
                </View>
                <View style={styles.clientRowText}>
                  <Text style={styles.clientName}>{getClientName(item)}</Text>
                  {item.enListaNegra ? (
                    <Text style={styles.clientBlacklist}>Lista negra</Text>
                  ) : null}
                  <Text style={styles.clientMeta}>
                    {item.numeroDocumento || "Sin documento"} · {item.telefono || "Sin telefono"}
                  </Text>
                  {!!item.direccion && <Text style={styles.clientAddress}>{item.direccion}</Text>}
                </View>
              </Pressable>
            )}
            ListEmptyComponent={
              <Text style={styles.modalEmpty}>
                {search.trim() ? "No se encontraron clientes." : "No hay clientes registrados."}
              </Text>
            }
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.dashboardBg,
  },
  header: {
    backgroundColor: colors.dashboardBg,
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTextWrap: {
    flex: 1,
  },
  headerTitle: {
    color: "#111827",
    fontFamily: fontFamilies.bold,
    fontSize: 23,
  },
  headerSubtitle: {
    marginTop: 2,
    color: "#6B7280",
    fontFamily: fontFamilies.medium,
    fontSize: 13,
  },
  content: {
    flex: 1,
    marginTop: 0,
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
  clientPickerButton: {
    height: 56,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  clientPickerTitle: {
    flex: 1,
    color: "#111111",
    fontFamily: fontFamilies.bold,
    fontSize: 14,
  },
  clientPickerPlaceholder: {
    color: "#9CA3AF",
    fontFamily: fontFamilies.medium,
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
    color: colors.primary,
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
  qrBox: {
    marginTop: 12,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 14,
    alignItems: "center",
  },
  qrTitle: {
    color: "#111827",
    fontFamily: fontFamilies.bold,
    fontSize: 14,
    marginBottom: 10,
  },
  qrImage: {
    width: "100%",
    height: 220,
    borderRadius: 14,
    backgroundColor: "#F9FAFB",
  },
  qrEmpty: {
    color: "#D14343",
    fontFamily: fontFamilies.medium,
    fontSize: 13,
    textAlign: "center",
    lineHeight: 18,
  },
  primaryButton: {
    marginTop: 18,
    height: 54,
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
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    alignItems: "center",
    justifyContent: "center",
    padding: 18,
  },
  modalCard: {
    width: "100%",
    maxHeight: "78%",
    borderRadius: 22,
    backgroundColor: "#FFFFFF",
    padding: 16,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  modalTitle: {
    color: "#111827",
    fontFamily: fontFamilies.bold,
    fontSize: 18,
  },
  modalSearch: {
    marginTop: 14,
  },
  clientList: {
    paddingTop: 10,
  },
  clientRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  clientIcon: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: "#EDEBFF",
    alignItems: "center",
    justifyContent: "center",
  },
  clientRowText: {
    flex: 1,
  },
  clientName: {
    color: "#111827",
    fontFamily: fontFamilies.bold,
    fontSize: 14,
  },
  clientBlacklist: {
    marginTop: 2,
    color: "#B91C1C",
    fontFamily: fontFamilies.bold,
    fontSize: 12,
  },
  clientMeta: {
    marginTop: 2,
    color: "#6B7280",
    fontFamily: fontFamilies.medium,
    fontSize: 12,
  },
  clientAddress: {
    marginTop: 2,
    color: "#6B7280",
    fontFamily: fontFamilies.medium,
    fontSize: 12,
  },
  modalEmpty: {
    textAlign: "center",
    color: "#6B7280",
    fontFamily: fontFamilies.medium,
    fontSize: 13,
    paddingVertical: 22,
  },
  blacklistWarning: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEE2E2",
    borderWidth: 1,
    borderColor: "#FCA5A5",
    borderRadius: 18,
    padding: 12,
    marginTop: 8,
    gap: 8,
  },
  blacklistWarningText: {
    flex: 1,
    color: "#B91C1C",
    fontFamily: fontFamilies.semibold,
    fontSize: 13,
  },
});
