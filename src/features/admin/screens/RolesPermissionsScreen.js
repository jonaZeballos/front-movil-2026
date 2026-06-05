import { useState } from "react";
import { Alert, Keyboard, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View } from "react-native";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

import { ScreenContainer } from "../../../shared/components/ScreenContainer";
import { ROLE_PERMISSION_DETAILS } from "../../../shared/permissions/permissions";
import { colors } from "../../../shared/theme/colors";
import { fontFamilies } from "../../../shared/theme/fonts";

const roleIcons = {
  admin: {
    iconPack: Feather,
    iconName: "shield",
    color: "#5655B9",
    backgroundColor: "#ECEBFF",
  },
  tecnico: {
    iconPack: MaterialCommunityIcons,
    iconName: "tools",
    color: "#F5AA29",
    backgroundColor: "#FFF3DA",
  },
  ventas: {
    iconPack: Feather,
    iconName: "shopping-bag",
    color: "#0F766E",
    backgroundColor: "#DCFDF4",
  },
};

export function RolesPermissionsScreen({ users = [], onBack, onChangeUserRole, onToggleBlockUser }) {
  const [blockModalVisible, setBlockModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [blockReason, setBlockReason] = useState("");
  const [blockError, setBlockError] = useState("");
  const [isActionSubmitting, setIsActionSubmitting] = useState(false);

  // Filter employees: only tecnico and ventas, exclude client and admin
  const employees = users.filter((user) => {
    const role = String(user.role || "").toLowerCase();
    return ["tecnico", "ventas"].includes(role);
  });

  const handleChangeRole = (user) => {
    const role = String(user.role || "").toLowerCase();
    const targetRole = role === "tecnico" ? "ventas" : "tecnico";
    const targetRoleLabel = targetRole === "tecnico" ? "Técnico" : "Ventas";

    Alert.alert(
      "Confirmar cambio de rol",
      `¿Cambiar rol de ${user.name || user.email} a ${targetRoleLabel}?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Cambiar",
          onPress: async () => {
            try {
              await onChangeUserRole?.(user.id, targetRole);
              Alert.alert("Éxito", "El rol ha sido cambiado correctamente.");
            } catch (error) {
              Alert.alert("Error", error.message || "No se pudo cambiar el rol.");
            }
          },
        },
      ]
    );
  };

  const handleToggleBlock = (user) => {
    if (user.bloqueado) {
      // Unblock: no reason required
      Alert.alert(
        "Desbloquear usuario",
        `¿Deseas desbloquear a ${user.name || user.email}?`,
        [
          { text: "Cancelar", style: "cancel" },
          {
            text: "Desbloquear",
            onPress: async () => {
              try {
                await onToggleBlockUser?.(user, "");
                Alert.alert("Éxito", "Usuario desbloqueado correctamente.");
              } catch (error) {
                Alert.alert("Error", error.message || "No se pudo desbloquear al usuario.");
              }
            },
          },
        ]
      );
    } else {
      // Block: open modal to enter reason
      setSelectedUser(user);
      setBlockReason("");
      setBlockError("");
      setBlockModalVisible(true);
    }
  };

  const handleConfirmBlock = async () => {
    const reason = blockReason.trim();
    if (!reason) {
      setBlockError("Debe ingresar un motivo para bloquear el usuario.");
      return;
    }

    setIsActionSubmitting(true);
    try {
      await onToggleBlockUser?.(selectedUser, reason);
      setBlockModalVisible(false);
      Alert.alert("Éxito", "Usuario bloqueado correctamente.");
    } catch (error) {
      Alert.alert("Error", error.message || "No se pudo bloquear al usuario.");
    } finally {
      setIsActionSubmitting(false);
    }
  };

  return (
    <ScreenContainer backgroundColor={colors.dashboardBg} edges={["top"]}>
      <View style={styles.root}>
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <Pressable style={styles.backButton} onPress={onBack}>
              <Ionicons name="arrow-back" size={22} color="#111827" />
            </Pressable>

            <View style={styles.headerTextWrap}>
              <Text style={styles.headerTitle}>Roles y permisos</Text>
              <Text style={styles.headerSubtitle}>Control de acceso del sistema</Text>
            </View>
          </View>
          <Text style={styles.headerDescription}>
            Configura los accesos de tus técnicos y vendedores, o bloquea usuarios cuando sea necesario.
          </Text>
        </View>

        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Administrar empleados Section */}
          <Text style={styles.sectionTitle}>Administrar empleados</Text>

          {employees.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyText}>No hay empleados registrados en el negocio.</Text>
            </View>
          ) : (
            employees.map((employee) => {
              const role = String(employee.role || "").toLowerCase();
              const visual = roleIcons[role] || roleIcons.admin;
              const IconPack = visual.iconPack;

              return (
                <View key={employee.id} style={styles.employeeCard}>
                  <View style={styles.employeeHeader}>
                    <View style={styles.employeeAvatar}>
                      <Text style={styles.avatarText}>{employee.initials || "U"}</Text>
                    </View>
                    <View style={styles.employeeInfo}>
                      <Text style={styles.employeeName}>{employee.name}</Text>
                      <Text style={styles.employeeEmail}>{employee.email}</Text>
                      <View style={styles.badgeRow}>
                        <View style={[styles.roleBadge, { backgroundColor: visual.backgroundColor }]}>
                          <IconPack name={visual.iconName} size={12} color={visual.color} />
                          <Text style={[styles.roleBadgeText, { color: visual.color }]}>
                            {role === "tecnico" ? "Técnico" : "Ventas"}
                          </Text>
                        </View>
                        {employee.bloqueado ? (
                          <View style={styles.blockedBadge}>
                            <Text style={styles.blockedBadgeText}>Bloqueado</Text>
                          </View>
                        ) : (
                          <View style={styles.activeBadge}>
                            <Text style={styles.activeBadgeText}>Activo</Text>
                          </View>
                        )}
                      </View>
                    </View>
                  </View>

                  {employee.bloqueado && employee.motivoBloqueo ? (
                    <View style={styles.reasonContainer}>
                      <Text style={styles.reasonLabel}>Motivo del bloqueo:</Text>
                      <Text style={styles.reasonText}>{employee.motivoBloqueo}</Text>
                    </View>
                  ) : null}

                  <View style={styles.actionsRow}>
                    <Pressable
                      style={styles.actionButtonRole}
                      onPress={() => handleChangeRole(employee)}
                    >
                      <Text style={styles.actionButtonRoleText}>
                        {role === "tecnico" ? "Cambiar a Ventas" : "Cambiar a Técnico"}
                      </Text>
                    </Pressable>

                    <Pressable
                      style={[
                        styles.actionButtonBlock,
                        employee.bloqueado ? styles.actionButtonUnblock : styles.actionButtonBlockActive,
                      ]}
                      onPress={() => handleToggleBlock(employee)}
                    >
                      <Text
                        style={[
                          styles.actionButtonBlockText,
                          employee.bloqueado ? styles.actionButtonUnblockText : styles.actionButtonBlockTextActive,
                        ]}
                      >
                        {employee.bloqueado ? "Desbloquear" : "Bloquear"}
                      </Text>
                    </Pressable>
                  </View>
                </View>
              );
            })
          )}

          {/* Informativo Section */}
          <Text style={[styles.sectionTitle, { marginTop: 18 }]}>Permisos por rol</Text>

          {ROLE_PERMISSION_DETAILS.map((item) => {
            const visual = roleIcons[item.role] || roleIcons.admin;
            const IconPack = visual.iconPack;

            return (
              <View key={item.role} style={styles.roleCard}>
                <View style={styles.roleHeader}>
                  <View
                    style={[
                      styles.roleIconBox,
                      { backgroundColor: visual.backgroundColor },
                    ]}
                  >
                    <IconPack name={visual.iconName} size={22} color={visual.color} />
                  </View>

                  <View style={styles.roleInfo}>
                    <Text style={styles.roleTitle}>{item.title}</Text>
                    <Text style={styles.roleDescription}>{item.description}</Text>
                  </View>
                </View>

                <View style={styles.permissionsList}>
                  {item.permissions.map((permission) => (
                    <View key={permission} style={styles.permissionItem}>
                      <View style={styles.checkIcon}>
                        <Feather name="check" size={12} color="#FFFFFF" />
                      </View>

                      <Text style={styles.permissionText}>{permission}</Text>
                    </View>
                  ))}
                </View>
              </View>
            );
          })}

          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Importante</Text>
            <Text style={styles.infoText}>
              Los usuarios con rol administrador tienen acceso completo. Los roles
              técnico y ventas solo deben visualizar los módulos relacionados con
              sus funciones.
            </Text>
          </View>
        </ScrollView>
      </View>

      {/* Block Motive Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={blockModalVisible}
        onRequestClose={() => setBlockModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.modalOverlay}>
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              style={{ width: "100%", alignItems: "center" }}
            >
              <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.modalContent}>
                  <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>Bloquear usuario</Text>
                    <Pressable
                      onPress={() => setBlockModalVisible(false)}
                      style={styles.closeIconButton}
                      hitSlop={10}
                    >
                      <Text style={styles.closeIconText}>✕</Text>
                    </Pressable>
                  </View>

                  <ScrollView
                    keyboardShouldPersistTaps="handled"
                    style={styles.modalBodyScroll}
                    contentContainerStyle={styles.modalBodyScrollContent}
                  >
                    <Text style={styles.modalSub}>
                      Ingresa la justificación para bloquear el acceso de{" "}
                      <Text style={{ fontWeight: "700", color: "#111827" }}>
                        {selectedUser?.name || selectedUser?.email}
                      </Text>
                      .
                    </Text>

                    <Text style={styles.inputLabel}>Motivo del bloqueo *</Text>
                    <TextInput
                      style={[styles.textInput, !!blockError && styles.textInputError]}
                      multiline
                      numberOfLines={3}
                      placeholder="Escribe el motivo aquí..."
                      placeholderTextColor="#9CA3AF"
                      value={blockReason}
                      onChangeText={(text) => {
                        setBlockReason(text);
                        if (text.trim()) setBlockError("");
                      }}
                    />
                    {!!blockError && <Text style={styles.errorLabel}>{blockError}</Text>}
                  </ScrollView>

                  <View style={styles.modalFooter}>
                    <Pressable
                      style={styles.cancelModalButton}
                      onPress={() => setBlockModalVisible(false)}
                    >
                      <Text style={styles.cancelModalButtonText}>Cancelar</Text>
                    </Pressable>
                    <Pressable
                      style={[
                        styles.confirmModalButton,
                        !blockReason.trim() && styles.disabledModalButton,
                      ]}
                      onPress={handleConfirmBlock}
                      disabled={isActionSubmitting || !blockReason.trim()}
                    >
                      <Text style={styles.confirmModalButtonText}>Bloquear</Text>
                    </Pressable>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.dashboardBg,
  },
  header: {
    backgroundColor: colors.dashboardBg,
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 8,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  headerTextWrap: {
    flex: 1,
  },
  headerTitle: {
    color: "#111827",
    fontFamily: fontFamilies.bold,
    fontSize: 24,
    lineHeight: 30,
  },
  headerSubtitle: {
    marginTop: 2,
    color: "#6B7280",
    fontFamily: fontFamilies.medium,
    fontSize: 13,
  },
  headerDescription: {
    marginTop: 14,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    padding: 14,
    color: "#6B7280",
    fontFamily: fontFamilies.regular,
    fontSize: 13,
    lineHeight: 19,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 118,
  },
  sectionTitle: {
    color: "#111111",
    fontFamily: fontFamilies.semibold,
    fontSize: 20,
    marginBottom: 12,
  },
  roleCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  roleHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  roleIconBox: {
    width: 46,
    height: 46,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  roleInfo: {
    flex: 1,
  },
  roleTitle: {
    color: "#111111",
    fontFamily: fontFamilies.bold,
    fontSize: 17,
  },
  roleDescription: {
    marginTop: 2,
    color: "#7A7A82",
    fontFamily: fontFamilies.regular,
    fontSize: 12,
    lineHeight: 16,
  },
  permissionsList: {
    gap: 8,
  },
  permissionItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
  },
  checkIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  permissionText: {
    flex: 1,
    color: "#334155",
    fontFamily: fontFamilies.medium,
    fontSize: 13,
    lineHeight: 18,
  },
  infoCard: {
    marginTop: 4,
    backgroundColor: "#F5F5F7",
    borderRadius: 14,
    padding: 14,
  },
  infoTitle: {
    color: "#111111",
    fontFamily: fontFamilies.semibold,
    fontSize: 15,
    marginBottom: 4,
  },
  infoText: {
    color: "#7A7A82",
    fontFamily: fontFamilies.regular,
    fontSize: 12,
    lineHeight: 17,
  },
  emptyCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  emptyText: {
    color: "#6B7280",
    fontFamily: fontFamilies.medium,
    fontSize: 14,
    textAlign: "center",
  },
  employeeCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  employeeHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  employeeAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  avatarText: {
    fontFamily: fontFamilies.bold,
    fontSize: 16,
    color: "#374151",
  },
  employeeInfo: {
    flex: 1,
  },
  employeeName: {
    color: "#111827",
    fontFamily: fontFamilies.bold,
    fontSize: 15,
  },
  employeeEmail: {
    color: "#6B7280",
    fontFamily: fontFamilies.regular,
    fontSize: 12,
    marginTop: 1,
  },
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 6,
  },
  roleBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  roleBadgeText: {
    fontFamily: fontFamilies.semibold,
    fontSize: 11,
  },
  activeBadge: {
    backgroundColor: "#DEF7EC",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  activeBadgeText: {
    color: "#03543F",
    fontFamily: fontFamilies.semibold,
    fontSize: 11,
  },
  blockedBadge: {
    backgroundColor: "#FDE8E8",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  blockedBadgeText: {
    color: "#9B1C1C",
    fontFamily: fontFamilies.semibold,
    fontSize: 11,
  },
  reasonContainer: {
    marginTop: 12,
    padding: 10,
    backgroundColor: "#FDF2F2",
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: "#F05252",
  },
  reasonLabel: {
    fontFamily: fontFamilies.bold,
    fontSize: 11,
    color: "#9B1C1C",
  },
  reasonText: {
    fontFamily: fontFamilies.medium,
    fontSize: 12,
    color: "#771D1D",
    marginTop: 2,
  },
  actionsRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 14,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
    paddingTop: 12,
  },
  actionButtonRole: {
    flex: 1,
    height: 38,
    borderRadius: 10,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  actionButtonRoleText: {
    fontFamily: fontFamilies.semibold,
    fontSize: 12,
    color: "#374151",
  },
  actionButtonBlock: {
    flex: 1,
    height: 38,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  actionButtonBlockActive: {
    backgroundColor: "#FFF5F5",
    borderColor: "#FEB2B2",
  },
  actionButtonBlockTextActive: {
    color: "#C53030",
    fontFamily: fontFamilies.semibold,
    fontSize: 12,
  },
  actionButtonUnblock: {
    backgroundColor: "#EBF8FF",
    borderColor: "#BEE3F8",
  },
  actionButtonUnblockText: {
    color: "#2B6CB0",
    fontFamily: fontFamilies.semibold,
    fontSize: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    width: "100%",
    maxWidth: 340,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    overflow: "hidden",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  modalTitle: {
    fontFamily: fontFamilies.bold,
    fontSize: 16,
    color: "#111827",
  },
  closeIconButton: {
    padding: 4,
  },
  closeIconText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#9CA3AF",
  },
  modalBodyScroll: {
    maxHeight: 220,
  },
  modalBodyScrollContent: {
    padding: 16,
  },
  modalSub: {
    fontFamily: fontFamilies.regular,
    fontSize: 13,
    color: "#4B5563",
    lineHeight: 18,
    marginBottom: 14,
  },
  inputLabel: {
    fontFamily: fontFamilies.bold,
    fontSize: 11,
    color: "#374151",
    textTransform: "uppercase",
    marginBottom: 6,
  },
  textInput: {
    minHeight: 80,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: "#111827",
    backgroundColor: "#F9FAFB",
    textAlignVertical: "top",
  },
  textInputError: {
    borderColor: "#F05252",
    backgroundColor: "#FDF2F2",
  },
  errorLabel: {
    color: "#F05252",
    fontFamily: fontFamilies.semibold,
    fontSize: 12,
    marginTop: 6,
  },
  modalFooter: {
    flexDirection: "row",
    gap: 8,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  cancelModalButton: {
    flex: 1,
    height: 42,
    borderRadius: 10,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  cancelModalButtonText: {
    fontFamily: fontFamilies.semibold,
    fontSize: 13,
    color: "#4B5563",
  },
  confirmModalButton: {
    flex: 1,
    height: 42,
    borderRadius: 10,
    backgroundColor: "#C53030",
    alignItems: "center",
    justifyContent: "center",
  },
  disabledModalButton: {
    backgroundColor: "#E5E7EB",
  },
  confirmModalButtonText: {
    fontFamily: fontFamilies.semibold,
    fontSize: 13,
    color: "#FFFFFF",
  },
});
