import { ROLES, normalizeRole } from "./roles";

export const MODULES = {
  USUARIOS: "usuarios",
  CLIENTES: "clientes",
  EQUIPOS: "equipos",
  ORDENES: "ordenes",
  VENTAS: "ventas",
  INVENTARIO: "inventario",
  ROLES_PERMISOS: "roles_permisos",
  COTIZACIONES: "cotizaciones",
  OBSERVACIONES: "observaciones",
  RECIBOS: "recibos",
  REPORTES: "reportes",
  NOTIFICACIONES: "notificaciones",
};

export const MODULE_LABELS = {
  [MODULES.USUARIOS]: "Usuarios",
  [MODULES.CLIENTES]: "Clientes",
  [MODULES.EQUIPOS]: "Equipos",
  [MODULES.ORDENES]: "Órdenes",
  [MODULES.VENTAS]: "Ventas",
  [MODULES.INVENTARIO]: "Inventario",
  [MODULES.ROLES_PERMISOS]: "Roles y permisos",
  [MODULES.COTIZACIONES]: "Cotizaciones",
  [MODULES.OBSERVACIONES]: "Observaciones",
  [MODULES.RECIBOS]: "Recibos",
  [MODULES.REPORTES]: "Reportes",
  [MODULES.NOTIFICACIONES]: "Notificaciones",
};

export const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: [
    MODULES.USUARIOS,
    MODULES.CLIENTES,
    MODULES.EQUIPOS,
    MODULES.ORDENES,
    MODULES.VENTAS,
    MODULES.COTIZACIONES,
    MODULES.INVENTARIO,
    MODULES.REPORTES,
    MODULES.NOTIFICACIONES,
    MODULES.ROLES_PERMISOS,
  ],

  [ROLES.TECNICO]: [
    MODULES.CLIENTES,
    MODULES.EQUIPOS,
    MODULES.ORDENES,
    MODULES.COTIZACIONES,
    MODULES.OBSERVACIONES,
    MODULES.NOTIFICACIONES,
  ],

  [ROLES.VENTAS]: [
    MODULES.CLIENTES,
    MODULES.VENTAS,
    MODULES.INVENTARIO,
    MODULES.RECIBOS,
    MODULES.NOTIFICACIONES,
  ],
};

export const ROLE_PERMISSION_DETAILS = [
  {
    role: ROLES.ADMIN,
    title: "Administrador",
    description: "Acceso total para gestionar el sistema.",
    permissions: [
      "Gestionar usuarios",
      "Gestionar clientes",
      "Gestionar equipos",
      "Gestionar órdenes de servicio",
      "Gestionar ventas",
      "Generar cotizaciones",
      "Gestionar inventario",
      "Consultar roles y permisos",
    ],
  },
  {
    role: ROLES.TECNICO,
    title: "Técnico",
    description: "Acceso operativo para atención técnica.",
    permissions: [
      "Gestionar clientes",
      "Registrar equipos",
      "Crear órdenes de servicio",
      "Actualizar órdenes",
      "Registrar observaciones",
      "Generar cotizaciones",
    ],
  },
  {
    role: ROLES.VENTAS,
    title: "Ventas",
    description: "Acceso comercial para ventas e inventario.",
    permissions: [
      "Gestionar clientes",
      "Registrar ventas",
      "Consultar inventario",
      "Generar recibos",
    ],
  },
];

export function getPermissionsByRole(role) {
  const normalizedRole = normalizeRole(role);

  return ROLE_PERMISSIONS[normalizedRole] || [];
}

export function hasPermission(role, moduleName) {
  const permissions = getPermissionsByRole(role);

  return permissions.includes(moduleName);
}

export function filterModulesByRole(role, modules) {
  return modules.filter((moduleItem) => hasPermission(role, moduleItem.id));
}
