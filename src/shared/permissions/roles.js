export const ROLES = {
  ADMIN: "admin",
  TECNICO: "tecnico",
  VENTAS: "ventas",
};

export const ROLE_LABELS = {
  [ROLES.ADMIN]: "Administrador",
  [ROLES.TECNICO]: "Técnico",
  [ROLES.VENTAS]: "Ventas",
};

export function normalizeRole(role) {
  return String(role || "")
    .trim()
    .toLowerCase();
}

export function getRoleLabel(role) {
  const normalizedRole = normalizeRole(role);

  return ROLE_LABELS[normalizedRole] || "Usuario";
}

export function isAdmin(role) {
  return normalizeRole(role) === ROLES.ADMIN;
}