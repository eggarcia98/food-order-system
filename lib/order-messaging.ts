import type { Order } from "@/lib/domain";
import { getSidesForOrder } from "@/lib/order-utils";

export function formatAustralianNumber(phoneNumber: string): string {
    const cleaned = phoneNumber.replace(/[^0-9]/g, "");

    if (cleaned.startsWith("61")) return cleaned;
    if (cleaned.startsWith("0")) return `61${cleaned.substring(1)}`;
    if (cleaned.length >= 9) return `61${cleaned}`;

    return cleaned;
}

export function getOrderTotal(order: Order): number {
    const sidesTotal = getSidesForOrder(order).reduce(
        (acc, side) => acc + side.price * side.quantity,
        0,
    );
    const dishesTotal = order.order_items.reduce(
        (acc, item) => acc + item.ItemVariant.price * item.quantity,
        0,
    );
    return sidesTotal + dishesTotal;
}

export function getWhatsAppLink(
    order: Order,
    messageType: "confirmation" | "info" = "confirmation",
): string {
    const phone = formatAustralianNumber(order.customer.phone_number);
    const customerName = `${order.customer.first_name} ${order.customer.last_name}`;
    let message = "";

    if (messageType === "confirmation") {
        const items = order.order_items
            .map((item) => `${item.ItemVariant.variant_name} x${item.quantity} ($${(item.ItemVariant.price * item.quantity).toFixed(2)})`)
            .join(", ");
        const sides = getSidesForOrder(order)
            .map((side) => `${side.name} x${side.quantity} ($${(side.price * side.quantity).toFixed(2)})`)
            .join(", ");

        message = `Hi ${customerName}! 👋\n\n`;
        message += order.confirmationLinkUrl
            ? `⚠️ *Important:* To reserve your order, you must confirm it using this link:\n${order.confirmationLinkUrl}`
            : "Your confirmation link is not available yet. Please contact us to confirm your order.";
        message += `\n\n📋 *Order Details:*\n${items}`;
        if (sides) message += `\n\n🍟 *Extras:*\n${sides}`;
        message += `\n\n💰 *Total:* $${getOrderTotal(order).toFixed(2)}`;
        message += "\n\nThank you for your order! 🙏";
    } else {
        message = `Hi ${customerName}! ℹ️\n\n*Important Information:*\n\n`;
        message += "⏰ *Operating Hours:*\n";
        message += "We are open from 10:30 AM to 4:00 PM\n\n";
        message += "🚗 *Pick-up Policy:*\n";
        message += "Orders placed after 2:30 PM are only available for pick-up\n";
        message += "(Dine-in service ends at 2:30 PM)\n\n";
        message += "Thank you for choosing us! 🙏";
    }

    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
