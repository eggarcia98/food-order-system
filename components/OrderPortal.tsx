"use client";

import { useEffect, useRef, useState } from "react";

import AddExtraItemModal from "@/components/AddExtraItemModal";
import AddMainItemModal from "@/components/AddMainItemModal";
import {
    ExtraOrderItem,
    MainOrderItem,
    calculateExtraItemTotal,
    calculateMainItemTotal,
    formatCurrency,
} from "@/lib/order-types";
import { ExtraItem, MenuItem, Nationality } from "@/lib/domain";

export default function OrderPortal() {
    const [phoneNumber, setPhoneNumber] = useState("");
    const [lastname, setLastname] = useState("");
    const [firstname, setFirstname] = useState("");
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [confirmedMainItems, setConfirmedMainItems] = useState<MainOrderItem[]>([]);
    const [confirmedExtraItems, setConfirmedExtraItems] = useState<ExtraOrderItem[]>([]);
    const [nationality, setNationality] = useState({});
    const [nationalityList, setNationalityList] = useState<Nationality[]>([
        { id: 1, name: "Ecuadorian" },
    ]);
    const [openAddMainItemModal, setOpenAddMainItemModal] = useState(false);
    const [openAddExtraItemModal, setOpenAddExtraItemModal] = useState(false);
    const [extraItems, setExtraItems] = useState<ExtraItem[]>([]);
    const [comments, setComments] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState<{
        type: "success" | "error";
        text: string;
    } | null>(null);
    const [nationalitySearch, setNationalitySearch] = useState("");
    const [showNationalitySuggestions, setShowNationalitySuggestions] = useState(false);
    const [filteredNationalities, setFilteredNationalities] = useState<Nationality[]>([]);
    const nationalityRef = useRef<HTMLDivElement>(null);
    const quickNationalityTerms = ["ecuador", "colombia", "peru", "australian"];

    const fetchNationalities = async () => {
        try {
            const response = await fetch("/api/nationalities");
            if (!response.ok) throw new Error("Failed to fetch");
            const data = await response.json();
            setNationalityList(data);
        } catch {
        }
    };

    const fetchExtraItems = async () => {
        try {
            const response = await fetch("/api/menu_extras");
            if (!response.ok) throw new Error("Failed to fetch");
            const data = await response.json();
            setExtraItems(data);
        } catch {
        }
    };

    const fetchMenuItems = async () => {
        try {
            const response = await fetch("/api/menu_items");
            if (!response.ok) throw new Error("Failed to fetch");
            const data = await response.json();
            setMenuItems(data);
        } catch (error) {
            console.error("Error fetching menu items:", error);
        }
    };

    useEffect(() => {
        fetchNationalities();
        fetchExtraItems();
        fetchMenuItems();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (nationalityRef.current && !nationalityRef.current.contains(event.target as Node)) {
                setShowNationalitySuggestions(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
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
        } catch {
            setMessage({
                type: "error",
                text: "Failed to register order. Please try again.",
            });
        } finally {
            setIsSubmitting(false);
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

    const selectNationality = (selectedNat: Nationality) => {
        setNationalitySearch(selectedNat.name);
        setNationality({ id: selectedNat.id });
        setShowNationalitySuggestions(false);
    };

    const selectQuickNationality = (value: string) => {
        setNationalitySearch(value);

        const matchedNationality = nationalityList.find((nat) =>
            nat.name.toLowerCase().includes(value.toLowerCase())
        );

        if (matchedNationality) {
            setNationality({ id: matchedNationality.id });
            setFilteredNationalities([matchedNationality]);
            setShowNationalitySuggestions(false);
            return;
        }

        setNationality({});
        setFilteredNationalities(nationalityList.filter((nat) =>
            nat.name.toLowerCase().includes(value.toLowerCase())
        ));
        setShowNationalitySuggestions(false);
    };

    const quickNationalityOptions = quickNationalityTerms
        .map((term) => nationalityList.find((nat) => nat.name.toLowerCase().includes(term)))
        .filter((nationality): nationality is Nationality => Boolean(nationality));

    return (
        <div
            className={`flex flex-col m-8 min-h-screen bg-linear-to-b from-background via-cream/30 to-background`}
        >
            <div className="w-full max-w-5xl mx-auto p-6 grow">
                <div className="flex justify-between">

                    <div className="mb-8">
                        <h1 className="text-4xl font-light text-foreground mb-2">
                            New Order
                        </h1>
                        <p className="text-sm text-text-light font-light">
                            Register your orders quickly and easily
                        </p>
                    </div>

                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="space-y-6 rounded-2xl bg-white/80 p-8 shadow-sm backdrop-blur-sm">
                        <h2 className="text-xl font-light uppercase tracking-wide text-foreground">
                            Customer Information
                        </h2>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div className="relative">
                                <label className="mb-2 block text-sm font-light text-text-light">
                                    Phone Number
                                    <span className="ml-1 text-brand-red">*</span>
                                </label>
                                <input
                                    type="tel"
                                    required
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    className="w-full rounded-lg border border-soft-pink/30 bg-cream px-4 py-3 font-light transition focus:border-transparent focus:ring-2 focus:ring-brand-blue"
                                    placeholder="+1 234 567 8900"
                                    autoComplete="tel"
                                />
                            </div>

                            <div>
                                <div className="mb-2 flex flex-wrap items-center gap-2">
                                    <label className="text-sm font-light text-text-light">
                                        Nationality
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {quickNationalityOptions.map((option) => (
                                            <button
                                                key={option.id}
                                                type="button"
                                                onClick={() => selectNationality(option)}
                                                className="rounded-full border border-soft-pink/30 bg-cream px-3 py-1 text-xs font-light text-text-light transition hover:border-brand-blue hover:text-brand-blue"
                                            >
                                                {option.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="relative" ref={nationalityRef}>
                                    <input
                                        type="text"
                                        value={nationalitySearch}
                                        onChange={(e) => handleNationalitySearch(e.target.value)}
                                        onFocus={() => {
                                            if (nationalitySearch.length === 0) {
                                                setFilteredNationalities(nationalityList);
                                                setShowNationalitySuggestions(true);
                                            } else if (filteredNationalities.length > 0) {
                                                setShowNationalitySuggestions(true);
                                            }
                                        }}
                                        className="w-full rounded-lg border border-soft-pink/30 bg-cream px-4 py-3 font-light transition focus:border-transparent focus:ring-2 focus:ring-brand-blue"
                                        placeholder="Type to search nationality..."
                                        autoComplete="off"
                                    />

                                    {showNationalitySuggestions && filteredNationalities.length > 0 && (
                                        <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-soft-pink/20 bg-white/95 shadow-lg backdrop-blur-sm">
                                            {filteredNationalities.slice(0, 3).map((nat) => (
                                                <button
                                                    key={nat.id}
                                                    type="button"
                                                    onClick={() => selectNationality(nat)}
                                                    className="w-full border-b border-soft-pink/10 px-4 py-3 text-left transition last:border-b-0 hover:bg-soft-pink/10"
                                                >
                                                    <p className="text-sm font-light text-foreground">
                                                        {nat.name}
                                                    </p>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div className="relative">
                                <label className="mb-2 block text-sm font-light text-text-light">
                                    First Name
                                    <span className="ml-1 text-brand-red">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={firstname}
                                    onChange={(e) => setFirstname(e.target.value)}
                                    className="w-full rounded-lg border border-soft-pink/30 bg-cream px-4 py-3 font-light transition focus:border-transparent focus:ring-2 focus:ring-brand-blue"
                                    placeholder="John"
                                    autoComplete="given-name"
                                />
                            </div>

                            <div className="relative">
                                <label className="mb-2 block text-sm font-light text-text-light">
                                    Last Name
                                    <span className="ml-1 text-brand-red">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={lastname}
                                    onChange={(e) => setLastname(e.target.value)}
                                    className="w-full rounded-lg border border-soft-pink/30 bg-cream px-4 py-3 font-light transition focus:border-transparent focus:ring-2 focus:ring-brand-blue"
                                    placeholder="Doe"
                                    autoComplete="family-name"
                                />
                            </div>
                        </div>
                    </div>

                    <div
                        className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
                            openAddMainItemModal ? "visible opacity-100" : "invisible opacity-0"
                        }`}
                        onClick={() => setOpenAddMainItemModal(false)}
                    />

                    <AddMainItemModal
                        open={openAddMainItemModal}
                        menuItems={menuItems}
                        setOpen={setOpenAddMainItemModal}
                        setConfirmedMainItems={setConfirmedMainItems}
                    />

                    <div
                        className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
                            openAddExtraItemModal ? "visible opacity-100" : "invisible opacity-0"
                        }`}
                        onClick={() => setOpenAddExtraItemModal(false)}
                    />

                    <AddExtraItemModal
                        open={openAddExtraItemModal}
                        extraItems={extraItems}
                        setOpen={setOpenAddExtraItemModal}
                        setConfirmedExtraItems={setConfirmedExtraItems}
                    />

                    <div className="space-y-6 rounded-2xl bg-white/80 p-8 shadow-sm backdrop-blur-sm">
                        <div className="mb-6 flex items-center justify-between">
                            <h2 className="text-xl font-light uppercase tracking-wide text-foreground">
                                Order Items
                            </h2>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-light text-foreground">
                                    Main Items
                                </h3>
                                <button
                                    type="button"
                                    onClick={() => setOpenAddMainItemModal(true)}
                                    className="cursor-pointer rounded-lg px-4 py-2 text-sm font-light transition btn-brand-blue"
                                >
                                    + Add Main Item
                                </button>
                            </div>

                            {confirmedMainItems.length === 0 ? (
                                <div className="flex items-center gap-4 rounded-lg border border-soft-pink/20 bg-soft-pink/10 p-4">
                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-soft-pink/20">
                                        <svg className="h-4 w-4 text-brand-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                    </div>
                                    <p className="text-sm font-light text-text-light">
                                        No main items added yet.
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {confirmedMainItems.map((item, index) => (
                                        <div key={index} className="flex items-center justify-between border-b border-brand/30 pb-3">
                                            <div className="flex-1">
                                                <p className="font-medium text-foreground">
                                                    {item.item_name} - {item.variant_name}
                                                </p>
                                                <p className="text-sm text-text-light">
                                                    Quantity: {item.quantity} × {formatCurrency(Number(item.price))}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <p className="font-semibold text-brand-red">
                                                    {formatCurrency(calculateMainItemTotal(item))}
                                                </p>
                                                <button
                                                    type="button"
                                                    onClick={() => removeMainItem(index)}
                                                    className="text-brand-red transition hover:text-red-700"
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
                                <div className="w-full border-t border-gradient-to-r from-transparent via-brand-blue/30 to-transparent" />
                            </div>
                            <div className="relative flex justify-center">
                                <span className="bg-white px-4 text-sm font-light text-text-light">
                                    •••
                                </span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-light text-foreground">
                                    Extra Items
                                </h3>
                                <button
                                    type="button"
                                    onClick={() => setOpenAddExtraItemModal(true)}
                                    className="cursor-pointer rounded-lg px-4 py-2 text-sm font-light transition btn-brand-blue"
                                >
                                    + Add Extras
                                </button>
                            </div>

                            {confirmedExtraItems.length === 0 ? (
                                <div className="flex items-center gap-4 rounded-lg border border-soft-pink/20 bg-soft-pink/10 p-4">
                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-soft-pink/20">
                                        <svg className="h-4 w-4 text-brand-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                    </div>
                                    <p className="text-sm font-light text-text-light">
                                        No extra items added yet.
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {confirmedExtraItems.map((item, index) => (
                                        <div key={index} className="flex items-center justify-between border-b border-brand/30 pb-3">
                                            <div className="flex-1">
                                                <p className="font-medium text-foreground">
                                                    {item.name}
                                                </p>
                                                <p className="text-sm text-text-light">
                                                    Quantity: {item.quantity} × {formatCurrency(Number(item.price))}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <p className="font-semibold text-brand-red">
                                                    {formatCurrency(calculateExtraItemTotal(item))}
                                                </p>
                                                <button
                                                    type="button"
                                                    onClick={() => removeExtraItem(index)}
                                                    className="text-brand-red transition hover:text-red-700"
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

                    <div className="rounded-2xl bg-white/80 p-8 shadow-sm backdrop-blur-sm">
                        <label className="block text-sm font-light uppercase tracking-wide text-foreground mb-3">
                            Special Notes
                        </label>
                        <textarea
                            value={comments}
                            onChange={(e) => setComments(e.target.value)}
                            rows={4}
                            className="w-full resize-none rounded-lg border border-soft-pink/30 bg-cream px-4 py-3 font-light transition focus:border-transparent focus:ring-2 focus:ring-brand-blue"
                            placeholder="Additional notes or special instructions..."
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full rounded-lg py-4 text-base font-light shadow-lg transition hover:shadow-xl disabled:cursor-not-allowed ${
                            isSubmitting ? "bg-gray-400 text-gray-600" : "btn-brand-blue"
                        }`}
                    >
                        {isSubmitting ? "Submitting Order..." : "Register Order"}
                    </button>

                    {message?.type === "success" && (
                        <div
                            className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-4 backdrop-blur-sm"
                            role="alertdialog"
                            aria-live="assertive"
                            aria-modal="true"
                            onClick={() => setMessage(null)}
                        >
                            <div
                                className="w-full max-w-md rounded-3xl border border-soft-pink/30 bg-white/95 p-6 text-center shadow-2xl shadow-brand-blue/10"
                                onClick={(event) => event.stopPropagation()}
                            >
                                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-soft-blue/20">
                                    <svg className="h-7 w-7 text-brand-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-light text-foreground">
                                    Order submitted
                                </h3>
                                <p className="mt-2 text-sm font-light text-text-light">
                                    {message.text}
                                </p>
                                <button
                                    type="button"
                                    onClick={() => setMessage(null)}
                                    className="mt-5 rounded-lg px-5 py-2 text-sm font-light transition btn-brand-blue"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    )}

                    {message?.type === "error" && (
                        <div className="mb-6 rounded-2xl border border-rose/30 bg-rose/20 p-4 text-sm font-light text-brand-red backdrop-blur-sm">
                            {message.text}
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}