import { apiRequest } from "../../../shared/api/client";

export async function getAdminSettings() {
  const [business, admin] = await Promise.all([
    apiRequest("/api/negocios/me"),
    apiRequest("/api/usuarios/me"),
  ]);

  return {
    business: mapBusiness(business),
    admin: mapAdmin(admin),
  };
}

export async function updateBusinessSettings(data) {
  return apiRequest("/api/negocios/me", {
    method: "PATCH",
    body: JSON.stringify({
      nombre: data.nombre,
      emailContacto: data.emailContacto,
      telefono: data.telefono,
      direccion: data.direccion,
      qrPagoUrl: data.qrPagoUrl,
    }),
  }).then(mapBusiness);
}

export async function updateAdminProfile(data) {
  return apiRequest("/api/usuarios/me", {
    method: "PATCH",
    body: JSON.stringify({
      nombres: data.nombres,
      apellidos: data.apellidos,
      email: data.email,
      telefono: data.telefono,
    }),
  }).then(mapAdmin);
}

export async function updateAdminPassword(data) {
  return apiRequest("/api/usuarios/me/password", {
    method: "PATCH",
    body: JSON.stringify({
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
    }),
  });
}

function mapBusiness(business) {
  return {
    id: business.id,
    nombre: business.nombre || "",
    emailContacto: business.emailContacto || "",
    telefono: business.telefono || "",
    direccion: business.direccion || "",
    qrPagoUrl: business.qrPagoUrl || "",
    fechaCreacion: business.fechaCreacion || null,
  };
}

function mapAdmin(admin) {
  return {
    id: admin.id,
    nombres: admin.nombres || "",
    apellidos: admin.apellidos || "",
    email: admin.email || "",
    telefono: admin.telefono || "",
    role: admin.role || admin.rol || "admin",
  };
}
