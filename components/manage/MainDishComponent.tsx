import { useState } from "react";
import EditMainDish from "./EditMainDish";


export default function MainDishComponent({ dish, setMainDishFormData}) {
    const [editMode, setEditMode] = useState(false);

    if (editMode) {
        return (
            <EditMainDish dish={dish} setEditMode={setEditMode} />
        )
    }

    return (
        <>
            <div className="flex flex-wrap items-center gap-3">
                <h3 className="text-xl font-bold font-bungee text-foreground">
                    {dish.name}
                </h3>

                <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${dish.is_active ?? true
                        ? "bg-[#eef8f4] text-[#2c7a5a]"
                        : "bg-[#faf0ef] text-brand-red"
                        }`}
                >
                    {dish.is_active ?? true ? "Active" : "Inactive"}
                </span>
            </div>
            {dish.description && <p className="max-w-3xl text-sm leading-6 text-light">{dish.description}</p>}
            <button
                onClick={() => {
                    setMainDishFormData({
                        name: dish.name,
                        description: dish.description || "",
                    });
                    setEditMode(true);
                }}
                className="text-sm font-medium text-brand-blue hover:text-accent-blue"
            >
                Edit Dish
            </button>
        </>
    )
}