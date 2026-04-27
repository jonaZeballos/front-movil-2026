import React, { useState } from "react";
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";

import { colors } from "../../../shared/theme/colors";
import { textPresets } from "../../../shared/theme/typography";
import tw from "../../../shared/styles/tw";

const clientes = [
  {
    id: 1,
    nombre: "Juan Soliz",
    correo: "juan.soliz@email.com",
    telefono: "+591 70011223",
    direccion: "Calle Libertad 45",
    iniciales: "JS",
  },
  {
    id: 2,
    nombre: "Pedro Perez",
    correo: "pedro.perez@gmail.com",
    telefono: "+591 71234567",
    direccion: "Av. Busch 120",
    iniciales: "PP",
  },
  {
    id: 3,
    nombre: "Maria Lopez",
    correo: "maria.lopez@hotmail.com",
    telefono: "+591 76543210",
    direccion: "Calle Murillo 8",
    iniciales: "ML",
  },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  header: {
    backgroundColor: colors.surface,
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 14,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  backBtn: {
    width: 36,
    height: 36,
    backgroundColor: colors.surface,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: "#ddd",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.black,
  },
  headerSubtitle: {
    fontSize: 12,
    color: "#888",
    marginTop: 2,
    lineHeight: 16,
  },
  searchBox: {
    backgroundColor: colors.surface,
    marginHorizontal: 12,
    marginVertical: 10,
    borderRadius: 14,
    padding: 14,
  },
  searchLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: "#888",
    letterSpacing: 0.5,
    marginBottom: 8,
    textTransform: "uppercase",
  },
  searchInput: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  inputText: {
    flex: 1,
    fontSize: 13,
    color: colors.black,
  },
  listHeader: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  listTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.black,
  },
  listCount: {
    fontSize: 14,
    color: "#888",
    fontWeight: "500",
  },
  listContainer: {
    paddingHorizontal: 12,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 14,
    marginBottom: 8,
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 6,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#e8e4fd",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#534AB7",
  },
  cardName: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.black,
  },
  cardEmail: {
    fontSize: 11,
    color: "#888",
    marginTop: 2,
  },
  cardDetail: {
    fontSize: 11,
    color: "#aaa",
  },
  registerBtn: {
    marginHorizontal: 12,
    marginVertical: 16,
    backgroundColor: "#534AB7",
    borderRadius: 14,
    padding: 15,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  registerBtnText: {
    color: colors.surface,
    fontSize: 15,
    fontWeight: "500",
  },
});

export default function GestionClientes({ clientes, onBack, onRegistrar, onSelectCliente }) {
  const [busqueda, setBusqueda] = useState("");

  const filtrados = clientes.filter(
    (c) =>
      c.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      c.telefono.includes(busqueda) ||
      c.correo.toLowerCase().includes(busqueda.toLowerCase())
  );

  const renderCliente = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => onSelectCliente(item)}>
      <View style={styles.cardRow}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{item.iniciales}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.cardName}>{item.nombre}</Text>
          <Text style={styles.cardEmail}>{item.correo}</Text>
        </View>
        <Feather name="chevron-right" size={14} color="#ccc" />
      </View>
      <Text style={styles.cardDetail}>
        {item.telefono} · {item.direccion}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Feather name="arrow-left" size={14} color="#555" />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Gestión de clientes</Text>
          <Text style={styles.headerSubtitle}>Registro y lista de clientes registrados</Text>
        </View>
      </View>

      {/* Buscador */}
      <View style={styles.searchBox}>
        <Text style={styles.searchLabel}>Buscar cliente</Text>
        <View style={styles.searchInput}>
          <Feather name="search" size={15} color="#aaa" />
          <TextInput
            style={styles.inputText}
            placeholder="Por nombre, teléfono o correo"
            placeholderTextColor="#bbb"
            value={busqueda}
            onChangeText={setBusqueda}
          />
        </View>
      </View>

      {/* Lista */}
      <View style={styles.listHeader}>
        <Text style={styles.listTitle}>Clientes registrados</Text>
        <Text style={styles.listCount}>{filtrados.length}</Text>
      </View>

      <FlatList
        data={filtrados}
        renderItem={renderCliente}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

      {/* Botón registrar */}
      <TouchableOpacity style={styles.registerBtn} onPress={onRegistrar}>
        <Text style={{ fontSize: 20, color: colors.surface }}>+</Text>
        <Text style={styles.registerBtnText}>Registrar cliente</Text>
      </TouchableOpacity>
    </View>
  );
}