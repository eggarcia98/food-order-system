type VariantInfo = {
    item_id: number;
    item_name: string;
    variant_id: number;
    variant_name: string;
    price: number;
    quantity: number;
};

type SideInfo = {
    id: number;
    name: string;
    price?: number;
    quantity?: number;
};

type OrderEntry = {
    variant: VariantInfo;
    quantity: number;
    sides: SideInfo[];
};

export const DishToOrderItem = ({
    orderList,
    removeItemFromOrder,
}: {
    orderList: any[];
    removeItemFromOrder: (index: number) => void;
}) => {
    const getTotal = (item: OrderEntry) => {
        const itemQty = item.quantity ?? item.variant.quantity ?? 1;
        const sidesTotal = (item.sides || []).reduce(
            (acc: number, side) => acc + (side.price || 0) * (side.quantity || 0),
            0,
        );
        return item.variant.price * itemQty + sidesTotal;
    };

    const renderSides = (sides: SideInfo[]) => {
        if (!sides || sides.length === 0) return null;
        return (
            <p className="text-sm mt-1 text-secondary">
                <span className="font-medium text-foreground">Sides:</span>{" "}
                {sides
                    .map((s) =>
                        s.quantity && s.quantity > 1
                            ? `${s.name} (x${s.quantity})`
                            : s.name,
                    )
                    .join(", ")}
            </p>
        );
    };

    if (!orderList || orderList.length === 0) {
        return (
            <div className="p-4 text-secondary text-sm">
                No items in your order yet.
            </div>
        );
    }

    return (
        <ul className="divide-y border-brand">
            {orderList.map((item, index) => (
                <li
                    key={`${item.variant.variant_id}-${index}`}
                    className="p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center"
                >
                    <div className="flex items-start gap-3">
                        {/* <div className="w-16 h-16 rounded-lg border flex items-center justify-center bg-bg-light text-xs text-secondary">
                            {item.variant.item_name[0] || "?"}
                        </div> */}

                        <div>
                            <p className="font-medium text-foreground">
                                {item.variant.variant_name}
                            </p>
                           
                            <p className="text-sm text-brand-red">
                                ${item.variant.price.toFixed(2)} ×{" "}
                                {item.quantity ?? item.variant.quantity ?? 1}
                            </p>
                            {renderSides(item.sides)}
                        </div>
                    </div>

                    <div className="flex items-center gap-3 mt-3 sm:mt-0">
                        <p className="font-semibold text-foreground">
                            ${getTotal(item).toFixed(2)}
                        </p>

                        <button
                            onClick={() => removeItemFromOrder(index)}
                            className="text-sm font-medium transition text-brand-red"
                        >
                            Remove
                        </button>
                    </div>
                </li>
            ))}
        </ul>
    );
};
