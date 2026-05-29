import { Linking } from "react-native";

export function normalizeWhatsAppPhone(phone) {
  if (!phone) return "";

  const digits = String(phone).replace(/\D/g, "");

  if (!digits) return "";

  if (digits.length === 8) {
    return `591${digits}`;
  }

  if (digits.length === 9 && digits.startsWith("0")) {
    return `591${digits.slice(1)}`;
  }

  return digits;
}

export function buildWhatsAppUrl({ message, phone }) {
  const encodedMessage = encodeURIComponent(message || "");
  const normalizedPhone = normalizeWhatsAppPhone(phone);

  if (normalizedPhone) {
    return `whatsapp://send?phone=${normalizedPhone}&text=${encodedMessage}`;
  }

  return `whatsapp://send?text=${encodedMessage}`;
}

export function buildWhatsAppWebUrl({ message, phone }) {
  const encodedMessage = encodeURIComponent(message || "");
  const normalizedPhone = normalizeWhatsAppPhone(phone);

  if (normalizedPhone) {
    return `https://wa.me/${normalizedPhone}?text=${encodedMessage}`;
  }

  return `https://wa.me/?text=${encodedMessage}`;
}

export async function openWhatsApp({ message, phone }) {
  if (!message || !String(message).trim()) {
    throw new Error("No hay mensaje para enviar por WhatsApp.");
  }

  const appUrl = buildWhatsAppUrl({ message, phone });
  const webUrl = buildWhatsAppWebUrl({ message, phone });

  try {
    await Linking.openURL(appUrl);
    return true;
  } catch (error) {
    try {
      await Linking.openURL(webUrl);
      return true;
    } catch (fallbackError) {
      throw new Error("No se pudo abrir WhatsApp en este dispositivo.");
    }
  }
}
