// app/page.tsx
"use client";

import { DishToOrderItem } from "@/components/DishToOrderItem";
import { Selector } from "@/components/SelectorComponent";
import { useEffect, useState } from "react";

interface DishItem {
    id: string;
    dish: string;
    quantity: number;
    extras: string;
}

export default function OrderRegistration() {
    const [phoneNumber, setPhoneNumber] = useState("");

    const [lastName, setLastname] = useState("");
    const [firstname, setFirstname] = useState("");

    const [nationality, setNationality] = useState("");
    const [nationalityList, setNationalityList] = useState([
        { id: 1, name: "Ecuadorian" },
    ]);

    const [dishes, setDishes] = useState<any[]>([]);

    const [dishesToOrder, setDishesToOrder] = useState<DishItem[]>([
        { id: "", dish: "", quantity: 1, extras: "" },
    ]);

    const [comments, setComments] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState<{
        type: "success" | "error";
        text: string;
    } | null>(null);

    const fetchNationalities = async () => {
        try {
            const response = await fetch("/api/nationalities");
            if (!response.ok) throw new Error("Failed to fetch");
            const data = await response.json();
            setNationalityList(data);
        } catch (error) {
            console.error("Error fetching nationalities:", error);
        }
    };

    const fetchDishes = async () => {
        try {
            const response = await fetch("/api/dishes");
            if (!response.ok) throw new Error("Failed to fetch");
            const data = await response.json();
            setDishes(data);
        } catch (error) {
            console.error("Error fetching dishes:", error);
        }
    };

    useEffect(() => {
        // Fetch nationalities from the API
        fetchNationalities();
        fetchDishes();
    }, []);

    const addDish = (dishSelected: any) => {
        console.log(dishSelected);

        if (dishesToOrder.length === 1) {
            setDishesToOrder([dishSelected]);
            console.log(dishesToOrder);

            return;
        }

        console.log(dishesToOrder);

        setDishesToOrder([...dishesToOrder, dishSelected]);
    };

    const removeDish = (id: string) => {
        if (dishesToOrder.length > 1) {
            setDishesToOrder(dishesToOrder.filter((d) => d.id !== id));
        }
    };

    const updateDish = (
        id: string,
        field: keyof DishItem,
        value: string | number
    ) => {
        setDishesToOrder(
            dishesToOrder.map((d) =>
                d.id === id ? { ...d, [field]: value } : d
            )
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage(null);

        try {
            const response = await fetch("/api/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    phoneNumber,
                    name,
                    dishes: dishesToOrder.filter((d) => d.dish.trim() !== ""),
                    comments,
                }),
            });

            if (!response.ok) throw new Error("Failed to submit order");

            setMessage({
                type: "success",
                text: "Order registered successfully!",
            });
            // Reset form
            setPhoneNumber("");
            setLastname("");
            setFirstname("");
            setDishesToOrder([
                { id: crypto.randomUUID(), dish: "", quantity: 1, extras: "" },
            ]);
            setComments("");
        } catch (error) {
            setMessage({
                type: "error",
                text: "Failed to register order. Please try again.",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 py-12 px-4">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Food Order Registration
                    </h1>
                    <p className="text-gray-600 mb-8">
                        Register customer orders quickly and easily
                    </p>

                    {message && (
                        <div
                            className={`mb-6 p-4 rounded-lg ${
                                message.type === "success"
                                    ? "bg-green-50 text-green-800 border border-green-200"
                                    : "bg-red-50 text-red-800 border border-red-200"
                            }`}
                        >
                            {message.text}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Customer Info */}
                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold text-gray-800">
                                Customer Information
                            </h2>
                            <div className="flex flex-row gap-4">
                                <div className="w-full">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Phone Number *
                                    </label>
                                    <input
                                        type="tel"
                                        required
                                        value={phoneNumber}
                                        onChange={(e) =>
                                            setPhoneNumber(e.target.value)
                                        }
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                                        placeholder="+61 642 123 456"
                                    />
                                </div>

                                <div className="w-full">
                                    <label className="block text-sm font-medium text-gray-700 mb-2 ">
                                        Nationality
                                    </label>
                                    <Selector
                                        placeholder="Select Nationality"
                                        returnSelectedValue={true}
                                        onChangeParent={setNationality}
                                        selectorList={nationalityList}
                                        className="appearance-none w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition center"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    First Name *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={firstname}
                                    onChange={(e) =>
                                        setFirstname(e.target.value)
                                    }
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                                    placeholder="John"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Last Name *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={lastName}
                                    onChange={(e) =>
                                        setLastname(e.target.value)
                                    }
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                                    placeholder="Doe"
                                />
                            </div>
                        </div>

                        {/* Dishes */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-semibold text-gray-800">
                                    Dishes
                                </h2>
                                <button
                                    type="button"
                                    onClick={addDish}
                                    className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition text-sm font-medium"
                                >
                                    + Add Dish
                                </button>
                            </div>

                            {dishesToOrder.map((dishToOrder, index) => (
                                <DishToOrderItem
                                    // key={index + 1}
                                    index={index}
                                    dishToOrder={dishToOrder}
                                    dishes={dishes}
                                    removeDish={removeDish}
                                />
                            ))}
                        </div>

                        {/* Comments */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Comments
                            </label>
                            <textarea
                                value={comments}
                                onChange={(e) => setComments(e.target.value)}
                                rows={3}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition resize-none"
                                placeholder="Additional notes or special instructions..."
                            />
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-4 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition shadow-lg hover:shadow-xl"
                        >
                            {isSubmitting ? "Submitting..." : "Register Order"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
