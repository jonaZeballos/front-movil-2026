import React, { useState } from "react";
import {
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

const productosData = [
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

export default function GestionInventario({ onRegistrar }) {
  const [busqueda, setBusqueda] = useState("");

  const filtrados = productosData.filter(
    (producto) =>
      producto.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      producto.marca.toLowerCase().includes(busqueda.toLowerCase()) ||
      producto.modelo.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.backBtn}>
            <Text style={styles.backBtnText}>{"<"}</Text>
          </View>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>Gestión de inventario</Text>
            <Text style={styles.headerSubtitle}>Registro y lista de productos</Text>
          </View>
        </View>
      </View>

      <View style={styles.searchBox}>
        <Text style={styles.searchLabel}>Buscar producto</Text>
        <View style={styles.searchInput}>
          <TextInput
            style={styles.inputText}
            placeholder="Por nombre, marca o modelo"
            placeholderTextColor="#7A7A82"
            value={busqueda}
            onChangeText={setBusqueda}
          />
        </View>
      </View>

      <View style={styles.listHeader}>
        <Text style={styles.listTitle}>Productos registrados</Text>
        <Text style={styles.listCount}>{filtrados.length}</Text>
      </View>

      <FlatList
        data={filtrados}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardRow}>
              <View style={styles.iconBox}>
                <Text style={styles.iconSymbol}>💻</Text>
              </View>
              <View style={styles.cardInfo}>
                <Text style={styles.cardName}>{item.nombre}</Text>
                <Text style={styles.cardSub}>
                  Marca: {item.marca} · Modelo: {item.modelo}
                </Text>
              </View>
            </View>
            <View style={styles.cardBottom}>
              <Text style={styles.cardDetail}>Stock: {item.stock} unidades</Text>
              <Text style={styles.priceText}>{item.precio}</Text>
            </View>
          </View>
        )}
      />

      <Pressable style={styles.registerBtn} onPress={onRegistrar}>
        <Text style={styles.registerBtnIcon}>+</Text>
        <Text style={styles.registerBtnText}>Registrar producto</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0",
  },
  header: {
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 14,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  backBtn: {
    width: 36,
    height: 36,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#dddddd",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  backBtnText: {
    color: "#555555",
    fontSize: 18,
    fontWeight: "700",
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1a1a1a",
  },
  headerSubtitle: {
    fontSize: 12,
    color: "#888888",
    marginTop: 4,
  },
  searchBox: {
    backgroundColor: "#ffffff",
    marginHorizontal: 12,
    borderRadius: 14,
    padding: 14,
    marginTop: 10,
  },
  searchLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: "#888888",
    letterSpacing: 0.5,
    marginBottom: 8,
    textTransform: "uppercase",
  },
  searchInput: {
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  inputText: {
    fontSize: 13,
    color: "#1a1a1a",
  },
  listHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
    marginHorizontal: 12,
  },
  listTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1a1a1a",
  },
  listCount: {
    fontSize: 14,
    color: "#888888",
  },
  listContainer: {
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 9,
    backgroundColor: "#e8e4fd",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  iconSymbol: {
    fontSize: 18,
  },
  cardInfo: {
    flex: 1,
  },
  cardName: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1a1a1a",
  },
  cardSub: {
    fontSize: 11,
    color: "#888888",
    marginTop: 2,
  },
  cardBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardDetail: {
    fontSize: 11,
    color: "#777777",
  },
  priceText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#534AB7",
  },
  registerBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 12,
    marginBottom: 24,
    marginTop: 8,
    backgroundColor: "#534AB7",
    borderRadius: 14,
    paddingVertical: 15,
  },
  registerBtnIcon: {
    color: "#ffffff",
    fontSize: 20,
    marginRight: 8,
  },
  registerBtnText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "700",
  },
});
