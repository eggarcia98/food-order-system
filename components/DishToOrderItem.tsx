import {
    OrderEntry,
    OrderSide,
    MainOrderItem,
    calculateOrderEntryTotal,
    formatCurrency,
} from '@/lib/order-types';

export const DishToOrderItem = ({
    orderList,
    removeItemFromOrder,
}: {
    orderList: OrderEntry[];
    removeItemFromOrder: (index: number) => void;
}) => {

    const renderSides = (sides: OrderSide[]) => {
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

                        <div>
                            <p className="font-medium text-foreground">
                                {item.variant.variant_name}
                            </p>

                            <p className="text-sm text-brand-red">
                                {formatCurrency(item.variant.price)} ×{" "}
                                {item.quantity ?? item.variant.quantity ?? 1}
                            </p>
                            {renderSides(item.sides)}
                        </div>
                    </div>

                    <div className="flex items-center gap-3 mt-3 sm:mt-0">
                        <p className="font-semibold text-foreground">
                            {formatCurrency(calculateOrderEntryTotal(item))}
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
