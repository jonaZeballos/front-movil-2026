import React, { useState } from "react";
import { Alert, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

export default function RegistroProducto({ onGuardar, onCancelar, isSaving = false }) {
  const [nombre, setNombre] = useState("");
  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [precio, setPrecio] = useState("");
  const [stock, setStock] = useState("");

  const onSubmit = () => {
    if (isSaving) return;

    if (!nombre.trim()) {
      Alert.alert("Nombre obligatorio", "Ingresa el nombre del producto.");
      return;
    }

    if (!precio.trim()) {
      Alert.alert("Precio obligatorio", "Ingresa el precio del producto.");
      return;
    }

    const precioNumber = Number(String(precio).replace(",", "."));
    const stockNumber = Number(stock || 0);

    if (!Number.isFinite(precioNumber) || precioNumber < 0) {
      Alert.alert("Precio invalido", "Ingresa un precio mayor o igual a 0.");
      return;
    }

    if (!Number.isInteger(stockNumber) || stockNumber < 0) {
      Alert.alert("Stock invalido", "Ingresa un stock entero mayor o igual a 0.");
      return;
    }

    const producto = {
      nombre: nombre.trim(),
      marca: marca.trim(),
      modelo: modelo.trim(),
      precio: precioNumber,
      stock: stockNumber,
      stockMinimo: 1,
    };
    onGuardar(producto);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
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

        <View style={styles.actions}>
          <Pressable
            style={[styles.button, styles.cancelButton, isSaving && styles.disabledButton]}
            onPress={onCancelar}
            disabled={isSaving}
          >
            <Text style={[styles.buttonText, styles.cancelButtonText]}>Cancelar</Text>
          </Pressable>
          <Pressable
            style={[styles.button, styles.submitButton, isSaving && styles.disabledButton]}
            onPress={onSubmit}
            disabled={isSaving}
          >
            <Text style={[styles.buttonText, styles.submitButtonText]}>
              {isSaving ? "Guardando..." : "Guardar"}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f7fb",
  },
  content: {
    paddingHorizontal: 18,
    paddingTop: 22,
    paddingBottom: 32,
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
  disabledButton: {
    opacity: 0.65,
  },
});
