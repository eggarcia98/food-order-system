export interface MainOrderItem {
    item_id: number;
    item_name: string;
    variant_id: number;
    variant_name: string;
    price: number;
    quantity: number;
}

export interface ExtraOrderItem {
    extra_id: number;
    name: string;
    price: number;
    quantity: number;
}

export interface OrderSide {
    id: number;
    name: string;
    price?: number;
    quantity?: number;
}

export interface OrderEntry {
    variant: MainOrderItem;
    quantity: number;
    sides: OrderSide[];
}

export const CURRENCY_SYMBOL = '$';
export const DECIMAL_PLACES = 2;

const formatCurrencyValue = (amount: number): string => {
    return amount.toFixed(DECIMAL_PLACES);
};

export const formatCurrency = (amount: number): string => {
    return `${CURRENCY_SYMBOL}${formatCurrencyValue(amount)}`;
};

export const calculateMainItemTotal = (item: MainOrderItem): number => {
    return item.price * item.quantity;
};

export const calculateExtraItemTotal = (item: ExtraOrderItem): number => {
    return item.price * item.quantity;
};

export const calculateOrderEntryTotal = (entry: OrderEntry): number => {
    const itemQty = entry.quantity ?? entry.variant.quantity ?? 1;
    const variantTotal = entry.variant.price * itemQty;
    const sidesTotal = (entry.sides || []).reduce((acc: number, side) => {
        return acc + (side.price ?? 0) * (side.quantity ?? 0);
    }, 0);
    return variantTotal + sidesTotal;
};

export const calculateOrderSidesTotal = (sides: OrderSide[]): number => {
    return (sides || []).reduce((acc: number, side) => {
        return acc + (side.price ?? 0) * (side.quantity ?? 0);
    }, 0);
};

export const calculateOrdersGrandTotal = (
    mainItems: MainOrderItem[],
    extraItems: ExtraOrderItem[],
): number => {
    const mainTotal = mainItems.reduce((acc, item) => {
        return acc + calculateMainItemTotal(item);
    }, 0);

    const extraTotal = extraItems.reduce((acc, item) => {
        return acc + calculateExtraItemTotal(item);
    }, 0);

    return mainTotal + extraTotal;
};
