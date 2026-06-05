import { Linking } from "react-native";
import { normalizeWhatsAppBolivianPhone } from "./validators";

export function normalizeWhatsAppPhone(phone) {
  return normalizeWhatsAppBolivianPhone(phone);
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
