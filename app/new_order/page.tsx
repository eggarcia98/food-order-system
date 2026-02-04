"use client";

import AddMainItemModal from "@/components/AddMainItemModal";
import AddExtraItemModal from "@/components/AddExtraItemModal";
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

    const [confirmedMainItems, setConfirmedMainItems] = useState<any[]>([]);
    const [confirmedExtraItems, setConfirmedExtraItems] = useState<any[]>([]);

    const [nationality, setNationality] = useState({});
    const [nationalityList, setNationalityList] = useState([
        { id: 1, name: "Ecuadorian" },
    ]);

    const [openAddMainItemModal, setOpenAddMainItemModal] = useState(false);
    const [openAddExtraItemModal, setOpenAddExtraItemModal] = useState(false);

    const [extraItems, setExtraItems] = useState<any[]>([]);

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

        }
    };

    const fetchExtraItems = async () => {
        try {
            const response = await fetch("/api/menu_extras");
            if (!response.ok) throw new Error("Failed to fetch");
            const data = await response.json();
            setExtraItems(data);
        } catch (error) {

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
            setMenuItems(data);
        } catch (error) {
            console.error("Error fetching previous customers:", error);
        }
    };

    useEffect(() => {
        fetchNationalities();
        fetchExtraItems();
        fetchPreviousCustomers();
        fetchMenuItems();
    }, []);

    const removeMainItem = (index: number) => {
        const updatedItems = [...confirmedMainItems];
        updatedItems.splice(index, 1);
        setConfirmedMainItems(updatedItems);
    };

    const removeExtraItem = (index: number) => {
        const updatedItems = [...confirmedExtraItems];
        updatedItems.splice(index, 1);
        setConfirmedExtraItems(updatedItems);
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
                    client: {
                        firstName: firstname,
                        lastName: lastname,
                        nationality,
                        phoneNumber,
                    },
                    mainItems: confirmedMainItems,
                    extraItems: confirmedExtraItems,
                    comments,
                }),
            });

            if (!response.ok) throw new Error("Failed to submit order");

            setMessage({
                type: "success",
                text: "Order registered successfully!",
            });

            setPhoneNumber("");
            setLastname("");
            setFirstname("");
            setComments("");
            setNationalitySearch("");
            setNationality({});
            setConfirmedMainItems([]);
            setConfirmedExtraItems([]);
        } catch (error) {

            setMessage({
                type: "error",
                text: "Failed to register order. Please try again.",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const [showSuggestions, setShowSuggestions] = useState(false);
    const [filteredSuggestions, setFilteredSuggestions] = useState<any[]>([]);
    const suggestionsRef = useRef<HTMLDivElement>(null);

    const [nationalitySearch, setNationalitySearch] = useState("");
    const [showNationalitySuggestions, setShowNationalitySuggestions] = useState(false);
    const [filteredNationalities, setFilteredNationalities] = useState<any[]>([]);
    const nationalityRef = useRef<HTMLDivElement>(null);

    const handlePhoneNumberChange = (value: string) => {
        setPhoneNumber(value);

        if (value.length > 0) {
            const filtered = previousCustomers.filter((customer) =>
                customer.phone_number.includes(value)
            );

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

        const selectedNationality = nationalityList.find(n => n.id === customer.nationality_id);
        if (selectedNationality) {
            setNationalitySearch(selectedNationality.name);
        }
    };

    const handleNationalitySearch = (value: string) => {
        setNationalitySearch(value);

        if (value.length > 0) {
            const filtered = nationalityList.filter((nat) =>
                nat.name.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredNationalities(filtered);
            setShowNationalitySuggestions(filtered.length > 0);
        } else {
            setFilteredNationalities(nationalityList);
            setShowNationalitySuggestions(false);
            setNationality({});
        }
    };

    const selectNationality = (selectedNat) => {
        setNationalitySearch(selectedNat.name);
        setNationality({ id: selectedNat.id });
        setShowNationalitySuggestions(false);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                suggestionsRef.current &&
                !suggestionsRef.current.contains(event.target as Node)
            ) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                nationalityRef.current &&
                !nationalityRef.current.contains(event.target as Node)
            ) {
                setShowNationalitySuggestions(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div
            className={`flex flex-col m-8 min-h-screen bg-gradient-to-b from-background via-cream/30 to-background`}
        >
            <div className="w-full max-w-5xl mx-auto p-6 flex-grow">
                <div className="flex justify-between">

                    <div className="mb-8">
                        <h1 className="text-4xl font-light text-foreground mb-2">
                            New Order
                        </h1>
                        <p className="text-sm text-text-light font-light">
                            Register customer orders quickly and easily
                        </p>
                    </div>

                </div>

                <form onSubmit={handleSubmit} className="space-y-8">

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
                                <div className="relative" ref={nationalityRef}>
                                    <input
                                        type="text"
                                        value={nationalitySearch}
                                        onChange={(e) =>
                                            handleNationalitySearch(e.target.value)
                                        }
                                        onFocus={() => {
                                            if (nationalitySearch.length === 0) {
                                                setFilteredNationalities(nationalityList);
                                                setShowNationalitySuggestions(true);
                                            } else if (filteredNationalities.length > 0) {
                                                setShowNationalitySuggestions(true);
                                            }
                                        }}
                                        className="w-full px-4 py-3 border border-soft-pink/30 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent bg-cream font-light transition"
                                        placeholder="Type to search nationality..."
                                        autoComplete="off"
                                    />

                                    {showNationalitySuggestions && filteredNationalities.length > 0 && (
                                        <div className="absolute z-10 w-full mt-1 bg-white/95 backdrop-blur-sm border border-soft-pink/20 rounded-lg shadow-lg max-h-60 overflow-auto">
                                            {filteredNationalities.slice(0, 3).map((nat) => (
                                                <button
                                                    key={nat.id}
                                                    type="button"
                                                    onClick={() => selectNationality(nat)}
                                                    className="w-full px-4 py-3 text-left transition border-b border-soft-pink/10 last:border-b-0 hover:bg-soft-pink/10"
                                                >
                                                    <p className="font-light text-foreground text-sm">
                                                        {nat.name}
                                                    </p>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
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

                    <div
                        className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
                            openAddMainItemModal
                                ? "opacity-100 visible"
                                : "opacity-0 invisible"
                        }`}
                        onClick={() => setOpenAddMainItemModal(false)}
                    ></div>

                    <AddMainItemModal
                        open={openAddMainItemModal}
                        menuItems={menuItems}
                        setOpen={setOpenAddMainItemModal}
                        setConfirmedMainItems={setConfirmedMainItems}
                    />

                    <div
                        className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
                            openAddExtraItemModal
                                ? "opacity-100 visible"
                                : "opacity-0 invisible"
                        }`}
                        onClick={() => setOpenAddExtraItemModal(false)}
                    ></div>

                    <AddExtraItemModal
                        open={openAddExtraItemModal}
                        extraItems={extraItems}
                        setOpen={setOpenAddExtraItemModal}
                        setConfirmedExtraItems={setConfirmedExtraItems}
                    />

                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm p-8 space-y-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-light text-foreground uppercase tracking-wide">
                                Order Items
                            </h2>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-light text-foreground">
                                    Main Items
                                </h3>
                                <button
                                    type="button"
                                    onClick={() => setOpenAddMainItemModal(true)}
                                    className="px-4 py-2 rounded-lg cursor-pointer transition btn-brand-blue text-sm font-light"
                                >
                                    + Add Main Item
                                </button>
                            </div>

                            {confirmedMainItems.length === 0 ? (
                                <div className="flex items-center gap-4 p-4 rounded-lg bg-soft-pink/10 border border-soft-pink/20">
                                    <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-soft-pink/20">
                                        <svg
                                            className="w-4 h-4 text-brand-red"
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
                                        No main items added yet.
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {confirmedMainItems.map((item, index) => (
                                        <div key={index} className="flex justify-between items-center border-b pb-3 border-brand/30">
                                            <div className="flex-1">
                                                <p className="font-medium text-foreground">
                                                    {item.item_name} - {item.variant_name}
                                                </p>
                                                <p className="text-sm text-text-light">
                                                    Quantity: {item.quantity} × ${item.price}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <p className="font-semibold text-brand-red">
                                                    ${(item.quantity * item.price).toFixed(2)}
                                                </p>
                                                <button
                                                    type="button"
                                                    onClick={() => removeMainItem(index)}
                                                    className="text-brand-red hover:text-red-700 transition"
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="relative py-4">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gradient-to-r from-transparent via-brand-blue/30 to-transparent"></div>
                            </div>
                            <div className="relative flex justify-center">
                                <span className="bg-white px-4 text-sm text-text-light font-light">
                                    •••
                                </span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-light text-foreground">
                                    Extra Items
                                </h3>
                                <button
                                    type="button"
                                    onClick={() => setOpenAddExtraItemModal(true)}
                                    className="px-4 py-2 rounded-lg cursor-pointer transition btn-brand-blue text-sm font-light"
                                >
                                    + Add Extras
                                </button>
                            </div>

                            {confirmedExtraItems.length === 0 ? (
                                <div className="flex items-center gap-4 p-4 rounded-lg bg-soft-pink/10 border border-soft-pink/20">
                                    <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-soft-pink/20">
                                        <svg
                                            className="w-4 h-4 text-brand-red"
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
                                        No extra items added yet.
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {confirmedExtraItems.map((item, index) => (
                                        <div key={index} className="flex justify-between items-center border-b pb-3 border-brand/30">
                                            <div className="flex-1">
                                                <p className="font-medium text-foreground">
                                                    {item.name}
                                                </p>
                                                <p className="text-sm text-text-light">
                                                    Quantity: {item.quantity} × ${item.price}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <p className="font-semibold text-brand-red">
                                                    ${(item.quantity * item.price).toFixed(2)}
                                                </p>
                                                <button
                                                    type="button"
                                                    onClick={() => removeExtraItem(index)}
                                                    className="text-brand-red hover:text-red-700 transition"
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

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
