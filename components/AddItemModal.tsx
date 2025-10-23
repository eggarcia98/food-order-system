import React, { use, useEffect } from "react";

export default function AddItemModal({ open, setOpen, dishes, sides }: any) {
    const [orderItem, setOrderItem] = React.useState<any>(null);

    const [sidesSelected, setSidesSelected] = React.useState<any>([]);

    const handleDishSelect = (dish: any) => {
        setOrderItem((prev: any) => ({ ...prev, dish }));
    };

    const toggleDishSelection = (dishId: any) => {
        return orderItem?.dish?.id === dishId;
    };

    const handleSideSelect = (side: any) => {
        setSidesSelected((prev: any) => {
            if (prev.find((s: any) => s.id === side.id)) {
                return prev.filter((s: any) => s.id !== side.id);
            } else {
                return [...prev, side];
            }
        });

        setOrderItem((prev: any) => ({ ...prev, sides: sidesSelected }));

    };

    const toogleSideSelection = (sideId: any) => {
        return sidesSelected.find((s: any) => s.id === sideId);
    };

    useEffect(() => {
        console.log("Selected sides updated:", setSidesSelected);
        console.log("Order dish:", orderItem);
    }, [ orderItem]);

    return (
        <div
            className={`fixed z-50 bg-white shadow-xl p-6 transition-all duration-500 ease-out
    ${open ? "opacity-100" : "opacity-0 pointer-events-none"}
    bottom-0 left-0 right-0 rounded-t-3xl
    max-h-[70vh] md:max-h-[80vh] md:rounded-2xl md:w-[90%] md:max-w-lg md:left-1/2 md:top-1/2 md:translate-x-[-50%] md:translate-y-[-50%]
  `}
        >
            <div className="flex flex-col h-full overflow-y-auto">
                <h2 className="text-xl font-semibold mb-4 text-center">
                    Add Item
                </h2>

                {/* Dishes */}
                <div>
                    <h3 className="text-lg font-medium mb-2">Dishes</h3>
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

                {/* Sides */}
                <div className="mt-6">
                    <h3 className="text-lg font-medium mb-2">Sides</h3>
                    <div className="grid grid-cols-2 gap-2">
                        {sides.map((side) => (
                            <div
                                key={side.id}
                                onClick={() => handleSideSelect(side)}
                                className={`border rounded-lg p-2 text-sm ${
                                    toogleSideSelection(side.id)
                                        ? "border-green-600 bg-green-50"
                                        : "border-gray-200"
                                }`}
                            >
                                {side.name} (${side.price})
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quantity */}
                <div className="mt-6 flex items-center justify-between">
                    <label className="text-lg font-medium">Quantity</label>
                    <input
                        type="number"
                        value={0}
                        onChange={(e) => {}}
                        min={1}
                        className="border rounded-lg w-20 text-center"
                    />
                </div>

                {/* Actions */}
                <div className="mt-6 flex justify-end gap-2">
                    <button
                        onClick={() => setOpen(false)}
                        className="px-4 py-2 rounded-xl bg-gray-200 hover:bg-gray-300"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => setOpen(false)}
                        className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
                    >
                        Add
                    </button>
                </div>
            </div>
        </div>
    );
}
