import { useRef, useState } from "react";
import {
  ActivityIndicator,
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
import { ShareQuotationButton } from "../../cotizaciones/components/ShareQuotationButton";
import { ShareQuotationPdfButton } from "../../cotizaciones/components/ShareQuotationPdfButton";
import {
  formatQuotationDate,
  formatQuotationMoney,
  getClienteNombre,
  getCotizacionValidoHasta,
  getEquipoNombre,
  getQuotationPhone,
  getQuotationSubtotal,
  isCotizacionActiva,
  toDisplayText,
} from "../../cotizaciones/utils/quotationFormatters";
import { StatusBadge } from "../components/StatusBadge";
import { orderStatuses } from "../services/ordersApi";

export function OrderDetailScreen({
  order,
  onBack,
  onUpdateStatus,
  onAddObservation,
  onViewQuotation,
  onGenerateQuotation,
}) {
  const [observation, setObservation] = useState("");
  const [savingStatus, setSavingStatus] = useState(null);
  const [isSavingObservation, setIsSavingObservation] = useState(false);
  const statusLockRef = useRef(false);
  const observationLockRef = useRef(false);

  if (!order) {
    return (
      <ScreenContainer backgroundColor={colors.dashboardBg} edges={["top"]}>
        <View style={styles.container}>
          <Text style={styles.title}>Orden no encontrada</Text>
          <Pressable style={styles.primaryButton} onPress={onBack}>
            <Text style={styles.primaryButtonText}>Volver</Text>
          </Pressable>
        </View>
      </ScreenContainer>
    );
  }

  const handleAddObservation = async () => {
    if (observationLockRef.current || isSavingObservation) return;

    if (!observation.trim()) {
      Alert.alert("Observación vacía", "Ingresa una observación válida.");
      return;
    }

    observationLockRef.current = true;
    setIsSavingObservation(true);

    try {
      await onAddObservation(order.id, observation.trim());
      setObservation("");
    } catch (error) {
      Alert.alert("No se pudo guardar", error.message || "Intenta nuevamente.");
      return;
    } finally {
      observationLockRef.current = false;
      setIsSavingObservation(false);
    }
    Alert.alert("Confirmación", "La observación fue agregada correctamente.");
  };

  const handleUpdateStatus = async (status) => {
    if (statusLockRef.current || savingStatus || order.status === status) return;

    statusLockRef.current = true;
    setSavingStatus(status);

    try {
      await onUpdateStatus(order.id, status);
      Alert.alert("Confirmacion", "El estado fue actualizado correctamente.");
    } catch (error) {
      Alert.alert("No se pudo actualizar", error.message || "Intenta nuevamente.");
    } finally {
      statusLockRef.current = false;
      setSavingStatus(null);
    }
  };

  const quotation = order.cotizacion ? buildOrderQuotation(order) : null;
  const quotationActive = isCotizacionActiva(quotation);
  const validoHasta = getCotizacionValidoHasta(quotation);

  return (
    <ScreenContainer backgroundColor={colors.dashboardBg} edges={["top"]} keyboardAvoiding>
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable onPress={onBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={22} color="#111827" />
          </Pressable>

          <View style={styles.headerText}>
            <Text style={styles.title}>Detalle de orden</Text>
            <Text style={styles.subtitle}>{order.code}</Text>
          </View>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Información principal</Text>

            <InfoRow label="Cliente" value={order.clientName} />
            <InfoRow label="Equipo" value={order.equipmentName} />
            <InfoRow label="Serie" value={order.equipmentSerial} />
            <InfoRow label="Falla reportada" value={order.failure} />

            <View style={styles.statusCurrent}>
              <Text style={styles.label}>Estado actual</Text>
              <StatusBadge status={order.status} />
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Actualizar estado</Text>

            <View style={styles.statusGrid}>
              {orderStatuses.map((status) => {
                const active = order.status === status;

                return (
                  <Pressable
                    key={status}
                    style={[
                      styles.statusButton,
                      active && styles.statusButtonActive,
                      savingStatus && styles.disabledButton,
                    ]}
                    onPress={() => handleUpdateStatus(status)}
                    disabled={Boolean(savingStatus)}
                  >
                    {savingStatus === status ? (
                      <ActivityIndicator size="small" color={active ? "#FFFFFF" : "#5655B9"} />
                    ) : (
                      <Text style={[styles.statusButtonText, active && styles.statusButtonTextActive]}>
                        {status}
                      </Text>
                    )}
                  </Pressable>
                );
              })}
            </View>
          </View>

          {quotation ? (
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Cotizacion asociada</Text>
              <View style={[styles.noticeBox, quotationActive ? styles.noticeActive : styles.noticeExpired]}>
                <Text style={styles.noticeText}>
                  {quotationActive
                    ? "Esta orden ya tiene una cotizacion activa"
                    : "Cotizacion vencida"}
                </Text>
              </View>

              <InfoRow label="Numero" value={quotation.numero} />
              <InfoRow label="Fecha de emision" value={formatQuotationDate(quotation.fechaEmision || quotation.fechaCreacion)} />
              <InfoRow label="Fecha de validez" value={formatQuotationDate(validoHasta)} />
              <InfoRow label="Estado" value={quotationActive ? "Activa" : "Vencida"} />
              <InfoRow label="Cliente" value={getClienteNombre(quotation.cliente || order.cliente || order.clientName)} />
              <InfoRow label="Telefono" value={getQuotationPhone(quotation)} />
              <InfoRow label="Descripcion" value={quotation.descripcion} />
              <InfoRow label="Mano de obra" value={formatQuotationMoney(quotation.manoObra)} />
              <InfoRow label="Repuestos/productos" value={formatQuotationMoney(quotation.repuestos)} />
              <InfoRow label="Subtotal" value={formatQuotationMoney(getQuotationSubtotal(quotation))} />
              <InfoRow label="Descuento" value={formatQuotationMoney(quotation.descuento)} />
              <InfoRow label="Total" value={formatQuotationMoney(quotation.total)} />
              <InfoRow label="Observaciones" value={quotation.observaciones || "Sin observaciones"} />
              <Text style={styles.validityText}>
                Cotizacion valida hasta {formatQuotationDate(validoHasta)}.
              </Text>

              <View style={styles.quotationActions}>
                <Pressable style={styles.secondaryButton} onPress={() => onViewQuotation?.(quotation)}>
                  <Text style={styles.secondaryButtonText}>Ver cotizacion completa</Text>
                </Pressable>
                <ShareQuotationButton quotation={quotation} />
                <ShareQuotationPdfButton quotation={quotation} />
                {!quotationActive ? (
                  <Pressable style={styles.primaryButton} onPress={() => onGenerateQuotation?.(order)}>
                    <Text style={styles.primaryButtonText}>Generar nueva cotizacion</Text>
                  </Pressable>
                ) : null}
              </View>
            </View>
          ) : (
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>Cotizacion</Text>
              <Text style={styles.emptyText}>Esta orden aun no tiene cotizacion asociada.</Text>
              <Pressable style={styles.primaryButton} onPress={() => onGenerateQuotation?.(order)}>
                <Text style={styles.primaryButtonText}>Generar cotizacion</Text>
              </Pressable>
            </View>
          )}

          <View style={styles.card}>
            <Text style={styles.sectionTitle}>Observaciones</Text>

            {order.observations?.length ? (
              order.observations.map((item, index) => (
                <View key={`${item}-${index}`} style={styles.observationItem}>
                  <Text style={styles.observationText}>{item}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.emptyText}>Aún no hay observaciones registradas.</Text>
            )}

            <TextInput
              value={observation}
              onChangeText={setObservation}
              placeholder="Agregar observación del servicio..."
              multiline
              style={styles.input}
            />

            <Pressable
              style={[styles.primaryButton, isSavingObservation && styles.disabledButton]}
              onPress={handleAddObservation}
              disabled={isSavingObservation}
            >
              {isSavingObservation ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.primaryButtonText}>Agregar observacion</Text>
              )}
            </Pressable>
          </View>
        </ScrollView>
      </View>
    </ScreenContainer>
  );
}

function InfoRow({ label, value }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{toDisplayText(value)}</Text>
    </View>
  );
}

function buildOrderQuotation(order) {
  const orderSummary = {
    id: order.id,
    codigo: order.codigo || order.code,
    code: order.code || order.codigo,
    cliente: order.cliente || { nombre: order.clientName },
    clientName: order.clientName,
    equipo: order.equipo || { nombre: order.equipmentName, nroSerie: order.equipmentSerial },
    equipmentName: order.equipmentName,
    diagnostico: order.diagnostico || order.failure,
    failure: order.failure || order.diagnostico,
    negocio: order.negocio,
  };

  return {
    ...order.cotizacion,
    ordenId: order.cotizacion.ordenId || order.id,
    cliente: order.cotizacion.cliente || orderSummary.cliente,
    equipo: order.cotizacion.equipo || orderSummary.equipo,
    negocio: order.cotizacion.negocio || orderSummary.negocio,
    order: order.cotizacion.order || order.cotizacion.orden || orderSummary,
    orden: order.cotizacion.orden || order.cotizacion.order || orderSummary,
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
    fontSize: 13,
    color: "#6B7280",
  },
  scrollContent: {
    paddingBottom: 140,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "900",
    color: "#111827",
    marginBottom: 14,
  },
  infoRow: {
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 4,
  },
  value: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
  },
  statusCurrent: {
    marginTop: 4,
  },
  statusGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  statusButton: {
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 999,
    backgroundColor: "#F3F4F6",
  },
  statusButtonActive: {
    backgroundColor: "#5655B9",
  },
  statusButtonText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#374151",
  },
  statusButtonTextActive: {
    color: "#FFFFFF",
  },
  observationItem: {
    backgroundColor: "#F9FAFB",
    borderRadius: 14,
    padding: 12,
    marginBottom: 8,
  },
  observationText: {
    fontSize: 13,
    color: "#374151",
    lineHeight: 18,
  },
  emptyText: {
    fontSize: 13,
    color: "#6B7280",
    marginBottom: 12,
  },
  input: {
    minHeight: 90,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 16,
    padding: 12,
    fontSize: 14,
    textAlignVertical: "top",
    color: "#111827",
    marginTop: 10,
  },
  primaryButton: {
    height: 52,
    borderRadius: 16,
    backgroundColor: "#5655B9",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },
  disabledButton: {
    opacity: 0.65,
  },
  noticeBox: {
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
  },
  noticeActive: {
    backgroundColor: "#ECFDF5",
  },
  noticeExpired: {
    backgroundColor: "#FEF2F2",
  },
  noticeText: {
    color: "#111827",
    fontSize: 13,
    fontWeight: "800",
  },
  validityText: {
    color: "#374151",
    fontSize: 13,
    fontWeight: "800",
    marginTop: 4,
  },
  quotationActions: {
    marginTop: 12,
    rowGap: 10,
  },
  secondaryButton: {
    minHeight: 52,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#5655B9",
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryButtonText: {
    color: "#5655B9",
    fontSize: 15,
    fontWeight: "800",
  },
});
