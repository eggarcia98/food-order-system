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
        <ul className="divide-y divide-gray-100">
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
                            <p className="font-medium text-gray-800">
                                {item.dish.name}
                            </p>
                            <p className="text-sm text-gray-500">
                                ${item.dish.price.toFixed(2)} × {item.quantity}
                            </p>

                            {item.sides.length > 0 && (
                                <p className="text-sm text-gray-600 mt-1">
                                    <span className="font-medium text-gray-700">
                                        Sides:
                                    </span>{" "}
                                    {item.sides.map((s) => s.name).join(", ")}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-3 mt-3 sm:mt-0">
                        <p className="font-semibold text-gray-800">
                            ${getTotal(item).toFixed(2)}
                        </p>

                        <button
                            onClick={() => removeItemFromOrder(index)}
                            className="text-red-500 hover:text-red-600 text-sm font-medium"
                        >
                            Remove
                        </button>
                    </div>
                </li>
            ))}
        </ul>
    );
};
