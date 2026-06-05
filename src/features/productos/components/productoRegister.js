import React, { useEffect, useState } from "react";
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

  useEffect(() => {
    if (initialCategoriaId) {
      setSelectedCategoriaId(initialCategoriaId);
    }
  }, [initialCategoriaId]);

  const onSubmit = () => {
    if (isSaving) return;

    const trimmedPrecio = String(precio).trim();
    const trimmedStock = String(stock).trim();
    const trimmedStockMinimo = String(stockMinimo).trim();
    const parsedPrecio = trimmedPrecio ? Number(trimmedPrecio.replace(",", ".")) : 0;
    const parsedStock = Number(trimmedStock);
    const parsedStockMinimo = Number(trimmedStockMinimo);

    if (!selectedCategoriaId) {
      return Alert.alert("Categoria requerida", "Seleccione una categoria.");
    }

    if (nombre.trim().length < 3) {
      return Alert.alert(
        isTechnicalInventory ? "Insumo incompleto" : "Producto incompleto",
        isTechnicalInventory ? "Ingrese el nombre del insumo." : "Ingrese el nombre del producto."
      );
    }

    if (requiresTecnico && !selectedTecnicoId) {
      return Alert.alert("Tecnico requerido", "Seleccione un tecnico.");
    }

    if (!isTechnicalInventory && !trimmedPrecio) {
      return Alert.alert("Precio requerido", "Ingrese un precio de venta valido.");
    }

    if (trimmedPrecio && (!Number.isFinite(parsedPrecio) || parsedPrecio < 0)) {
      return Alert.alert("Precio invalido", isTechnicalInventory ? "Ingrese un precio de referencia valido." : "Ingrese un precio de venta valido.");
    }

    if (!trimmedStock || !Number.isInteger(parsedStock) || parsedStock < 0) {
      return Alert.alert("Stock invalido", "Ingrese un stock valido.");
    }

    if (!trimmedStockMinimo || !Number.isInteger(parsedStockMinimo) || parsedStockMinimo < 0) {
      return Alert.alert("Stock minimo invalido", "Ingrese un stock minimo valido.");
    }

    const producto = {
      nombre: nombre.trim(),
      marca: marca.trim(),
      modelo: modelo.trim(),
      descripcion: descripcion.trim(),
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
          <Text style={styles.title}>Registrar nuevo producto</Text>
          <Text style={styles.subtitle}>
            Llena los campos para añadir un {isTechnicalInventory ? "insumo al inventario tecnico" : "producto al inventario de tienda"}
          </Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Categoria *</Text>
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
                    style={[styles.categoryChip, selected && styles.categoryChipSelected]}
                    onPress={() => setSelectedCategoriaId(categoria.id)}
                  >
                    <Text style={[styles.categoryChipText, selected && styles.categoryChipTextSelected]}>
                      {categoria.nombre}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>

          {requiresTecnico ? (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Tecnico *</Text>
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
                      style={[styles.categoryChip, selected && styles.categoryChipSelected]}
                      onPress={() => setSelectedTecnicoId(tecnico.id)}
                    >
                      <Text style={[styles.categoryChipText, selected && styles.categoryChipTextSelected]}>
                        {name}
                      </Text>
                    </Pressable>
                  );
                })}
              </ScrollView>
            </View>
          ) : null}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{isTechnicalInventory ? "Nombre del insumo *" : "Nombre del producto *"}</Text>
            <TextInput
              style={styles.input}
              placeholder={isTechnicalInventory ? "Ej. Alcohol isopropilico" : "Ej. Cargador universal laptop"}
              placeholderTextColor="#999"
              value={nombre}
              onChangeText={setNombre}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Marca (opcional)</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej. Dell"
              placeholderTextColor="#999"
              value={marca}
              onChangeText={setMarca}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Modelo (opcional)</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej. Inspiron 15"
              placeholderTextColor="#999"
              value={modelo}
              onChangeText={setModelo}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{isTechnicalInventory ? "Precio de referencia (opcional)" : "Precio de venta *"}</Text>
            <TextInput
              style={styles.input}
              placeholder={isTechnicalInventory ? "Opcional. Ej. 35" : "Ej. 120"}
              placeholderTextColor="#999"
              value={precio}
              onChangeText={setPrecio}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Stock *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej. 10"
              placeholderTextColor="#999"
              value={stock}
              onChangeText={setStock}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Stock minimo *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ej. 2"
              placeholderTextColor="#999"
              value={stockMinimo}
              onChangeText={setStockMinimo}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Descripcion (opcional)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder={isTechnicalInventory ? "Ej. Uso interno para mantenimiento preventivo" : "Ej. Producto disponible para venta al cliente"}
              placeholderTextColor="#999"
              value={descripcion}
              onChangeText={setDescripcion}
              multiline
              textAlignVertical="top"
            />
          </View>

          <View style={styles.actions}>
            <Pressable style={[styles.button, styles.cancelButton]} onPress={onCancelar}>
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
    backgroundColor: "#f4f4f8",
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
    color: "#4e4e62",
  },
  submitButtonText: {
    color: "#ffffff",
  },
});
