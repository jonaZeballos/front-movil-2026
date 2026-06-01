import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { colors } from "../../../shared/theme/colors";
import { ProductCard } from "./ProductCard";
import { ProductListHeader } from "./ProductListHeader";
import { ProductSearchBox } from "./ProductSearchBox";

export default function GestionInventario({
  productos = [],
  categorias = [],
  isLoading = false,
  onRegistrar,
  onOpenStockControl,
  onRefresh,
  onCreateCategoria,
  canManageCategories = false,
  onVolver,
  title = "Inventario",
  inventoryType = "tienda",
}) {
  const [busqueda, setBusqueda] = useState("");
  const [selectedCategoria, setSelectedCategoria] = useState(null);
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isSavingCategory, setIsSavingCategory] = useState(false);

  const categoryCounts = useMemo(() => {
    return productos.reduce((acc, producto) => {
      const key = producto.idCategoria || producto.categoria?.id || "sin_categoria";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
  }, [productos]);

  const filtrados = productos.filter((producto) => {
    const query = busqueda.toLowerCase();
    const matchesSearch =
      producto.nombre?.toLowerCase().includes(query) ||
      producto.marca?.toLowerCase().includes(query) ||
      producto.modelo?.toLowerCase().includes(query);
    const matchesCategory = selectedCategoria
      ? String(producto.idCategoria || producto.categoria?.id) === String(selectedCategoria.id)
      : true;

    return matchesSearch && matchesCategory;
  });

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) {
      return Alert.alert("Categoria requerida", "Escribe el nombre de la categoria.");
    }

    try {
      setIsSavingCategory(true);
      const categoria = await onCreateCategoria?.({ nombre: newCategoryName.trim() });
      setNewCategoryName("");
      setCategoryModalVisible(false);
      if (categoria) {
        setSelectedCategoria(categoria);
      }
    } catch (error) {
      Alert.alert("No se pudo crear", error.message || "Intenta nuevamente.");
    } finally {
      setIsSavingCategory(false);
    }
  };

  const registerLabel = selectedCategoria ? `Agregar en ${selectedCategoria.nombre}` : "Registrar producto";
  const inventoryLabel = inventoryType === "tecnico" ? "tecnico" : "de tienda";

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={onVolver} style={styles.backButton}>
          <Ionicons name="arrow-back" size={22} color="#111827" />
        </Pressable>

        <View style={styles.headerText}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>Categorias, productos y stock {inventoryLabel}</Text>
        </View>
      </View>

      <View style={styles.actionRow}>
        <Pressable style={styles.stockBtn} onPress={onOpenStockControl}>
          <Ionicons name="cube-outline" size={20} color={colors.primary} />
          <Text style={styles.stockBtnText}>Control de stock</Text>
        </Pressable>

        {canManageCategories ? (
          <Pressable style={styles.categoryBtn} onPress={() => setCategoryModalVisible(true)}>
            <Ionicons name="folder-open-outline" size={20} color="#FFFFFF" />
          </Pressable>
        ) : null}
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Categorias</Text>
        {selectedCategoria ? (
          <Pressable style={styles.clearCategoryButton} onPress={() => setSelectedCategoria(null)}>
            <Text style={styles.clearCategoryText}>Ver todas</Text>
          </Pressable>
        ) : null}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesRow}
      >
        {categorias.map((categoria) => {
          const selected = String(selectedCategoria?.id) === String(categoria.id);
          const count = categoryCounts[categoria.id] || categoria.productosCount || 0;

          return (
            <Pressable
              key={categoria.id}
              style={[styles.categoryCard, selected && styles.categoryCardSelected]}
              onPress={() => setSelectedCategoria(categoria)}
            >
              <Ionicons
                name="folder-outline"
                size={20}
                color={selected ? "#FFFFFF" : colors.primary}
              />
              <Text style={[styles.categoryName, selected && styles.categoryNameSelected]}>
                {categoria.nombre}
              </Text>
              <Text style={[styles.categoryCount, selected && styles.categoryCountSelected]}>
                {count} productos
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <View style={styles.selectedRow}>
        <Text style={styles.selectedTitle}>
          {selectedCategoria ? selectedCategoria.nombre : "Todos los productos"}
        </Text>
        <Pressable style={styles.inlineAddButton} onPress={() => onRegistrar?.(selectedCategoria)}>
          <Ionicons name="add" size={18} color="#FFFFFF" />
          <Text style={styles.inlineAddText}>Nuevo</Text>
        </Pressable>
      </View>

      <ProductSearchBox value={busqueda} onChangeText={setBusqueda} />
      <ProductListHeader count={filtrados.length} />

      <ScrollView
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          onRefresh ? (
            <RefreshControl refreshing={isLoading} onRefresh={onRefresh} tintColor={colors.primary} />
          ) : undefined
        }
      >
        {isLoading ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator color={colors.primary} />
          </View>
        ) : null}

        {!isLoading && filtrados.length === 0 ? (
          <View style={styles.emptyCard}>
            <Ionicons name="cube-outline" size={42} color="#9CA3AF" />
            <Text style={styles.emptyTitle}>No hay productos</Text>
            <Text style={styles.emptyText}>
              Registra productos dentro de esta categoria para empezar a gestionar el inventario {inventoryLabel}.
            </Text>
          </View>
        ) : null}

        {filtrados.map((item) => (
          <ProductCard key={item.id} product={item} />
        ))}

        <Pressable style={styles.registerBtn} onPress={() => onRegistrar?.(selectedCategoria)}>
          <Ionicons name="add" size={22} color="#FFFFFF" />
          <Text style={styles.registerBtnText}>{registerLabel}</Text>
        </Pressable>
      </ScrollView>

      <Modal transparent visible={categoryModalVisible} animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Nueva categoria</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Ej. IMPRESORAS"
              placeholderTextColor="#9CA3AF"
              value={newCategoryName}
              onChangeText={setNewCategoryName}
              autoCapitalize="characters"
            />
            <View style={styles.modalActions}>
              <Pressable
                style={[styles.modalButton, styles.modalCancel]}
                onPress={() => {
                  setNewCategoryName("");
                  setCategoryModalVisible(false);
                }}
                disabled={isSavingCategory}
              >
                <Text style={styles.modalCancelText}>Cancelar</Text>
              </Pressable>
              <Pressable
                style={[styles.modalButton, styles.modalSave, isSavingCategory && styles.disabledButton]}
                onPress={handleCreateCategory}
                disabled={isSavingCategory}
              >
                {isSavingCategory ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.modalSaveText}>Crear</Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
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
  categoryBtn: {
    width: 58,
    height: 52,
    borderRadius: 18,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  sectionTitle: {
    color: "#111827",
    fontSize: 15,
    fontWeight: "900",
  },
  clearCategoryButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  clearCategoryText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: "900",
  },
  categoriesRow: {
    columnGap: 10,
    paddingBottom: 16,
  },
  categoryCard: {
    width: 142,
    minHeight: 92,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    padding: 12,
    justifyContent: "space-between",
  },
  categoryCardSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryName: {
    color: "#111827",
    fontSize: 13,
    fontWeight: "900",
  },
  categoryNameSelected: {
    color: "#FFFFFF",
  },
  categoryCount: {
    color: "#6B7280",
    fontSize: 12,
    fontWeight: "700",
  },
  categoryCountSelected: {
    color: "#E0E7FF",
  },
  selectedRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  selectedTitle: {
    flex: 1,
    color: "#111827",
    fontSize: 18,
    fontWeight: "900",
    marginRight: 10,
  },
  inlineAddButton: {
    height: 40,
    borderRadius: 14,
    backgroundColor: colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    columnGap: 6,
    paddingHorizontal: 12,
  },
  inlineAddText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "900",
  },
  listContainer: {
    paddingTop: 10,
    paddingBottom: 20,
  },
  loadingBox: {
    paddingVertical: 20,
  },
  emptyCard: {
    marginTop: 20,
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
    minHeight: 54,
    borderRadius: 18,
    backgroundColor: colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    columnGap: 8,
    marginTop: 10,
    paddingHorizontal: 14,
  },
  registerBtnText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
    textAlign: "center",
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(17, 24, 39, 0.45)",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  modalCard: {
    width: "100%",
    borderRadius: 22,
    backgroundColor: "#FFFFFF",
    padding: 18,
  },
  modalTitle: {
    color: "#111827",
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 14,
  },
  modalInput: {
    minHeight: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    paddingHorizontal: 14,
    color: "#111827",
    fontSize: 14,
  },
  modalActions: {
    flexDirection: "row",
    columnGap: 10,
    marginTop: 16,
  },
  modalButton: {
    flex: 1,
    minHeight: 46,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  modalCancel: {
    backgroundColor: "#F3F4F6",
  },
  modalSave: {
    backgroundColor: colors.primary,
  },
  modalCancelText: {
    color: "#374151",
    fontSize: 14,
    fontWeight: "800",
  },
  modalSaveText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "900",
  },
  disabledButton: {
    opacity: 0.7,
  },
});
