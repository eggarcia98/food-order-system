import { useEffect, useState } from "react";

export const DishToOrderItem = ({ orderList, removeItemFromOrder }: any) => {
    useEffect(() => {}, []);

    const getTotal = (item: any) => {
        const sidesTotal = item.sides.reduce(
            (acc: number, side: any) => acc + (side.price * side.quantity || 0),
            0
        );
        return item.dish.price * item.dish.quantity + sidesTotal;
    };

    console.log("orderList in DishToOrderItem:", orderList);
    return (
        <ul className="divide-y" style={{ borderColor: 'rgba(153, 23, 28, 0.1)' }}>
            {orderList.map((item, index) => (
                <li
                    key={index}
                    className="p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center"
                >
                    <div className="flex items-start gap-3">
                        {item.dish.img && (
                            <img
                                src={item.dish.img}
                                alt={item.dish.name}
                                className="w-16 h-16 object-cover rounded-lg border"
                            />
                        )}

                        <div>
                            <p className="font-medium" style={{ color: 'var(--color-foreground-dark)' }}>
                                {item.dish.name}
                            </p>
                            <p className="text-sm" style={{ color: 'var(--color-brand-red)' }}>
                                ${item.dish.price.toFixed(2)} × {item.quantity}
                            </p>

                            {item.sides.length > 0 && (
                                <p className="text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
                                    <span className="font-medium" style={{ color: 'var(--color-foreground-dark)' }}>
                                        Sides:
                                    </span>{" "}
                                    {item.sides.map((s) => s.name).join(", ")}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-3 mt-3 sm:mt-0">
                        <p className="font-semibold" style={{ color: 'var(--color-foreground-dark)' }}>
                            ${getTotal(item).toFixed(2)}
                        </p>

                        <button
                            onClick={() => removeItemFromOrder(index)}
                            className="text-sm font-medium transition"
                            style={{ color: 'var(--color-brand-red)' }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.color = 'var(--color-brand-dark-red)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.color = 'var(--color-brand-red)';
                            }}
                        >
                            Remove
                        </button>
                    </div>
                </li>
            ))}
        </ul>
    );
};
