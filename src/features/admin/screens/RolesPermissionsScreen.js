import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
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

export function RolesPermissionsScreen({ onBack }) {
  return (
    <ScreenContainer backgroundColor={colors.primary} edges={["top"]}>
      <View style={styles.root}>
        <View style={styles.hero}>
          <View style={styles.headerRow}>
            <Pressable style={styles.backButton} onPress={onBack}>
              <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
            </Pressable>

            <View style={styles.headerTextWrap}>
              <Text style={styles.headerTitle}>Roles y permisos</Text>
              <Text style={styles.headerSubtitle}>Control de acceso del sistema</Text>
            </View>
          </View>

          <View style={styles.heroCard}>
            <View style={styles.heroIconBox}>
              <Feather name="lock" size={22} color="#FFFFFF" />
            </View>

            <View style={styles.heroInfo}>
              <Text style={styles.heroTitle}>Acceso administrativo</Text>
              <Text style={styles.heroText}>
                Desde esta sección puedes consultar qué funciones tiene permitido
                usar cada rol dentro de la aplicación.
              </Text>
            </View>
          </View>
        </View>

        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.sectionTitle}>Permisos por rol</Text>

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
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.dashboardBg,
  },
  hero: {
    backgroundColor: colors.primary,
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(255, 255, 255, 0.16)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTextWrap: {
    flex: 1,
  },
  headerTitle: {
    color: "#FFFFFF",
    fontFamily: fontFamilies.bold,
    fontSize: 24,
    lineHeight: 30,
  },
  headerSubtitle: {
    marginTop: 2,
    color: "#DEE1FF",
    fontFamily: fontFamilies.medium,
    fontSize: 13,
  },
  heroCard: {
    marginTop: 20,
    borderRadius: 18,
    backgroundColor: "rgba(255, 255, 255, 0.14)",
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  heroIconBox: {
    width: 46,
    height: 46,
    borderRadius: 15,
    backgroundColor: "#2C2B72",
    alignItems: "center",
    justifyContent: "center",
  },
  heroInfo: {
    flex: 1,
  },
  heroTitle: {
    color: "#FFFFFF",
    fontFamily: fontFamilies.semibold,
    fontSize: 15,
    marginBottom: 3,
  },
  heroText: {
    color: "#ECEEFF",
    fontFamily: fontFamilies.regular,
    fontSize: 12,
    lineHeight: 17,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 14,
    paddingTop: 18,
    paddingBottom: 28,
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
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 3,
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
});