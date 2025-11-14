// app/page.tsx
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


// Dis is a comment 
export default function OrderRegistration() {
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

    const [open, setOpen] = useState(false);

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

    return (
        <div className="min-h-screen py-12 px-4 bg-background">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white rounded-2xl shadow-xl p-8 border-t-4 border-accent-secondary">
                    <h1 className="text-3xl font-bold mb-2 text-text-secondary">
                        Food Order Registration
                    </h1>
                    <p className="mb-4 text-gray-500">
                        Register customer orders quickly and easily
                    </p>

                    <div className="flex justify-end">
                        <Link
                            href="/orders"
                            className="px-4 py-2 rounded-lg transition text-sm font-medium bg-accent-secondary text-button-text hover:bg-button-hover-overlay"
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
                                <div
                                    className="w-1 h-6 rounded-full"
                                    style={{
                                        backgroundColor:
                                            "var(--color-brand-blue)",
                                    }}
                                ></div>
                                <h2
                                    className="text-xl font-semibold "
                                    style={{
                                        color: "var(--color-foreground-dark)",
                                    }}
                                >
                                    Customer Information
                                </h2>
                            </div>
                            <div className="flex flex-row gap-4">
                                <div className="w-full">
                                    <label
                                        className="block text-sm font-medium mb-2"
                                        style={{ color: "var(--color-text)" }}
                                    >
                                        Phone Number{" "}
                                        <span
                                            style={{
                                                color: "var(--color-brand-blue)",
                                            }}
                                        >
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
                                            onFocus={(e) => {
                                                if (
                                                    phoneNumber.length > 0 &&
                                                    filteredSuggestions.length >
                                                        0
                                                ) {
                                                    setShowSuggestions(true);
                                                }
                                                e.currentTarget.style.borderColor =
                                                    "var(--color-brand-blue)";
                                                e.currentTarget.style.boxShadow =
                                                    "0 0 0 2px rgba(35, 160, 229, 0.2)";
                                            }}
                                            onBlur={(e) => {
                                                e.currentTarget.style.borderColor =
                                                    "var(--color-border)";
                                                e.currentTarget.style.boxShadow =
                                                    "none";
                                            }}
                                            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition bg-white appearance-none"
                                            style={{
                                                borderColor:
                                                    "var(--color-border)",
                                            }}
                                            placeholder="+1 234 567 8900"
                                            autoComplete="off"
                                        />

                                        {/* Suggestions Dropdown */}
                                        {showSuggestions &&
                                            filteredSuggestions.length > 0 && (
                                                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
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
                                                                className="w-full px-4 py-3 text-left transition flex justify-between items-center border-b border-gray-100 last:border-b-0"
                                                                onMouseEnter={(
                                                                    e
                                                                ) => {
                                                                    e.currentTarget.style.backgroundColor =
                                                                        "rgba(35, 160, 229, 0.05)";
                                                                }}
                                                                onMouseLeave={(
                                                                    e
                                                                ) => {
                                                                    e.currentTarget.style.backgroundColor =
                                                                        "transparent";
                                                                }}
                                                            >
                                                                <div>
                                                                    <p
                                                                        className="font-medium"
                                                                        style={{
                                                                            color: "var(--color-foreground-dark)",
                                                                        }}
                                                                    >
                                                                        {
                                                                            customer.phone_number
                                                                        }
                                                                    </p>
                                                                    <p
                                                                        className="text-sm"
                                                                        style={{
                                                                            color: "var(--color-brand-blue)",
                                                                        }}
                                                                    >
                                                                        {customer.first_name +
                                                                            " " +
                                                                            customer.last_name}
                                                                    </p>
                                                                </div>
                                                                <svg
                                                                    className="w-5 h-5"
                                                                    fill="none"
                                                                    stroke="currentColor"
                                                                    viewBox="0 0 24 24"
                                                                    style={{
                                                                        color: "var(--color-brand-red)",
                                                                    }}
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
                                    <label
                                        className="block text-sm font-medium mb-2"
                                        style={{ color: "var(--color-text)" }}
                                    >
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
                                <label
                                    className="block text-sm font-medium mb-2"
                                    style={{ color: "var(--color-text)" }}
                                >
                                    First Name{" "}
                                    <span
                                        style={{
                                            color: "var(--color-brand-blue)",
                                        }}
                                    >
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
                                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition"
                                    style={{
                                        borderColor: "var(--color-border)",
                                    }}
                                    onFocus={(e) => {
                                        e.currentTarget.style.borderColor =
                                            "var(--color-brand-blue)";
                                        e.currentTarget.style.boxShadow =
                                            "0 0 0 2px rgba(35, 160, 229, 0.2)";
                                    }}
                                    onBlur={(e) => {
                                        e.currentTarget.style.borderColor =
                                            "var(--color-border)";
                                        e.currentTarget.style.boxShadow =
                                            "none";
                                    }}
                                    placeholder="John"
                                />
                            </div>

                            <div>
                                <label
                                    className="block text-sm font-medium mb-2"
                                    style={{ color: "var(--color-text)" }}
                                >
                                    Last Name{" "}
                                    <span
                                        style={{
                                            color: "var(--color-brand-blue)",
                                        }}
                                    >
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
                                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition"
                                    style={{
                                        borderColor: "var(--color-border)",
                                    }}
                                    onFocus={(e) => {
                                        e.currentTarget.style.borderColor =
                                            "var(--color-brand-blue)";
                                        e.currentTarget.style.boxShadow =
                                            "0 0 0 2px rgba(35, 160, 229, 0.2)";
                                    }}
                                    onBlur={(e) => {
                                        e.currentTarget.style.borderColor =
                                            "var(--color-border)";
                                        e.currentTarget.style.boxShadow =
                                            "none";
                                    }}
                                    placeholder="Doe"
                                />
                            </div>
                        </div>

                        {/* Overlay */}
                        <div
                            className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
                                open
                                    ? "opacity-100 visible"
                                    : "opacity-0 invisible"
                            }`}
                            onClick={() => setOpen(false)}
                        ></div>

                        <AddItemModal
                            dishes={dishes}
                            sides={sides}
                            open={open}
                            setOpen={setOpen}
                            setConfirmedOrderList={setConfirmedOrderList}
                        />

                        {/* Dishes */}
                        <div className="space-y-4">
                            <div className="flex  justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-1 h-6 rounded-full"
                                        style={{
                                            backgroundColor:
                                                "var(--color-brand-blue)",
                                        }}
                                    ></div>
                                    <h2
                                        className="text-xl font-semibold"
                                        style={{
                                            color: "var(--color-foreground-dark)",
                                        }}
                                    >
                                        Order List
                                    </h2>
                                </div>
                                <div
                                    onClick={() => setOpen(true)}
                                    className="px-4 py-2 rounded-xl cursor-pointer transition"
                                    style={{
                                        backgroundColor:
                                            "var(--color-brand-blue)",
                                        color: "var(--color-background-light)",
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.backgroundColor =
                                            "rgba(35, 160, 229, 0.8)";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor =
                                            "var(--color-brand-blue)";
                                    }}
                                >
                                    + Add Item
                                </div>
                            </div>
                            <div
                                className="flex items-center gap-2 p-5 rounded-lg"
                                style={{
                                    backgroundColor:
                                        "var(--color-background-light)",
                                }}
                            >
                                {confirmedOrderList.length === 0 ? (
                                    <div className="flex items-center gap-3 w-full">
                                        <div
                                            className="w-8 h-8 rounded-full flex items-center justify-center"
                                            style={{
                                                backgroundColor:
                                                    "rgba(35, 160, 229, 0.1)",
                                            }}
                                        >
                                            <svg
                                                className="w-4 h-4"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                                style={{
                                                    color: "var(--color-brand-blue)",
                                                }}
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                                />
                                            </svg>
                                        </div>
                                        <p
                                            style={{
                                                color: "var(--color-text-secondary)",
                                            }}
                                        >
                                            No items added yet. Click "Add Item"
                                            to start your order.
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
                                <div
                                    className="w-1 h-4 rounded-full"
                                    style={{
                                        backgroundColor:
                                            "var(--color-brand-blue)",
                                    }}
                                ></div>
                                <label
                                    className="block text-sm font-medium"
                                    style={{ color: "var(--color-text)" }}
                                >
                                    Comments
                                </label>
                            </div>
                            <textarea
                                value={comments}
                                onChange={(e) => setComments(e.target.value)}
                                rows={3}
                                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent transition resize-none"
                                style={{ borderColor: "var(--color-border)" }}
                                onFocus={(e) => {
                                    e.currentTarget.style.borderColor =
                                        "var(--color-brand-blue)";
                                    e.currentTarget.style.boxShadow =
                                        "0 0 0 2px rgba(35, 160, 229, 0.2)";
                                }}
                                onBlur={(e) => {
                                    e.currentTarget.style.borderColor =
                                        "var(--color-border)";
                                    e.currentTarget.style.boxShadow = "none";
                                }}
                                placeholder="Additional notes or special instructions..."
                            />
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-4 font-semibold rounded-lg disabled:cursor-not-allowed transition shadow-lg hover:shadow-xl"
                            style={{
                                backgroundColor: isSubmitting
                                    ? "#9CA3AF"
                                    : "var(--color-brand-blue)",
                                color: "var(--color-background-light)",
                            }}
                            onMouseEnter={(e) => {
                                if (!isSubmitting) {
                                    e.currentTarget.style.backgroundColor =
                                        "rgba(35, 160, 229, 0.8)";
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!isSubmitting) {
                                    e.currentTarget.style.backgroundColor =
                                        "var(--color-brand-blue)";
                                }
                            }}
                        >
                            {isSubmitting ? "Submitting..." : "Register Order"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
