import React, { useState } from "react";
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

export default function RegistroProducto({ onGuardar, onCancelar, isSaving = false }) {
  const [nombre, setNombre] = useState("");
  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [precio, setPrecio] = useState("");
  const [stock, setStock] = useState("");
  const [stockMinimo, setStockMinimo] = useState("1");

  const onSubmit = () => {
    if (isSaving) return;

    const parsedPrecio = Number(String(precio).replace(",", "."));
    const parsedStock = Number(stock);
    const parsedStockMinimo = Number(stockMinimo);

    if (!nombre.trim()) {
      return Alert.alert("Producto incompleto", "El nombre del producto es obligatorio.");
    }

    if (!Number.isFinite(parsedPrecio) || parsedPrecio <= 0) {
      return Alert.alert("Precio invalido", "El precio debe ser mayor a 0.");
    }

    if (!Number.isInteger(parsedStock) || parsedStock < 0) {
      return Alert.alert("Stock invalido", "El stock debe ser un numero entero mayor o igual a 0.");
    }

    if (!Number.isInteger(parsedStockMinimo) || parsedStockMinimo < 0) {
      return Alert.alert("Stock minimo invalido", "El stock minimo debe ser un numero entero mayor o igual a 0.");
    }

    const producto = {
      nombre: nombre.trim(),
      marca: marca.trim(),
      modelo: modelo.trim(),
      precio: parsedPrecio,
      stock: parsedStock,
      stockMinimo: parsedStockMinimo,
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
          <Text style={styles.subtitle}>Llena los campos para añadir un producto al inventario</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nombre del producto</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej. Laptop Dell Inspiron"
            placeholderTextColor="#999"
            value={nombre}
            onChangeText={setNombre}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Marca</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej. Dell"
            placeholderTextColor="#999"
            value={marca}
            onChangeText={setMarca}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Modelo</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej. Inspiron 15"
            placeholderTextColor="#999"
            value={modelo}
            onChangeText={setModelo}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Precio</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej. 4500"
            placeholderTextColor="#999"
            value={precio}
            onChangeText={setPrecio}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Stock</Text>
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
          <Text style={styles.label}>Stock minimo</Text>
          <TextInput
            style={styles.input}
            placeholder="Ej. 2"
            placeholderTextColor="#999"
            value={stockMinimo}
            onChangeText={setStockMinimo}
            keyboardType="numeric"
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
              <ActivityIndicator color="#ffffff" />
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
    backgroundColor: "#ffffff",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: "#e1e1e8",
    color: "#1a1a1a",
    fontSize: 14,
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
