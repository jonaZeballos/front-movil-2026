import { StyleSheet, Text, TextInput, View } from "react-native";

export function QuotationForm({ form, errors, onChange }) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Datos de la cotizacion</Text>

      <Field
        label="Descripcion del trabajo"
        placeholder="Ej. Reparacion de fuente y pruebas de encendido"
        value={form.descripcion}
        error={errors.descripcion}
        multiline
        onChangeText={(value) => onChange("descripcion", value)}
      />

      <Field
        label="Costo de mano de obra"
        placeholder="0.00"
        value={form.manoObra}
        error={errors.manoObra}
        keyboardType="numeric"
        onChangeText={(value) => onChange("manoObra", value)}
      />

      <Field
        label="Costo de repuestos"
        placeholder="0.00"
        value={form.repuestos}
        error={errors.repuestos}
        keyboardType="numeric"
        onChangeText={(value) => onChange("repuestos", value)}
      />

      <Field
        label="Descuento (opcional)"
        placeholder="0.00"
        value={form.descuento}
        error={errors.descuento}
        keyboardType="numeric"
        onChangeText={(value) => onChange("descuento", value)}
      />

      <Field
        label="Observaciones (opcional)"
        placeholder="Opcional. Agrega detalles adicionales para el cliente."
        value={form.observaciones}
        error={errors.observaciones}
        multiline
        onChangeText={(value) => onChange("observaciones", value)}
      />
    </View>
  );
}

function Field({
  label,
  placeholder,
  value,
  error,
  onChangeText,
  keyboardType = "default",
  multiline = false,
}) {
  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        keyboardType={keyboardType}
        multiline={multiline}
        textAlignVertical={multiline ? "top" : "center"}
        style={[styles.input, multiline && styles.textArea, error && styles.inputError]}
      />
      {!!error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
  },
  title: {
    marginBottom: 14,
    color: "#111827",
    fontSize: 18,
    fontWeight: "900",
  },
  fieldGroup: {
    marginBottom: 14,
  },
  label: {
    marginBottom: 7,
    fontSize: 12,
    fontWeight: "800",
    color: "#4B5563",
    textTransform: "uppercase",
  },
  input: {
    minHeight: 52,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#F9FAFB",
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: "#111827",
    fontSize: 15,
  },
  textArea: {
    minHeight: 92,
  },
  inputError: {
    borderColor: "#DC2626",
    backgroundColor: "#FEF2F2",
  },
  errorText: {
    marginTop: 6,
    color: "#DC2626",
    fontSize: 12,
    fontWeight: "700",
  },
});
