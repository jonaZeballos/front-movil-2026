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
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 18,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  backBtn: {
    width: 42,
    height: 42,
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: 0.5,
    borderColor: "#ddd",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: "#111827",
  },
  headerSubtitle: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 3,
    lineHeight: 18,
  },
  searchBox: {
    backgroundColor: colors.surface,
    marginHorizontal: 14,
    marginVertical: 12,
    borderRadius: 18,
    padding: 16,
  },
  searchLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#4B4B4B",
    letterSpacing: 1.1,
    marginBottom: 8,
    textTransform: "uppercase",
  },
  searchInput: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#f5f5f5",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 13,
  },
  inputText: {
    flex: 1,
    fontSize: 15,
    color: colors.black,
  },
  listHeader: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  listTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#111827",
  },
  listCount: {
    fontSize: 13,
    color: "#6B7280",
    fontWeight: "700",
  },
  listContainer: {
    paddingHorizontal: 14,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 8,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#e8e4fd",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#534AB7",
  },
  cardName: {
    fontSize: 15,
    fontWeight: "800",
    color: "#111827",
  },
  cardEmail: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 3,
  },
  cardDetail: {
    fontSize: 13,
    color: "#6B7280",
  },
  registerBtn: {
    marginHorizontal: 14,
    marginVertical: 16,
    backgroundColor: "#534AB7",
    borderRadius: 18,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  registerBtnText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: "800",
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
        <Feather name="chevron-right" size={18} color="#9CA3AF" />
      </View>
      <Text style={styles.cardDetail}>
        {item.telefono} · {item.direccion}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Feather name="arrow-left" size={20} color="#111827" />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Gestión de clientes</Text>
          <Text style={styles.headerSubtitle}>Registro y lista de clientes registrados</Text>
        </View>
      </View>

      <View style={styles.searchBox}>
        <Text style={styles.searchLabel}>Buscar cliente</Text>
        <View style={styles.searchInput}>
          <Feather name="search" size={18} color="#8C8C8C" />
          <TextInput
            style={styles.inputText}
            placeholder="Por nombre, teléfono o correo"
            placeholderTextColor="#8C8C8C"
            value={busqueda}
            onChangeText={setBusqueda}
          />
        </View>
      </View>

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

      <TouchableOpacity style={styles.registerBtn} onPress={onRegistrar}>
        <Text style={{ fontSize: 22, color: colors.surface }}>+</Text>
        <Text style={styles.registerBtnText}>Registrar cliente</Text>
      </TouchableOpacity>
    </View>
  );
}