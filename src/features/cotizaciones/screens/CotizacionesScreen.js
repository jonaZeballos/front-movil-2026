import { useMemo, useState } from "react";
import { Alert, FlatList, Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";

import { ScreenContainer } from "../../../shared/components/ScreenContainer";
import { SearchInput } from "../../../shared/components/SearchInput";
import { colors } from "../../../shared/theme/colors";
import { bottomActionMargin } from "../../../shared/styles/bottomActions";
import { OrderQuotationCard } from "../components/OrderQuotationCard";
import {
  getClienteNombre,
  getCotizacionValidoHasta,
  getEquipoNombre,
  isCotizacionActiva,
  toDisplayText,
} from "../utils/quotationFormatters";
import { normalizeOrderState } from "../../orders/utils/orderStates";

export function CotizacionesScreen({ orders = [], onBack, onGenerateQuotation, onViewQuotation }) {
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [selectedOrderIds, setSelectedOrderIds] = useState([]);
  const [clientPickerVisible, setClientPickerVisible] = useState(false);
  const [clientSearch, setClientSearch] = useState("");
  const quoteableOrders = orders.map(mapOrderForQuotation).filter((order) => {
    const status = normalizeOrderState(order.status || order.estado);
    return status !== "entregado" && status !== "sin_solucion" && status !== "cancelado";
  });
  const clients = useMemo(() => getClientsFromOrders(quoteableOrders), [quoteableOrders]);
  const filteredClients = useMemo(
    () => clients.filter((client) => clientMatchesSearch(client, clientSearch)),
    [clientSearch, clients]
  );
  const selectedClient = clients.find((client) => client.id === selectedClientId);
  const visibleOrders = selectedClientId
    ? quoteableOrders.filter((order) => getOrderClientKey(order) === selectedClientId)
    : [];
  const selectedOrders = visibleOrders.filter((order) => selectedOrderIds.includes(order.id));

  const handleSelectClient = (clientId) => {
    setSelectedClientId(clientId);
    setSelectedOrderIds([]);
    setClientPickerVisible(false);
  };

  const toggleOrder = (order) => {
    if (order.cotizacionActiva) {
      Alert.alert(
        "Cotizacion activa",
        "Esta orden ya tiene una cotizacion activa. Se abrira la cotizacion existente.",
        [{ text: "Ver cotizacion", onPress: () => onViewQuotation?.(order.cotizacion) }]
      );
      return;
    }

    setSelectedOrderIds((prev) =>
      prev.includes(order.id) ? prev.filter((id) => id !== order.id) : [...prev, order.id]
    );
  };

  const handleGenerate = () => {
    if (!selectedClientId) {
      Alert.alert("Cliente obligatorio", "Selecciona un cliente para ver sus ordenes cotizables.");
      return;
    }

    if (!selectedOrders.length) {
      Alert.alert("Orden obligatoria", "Selecciona una o mas ordenes para generar la cotizacion.");
      return;
    }

    if (selectedOrders.some((order) => order.cotizacionVencida)) {
      Alert.alert(
        "Cotizacion vencida",
        "Una cotizacion anterior vencio. Puedes generar una nueva cotizacion para la seleccion actual."
      );
    }

    onGenerateQuotation?.(selectedOrders[0], selectedOrders);
  };

  return (
    <ScreenContainer backgroundColor={colors.dashboardBg} edges={["top"]}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable onPress={onBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={22} color="#111827" />
          </Pressable>

          <View style={styles.headerText}>
            <Text style={styles.title}>Cotizaciones</Text>
            <Text style={styles.subtitle}>Ordenes listas para cotizar</Text>
          </View>
        </View>

        <View style={styles.clientSection}>
          <Text style={styles.sectionTitle}>Cliente</Text>
          <Pressable
            style={styles.clientPickerButton}
            onPress={() => setClientPickerVisible(true)}
          >
            <Feather name="user" size={18} color={selectedClient ? "#5655B9" : "#6B7280"} />
            <Text
              style={[
                styles.clientPickerTitle,
                !selectedClient && styles.clientPickerPlaceholder,
              ]}
              numberOfLines={1}
            >
              {selectedClient
                ? selectedClient.name
                : "Selecciona un cliente para ver sus órdenes"}
            </Text>
            <Ionicons name="chevron-forward" size={20} color="#6B7280" />
          </Pressable>
        </View>

        {!!selectedClientId && (
          <Text style={styles.selectionText}>
            {selectedOrders.length} orden{selectedOrders.length === 1 ? "" : "es"} seleccionada{selectedOrders.length === 1 ? "" : "s"}
          </Text>
        )}

        <FlatList
          data={visibleOrders}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <OrderQuotationCard
              order={item}
              selected={selectedOrderIds.includes(item.id)}
              onSelect={() => toggleOrder(item)}
            />
          )}
          ListEmptyComponent={
            <View style={styles.emptyCard}>
              <Ionicons name="document-text-outline" size={42} color="#9CA3AF" />
              <Text style={styles.emptyTitle}>
                {selectedClientId ? "No hay ordenes para este cliente" : "No hay clientes con ordenes"}
              </Text>
              <Text style={styles.emptyText}>
                {selectedClientId
                  ? "Este cliente no tiene ordenes disponibles para cotizar."
                  : "Registra ordenes de servicio para generar cotizaciones."}
              </Text>
            </View>
          }
        />

        <Pressable style={styles.createButton} onPress={handleGenerate}>
          <Ionicons name="add" size={22} color="#FFFFFF" />
          <Text style={styles.createButtonText}>
            {selectedOrders.length > 1 ? "Generar cotizacion agrupada" : "Generar cotizacion"}
          </Text>
        </Pressable>

        <ClientPickerModal
          visible={clientPickerVisible}
          clients={filteredClients}
          search={clientSearch}
          onSearch={setClientSearch}
          onSelect={handleSelectClient}
          onClose={() => setClientPickerVisible(false)}
        />
      </View>
    </ScreenContainer>
  );
}

function getClientsFromOrders(orders) {
  const map = new Map();
  orders.forEach((order) => {
    const id = getOrderClientKey(order);
    if (!id) return;
    if (!map.has(id)) {
      map.set(id, {
        id,
        name: getClienteNombre(order.cliente || order.clientName),
        searchText: buildClientSearchText(order),
        count: 0,
      });
    }
    map.get(id).count += 1;
  });
  return Array.from(map.values());
}

function clientMatchesSearch(client, search) {
  const term = search.trim().toLowerCase();
  if (!term) return true;
  return String(client.searchText || client.name || "").toLowerCase().includes(term);
}

function buildClientSearchText(order) {
  const cliente = order.clienteOriginal || order.cliente || {};
  if (typeof cliente !== "object") {
    return [order.clientName, cliente].filter(Boolean).join(" ");
  }
  return [
    cliente.nombre,
    cliente.razonSocial,
    cliente.nombres,
    cliente.apellidos,
    cliente.numeroDocumento,
    cliente.documento,
    cliente.telefono,
    cliente.email,
    cliente.correo,
    order.clientName,
  ].filter(Boolean).join(" ");
}

function ClientPickerModal({ visible, clients, search, onSearch, onSelect, onClose }) {
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
            placeholder="Buscar cliente por nombre, CI o telefono"
            style={styles.modalSearch}
          />
          <FlatList
            data={clients}
            keyExtractor={(item) => item.id}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.modalList}
            renderItem={({ item }) => (
              <Pressable style={styles.clientRow} onPress={() => onSelect(item.id)}>
                <View style={styles.clientRowIcon}>
                  <Ionicons name="person-outline" size={18} color={colors.primary} />
                </View>
                <View style={styles.clientRowText}>
                  <Text style={styles.clientRowTitle}>{item.name}</Text>
                  <Text style={styles.clientRowMeta}>
                    {item.count} orden{item.count === 1 ? "" : "es"} disponible{item.count === 1 ? "" : "s"}
                  </Text>
                </View>
              </Pressable>
            )}
            ListEmptyComponent={
              <Text style={styles.modalEmpty}>No hay clientes con ordenes disponibles.</Text>
            }
          />
        </View>
      </View>
    </Modal>
  );
}

function getOrderClientKey(order) {
  const cliente = order.clienteOriginal || order.cliente;
  if (cliente && typeof cliente === "object") {
    return cliente.id || cliente.idUsuario || cliente.email || cliente.telefono || cliente.nombre;
  }
  return String(order.clientName || cliente || "").trim();
}

function mapOrderForQuotation(order) {
  const baseCotizacion = order.cotizacion || order.cotizaciones?.[0] || null;
  const orderResumen = {
    id: order.id,
    codigo: toDisplayText(order.code || order.codigo, "Sin codigo"),
    cliente: getClienteNombre(order.cliente || order.clientName),
    equipo: getEquipoNombre(order.equipo || order.equipmentName),
    falla: toDisplayText(order.failure || order.falla || order.diagnostico, "Sin diagnostico"),
    diagnostico: toDisplayText(order.diagnostico || order.failure || order.falla, "Sin diagnostico"),
  };
  const cotizacion = baseCotizacion
    ? {
        ...baseCotizacion,
        ordenId: baseCotizacion.ordenId || order.id,
        order: baseCotizacion.order || baseCotizacion.orden || orderResumen,
        orden: baseCotizacion.orden || baseCotizacion.order || orderResumen,
      }
    : null;
  const activa = isCotizacionActiva(cotizacion);

  return {
    ...order,
    ...orderResumen,
    clienteOriginal: order.cliente,
    estado: toDisplayText(order.status || order.estado, "Recibido"),
    cotizacion,
    cotizacionActiva: activa,
    cotizacionVencida: !!cotizacion && !activa,
    cotizacionValidoHasta: getCotizacionValidoHasta(cotizacion),
  };
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
    fontWeight: "900",
    color: "#111827",
  },
  subtitle: {
    marginTop: 3,
    color: "#6B7280",
    fontSize: 13,
  },
  clientSection: {
    marginBottom: 12,
  },
  sectionTitle: {
    marginBottom: 8,
    color: "#111827",
    fontSize: 14,
    fontWeight: "900",
  },
  clientPickerButton: {
    height: 56,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    columnGap: 10,
  },
  clientPickerTitle: {
    flex: 1,
    color: "#111827",
    fontSize: 14,
    fontWeight: "700",
  },
  clientPickerPlaceholder: {
    color: "#9CA3AF",
    fontWeight: "500",
  },
  selectionText: {
    marginBottom: 10,
    color: "#4B5563",
    fontSize: 13,
    fontWeight: "800",
  },
  listContent: {
    paddingBottom: 128,
  },
  createButton: {
    height: 54,
    borderRadius: 18,
    backgroundColor: colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    columnGap: 8,
    marginTop: 10,
    marginBottom: bottomActionMargin,
  },
  createButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },
  emptyCard: {
    marginTop: 30,
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 22,
    alignItems: "center",
    rowGap: 10,
  },
  emptyTitle: {
    color: "#111827",
    fontSize: 18,
    fontWeight: "900",
  },
  emptyText: {
    color: "#6B7280",
    fontSize: 13,
    lineHeight: 19,
    textAlign: "center",
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
    justifyContent: "space-between",
    alignItems: "center",
  },
  modalTitle: {
    color: "#111827",
    fontSize: 18,
    fontWeight: "900",
  },
  modalSearch: {
    marginTop: 14,
  },
  modalList: {
    paddingTop: 10,
  },
  clientRow: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 10,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  clientRowIcon: {
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
  clientRowTitle: {
    color: "#111827",
    fontSize: 14,
    fontWeight: "900",
  },
  clientRowMeta: {
    marginTop: 2,
    color: "#6B7280",
    fontSize: 12,
  },
  modalEmpty: {
    textAlign: "center",
    color: "#6B7280",
    fontSize: 13,
    paddingVertical: 22,
  },
});
