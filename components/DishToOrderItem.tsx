import { Selector } from "./SelectorComponent";

export const DishToOrderItem = ({
    dishes,
    dishToOrder,
    index,
    removeDish,
}: any) => {
    return (
        <>
            <div
                key={dishToOrder?.id}
                className="p-4 border border-gray-200 rounded-lg bg-gray-50 space-y-3"
            >
                <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">
                        Dish {index + 1}
                    </span>
                    {index > 0 && (
                        <button
                            type="button"
                            onClick={() => removeDish(dishToOrder.id)}
                            className="text-red-600 hover:text-red-800 text-sm font-medium"
                        >
                            Remove
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Dish Name *
                        </label>
                        <Selector
                            placeholder="Select Dish"
                            onChangeParent={(value) => console.log(value)}
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
                            value={dishToOrder.quantity}
                            onChange={
                                (e) => {}
                                // updateDish(
                                //     dishToOrder.id,
                                //     "quantity",
                                //     parseInt(e.target.value) || 1
                                // )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Extras
                    </label>
                    <input
                        type="text"
                        value={dishToOrder.extras}
                        onChange={
                            (e) => {}
                            // updateDish(dishToOrder.id, "extras", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="e.g., Extra cheese, No onions"
                    />
                </div>
            </div>
        </>
    );
};
