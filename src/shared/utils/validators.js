export const EMAIL_FORMAT_MESSAGE = "Ingrese un correo valido, ejemplo: usuario@correo.com.";
export const BOLIVIAN_MOBILE_MESSAGE = "Ingresa tu numero de telefono.";
export const BOLIVIAN_CI_MESSAGE = "Ingrese un CI valido, solo numeros de 5 a 8 digitos.";
export const BOLIVIAN_NIT_MESSAGE = "Ingrese un NIT valido, solo numeros de 7 a 15 digitos.";

export function normalizeDigits(value) {
  return String(value || "").replace(/\D/g, "");
}

export function isValidEmail(value) {
  const email = String(value || "").trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isInternalEmail(value) {
  return /@servitech\.local$/i.test(String(value || "").trim());
}

export function normalizeBolivianPhone(value) {
  const digits = normalizeDigits(value);

  if (digits.length === 11 && digits.startsWith("591")) {
    return digits.slice(3);
  }

  if (digits.length === 12 && digits.startsWith("5910")) {
    return digits.slice(4);
  }

  if (digits.length === 9 && digits.startsWith("0")) {
    return digits.slice(1);
  }

  return digits;
}

export function isValidBolivianMobile(value) {
  return /^[67]\d{7}$/.test(normalizeBolivianPhone(value));
}

export function normalizeWhatsAppBolivianPhone(value) {
  const national = normalizeBolivianPhone(value);
  return isValidBolivianMobile(national) ? `591${national}` : "";
}

export function isValidBolivianCI(value) {
  return /^\d{5,8}$/.test(normalizeDigits(value));
}

export function isValidBolivianNIT(value) {
  return /^\d{7,15}$/.test(normalizeDigits(value));
}

export function isValidFiscalDocument(value, type = "ci") {
  return String(type).toLowerCase() === "nit"
    ? isValidBolivianNIT(value)
    : isValidBolivianCI(value);
}
