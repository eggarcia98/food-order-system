import { useEffect, useState } from "react";
import { Selector } from "./SelectorComponent";

export const DishToOrderItem = ({
    dishes,
    index,
    addToOrderList,
    updateOrderList,
    removeToOrderList,
    dishToOrder,
}: any) => {
    const [dishConfirmed, setDishConfirmed] = useState(false);
    const [dishSelected, setDishSelected] = useState<any>(null);
    const [editingDish, setEditingDish] = useState(false);

    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        if (dishToOrder?.id) {
            setDishSelected(dishToOrder);
            setQuantity(dishToOrder.quantity);
            setDishConfirmed(true);
            setEditingDish(false);
        }
    }, [dishToOrder]);
     
    const handleConfirmDish = () => {
        setDishConfirmed(true);
        disableDishItem();

        if (editingDish) {
            updateOrderList({ ...dishSelected, quantity }, index);
            setEditingDish(false);
            return;
        }

        addToOrderList({ ...dishSelected, quantity });
    };
    const handleUnconfirmDish = () => {
        setDishConfirmed(false);
        setEditingDish(true);
        disableDishItem();
    };

    const handleRemoveDish = () => {
        removeToOrderList(index);
    }

    const disableDishItem = () => {
        return dishConfirmed ? "pointer-events-none opacity-60" : "";
    };

    return (
        <div
            className={
                "p-4 border border-gray-200 rounded-lg bg-gray-50 space-y-3"
            }
        >
            <div className={`space-y-3 ${disableDishItem()}`}>
                <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">
                        Dish {index + 1}
                    </span>
                    {/* {index > 0 && (
                        <button
                            type="button"
                            onClick={() => removeDish(dishToOrder.id)}
                            className="text-red-600 hover:text-red-800 text-sm font-medium"
                        >
                            Remove
                        </button>
                    )} */}
                </div>

                <div className="grid grid-cols-[3fr_minmax(100px,_1fr)] gap-3">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Dish Name *
                        </label>
                        <Selector
                            placeholder="Select Dish"
                            returnSelectedValue={true}
                            currentValue={dishToOrder}
                            onChangeParent={setDishSelected}
                            selectorList={dishes}
                            className="appearance-none w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition center"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Quantity *
                        </label>
                        <input
                            type="number"
                            required
                            min="1"
                            value={quantity}
                            onChange={(e) =>
                                setQuantity(Number(e.target.value))
                            }
                            className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                    </div>
                </div>
            </div>
            <div className="space-x-2 flex justify-end">
                <button
                    type="button"
                    hidden={dishConfirmed}
                    onClick={handleConfirmDish}
                    className="px-4 py-2 min-w-12 bg-green-700 text-white rounded-lg hover:bg-green-800 transition text-sm font-medium"
                >
                    ✔︎
                </button>
                <button
                    type="button"
                    hidden={!dishConfirmed || index === 0}
                    onClick={handleRemoveDish}
                    className=" px-4 py-2 min-w-12 bg-red-700 text-white rounded-lg hover:bg-red-800 transition text-sm font-medium z-10 pointer-events-auto "
                >
                    ✘
                </button>

                <button
                    type="button"
                    hidden={!dishConfirmed}
                    onClick={handleUnconfirmDish}
                    className="px-4 py-2 min-w-12 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition text-sm font-medium"
                >
                    ⏎
                </button>
            </div>
        </div>
    );
};
