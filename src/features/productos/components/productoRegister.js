import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function RegistroProducto({
  onGuardar,
  onCancelar,
  isSaving = false,
  categorias = [],
  initialCategoriaId,
  technicians = [],
  inventoryType = "tienda",
  role,
}) {
  const [nombre, setNombre] = useState("");
  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("");
  const [stock, setStock] = useState("");
  const [stockMinimo, setStockMinimo] = useState("1");
  const [selectedCategoriaId, setSelectedCategoriaId] = useState(initialCategoriaId || "");
  const [selectedTecnicoId, setSelectedTecnicoId] = useState("");
  const requiresTecnico = inventoryType === "tecnico" && role === "admin";
  const isTechnicalInventory = inventoryType === "tecnico";

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialCategoriaId) {
      setSelectedCategoriaId(initialCategoriaId);
    }
  }, [initialCategoriaId]);

  const handleExit = () => {
    const isDirty = nombre || marca || modelo || descripcion || precio || stock || (stockMinimo !== "1") || (selectedCategoriaId && selectedCategoriaId !== initialCategoriaId) || selectedTecnicoId;
    if (isDirty) {
      Alert.alert(
        "Descartar cambios",
        "Tienes datos ingresados. ¿Deseas salir sin guardar?",
        [
          { text: "Continuar editando", style: "cancel" },
          { text: "Salir sin guardar", style: "destructive", onPress: onCancelar },
        ]
      );
    } else {
      onCancelar();
    }
  };

  const onSubmit = () => {
    if (isSaving) return;

    let newErrors = {};

    if (!selectedCategoriaId) {
      newErrors.categoria = "Seleccione una categoría.";
    }

    if (requiresTecnico && !selectedTecnicoId) {
      newErrors.tecnico = "Seleccione un técnico.";
    }

    const trimmedNombre = nombre.trim();
    if (!trimmedNombre) {
      newErrors.nombre = isTechnicalInventory ? "Ingrese el nombre del insumo." : "Ingrese el nombre del producto.";
    } else if (trimmedNombre.length < 3) {
      newErrors.nombre = "El nombre debe tener al menos 3 caracteres.";
    } else if (trimmedNombre.length > 50) {
      newErrors.nombre = "El nombre no debe superar 50 caracteres.";
    } else if (/^\d+$/.test(trimmedNombre)) {
      newErrors.nombre = "El nombre no puede ser solo números.";
    }

    const trimmedMarca = marca.trim();
    if (trimmedMarca && trimmedMarca.length > 30) {
      newErrors.marca = "La marca no debe superar 30 caracteres.";
    }

    const trimmedModelo = modelo.trim();
    if (trimmedModelo && trimmedModelo.length > 30) {
      newErrors.modelo = "El modelo no debe superar 30 caracteres.";
    }

    const trimmedDesc = descripcion.trim();
    if (trimmedDesc && trimmedDesc.length > 200) {
      newErrors.descripcion = "La descripción no debe superar 200 caracteres.";
    }

    const trimmedPrecio = String(precio).trim();
    const parsedPrecio = trimmedPrecio ? Number(trimmedPrecio.replace(",", ".")) : 0;
    
    if (!isTechnicalInventory) {
      if (!trimmedPrecio || !Number.isFinite(parsedPrecio) || parsedPrecio < 0) {
        newErrors.precio = "Ingrese un precio válido.";
      }
    } else {
      if (trimmedPrecio && (!Number.isFinite(parsedPrecio) || parsedPrecio < 0)) {
        newErrors.precio = "Ingrese un precio válido.";
      }
    }

    const trimmedStock = String(stock).trim();
    const parsedStock = Number(trimmedStock);
    if (!trimmedStock || !Number.isInteger(parsedStock) || parsedStock < 0) {
      newErrors.stock = "Ingrese un stock válido.";
    }

    const trimmedStockMinimo = String(stockMinimo).trim();
    const parsedStockMinimo = Number(trimmedStockMinimo);
    if (!trimmedStockMinimo || !Number.isInteger(parsedStockMinimo) || parsedStockMinimo < 0) {
      newErrors.stockMinimo = "Ingrese un stock mínimo válido.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setErrors({});

    const producto = {
      nombre: trimmedNombre,
      marca: trimmedMarca,
      modelo: trimmedModelo,
      descripcion: trimmedDesc,
      precio: parsedPrecio,
      stock: parsedStock,
      stockMinimo: parsedStockMinimo,
      idCategoria: selectedCategoriaId,
      idTecnico: requiresTecnico ? selectedTecnicoId : undefined,
      tipoInventario: inventoryType,
    };
    onGuardar(producto);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardArea}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.content}>
          <Pressable onPress={handleExit} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#1f1f39" />
          </Pressable>
          <Text style={styles.title}>Registrar nuevo producto</Text>
          <Text style={styles.subtitle}>
            Llena los campos para añadir un {isTechnicalInventory ? "insumo al inventario tecnico" : "producto al inventario de tienda"}
          </Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Categoría *</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoryList}
            >
              {categorias.map((categoria) => {
                const selected = String(selectedCategoriaId) === String(categoria.id);

                return (
                  <Pressable
                    key={categoria.id}
                    style={[styles.categoryChip, selected && styles.categoryChipSelected, errors.categoria && styles.inputErrorBorder]}
                    onPress={() => setSelectedCategoriaId(categoria.id)}
                  >
                    <Text style={[styles.categoryChipText, selected && styles.categoryChipTextSelected]}>
                      {categoria.nombre}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
            {errors.categoria && <Text style={styles.errorText}>{errors.categoria}</Text>}
          </View>

          {requiresTecnico ? (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Técnico *</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoryList}
              >
                {technicians.map((tecnico) => {
                  const selected = String(selectedTecnicoId) === String(tecnico.id);
                  const name = tecnico.name || [tecnico.nombres, tecnico.apellidos].filter(Boolean).join(" ").trim() || tecnico.username || tecnico.email;

                  return (
                    <Pressable
                      key={tecnico.id}
                      style={[styles.categoryChip, selected && styles.categoryChipSelected, errors.tecnico && styles.inputErrorBorder]}
                      onPress={() => setSelectedTecnicoId(tecnico.id)}
                    >
                      <Text style={[styles.categoryChipText, selected && styles.categoryChipTextSelected]}>
                        {name}
                      </Text>
                    </Pressable>
                  );
                })}
              </ScrollView>
              {errors.tecnico && <Text style={styles.errorText}>{errors.tecnico}</Text>}
            </View>
          ) : null}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{isTechnicalInventory ? "Nombre del insumo *" : "Nombre del producto *"}</Text>
            <TextInput
              style={[styles.input, errors.nombre && styles.inputErrorBorder]}
              placeholder={isTechnicalInventory ? "Ej. Alcohol isopropilico" : "Ej. Cargador universal laptop"}
              placeholderTextColor="#999"
              value={nombre}
              onChangeText={setNombre}
            />
            {errors.nombre && <Text style={styles.errorText}>{errors.nombre}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Marca (opcional)</Text>
            <TextInput
              style={[styles.input, errors.marca && styles.inputErrorBorder]}
              placeholder="Ej. Dell"
              placeholderTextColor="#999"
              value={marca}
              onChangeText={setMarca}
            />
            {errors.marca && <Text style={styles.errorText}>{errors.marca}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Modelo (opcional)</Text>
            <TextInput
              style={[styles.input, errors.modelo && styles.inputErrorBorder]}
              placeholder="Ej. Inspiron 15"
              placeholderTextColor="#999"
              value={modelo}
              onChangeText={setModelo}
            />
            {errors.modelo && <Text style={styles.errorText}>{errors.modelo}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{isTechnicalInventory ? "Precio de referencia (opcional)" : "Precio de venta *"}</Text>
            <TextInput
              style={[styles.input, errors.precio && styles.inputErrorBorder]}
              placeholder={isTechnicalInventory ? "Opcional. Ej. 35" : "Ej. 120"}
              placeholderTextColor="#999"
              value={precio}
              onChangeText={setPrecio}
              keyboardType="numeric"
            />
            {errors.precio && <Text style={styles.errorText}>{errors.precio}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Stock *</Text>
            <TextInput
              style={[styles.input, errors.stock && styles.inputErrorBorder]}
              placeholder="Ej. 10"
              placeholderTextColor="#999"
              value={stock}
              onChangeText={setStock}
              keyboardType="numeric"
            />
            {errors.stock && <Text style={styles.errorText}>{errors.stock}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Stock mínimo *</Text>
            <TextInput
              style={[styles.input, errors.stockMinimo && styles.inputErrorBorder]}
              placeholder="Ej. 2"
              placeholderTextColor="#999"
              value={stockMinimo}
              onChangeText={setStockMinimo}
              keyboardType="numeric"
            />
            {errors.stockMinimo && <Text style={styles.errorText}>{errors.stockMinimo}</Text>}
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Descripción (opcional)</Text>
            <TextInput
              style={[styles.input, styles.textArea, errors.descripcion && styles.inputErrorBorder]}
              placeholder={isTechnicalInventory ? "Ej. Uso interno para mantenimiento preventivo" : "Ej. Producto disponible para venta al cliente"}
              placeholderTextColor="#999"
              value={descripcion}
              onChangeText={setDescripcion}
              multiline
              textAlignVertical="top"
            />
            {errors.descripcion && <Text style={styles.errorText}>{errors.descripcion}</Text>}
          </View>

          <View style={styles.actions}>
            <Pressable style={[styles.button, styles.cancelButton]} onPress={handleExit}>
              <Text style={[styles.buttonText, styles.cancelButtonText]}>Cancelar</Text>
            </Pressable>
            <Pressable
              style={[styles.button, styles.submitButton, isSaving && styles.disabledButton]}
              onPress={onSubmit}
              disabled={isSaving}
            >
              {isSaving ? (
                <View style={styles.loadingRow}>
                  <ActivityIndicator color="#ffffff" />
                  <Text style={[styles.buttonText, styles.submitButtonText]}>Guardando...</Text>
                </View>
              ) : (
                <Text style={[styles.buttonText, styles.submitButtonText]}>Guardar</Text>
              )}
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f7fb",
  },
  keyboardArea: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 18,
    paddingTop: 22,
    paddingBottom: 140,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1f1f39",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#666877",
    marginBottom: 22,
  },
  inputGroup: {
    marginBottom: 18,
  },
  label: {
    fontSize: 13,
    fontWeight: "700",
    color: "#555566",
    marginBottom: 8,
  },
  input: {
    minHeight: 52,
    backgroundColor: "#ffffff",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === "android" ? 0 : 14,
    borderWidth: 1,
    borderColor: "#e1e1e8",
    color: "#1a1a1a",
    fontSize: 14,
    lineHeight: 18,
    textAlignVertical: "center",
    includeFontPadding: false,
  },
  textArea: {
    minHeight: 92,
    paddingTop: 14,
    paddingVertical: 14,
    textAlignVertical: "top",
  },
  categoryList: {
    columnGap: 8,
    paddingVertical: 2,
    paddingHorizontal: 2,
    paddingRight: 8,
  },
  categoryChip: {
    minHeight: 40,
    borderRadius: 14,
    paddingHorizontal: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e1e1e8",
  },
  categoryChipSelected: {
    backgroundColor: "#534AB7",
    borderColor: "#534AB7",
  },
  categoryChipText: {
    color: "#4e4e62",
    fontSize: 12,
    fontWeight: "800",
  },
  categoryChipTextSelected: {
    color: "#ffffff",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 14,
  },
  button: {
    flex: 1,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
  },
  cancelButton: {
    backgroundColor: "#fefefe",
    borderColor: "#e1e1e8",
    borderWidth: 1,
    marginRight: 10,
  },
  submitButton: {
    backgroundColor: "#534AB7",
    marginLeft: 10,
  },
  disabledButton: {
    opacity: 0.7,
  },
  loadingRow: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 8,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "700",
  },
  cancelButtonText: {
    color: "#B91C1C", // rojo suave
  },
  submitButtonText: {
    color: "#ffffff",
  },
  errorText: {
    color: "#B91C1C",
    fontSize: 12,
    marginTop: 4,
    marginLeft: 2,
  },
  inputErrorBorder: {
    borderColor: "#B91C1C",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#e1e1e8",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    alignSelf: "flex-start",
  },
});
