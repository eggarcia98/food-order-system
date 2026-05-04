const BRISBANE_TIME_ZONE = "Australia/Brisbane";
const DEFAULT_LOCALE = "en-US";

type OrderWithExtras = {
    order_item_extras: Array<{
        quantity: number;
        MenuExtras: {
            extra_id: number;
            name: string;
            price: number;
        };
    }>;
};

export type OrderSideSummary = {
    id: number;
    name: string;
    price: number;
    quantity: number;
};

export function getWeekDates(referenceDate: Date = new Date()) {
    const dayOfWeek = referenceDate.getDay();
    const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

    const monday = new Date(referenceDate);
    monday.setDate(referenceDate.getDate() + diff + 1);
    monday.setHours(0, 0, 0, 0);

    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    sunday.setHours(23, 59, 59, 999);

    return { monday, sunday };
}

function formatDateParts(
    dateString: string,
    options: Intl.DateTimeFormatOptions,
): string {
    const date = new Date(dateString);
    return date.toLocaleString(DEFAULT_LOCALE, {
        timeZone: BRISBANE_TIME_ZONE,
        ...options,
    });
}

export function formatOrderDate(dateString: string): string {
    return formatDateParts(dateString, {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

export function formatOrderDateShort(dateString: string): string {
    return formatDateParts(dateString, {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

export function formatOrderTime(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleTimeString(DEFAULT_LOCALE, {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: BRISBANE_TIME_ZONE,
    });
}

export function getSidesForOrder(order: OrderWithExtras): OrderSideSummary[] {
    return order.order_item_extras.map((orderItemExtra) => ({
        id: orderItemExtra.MenuExtras.extra_id,
        name: orderItemExtra.MenuExtras.name,
        price: orderItemExtra.MenuExtras.price,
        quantity: orderItemExtra.quantity,
    }));
}
