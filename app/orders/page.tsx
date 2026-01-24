// app/orders/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { LayoutList, List } from "lucide-react";

export interface Order {
    id: number;
    order_code: string;
    customer_id: number;
    comments: string;
    created_at: string; // ISO date string
    customer: Customer;
    order_items: OrderItem[];
    order_item_extras: OrderExtraItem[];
    status: any;
}

export interface Customer {
    id: number;
    first_name: string;
    last_name: string;
    phone_number: string;
    nationality_id: number;
}

export interface OrderItem {
    id: number;
    order_id: number;
    quantity: number;
    variant_id: number;
    ItemVariant: ItemVariant;
}

export interface ItemVariant {
    id: number;
    variant_name: string;
    price: number;
    img?: string;
    extras?: string;
    MenuItem?: {
        id: number;
        name: string;
        category_id: number | null;
    };
}

export interface OrderExtraItem {
    id: number;
    order_id: number;
    extra_id: number;
    quantity: number;
    MenuExtras: Extra;
}

export interface Extra {
    extra_id: number;
    name: string;
    cost: number;
    price: number;
    description: string;
}

export default function OrdersList() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [viewMode, setViewMode] = useState<"detailed" | "compact">(
        "detailed",
    );
    const [userSetViewMode, setUserSetViewMode] = useState(false);
    const [expandedOrders, setExpandedOrders] = useState<Set<number>>(new Set());

    // Get current week (Monday - Sunday)
    const getWeekDates = () => {
        const now = new Date();
        const dayOfWeek = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
        const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Adjust if Sunday

        const monday = new Date(now);
        monday.setDate(now.getDate() + diff + 1); // I have to check timezone of database
        monday.setHours(0, 0, 0, 0);

        const sunday = new Date(monday);
        sunday.setDate(monday.getDate() + 6);
        sunday.setHours(23, 59, 59, 999);

        return { monday, sunday };
    };

    const { monday: currentMonday, sunday: currentSunday } = getWeekDates();
    const [startDate, setStartDate] = useState(
        currentMonday.toISOString().split("T")[0]
    );
    const [endDate, setEndDate] = useState(
        currentSunday.toISOString().split("T")[0]
    );

    useEffect(() => {
        fetchOrders();
    }, []);

    // Set default view mode based on screen size (compact for small screens, detailed for larger)
    useEffect(() => {
        if (typeof window === "undefined") return;
        const mql = window.matchMedia("(max-width: 768px)");
        const apply = () => {
            if (!userSetViewMode) {
                setViewMode(mql.matches ? "compact" : "detailed");
            }
        };
        apply();
        mql.addEventListener("change", apply);
        return () => mql.removeEventListener("change", apply);
    }, [userSetViewMode]);

    const fetchOrders = async () => {
        try {
            setIsLoading(true);
            const response = await fetch("/api/orders");
            if (!response.ok) throw new Error("Failed to fetch orders");
            const data: Order[] = await response.json();
            setOrders(data);
        } catch (err) {
            setError("Failed to load orders. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const getSidesForOrder = (order: Order) => {
        return order.order_item_extras.map((osi) => {
            return {
                id: osi.MenuExtras.extra_id,
                name: osi.MenuExtras.name,
                price: osi.MenuExtras.price,
                quantity: osi.quantity,
            };
        });
    };

    const filteredOrders = orders.filter((order) => {
        const customerName = `${order.customer.first_name} ${order.customer.last_name}`;

        const matchesSearch =
            customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.customer.phone_number.includes(searchTerm) ||
            order.order_items.some((item) =>
                item.ItemVariant.variant_name.toLowerCase().includes(searchTerm.toLowerCase())
            );

        const orderDate = new Date(order.created_at);
        const start = new Date(startDate);
        start.setHours(0, 0, 0, 0);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);

        const matchesDate = orderDate >= start && orderDate <= end;

        return matchesSearch && matchesDate;
    });

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            timeZone: "Australia/Brisbane",
        });
    };

    const formatDateShort = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            timeZone: "Australia/Brisbane",
        });
    };

    const updateOrderStatus = async (orderId: number, status_id: number) => {
        try {
            const response = await fetch(`/api/orders/${orderId}/dispatch`, {
                method: "PUT",
                body: JSON.stringify({ status_id }),
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (!response.ok) throw new Error("Failed to update order status");
            // Refresh orders after updating status
            fetchOrders();
        } catch (err) {
            setError("Failed to update order status. Please try again.");
        }
    };

    const getMenuItemSummary = (orders: Order[]) => {
        const menuItemCounts: {
            [key: string]: { name: string; received: number; dispatched: number };
        } = {};
        orders
            // Exclude cancelled orders (status id 6)
            .filter((order) => order.status?.id !== 6)
            .forEach((order) => {
                const isReceived = order.status?.id === 1;
                const isDispatched = order.status?.id === 5;
                order.order_items.forEach((item) => {
                    const menuId = item.ItemVariant.MenuItem?.id;
                    const menuName =
                        item.ItemVariant.MenuItem?.name || item.ItemVariant.variant_name;
                    const key = menuId == null ? `unknown-${menuName}` : String(menuId);
                    const existing = menuItemCounts[key] || {
                        name: menuName,
                        received: 0,
                        dispatched: 0,
                    };
                    menuItemCounts[key] = {
                        name: existing.name,
                        received: existing.received + (isReceived ? item.quantity : 0),
                        dispatched: existing.dispatched + (isDispatched ? item.quantity : 0),
                    };
                });
            });
        return Object.entries(menuItemCounts)
            .sort(([, a], [, b]) => (b.received + b.dispatched) - (a.received + a.dispatched))
            .slice(0, 10);
    };

    const getTotalItems = (orderItem: OrderItem[]) => {
        return orderItem.reduce((sum, item) => sum + item.quantity, 0);
    };

    const setThisWeek = () => {
        const { monday, sunday } = getWeekDates();
        setStartDate(monday.toISOString().split("T")[0]);
        setEndDate(sunday.toISOString().split("T")[0]);
    };

    const setToday = () => {
        const today = new Date().toISOString().split("T")[0];
        setStartDate(today);
        setEndDate(today);
    };

    const setThisMonth = () => {
        const now = new Date();
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        setStartDate(firstDay.toISOString().split("T")[0]);
        setEndDate(lastDay.toISOString().split("T")[0]);
    };

    const getTotal = (order: Order) => {
        const sidesForOrder = getSidesForOrder(order);
        const sidesTotal = sidesForOrder.reduce(
            (acc, side) => acc + side.price * side.quantity,
            0
        );
        const dishesTotal = order.order_items.reduce(
            (acc, item) => acc + item.ItemVariant.price * item.quantity,
            0
        );
        return sidesTotal + dishesTotal;
    };

    const summarizeMainItems = (order: Order) => {
        if (!order.order_items?.length) return "—";
        return order.order_items
            .map((item) => `${item.ItemVariant.variant_name} ×${item.quantity}`)
            .join(", ");
    };

    const summarizeExtras = (order: Order) => {
        const sides = getSidesForOrder(order);
        if (!sides.length) return "—";
        return sides
            .map((side) => `${side.name} ×${side.quantity}`)
            .join(", ");
    };

    const toggleOrderExpand = (orderId: number) => {
        setExpandedOrders((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(orderId)) {
                newSet.delete(orderId);
            } else {
                newSet.add(orderId);
            }
            return newSet;
        });
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div 
                        className="animate-spin rounded-full h-12 w-12 border-b-2 border-b-brand-red mx-auto"
                    ></div>
                    <p className="mt-4 text-text-light font-light">Loading orders...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-12 px-4 bg-gradient-to-b from-background via-cream/30 to-background">
            <div className="max-w-6xl mx-auto ">
                {/* Header */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm p-7 mb-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h1 className="text-4xl font-light text-foreground mb-2">
                                Orders History
                            </h1>
                            <p className="text-sm text-text-light font-light">
                                View and manage your orders
                            </p>
                        </div>
                        <Link
                            href="/"
                            className="px-6 py-3 font-light rounded-lg transition shadow-lg hover:shadow-xl btn-brand-blue whitespace-nowrap"
                        >
                            + New Order
                        </Link>
                    </div>

                    {/* Search Bar */}
                    <div className="mt-6">
                        <input
                            type="text"
                            placeholder="Search by name, phone, or dish..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full box-border px-4 py-3 border border-soft-pink/30 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent bg-cream font-light transition"
                        />
                    </div>

                    {/* Date Filter */}
                    <div className="mt-6 space-y-4">
                        <h3 className="text-sm font-light uppercase tracking-wide text-foreground">
                            Filter by Date
                        </h3>

                        {/* Quick Filters */}
                        <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                            <button
                                onClick={setToday}
                                className="px-5 py-2.5 rounded-full transition text-sm font-light border-2 border-brand-red text-brand-red bg-white hover:bg-rose/10 cursor-pointer"
                            >
                                Today
                            </button>
                            <button
                                onClick={setThisWeek}
                                className="px-5 py-2.5 rounded-full transition text-sm font-light border-2 border-brand-blue text-brand-blue bg-white hover:bg-soft-blue/10 cursor-pointer"
                            >
                                This Week
                            </button>
                            <button
                                onClick={setThisMonth}
                                className="px-5 py-2.5 rounded-full transition text-sm font-light border-2 border-accent-blue text-accent-blue bg-white hover:bg-soft-purple/10 cursor-pointer"
                            >
                                This Month
                            </button>
                        </div>

                        {/* Date Inputs */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-light mb-2 text-text-light">
                                    Start Date
                                </label>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) =>
                                        setStartDate(e.target.value)
                                    }
                                    className="w-full box-border h-12 px-4 border border-soft-pink/30 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent bg-cream font-light transition appearance-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-light mb-2 text-text-light">
                                    End Date
                                </label>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="w-full box-border h-12 px-4 border border-soft-pink/30 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent bg-cream font-light transition appearance-none"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* View Mode Toggle */}
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm p-4 mb-1">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-light uppercase tracking-wide text-foreground">
                            View Mode
                        </h3>
                        <div className="inline-flex rounded-lg bg-cream border border-soft-pink/30 overflow-hidden">
                            <button
                                type="button"
                                onClick={() => {
                                    setUserSetViewMode(true);
                                    setViewMode("detailed");
                                }}
                                className={`px-4 py-2.5 text-sm font-light transition flex items-center gap-2 ${
                                    viewMode === "detailed"
                                        ? "bg-soft-blue/30 text-brand-blue"
                                        : "text-text-light hover:bg-soft-blue/10"
                                }`}
                                title="Detailed View"
                            >
                                <LayoutList className="w-4 h-4" />
                                <span className="hidden sm:inline">
                                    Detailed
                                </span>
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setUserSetViewMode(true);
                                    setViewMode("compact");
                                }}
                                className={`px-4 py-2.5 text-sm font-light transition border-l border-soft-pink/30 flex items-center gap-2 ${
                                    viewMode === "compact"
                                        ? "bg-rose/30 text-brand-red"
                                        : "text-text-light hover:bg-rose/10"
                                }`}
                                title="Compact View"
                            >
                                <List className="w-4 h-4" />
                                <span className="hidden sm:inline">
                                    Compact
                                </span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Items Summary (by Menu Item) */}
                {filteredOrders.length > 0 && (
                    <div className=" backdrop-blur-sm rounded-2xl p-5 ">
                        <div className="text-center text-xs md:text-sm font-light text-foreground flex flex-wrap justify-center gap-y-1">
                            {getMenuItemSummary(filteredOrders).map(([id, data], idx, arr) => (
                                <span key={id} className="inline-flex items-center">
                                    <span>{data.name}</span>
                                    <span className="ml-2">
                                        <span className="text-brand-red">{data.received}</span>
                                        <span className="mx-1 text-text-light">|</span>
                                        <span className="text-brand-blue">{data.dispatched}</span>
                                    </span>
                                    {idx < arr.length - 1 && (
                                        <span className="mx-2 text-text-light">‧</span>
                                    )}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="rounded-lg p-4 mb-6 bg-rose/20 text-brand-red border border-rose/40 font-light text-sm">
                        {error}
                    </div>
                )}

                {/* Orders List */}
                {filteredOrders.length === 0 ? (
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm p-12 text-center">
                        <div className="mb-4 text-brand-red/40">
                            <svg
                                className="w-16 h-16 mx-auto"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                            </svg>
                        </div>
                        <h3 className="text-lg font-light mb-2 text-foreground">
                            {searchTerm ? "No orders found" : "No orders yet"}
                        </h3>
                        <p className="text-sm text-text-light font-light">
                            {searchTerm
                                ? "Try a different search term"
                                : "Start by creating your first order"}
                        </p>
                    </div>
                ) : viewMode === "compact" ? (
                    <div className="space-y-3">
                        {filteredOrders.map((order) => {
                            const isExpanded = expandedOrders.has(order.id);
                            return (
                                <div
                                    key={order.id}
                                    className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm hover:shadow-md transition overflow-hidden"
                                >
                                    {/* Compact Row */}
                                    <div className="flex items-center justify-between p-4 gap-4">
                                        {/* Client Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="font-light text-foreground text-sm">
                                                {order.customer.first_name}{" "}
                                                {order.customer.last_name}
                                            </div>
                                            <div className="text-xs text-text-light truncate">
                                                {order.customer.phone_number}
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex items-center gap-2">
                                            {order.status.id === 1 && (
                                                <>
                                                    <button
                                                        onClick={() =>
                                                            updateOrderStatus(
                                                                order.id,
                                                                5,
                                                            )
                                                        }
                                                        className="p-2 rounded-lg transition bg-soft-blue/20 hover:bg-soft-blue/40 text-brand-blue"
                                                        title="Confirm Order"
                                                    >
                                                        <svg
                                                            className="w-5 h-5"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M5 13l4 4L19 7"
                                                            />
                                                        </svg>
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            updateOrderStatus(
                                                                order.id,
                                                                6,
                                                            )
                                                        }
                                                        className="p-2 rounded-lg transition bg-rose/20 hover:bg-rose/40 text-brand-red"
                                                        title="Cancel Order"
                                                    >
                                                        <svg
                                                            className="w-5 h-5"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M6 18L18 6M6 6l12 12"
                                                            />
                                                        </svg>
                                                    </button>
                                                </>
                                            )}
                                            {/* Total */}
                                            <div className="text-right">
                                                <div className="font-light text-brand-blue text-lg">
                                                    $
                                                    {getTotal(order).toFixed(2)}
                                                </div>
                                                <div className="text-xs text-text-light">
                                                    {order.status.name}
                                                    </div>
                                            </div>
                                            {/* Expand Button */}
                                            <button
                                                onClick={() =>
                                                    toggleOrderExpand(order.id)
                                                }
                                                className="p-2 rounded-lg transition bg-soft-pink/20 hover:bg-soft-pink/40 text-foreground"
                                                title={
                                                    isExpanded
                                                        ? "Collapse"
                                                        : "Expand Details"
                                                }
                                            >
                                                <svg
                                                    className={`w-5 h-5 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M19 9l-7 7-7-7"
                                                    />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Expanded Details */}
                                    {isExpanded && (
                                        <div className="px-4 pb-4 pt-2 border-t border-soft-pink/20 space-y-3">
                                            {/* Main Items */}
                                            <div>
                                                <div className="text-xs text-text-light uppercase tracking-wide mb-1">
                                                    Main Items
                                                </div>
                                                <div className="text-sm text-foreground font-light">
                                                    {order.order_items.map(
                                                        (item, idx) => (
                                                            <div
                                                                key={item.id}
                                                                className="py-1"
                                                            >
                                                                •{" "}
                                                                {
                                                                    item
                                                                        .ItemVariant
                                                                        .variant_name
                                                                }{" "}
                                                                ×{item.quantity}
                                                            </div>
                                                        ),
                                                    )}
                                                </div>
                                            </div>

                                            {/* Extras */}
                                            {getSidesForOrder(order).length >
                                                0 && (
                                                <div>
                                                    <div className="text-xs text-text-light uppercase tracking-wide mb-1">
                                                        Extras
                                                    </div>
                                                    <div className="text-sm text-foreground font-light">
                                                        {getSidesForOrder(
                                                            order,
                                                        ).map((side) => (
                                                            <div
                                                                key={side.id}
                                                                className="py-1"
                                                            >
                                                                • {side.name} ×
                                                                {side.quantity}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Comments */}
                                            {order.comments && (
                                                <div>
                                                    <div className="text-xs text-text-light uppercase tracking-wide mb-1">
                                                        Notes
                                                    </div>
                                                    <div className="text-sm text-foreground font-light italic">
                                                        {order.comments}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Created Date */}
                                            <div className="text-xs text-text-light pt-2">
                                                Created:{" "}
                                                {formatDate(order.created_at)}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <>
                        {/* Orders Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredOrders
                                .sort((a, b) => {
                                    // Pending orders (status id 1) first, completed orders (status id 5 or 6) last
                                    const aIsPending = a.status.id === 1;
                                    const bIsPending = b.status.id === 1;
                                    if (aIsPending && !bIsPending) return -1;
                                    if (!aIsPending && bIsPending) return 1;
                                    return 0;
                                })
                                .map((order) => (
                                    <div
                                        key={order.id}
                                        className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm hover:shadow-md transition p-4 flex flex-col aspect-square"
                                    >
                                        {/* Header with Customer Name and Info */}
                                        <div className="flex justify-between items-start mb-3 pb-3 border-b border-soft-pink/20">
                                            <div className="flex-1">
                                                <h3 className="text-sm font-light text-foreground leading-tight">
                                                    {order.customer.first_name}{" "}
                                                    {order.customer.last_name}{" "}
                                                    <span className="text-xs text-gray-400 italic">
                                                        (
                                                        {formatDateShort(
                                                            order.created_at,
                                                        )}
                                                        )
                                                    </span>
                                                </h3>
                                                <p className="text-xs text-brand-red font-light">
                                                    {
                                                        order.customer
                                                            .phone_number
                                                    }
                                                </p>
                                            </div>
                                            <div className="text-right text-xs space-y-1 ml-2">
                                                <div className="text-brand-blue font-light">
                                                    {order.status.name}
                                                </div>
                                                <p className="text-text-light font-light text-xs">
                                                    {getTotalItems(
                                                        order.order_items,
                                                    )}{" "}
                                                    item(s)
                                                </p>
                                            </div>
                                        </div>

                                        {/* Dishes */}
                                        <div className="space-y-1 mb-2">
                                            <h4 className="font-light uppercase tracking-wide text-foreground text-xs">
                                                Dishes
                                            </h4>
                                            <div className="space-y-1">
                                                {order.order_items.map(
                                                    (orderItem) => (
                                                        <div
                                                            key={orderItem.id}
                                                            className="text-xs text-foreground font-light grid grid-cols-3 gap-2"
                                                        >
                                                            <span className="col-span-1 truncate">
                                                                {
                                                                    orderItem
                                                                        .ItemVariant
                                                                        .variant_name
                                                                }
                                                            </span>
                                                            <span className="text-brand-red text-right">
                                                                ×
                                                                {
                                                                    orderItem.quantity
                                                                }
                                                            </span>
                                                            <span className="text-brand-blue text-right">
                                                                $
                                                                {(
                                                                    orderItem
                                                                        .ItemVariant
                                                                        .price *
                                                                    orderItem.quantity
                                                                ).toFixed(2)}
                                                            </span>
                                                        </div>
                                                    ),
                                                )}
                                            </div>
                                        </div>

                                        {/* Sides */}
                                        {getSidesForOrder(order).length > 0 && (
                                            <div className="space-y-1 mb-2">
                                                <h4 className="font-light uppercase tracking-wide text-foreground text-xs">
                                                    Sides
                                                </h4>
                                                <div className="space-y-1">
                                                    {getSidesForOrder(
                                                        order,
                                                    ).map((side) => (
                                                        <div
                                                            key={side.id}
                                                            className="text-xs text-foreground font-light grid grid-cols-3 gap-2"
                                                        >
                                                            <span className="col-span-1 truncate">
                                                                {side.name}
                                                            </span>
                                                            <span className="text-brand-red text-right">
                                                                ×{side.quantity}
                                                            </span>
                                                            <span className="text-brand-blue text-right">
                                                                $
                                                                {(
                                                                    side.price *
                                                                    side.quantity
                                                                ).toFixed(2)}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Total */}
                                        <div className="mt-auto pt-3 border-t border-soft-pink/20 mb-3">
                                            <div className="flex justify-between items-center">
                                                <h4 className="font-light text-foreground text-xs">
                                                    Total
                                                </h4>
                                                <p className="font-light text-base text-brand-blue">
                                                    $
                                                    {getTotal(order).toFixed(2)}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Comments */}
                                        {order.comments ? (
                                            <div className="mb-3 p-2 rounded-lg bg-soft-pink/20 border border-soft-pink/30">
                                                <p className="text-xs text-foreground font-light italic line-clamp-3">
                                                    {order.comments}
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="mb-3 p-2 rounded-lg bg-gray-100 text-gray-500 text-center text-xs font-light">
                                                No comments
                                            </div>
                                        )}

                                        {/* Action Buttons */}
                                        {order.status.id === 5 ||
                                        order.status.id === 6 ? (
                                            <div className="px-3 py-2 font-light rounded-lg text-center text-sm text-green-600 bg-green-50 border border-green-200">
                                                Done
                                            </div>
                                        ) : (
                                            <div className="grid grid-cols-2 gap-2">
                                                {order.status.id === 1 && (
                                                    <>
                                                        <div
                                                            className="px-3 py-2 font-light rounded-lg transition text-center cursor-pointer btn-brand-blue text-xs"
                                                            onClick={() =>
                                                                updateOrderStatus(
                                                                    order.id,
                                                                    5,
                                                                )
                                                            }
                                                        >
                                                            Confirm
                                                        </div>
                                                        <div
                                                            className="px-3 py-2 font-light rounded-lg transition text-center cursor-pointer btn-brand-red text-xs"
                                                            onClick={() =>
                                                                updateOrderStatus(
                                                                    order.id,
                                                                    6,
                                                                )
                                                            }
                                                        >
                                                            Cancel
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))}
                        </div>
                    </>
                )}

                {/* Summary */}
                {filteredOrders.length > 0 && (
                    <div className="mt-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm p-6 text-center">
                        <p className="text-text-light font-light text-sm">
                            Showing{" "}
                            <span className="font-light text-brand-red">
                                {filteredOrders.length}
                            </span>{" "}
                            of{" "}
                            <span className="font-light text-foreground">
                                {orders.length}
                            </span>{" "}
                            total orders
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
