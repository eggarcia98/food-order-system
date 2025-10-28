"use client";

import React, { use, useEffect } from "react";

interface DishItem {
    id: number;
    name: string;
    price: number;
    quantity?: number;
}

interface SideItem {
    id: number;
    name: string;
    price?: number;
    quantity?: number;
}
interface OrderItem {
    dish: DishItem | null;
    sides: SideItem[];
}

export default function AddItemModal({
    open,
    setOpen,
    dishes,
    sides,
    setConfirmedOrderList,
}: any) {
    const [orderItem, setOrderItem] = React.useState<OrderItem>({
        dish: null,
        sides: [],
    });

    const [mainDishSelected, setMainDishSelected] = React.useState<any>(null);

    const [sidesSelected, setSidesSelected] = React.useState<any>([]);
    const [quantity, setQuantity] = React.useState<number>(1);

    useEffect(() => {
        setSideQuantities(() =>
            sides.reduce((acc, s) => ({ ...acc, [s.id]: 0 }), {})
        );
    }, [sides]);

    const [sideQuantities, setSideQuantities] = React.useState<any>({});

    const handleIncrement = (id: number) => {
        console.log("Incrementing side id:", sideQuantities);
        const updatedSideQuantities = {
            ...sideQuantities,
            [id]: sideQuantities[id] + 1,
        };
        setSideQuantities(updatedSideQuantities);
    };

    const handleDecrement = async (id: number) => {

        if (sideQuantities[id] <= 0) return;
        const updatedSideQuantities = {
            ...sideQuantities,
            [id]: sideQuantities[id] - 1,
        };
        setSideQuantities(updatedSideQuantities);
    };

    const updateSidesList = () => {
        // Get the ids of sides with quantity > 0 and update sides Selected with an array of objects wiht { id, name, quantity }
        const updatedSides = sides
            .filter((side) => sideQuantities[side.id] > 0)
            .map((side) => ({
                id: side.id,
                name: side.name,
                quantity: sideQuantities[side.id],
            }));

        console.log("Updated sides selected: ", updatedSides);
        setSidesSelected(updatedSides);
    };

    const resetOrderForm = () => {
        setOrderItem({
            dish: null,
            sides: [],
        });
        setSidesSelected([]);
        setMainDishSelected(null);
        setSideQuantities({})
        setQuantity(1);
    };

    const handleDishSelect = (dish: any) => {
        setMainDishSelected(dish);
    };

    const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuantity(Number(e.target.value));
    };

    const toggleDishSelection = (dishId: any) => orderItem?.dish?.id === dishId;

    const confirmOrderItem = () => {
        setConfirmedOrderList((prev: any) => [...prev, orderItem]);
        resetOrderForm();
        setOpen(false);
    };

    useEffect(() => {
        setOrderItem({
            dish: { ...mainDishSelected, quantity },
            sides: sidesSelected,
        });
    }, [quantity, sidesSelected, mainDishSelected]);

    useEffect(() => {
        console.log("Side Quantities Updated: ", sideQuantities);
        updateSidesList();
    }, [sideQuantities]);
    
    useEffect(() => {
        console.log("Current Order Item: ", orderItem);
    }, [orderItem]);

    if (!open) return null;

    return (
        <div
            className={`fixed inset-x-0 bottom-0 z-50 bg-white shadow-xl transition-transform duration-500 ease-out
    ${open ? "translate-y-0" : "translate-y-full"}
    rounded-t-3xl max-h-[80vh] flex flex-col
    md:rounded-2xl md:left-1/2 md:top-1/2 md:bottom-auto md:translate-x-[-50%] md:translate-y-[-50%]
    md:max-w-lg md:w-[90%] md:h-auto
  `}
        >
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-lg font-semibold">Add Item</h2>
                <button
                    onClick={() => setOpen(false)}
                    className="text-gray-500 hover:text-gray-700"
                >
                    ✕
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 smooth-scroll">
                {/* Dishes */}
                <div>
                    <h3 className="text-lg font-semibold mb-2">Dishes</h3>
                    <div className="grid grid-cols-2 gap-3">
                        {dishes.map((dish) => (
                            <div
                                key={dish.id}
                                onClick={() => handleDishSelect(dish)}
                                className={`border rounded-xl p-3 flex flex-col items-center ${
                                    toggleDishSelection(dish.id)
                                        ? "border-blue-600 bg-blue-50"
                                        : "border-gray-200"
                                }`}
                            >
                                <img
                                    src={dish.img}
                                    alt={dish.name}
                                    className="w-20 h-20 object-cover rounded-lg mb-2"
                                />
                                <p className="font-medium">{dish.name}</p>
                                <p className="text-sm text-gray-500">
                                    ${dish.price}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quantity */}
                <div className="mt-6 flex items-center justify-between">
                    <label className="text-lg font-semibold">Quantity</label>
                    <input
                        type="number"
                        value={quantity}
                        onChange={(e) => handleQuantityChange(e)}
                        min={1}
                        className="border rounded-lg w-20 text-center"
                    />
                </div>

                {/* Sides */}
                <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-2">Sides</h3>
                    <div className="flex flex-col gap-2">
                        {sides.map((side) => (
                            <div
                                key={side.id}
                                className="flex justify-between items-center  border-b p-2 px-3 text-sm"
                            >
                                <span className="">{side.name}</span>
                                <div className="flex items-center gap-2">
                                    <div
                                        className="px-2  rounded bg-gray-200 hover:bg-gray-300 font-bold"
                                        onClick={() => handleDecrement(side.id)}
                                    >
                                        -
                                    </div>
                                    <span className="w-6 text-center">
                                        {sideQuantities[side.id] ?? 0}
                                    </span>
                                    <div
                                        className="px-2 rounded bg-gray-200 hover:bg-gray-300 font-bold"
                                        onClick={() => handleIncrement(side.id)}
                                    >
                                        +
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* <div className="grid grid-cols-2 gap-2">
                        {sides.map((side) => (
                            <div
                                key={side.id}
                                onClick={() => handleSideSelect(side)}
                                className={`border rounded-lg p-2 text-sm ${
                                    toggleSideSelection(side.id)
                                        ? "border-green-600 bg-green-50"
                                        : "border-gray-200"
                                }`}
                            >
                                {side.name} (${side.price})
                            </div>
                        ))}
                    </div> */}
                </div>

                {/* Actions */}
                <div className="mt-6 flex justify-end gap-2">
                    <div
                        onClick={() => {
                            setOpen(false);
                        }}
                        className="px-4 py-2 rounded-xl bg-gray-200 hover:bg-gray-300"
                    >
                        Cancel
                    </div>
                    <div
                        onClick={() => confirmOrderItem()}
                        className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
                    >
                        Add
                    </div>
                </div>
            </div>
        </div>
    );
}
