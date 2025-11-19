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

export default function NewOrderModal({
    openNewOrderModal = true,
    setOpenNewOrderModal,
}: any) {
    const [phoneNumber, setPhoneNumber] = useState("");

    const [lastname, setLastname] = useState("");
    const [firstname, setFirstname] = useState("");

    const [confirmedOrderList, setConfirmedOrderList] = useState<OrderItem[]>(
        []
    );

    const [nationality, setNationality] = useState({});
    const [nationalityList, setNationalityList] = useState([
        { id: 1, name: "Ecuadorian" },
    ]);

    const [openAddItemModal, setOpenAddItemModal] = useState(false);

    const [sides, setSides] = useState<any[]>([]);
    const [dishes, setDishes] = useState<any[]>([]);

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

    useEffect(() => {
        fetchNationalities();
        fetchDishes();
        fetchSides();
        fetchPreviousCustomers();
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

    if (!openNewOrderModal) return null;

    return (
        <div
            className={`fixed inset-x-0 bottom-0 z-50 bg-white shadow-xl transition-transform duration-500 ease-out
    ${openNewOrderModal ? "translate-y-0" : "translate-y-full"}
    rounded-t-3xl max-h-[80vh] flex flex-col
    md:rounded-2xl md:left-1/2 md:top-1/2 md:bottom-auto md:translate-x-[-50%] md:translate-y-[-50%]
    md:max-w-lg md:w-[90%] md:h-auto
  `}
        >
            <div className="min-h-screen py-12 px-4 bg-background">
                <div className="max-w-3xl mx-auto">
                    <div className="bg-white rounded-2xl shadow-xl p-8 border-t-4 border-top-brand-blue">
                        <div className=" border-b flex justify-between items-center border-brand">
                            <h1 className="text-3xl font-bold mb-2 text-foreground">
                                Food Order Registration
                            </h1>
                            <button
                                onClick={() => setOpenNewOrderModal(false)}
                                className="transition text-secondary"
                            >
                                ✕
                            </button>
                        </div>

                        <p className="mb-4 text-secondary">
                            Register customer orders quickly and easily
                        </p>
                        <div className="flex justify-end">
                            <Link
                                href="/orders"
                                className="px-4 py-2 rounded-lg transition text-sm font-medium btn-brand-blue"
                            >
                                View Orders
                            </Link>
                        </div>
                        {message && (
                            <div
                                className={`p-2 m-3 rounded-md ${
                                    message.type === "success"
                                        ? "bg-blue-50 text-accent-secondary border-accent-secondary"
                                        : "bg-red-50 text-accent border border-accent"
                                }`}
                            >
                                {message.text}
                            </div>
                        )}
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Customer Info */}
                            <div className="space-y-4 mt-4">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-1 h-6 rounded-full bg-brand-blue"></div>
                                    <h2 className="text-xl font-semibold text-foreground">
                                        Customer Information
                                    </h2>
                                </div>
                                <div className="flex flex-row gap-4">
                                    <div className="w-full">
                                        <label className="block text-sm font-medium mb-2 text-secondary">
                                            Phone Number{" "}
                                            <span className="text-brand-blue">
                                                *
                                            </span>
                                        </label>
                                        <div
                                            className="relative"
                                            ref={suggestionsRef}
                                        >
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
                                                        phoneNumber.length >
                                                            0 &&
                                                        filteredSuggestions.length >
                                                            0
                                                    ) {
                                                        setShowSuggestions(
                                                            true
                                                        );
                                                    }
                                                }}
                                                className="w-full px-4 py-3 border rounded-lg transition bg-white appearance-none input-brand"
                                                placeholder="+1 234 567 8900"
                                                autoComplete="off"
                                            />

                                            {/* Suggestions Dropdown */}
                                            {showSuggestions &&
                                                filteredSuggestions.length >
                                                    0 && (
                                                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
                                                        {filteredSuggestions.map(
                                                            (
                                                                customer,
                                                                index
                                                            ) => (
                                                                <button
                                                                    key={index}
                                                                    type="button"
                                                                    onClick={() =>
                                                                        selectSuggestion(
                                                                            customer
                                                                        )
                                                                    }
                                                                    className="w-full px-4 py-3 text-left transition flex justify-between items-center border-b border-gray-100 last:border-b-0 suggestion"
                                                                >
                                                                    <div>
                                                                        <p className="font-medium text-foreground">
                                                                            {
                                                                                customer.phone_number
                                                                            }
                                                                        </p>
                                                                        <p className="text-sm text-brand-blue">
                                                                            {customer.first_name +
                                                                                " " +
                                                                                customer.last_name}
                                                                        </p>
                                                                    </div>
                                                                    <svg
                                                                        className="w-5 h-5 text-brand-red"
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

                                    <div className="w-full">
                                        <label className="block text-sm font-medium mb-2 text-secondary">
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
                                    <label className="block text-sm font-medium mb-2 text-secondary">
                                        First Name{" "}
                                        <span className="text-brand-blue">
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
                                        className="w-full px-4 py-3 border rounded-lg transition input-brand"
                                        placeholder="John"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2 text-secondary">
                                        Last Name{" "}
                                        <span className="text-brand-blue">
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
                                        className="w-full px-4 py-3 border rounded-lg transition input-brand"
                                        placeholder="Doe"
                                    />
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
                                dishes={dishes}
                                sides={sides}
                                open={openAddItemModal}
                                setOpen={setOpenAddItemModal}
                                setConfirmedOrderList={setConfirmedOrderList}
                            />

                            {/* Dishes */}
                            <div className="space-y-4">
                                <div className="flex  justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <div className="w-1 h-6 rounded-full bg-brand-blue"></div>
                                        <h2 className="text-xl font-semibold text-foreground">
                                            Order List
                                        </h2>
                                    </div>
                                    <div
                                        onClick={() =>
                                            setOpenAddItemModal(true)
                                        }
                                        className="px-4 py-2 rounded-xl cursor-pointer transition btn-brand-blue"
                                    >
                                        + Add Item
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 p-5 rounded-lg bg-bg-light">
                                    {confirmedOrderList.length === 0 ? (
                                        <div className="flex items-center gap-3 w-full">
                                            <div className="w-8 h-8 rounded-full flex items-center justify-center badge-blue">
                                                <svg
                                                    className="w-4 h-4 text-brand-blue"
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
                                            <p className="text-secondary">
                                                No items added yet. Click "Add
                                                Item" to start your order.
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="w-full space-y-4">
                                            <DishToOrderItem
                                                orderList={confirmedOrderList}
                                                removeItemFromOrder={removeDish}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Comments */}
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-1 h-4 rounded-full bg-brand-blue"></div>
                                    <label className="block text-sm font-medium text-secondary">
                                        Comments
                                    </label>
                                </div>
                                <textarea
                                    value={comments}
                                    onChange={(e) =>
                                        setComments(e.target.value)
                                    }
                                    rows={3}
                                    className="w-full px-4 py-3 border rounded-lg transition resize-none input-brand"
                                    placeholder="Additional notes or special instructions..."
                                />
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`w-full py-4 font-semibold rounded-lg disabled:cursor-not-allowed transition shadow-lg hover:shadow-xl ${
                                    isSubmitting
                                        ? "bg-gray-400"
                                        : "btn-brand-blue"
                                }`}
                            >
                                {isSubmitting
                                    ? "Submitting..."
                                    : "Register Order"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
