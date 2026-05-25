import React, { useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { colors } from "../../../shared/theme/colors";
import { ProductCard } from "./ProductCard";
import { ProductListHeader } from "./ProductListHeader";
import { ProductSearchBox } from "./ProductSearchBox";

export default function GestionInventario({
  productos = [],
  onRegistrar,
  onOpenStockControl,
  onVolver,
}) {
  const [busqueda, setBusqueda] = useState("");

  const filtrados = productos.filter(
    (producto) =>
      producto.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
      producto.marca?.toLowerCase().includes(busqueda.toLowerCase()) ||
      producto.modelo?.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={onVolver} style={styles.backButton}>
          <Ionicons name="arrow-back" size={22} color="#111827" />
        </Pressable>

        <View style={styles.headerText}>
          <Text style={styles.title}>Gestion de inventario</Text>
          <Text style={styles.subtitle}>Registro, lista y control de stock</Text>
        </View>
      </View>

      <View style={styles.actionRow}>
        <Pressable style={styles.stockBtn} onPress={onOpenStockControl}>
          <Ionicons name="cube-outline" size={20} color={colors.primary} />
          <Text style={styles.stockBtnText}>Control de stock</Text>
        </Pressable>

        <Pressable style={styles.registerSmallBtn} onPress={onRegistrar}>
          <Ionicons name="add" size={21} color="#FFFFFF" />
          <Text style={styles.registerSmallBtnText}>Nuevo</Text>
        </Pressable>
      </View>

      <ProductSearchBox value={busqueda} onChangeText={setBusqueda} />
      <ProductListHeader count={filtrados.length} />

      <FlatList
        data={filtrados}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <ProductCard product={item} />}
        ListEmptyComponent={
          <View style={styles.emptyCard}>
            <Ionicons name="cube-outline" size={42} color="#9CA3AF" />
            <Text style={styles.emptyTitle}>No hay productos</Text>
            <Text style={styles.emptyText}>
              Registra productos para empezar a gestionar el inventario.
            </Text>
          </View>
        }
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
  actionRow: {
    flexDirection: "row",
    columnGap: 10,
    marginBottom: 14,
  },
  stockBtn: {
    flex: 1,
    height: 52,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E0E7FF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    columnGap: 8,
  },
  stockBtnText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "900",
  },
  registerSmallBtn: {
    width: 110,
    height: 52,
    borderRadius: 18,
    backgroundColor: colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    columnGap: 6,
  },
  registerSmallBtnText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "900",
  },
  listContainer: {
    paddingTop: 10,
    paddingBottom: 16,
  },
  emptyCard: {
    marginTop: 30,
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