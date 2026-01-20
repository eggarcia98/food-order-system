"use client";

import AddItemModal from "@/components/AddItemModal";
import { DishToOrderItem } from "@/components/DishToOrderItem";
import { Selector } from "@/components/SelectorComponent";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";

interface OrderItem {
    dish: Dish;
    quantity: number;
    sides: Side[];
}

interface Dish {
    id: number;
    name: string;
    price: number;
    img?: string;
}

interface Side {
    id: number;
    name: string;
    price: number;
}

export default function NewOrderPage() {
    const [phoneNumber, setPhoneNumber] = useState("");

    const [lastname, setLastname] = useState("");
    const [firstname, setFirstname] = useState("");
    const [menuItems, setMenuItems] = useState<any[]>([]);

    const [confirmedOrderList, setConfirmedOrderList] = useState<OrderItem[]>(
        []
    );

    const [nationality, setNationality] = useState({});
    const [nationalityList, setNationalityList] = useState([
        { id: 1, name: "Ecuadorian" },
    ]);

    const [openAddItemModal, setOpenAddItemModal] = useState(false);

    const [sides, setSides] = useState<any[]>([]);

    const [comments, setComments] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState<{
        type: "success" | "error";
        text: string;
    } | null>(null);

    const [previousCustomers, setPreviousCustomers] = useState<any[]>([]);

    const fetchNationalities = async () => {
        try {
            const response = await fetch("/api/nationalities");
            if (!response.ok) throw new Error("Failed to fetch");
            const data = await response.json();
            setNationalityList(data);
        } catch (error) {
            console.error("Error fetching nationalities:", { error });
        }
    };

   

    const fetchSides = async () => {
        try {
            const response = await fetch("/api/sides");
            if (!response.ok) throw new Error("Failed to fetch");
            const data = await response.json();
            setSides(data);
        } catch (error) {
            console.error("Error fetching sides:", error);
        }
    };

    const fetchPreviousCustomers = async () => {
        try {
            const response = await fetch("/api/customers");
            if (!response.ok) throw new Error("Failed to fetch");
            const data = await response.json();
            setPreviousCustomers(data);
        } catch (error) {
            console.error("Error fetching previous customers:", error);
        }
    };


    const fetchMenuItems = async () => {
        try {
            const response = await fetch("/api/menu_items");
            if (!response.ok) throw new Error("Failed to fetch");
            const data = await response.json();
            console.log("Menu Items:", data);
            setMenuItems(data);
        } catch (error) {
            console.error("Error fetching previous customers:", error);
        }
    };

    useEffect(() => {
        fetchNationalities();
        fetchSides();
        fetchPreviousCustomers();
        fetchMenuItems();
    }, []);

    const removeDish = (index: number) => {
        const updatedDishes = [...confirmedOrderList];
        updatedDishes.splice(index, 1);
        setConfirmedOrderList(updatedDishes);
    };

    // useEffect(() => {
    //     console.log("Confirmed Order List: ", confirmedOrderList);
    // }, [confirmedOrderList]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage(null);

        try {
            const response = await fetch("/api/orders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    client: {
                        firstName: firstname,
                        lastName: lastname,
                        nationality,
                        phoneNumber,
                    },
                    itemsOrder: confirmedOrderList,
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
            setComments("");
            setConfirmedOrderList([]);
        } catch (error) {
            console.error("Error submitting order:", error);
            setMessage({
                type: "error",
                text: "Failed to register order. Please try again.",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    // Autocomplete states

    const [showSuggestions, setShowSuggestions] = useState(false);
    const [filteredSuggestions, setFilteredSuggestions] = useState<any[]>([]);
    const suggestionsRef = useRef<HTMLDivElement>(null);

    const handlePhoneNumberChange = (value: string) => {
        setPhoneNumber(value);

        if (value.length > 0) {
            const filtered = previousCustomers.filter((customer) =>
                customer.phone_number.includes(value)
            );
            console.log("Filtered Suggestions:", filtered);
            setFilteredSuggestions(filtered);
            setShowSuggestions(filtered.length > 0);
        } else {
            setShowSuggestions(false);
        }
    };

    const selectSuggestion = (customer) => {
        setPhoneNumber(customer.phone_number);
        setNationality({ id: customer.nationality_id });
        setFirstname(customer.first_name || "");
        setLastname(customer.last_name || "");
        setShowSuggestions(false);
    };

    return (
        <div
            className={`flex flex-col m-8 min-h-screen bg-gradient-to-b from-background via-cream/30 to-background`}
        >
            <div className="w-full max-w-5xl mx-auto p-6 flex-grow ">
                <div className="flex justify-between">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-4xl font-light text-foreground mb-2">
                            New Order
                        </h1>
                        <p className="text-sm text-text-light font-light">
                            Register customer orders quickly and easily
                        </p>
                    </div>

                    {/* View Orders Link */}
                    <div className="flex justify-end mb-6 h-fit">
                        <Link
                            href="/orders"
                            className="px-6 py-2.5 rounded-lg transition text-sm font-light btn-brand-blue"
                        >
                            View Orders
                        </Link>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Customer Information Card */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm p-8 space-y-6">
                        <h2 className="text-xl font-light text-foreground uppercase tracking-wide">
                            Customer Information
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="relative">
                                <label className="block text-sm font-light mb-2 text-text-light">
                                    Phone Number
                                    <span className="text-brand-red ml-1">
                                        *
                                    </span>
                                </label>
                                <div className="relative" ref={suggestionsRef}>
                                    <input
                                        type="tel"
                                        required
                                        value={phoneNumber}
                                        onChange={(e) =>
                                            handlePhoneNumberChange(
                                                e.target.value
                                            )
                                        }
                                        onFocus={() => {
                                            if (
                                                phoneNumber.length > 0 &&
                                                filteredSuggestions.length > 0
                                            ) {
                                                setShowSuggestions(true);
                                            }
                                        }}
                                        className="w-full px-4 py-3 border border-soft-pink/30 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent bg-cream font-light transition"
                                        placeholder="+1 234 567 8900"
                                        autoComplete="off"
                                    />

                                    {/* Suggestions Dropdown */}
                                    {showSuggestions &&
                                        filteredSuggestions.length > 0 && (
                                            <div className="absolute z-10 w-full mt-1 bg-white/95 backdrop-blur-sm border border-soft-pink/20 rounded-lg shadow-lg max-h-60 overflow-auto">
                                                {filteredSuggestions.map(
                                                    (customer, index) => (
                                                        <button
                                                            key={index}
                                                            type="button"
                                                            onClick={() =>
                                                                selectSuggestion(
                                                                    customer
                                                                )
                                                            }
                                                            className="w-full px-4 py-3 text-left transition flex justify-between items-center border-b border-soft-pink/10 last:border-b-0 hover:bg-soft-pink/10"
                                                        >
                                                            <div>
                                                                <p className="font-light text-foreground text-sm">
                                                                    {
                                                                        customer.phone_number
                                                                    }
                                                                </p>
                                                                <p className="text-xs text-text-light font-light">
                                                                    {customer.first_name +
                                                                        " " +
                                                                        customer.last_name}
                                                                </p>
                                                            </div>
                                                            <svg
                                                                className="w-5 h-5 text-brand-red/50"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                viewBox="0 0 24 24"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth={
                                                                        2
                                                                    }
                                                                    d="M9 5l7 7-7 7"
                                                                />
                                                            </svg>
                                                        </button>
                                                    )
                                                )}
                                            </div>
                                        )}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-light mb-2 text-text-light">
                                    Nationality
                                </label>
                                <Selector
                                    placeholder="Select Nationality"
                                    returnSelectedValue={true}
                                    onChangeParent={setNationality}
                                    selectorList={nationalityList}
                                    className="appearance-none w-full px-4 py-3 border border-soft-pink/30 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent bg-cream font-light transition"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-light mb-2 text-text-light">
                                    First Name
                                    <span className="text-brand-red ml-1">
                                        *
                                    </span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={firstname}
                                    onChange={(e) =>
                                        setFirstname(e.target.value)
                                    }
                                    className="w-full px-4 py-3 border border-soft-pink/30 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent bg-cream font-light transition"
                                    placeholder="John"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-light mb-2 text-text-light">
                                    Last Name
                                    <span className="text-brand-red ml-1">
                                        *
                                    </span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={lastname}
                                    onChange={(e) =>
                                        setLastname(e.target.value)
                                    }
                                    className="w-full px-4 py-3 border border-soft-pink/30 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent bg-cream font-light transition"
                                    placeholder="Doe"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Overlay */}
                    <div
                        className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
                            openAddItemModal
                                ? "opacity-100 visible"
                                : "opacity-0 invisible"
                        }`}
                        onClick={() => setOpenAddItemModal(false)}
                    ></div>

                    <AddItemModal
                        sides={sides}
                        open={openAddItemModal}
                        menuItems={menuItems}
                        setOpen={setOpenAddItemModal}
                        setConfirmedOrderList={setConfirmedOrderList}
                    />

                    {/* Order List Card */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm p-8 space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-light text-foreground uppercase tracking-wide">
                                Order Items
                            </h2>
                            <button
                                type="button"
                                onClick={() => setOpenAddItemModal(true)}
                                className="px-6 py-2.5 rounded-lg cursor-pointer transition btn-brand-blue text-sm font-light"
                            >
                                + Add Item
                            </button>
                        </div>

                        {confirmedOrderList.length === 0 ? (
                            <div className="flex items-center gap-4 p-6 rounded-lg bg-soft-pink/10 border border-soft-pink/20">
                                <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-soft-pink/20">
                                    <svg
                                        className="w-5 h-5 text-brand-red"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                        />
                                    </svg>
                                </div>
                                <p className="text-text-light font-light text-sm">
                                    No items added yet. Click "Add Item" to
                                    start your order.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <DishToOrderItem
                                    orderList={confirmedOrderList}
                                    removeItemFromOrder={removeDish}
                                />
                            </div>
                        )}
                    </div>

                    {/* Comments Card */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm p-8 space-y-4">
                        <label className="block text-sm font-light text-foreground uppercase tracking-wide">
                            Special Notes
                        </label>
                        <textarea
                            value={comments}
                            onChange={(e) => setComments(e.target.value)}
                            rows={4}
                            className="w-full px-4 py-3 border border-soft-pink/30 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent bg-cream font-light resize-none transition"
                            placeholder="Additional notes or special instructions..."
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full py-4 font-light rounded-lg disabled:cursor-not-allowed transition shadow-lg hover:shadow-xl text-base ${
                            isSubmitting
                                ? "bg-gray-400 text-gray-600"
                                : "btn-brand-blue"
                        }`}
                    >
                        {isSubmitting
                            ? "Submitting Order..."
                            : "Register Order"}
                    </button>

                    {/* Success/Error Message */}
                    {message && (
                        <div
                            className={`p-4 mb-6 rounded-2xl backdrop-blur-sm font-light text-sm ${
                                message.type === "success"
                                    ? "bg-soft-blue/20 text-brand-blue border border-brand-blue/30"
                                    : "bg-rose/20 text-brand-red border border-rose/30"
                            }`}
                        >
                            {message.text}
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}
