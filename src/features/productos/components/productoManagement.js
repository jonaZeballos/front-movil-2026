import React, { useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { colors } from "../../../shared/theme/colors";
import { ProductCard } from "./ProductCard";
import { ProductListHeader } from "./ProductListHeader";
import { ProductSearchBox } from "./ProductSearchBox";

const fallbackProducts = [
  {
    id: 1,
    nombre: "Laptop HP Pavilion 15",
    marca: "HP",
    modelo: "Pav-15",
    precio: "Bs. 4.500",
    stock: 5,
  },
  {
    id: 2,
    nombre: "PC Lenovo ThinkCentre",
    marca: "Lenovo",
    modelo: "TC-M70",
    precio: "Bs. 6.200",
    stock: 2,
  },
  {
    id: 3,
    nombre: "Laptop Asus Vivobook",
    marca: "Asus",
    modelo: "VB-14",
    precio: "Bs. 3.800",
    stock: 8,
  },
];

export default function GestionInventario({ productos = [], onRegistrar }) {
  const [busqueda, setBusqueda] = useState("");
  const productList = productos.length > 0 ? productos : fallbackProducts;

  const filtrados = productList.filter(
    (producto) =>
      producto.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      producto.marca.toLowerCase().includes(busqueda.toLowerCase()) ||
      producto.modelo.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.backButton}>
          <Ionicons name="arrow-back" size={22} color="#111827" />
        </View>

        <View style={styles.headerText}>
          <Text style={styles.title}>Gestion de inventario</Text>
          <Text style={styles.subtitle}>Registro y lista de productos</Text>
        </View>
      </View>

      <ProductSearchBox value={busqueda} onChangeText={setBusqueda} />
      <ProductListHeader count={filtrados.length} />

      <FlatList
        data={filtrados}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <ProductCard product={item} />}
      />

      <Pressable style={styles.registerBtn} onPress={onRegistrar}>
        <Ionicons name="add" size={22} color="#FFFFFF" />
        <Text style={styles.registerBtnText}>Registrar producto</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.dashboardBg,
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
  listContainer: {
    paddingTop: 10,
    paddingBottom: 16,
  },
  registerBtn: {
    height: 54,
    borderRadius: 18,
    backgroundColor: colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    columnGap: 8,
    marginTop: 10,
    marginBottom: 16,
  },
  registerBtnText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },
});
