import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { colors } from "../../../shared/theme/colors";

export function QuotationSummaryCard({ quotation }) {
  return (
    <View style={styles.card}>
      <View style={styles.successIcon}>
        <Ionicons name="checkmark" size={30} color="#FFFFFF" />
      </View>

      <Text style={styles.successText}>Cotizacion generada correctamente</Text>
      <Text style={styles.number}>{quotation.numero}</Text>

      <SummaryRow label="Codigo de orden" value={quotation.order.codigo} />
      <SummaryRow label="Cliente" value={quotation.order.cliente} />
      <SummaryRow label="Equipo" value={quotation.order.equipo} />
      <SummaryRow label="Descripcion del trabajo" value={quotation.descripcion} />
      <SummaryRow label="Mano de obra" value={`Bs. ${quotation.manoObra.toFixed(2)}`} />
      <SummaryRow label="Repuestos" value={`Bs. ${quotation.repuestos.toFixed(2)}`} />
      <SummaryRow label="Descuento" value={`Bs. ${quotation.descuento.toFixed(2)}`} />
      <SummaryRow label="Total a pagar" value={`Bs. ${quotation.total.toFixed(2)}`} strong />
      <SummaryRow label="Estado" value="Pendiente de aprobacion" />
    </View>
  );
}

function SummaryRow({ label, value, strong = false }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.value, strong && styles.strongValue]}>{value}</Text>
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
});
