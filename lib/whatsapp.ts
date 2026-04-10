import { siteConfig } from "@/data/site";
import type { CartItem } from "@/store/useCart";

/**
 * Generate a WhatsApp order message link
 */
export function buildOrderWhatsAppUrl(
  items: CartItem[],
  tableNumber: string,
  customerName: string
): string {
  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  let message = `🌮 *New Order — Casa Mexicana*\n\n`;
  message += `👤 Name: ${customerName}\n`;
  message += `🪑 Table: ${tableNumber}\n`;
  message += `────────────────\n`;

  items.forEach((item) => {
    const label = item.variantLabel ? ` (${item.variantLabel})` : "";
    message += `• ${item.name}${label} × ${item.quantity} — Rs ${item.price * item.quantity}\n`;
  });

  message += `────────────────\n`;
  message += `💰 *Total: Rs ${total}*\n`;
  message += `\nPlease confirm the order. Thank you!`;

  return `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(message)}`;
}

/**
 * Generate a WhatsApp reservation message link
 */
export function buildReservationWhatsAppUrl(data: {
  name: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  notes?: string;
}): string {
  let message = `📋 *Table Reservation — Casa Mexicana*\n\n`;
  message += `👤 Name: ${data.name}\n`;
  message += `📱 Phone: ${data.phone}\n`;
  message += `📅 Date: ${data.date}\n`;
  message += `🕐 Time: ${data.time}\n`;
  message += `👥 Guests: ${data.guests}\n`;

  if (data.notes) {
    message += `📝 Note: ${data.notes}\n`;
  }

  message += `\nPlease confirm availability. Thank you!`;

  return `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(message)}`;
}
