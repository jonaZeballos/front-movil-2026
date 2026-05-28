import { useMemo, useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { AppButton } from "../../../shared/components/buttons";
import { ScreenContainer } from "../../../shared/components/ScreenContainer";
import { colors } from "../../../shared/theme/colors";
import { QuotationForm } from "../components/QuotationForm";
import { QuotationOrderInfoCard } from "../components/QuotationOrderInfoCard";
import { TotalQuotationBox } from "../components/TotalQuotationBox";

const initialForm = {
  descripcion: "",
  manoObra: "",
  repuestos: "",
  descuento: "0",
  observaciones: "",
};

export function GenerateQuotationScreen({ order, onBack, onCancel, onSave }) {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  const amounts = useMemo(() => {
    const manoObra = parseAmount(form.manoObra);
    const repuestos = parseAmount(form.repuestos);
    const descuento = parseAmount(form.descuento);
    const subtotal = manoObra + repuestos;
    const total = subtotal - descuento;

    return { manoObra, repuestos, descuento, subtotal, total };
  }, [form.descuento, form.manoObra, form.repuestos]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSave = async () => {
    const validationErrors = validateQuotation(form, amounts);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSaving(true);
    try {
      await onSave?.({
        numero: "COT-001",
        order,
        ordenId: order.id,
        descripcion: form.descripcion.trim(),
        manoObra: amounts.manoObra,
        repuestos: amounts.repuestos,
        descuento: amounts.descuento,
        observaciones: form.observaciones.trim(),
        total: amounts.total,
      });
    } catch (error) {
      Alert.alert("No se pudo guardar", error.message || "Intenta nuevamente.");
    } finally {
      setIsSaving(false);
    }
  };

  const hasFormChanges = Object.keys(form).some(
    (field) => String(form[field]).trim() !== String(initialForm[field]).trim()
  );

  const handleCancel = () => {
    if (!hasFormChanges) {
      onCancel?.();
      return;
    }

    Alert.alert(
      "Cancelar cotizacion",
      "Hay datos ingresados. Si sales ahora se perdera la cotizacion actual.",
      [
        { text: "Seguir editando", style: "cancel" },
        {
          text: "Salir",
          style: "destructive",
          onPress: onCancel,
        },
      ]
    );
  };

  if (!order) {
    return (
      <ScreenContainer backgroundColor={colors.dashboardBg} edges={["top"]}>
        <View style={styles.container}>
          <View style={styles.emptyCard}>
            <Ionicons name="alert-circle-outline" size={44} color="#9CA3AF" />
            <Text style={styles.emptyTitle}>Orden no disponible</Text>
            <Text style={styles.emptyText}>
              Vuelve al listado y selecciona una orden para cotizar.
            </Text>
            <AppButton
              title="Volver"
              onPress={onBack}
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
          <Pressable onPress={handleCancel} style={styles.backButton}>
            <Ionicons name="arrow-back" size={22} color="#111827" />
          </Pressable>

          <View style={styles.headerText}>
            <Text style={styles.title}>Generar cotizacion</Text>
            <Text style={styles.subtitle}>Completa los costos del servicio</Text>
          </View>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.content}
        >
          <QuotationOrderInfoCard order={order} />
          <QuotationForm form={form} errors={errors} onChange={handleChange} />
          <TotalQuotationBox total={Math.max(amounts.total, 0)} />

          {!!errors.total && <Text style={styles.totalError}>{errors.total}</Text>}

          <View style={styles.actions}>
            <AppButton
              title="Cancelar"
              onPress={handleCancel}
              backgroundColor="#FFFFFF"
              textColor="#111827"
              borderColor="#E5E7EB"
              borderRadius={18}
              minHeight={52}
              width="48%"
            />
            <AppButton
              title={isSaving ? "Guardando..." : "Guardar"}
              onPress={handleSave}
              backgroundColor={colors.primary}
              borderRadius={18}
              minHeight={52}
              width="48%"
              disabled={isSaving}
            />
          </View>
        </ScrollView>
      </View>
    </ScreenContainer>
  );
}

function parseAmount(value) {
  const normalized = String(value || "").replace(",", ".");
  const number = Number(normalized);
  return Number.isFinite(number) ? number : 0;
}

function hasInvalidNumber(value) {
  if (String(value).trim() === "") return true;
  const number = Number(String(value).replace(",", "."));
  return !Number.isFinite(number) || number < 0;
}

function validateQuotation(form, amounts) {
  const validationErrors = {};

  if (!form.descripcion.trim()) {
    validationErrors.descripcion = "La descripcion del trabajo es obligatoria.";
  }

  if (hasInvalidNumber(form.manoObra)) {
    validationErrors.manoObra = "Ingresa un monto mayor o igual a 0.";
  }

  if (hasInvalidNumber(form.repuestos)) {
    validationErrors.repuestos = "Ingresa un monto mayor o igual a 0.";
  }

  if (String(form.descuento).trim() !== "" && hasInvalidNumber(form.descuento)) {
    validationErrors.descuento = "El descuento no puede ser negativo.";
  }

  if (amounts.descuento > amounts.subtotal) {
    validationErrors.descuento = "El descuento no puede ser mayor al subtotal.";
  }

  if (amounts.total < 0) {
    validationErrors.total = "El total no puede quedar negativo.";
  }

  return validationErrors;
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
  content: {
    paddingBottom: 140,
  },
  totalError: {
    marginTop: -8,
    marginBottom: 12,
    color: "#DC2626",
    fontSize: 12,
    fontWeight: "800",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  emptyCard: {
    marginTop: 80,
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
});
