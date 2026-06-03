import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { colors } from "../../../shared/theme/colors";
import {
  getClienteNombre,
  formatQuotationDate,
  formatQuotationMoney,
  getCotizacionValidoHasta,
  getDiagnosticoTexto,
  getEquipoNombre,
  getQuotationBusiness,
  getQuotationClient,
  getQuotationCreator,
  getQuotationEmailText,
  getQuotationEquipment,
  getQuotationOrders,
  getQuotationPhone,
  getQuotationSubtotal,
  toDisplayText,
} from "../utils/quotationFormatters";

export function QuotationSummaryCard({ quotation }) {
  const order = normalizeOrder(quotation.order || quotation.orden);
  const cliente = getQuotationClient(quotation);
  const equipo = getQuotationEquipment(quotation);
  const ordenes = getQuotationOrders(quotation);
  const isGrouped = ordenes.length > 1;
  const negocio = getQuotationBusiness(quotation);
  const validoHasta = getCotizacionValidoHasta(quotation);
  const subtotal = getQuotationSubtotal(quotation);

  return (
    <View style={styles.card}>
      <View style={styles.successIcon}>
        <Ionicons name="checkmark" size={30} color="#FFFFFF" />
      </View>

      <Text style={styles.successText}>Cotizacion generada correctamente</Text>
      <Text style={styles.number}>{toDisplayText(quotation.numero, "Sin numero")}</Text>

      <SummaryRow label="Negocio" value={toDisplayText(negocio.nombre, "ServiTech")} />
      <SummaryRow label="Fecha de emision" value={formatQuotationDate(quotation.fechaEmision || quotation.fechaCreacion)} />
      <SummaryRow label="Valida hasta" value={formatQuotationDate(validoHasta)} />
      <SummaryRow label={isGrouped ? "Ordenes incluidas" : "Codigo de orden"} value={isGrouped ? `${ordenes.length} ordenes` : order.codigo} />
      <SummaryRow label="Cliente" value={getClienteNombre(cliente) || order.cliente} />
      <SummaryRow label="Telefono" value={getQuotationPhone(quotation)} />
      <SummaryRow label="Email" value={getQuotationEmailText(quotation)} />
      <SummaryRow label="Cotizacion realizada por" value={getQuotationCreator(quotation)} />
      {isGrouped ? (
        <View style={styles.ordersBlock}>
          {ordenes.map((item) => (
            <View key={item.id || item.codigo || item.code} style={styles.orderItem}>
              <Text style={styles.orderTitle}>{toDisplayText(item.code || item.codigo, "Sin codigo")}</Text>
              <Text style={styles.orderText}>{getEquipoNombre(item.equipo || item.equipmentName)}</Text>
              <Text style={styles.orderText}>{getDiagnosticoTexto(item.diagnostico || item.failure)}</Text>
            </View>
          ))}
        </View>
      ) : (
        <>
          <SummaryRow label="Equipo" value={getEquipoNombre(equipo) || order.equipo} />
          <SummaryRow label="Diagnostico" value={getDiagnosticoTexto(order.diagnostico || order.failure)} />
        </>
      )}
      <SummaryRow label="Descripcion del trabajo" value={quotation.descripcion} />
      <SummaryRow label="Mano de obra" value={formatQuotationMoney(quotation.manoObra)} />
      <SummaryRow label="Repuestos/productos" value={formatQuotationMoney(quotation.repuestos)} />
      <SummaryRow label="Subtotal" value={formatQuotationMoney(subtotal)} />
      <SummaryRow label="Descuento" value={formatQuotationMoney(quotation.descuento)} />
      <SummaryRow label="Total a pagar" value={formatQuotationMoney(quotation.total)} strong />
      <SummaryRow label="Observaciones" value={quotation.observaciones || "Sin observaciones"} />
      <SummaryRow label="Estado" value={quotation.activa === false ? "Vencida" : quotation.estado || "Pendiente de aprobacion"} />
      <Text style={styles.validityText}>
        Cotizacion valida hasta {formatQuotationDate(validoHasta)}.
      </Text>
    </View>
  );
}

function normalizeOrder(order = {}) {
  return {
    codigo: toDisplayText(order.codigo || order.code, "Sin codigo"),
    cliente: getClienteNombre(order.cliente || order.clientName),
    equipo: getEquipoNombre(order.equipo || order.equipmentName),
    diagnostico: getDiagnosticoTexto(order.diagnostico || order.failure),
  };
}

function SummaryRow({ label, value, strong = false }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.value, strong && styles.strongValue]}>{toDisplayText(value)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 18,
    alignItems: "center",
  },
  successIcon: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  successText: {
    color: "#111827",
    fontSize: 18,
    lineHeight: 23,
    fontWeight: "900",
    textAlign: "center",
  },
  number: {
    marginTop: 5,
    marginBottom: 12,
    color: colors.primary,
    fontSize: 15,
    fontWeight: "900",
  },
  row: {
    width: "100%",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#F0F1F5",
  },
  ordersBlock: {
    alignSelf: "stretch",
    borderTopWidth: 1,
    borderTopColor: "#F0F1F5",
    paddingVertical: 10,
    rowGap: 8,
  },
  orderItem: {
    borderRadius: 12,
    backgroundColor: "#F9FAFB",
    padding: 10,
  },
  orderTitle: {
    color: "#111827",
    fontSize: 13,
    fontWeight: "900",
  },
  orderText: {
    marginTop: 3,
    color: "#6B7280",
    fontSize: 12,
    fontWeight: "700",
    lineHeight: 17,
  },
  label: {
    color: "#6B7280",
    fontSize: 12,
    fontWeight: "800",
  },
  value: {
    marginTop: 3,
    color: "#111827",
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 19,
  },
  strongValue: {
    color: colors.primary,
    fontSize: 19,
    fontWeight: "900",
  },
  validityText: {
    alignSelf: "stretch",
    marginTop: 12,
    color: "#374151",
    fontSize: 13,
    fontWeight: "800",
    textAlign: "center",
  },
});
