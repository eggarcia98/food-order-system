// app/orders/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export interface Order {
    id: number;
    order_code: string;
    customer_id: number;
    comments: string;
    created_at: string; // ISO date string
    customer: Customer;
    order_item: OrderItem[];
    order_side_item: OrderSideItem[];
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
    dish_id: number;
    dish: Dish;
}

export interface Dish {
    id: number;
    name: string;
    price: number;
    description: string;
    img?: string;
    extras?: string;
}

export interface OrderSideItem {
    id: number;
    order_id: number;
    side_id: number;
    quantity: number;
    side: Side;
}

export interface Side {
    id: number;
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

    const fetchOrders = async () => {
        try {
            setIsLoading(true);
            const response = await fetch("/api/orders");
            if (!response.ok) throw new Error("Failed to fetch orders");
            const data: Order[] = await response.json();
            console.log("Fetched orders:", data);
            setOrders(data);
        } catch (err) {
            setError("Failed to load orders. Please try again.");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const getSidesForOrder = (order: Order) => {
        return order.order_side_item.map((osi) => {
            return {
                id: osi.side.id,
                name: osi.side.name,
                price: osi.side.price,
                quantity: osi.quantity,
            };
        });
    };

    const filteredOrders = orders.filter((order) => {
        const customerName = `${order.customer.first_name} ${order.customer.last_name}`;

        const matchesSearch =
            customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.customer.phone_number.includes(searchTerm) ||
            order.order_item.some((item) =>
                item.dish.name.toLowerCase().includes(searchTerm.toLowerCase())
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
            console.error(err);
            setError("Failed to update order status. Please try again.");
        }
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
        const dishesTotal = order.order_item.reduce(
            (acc, item) => acc + item.dish.price * item.quantity,
            0
        );
        return sidesTotal + dishesTotal;
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-background-light)' }}>
                <div className="text-center">
                    <div 
                        className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto"
                        style={{ borderColor: 'var(--color-brand-red)' }}
                    ></div>
                    <p className="mt-4" style={{ color: 'var(--color-text-secondary)' }}>Loading orders...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-12 px-4" style={{ backgroundColor: 'var(--color-background-light)' }}>
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div 
                    className="bg-white rounded-2xl shadow-xl p-8 mb-6 border-t-4" 
                    style={{ borderTopColor: 'var(--color-brand-blue)' }}
                >
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--color-foreground-dark)' }}>
                                Orders History
                            </h1>
                            <p style={{ color: 'var(--color-text-secondary)' }}>
                                View and search past orders
                            </p>
                        </div>
                        <Link
                            href="/"
                            className="px-6 py-3 font-semibold rounded-lg transition shadow-lg hover:shadow-xl"
                            style={{ 
                                backgroundColor: 'var(--color-brand-blue)', 
                                color: 'var(--color-background-light)' 
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = 'rgba(35, 160, 229, 0.8)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'var(--color-brand-blue)';
                            }}
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
                            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent bg-white appearance-none transition"
                            style={{ borderColor: 'var(--color-border)' }}
                            onFocus={(e) => {
                                e.currentTarget.style.borderColor = 'var(--color-brand-blue)';
                                e.currentTarget.style.boxShadow = '0 0 0 2px rgba(35, 160, 229, 0.2)';
                            }}
                            onBlur={(e) => {
                                e.currentTarget.style.borderColor = 'var(--color-border)';
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                        />
                    </div>

                    {/* Date Filter */}
                    <div className="mt-6 space-y-4">
                        <div className="flex items-center gap-2">
                            <div 
                                className="w-1 h-4 rounded-full" 
                                style={{ backgroundColor: 'var(--color-brand-blue)' }}
                            ></div>
                            <h3 className="text-sm font-semibold uppercase tracking-wide" style={{ color: 'var(--color-foreground-dark)' }}>
                                Date Range
                            </h3>
                        </div>

                        {/* Quick Filters */}
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={setToday}
                                className="px-4 py-2 rounded-lg transition text-sm font-medium"
                                style={{ 
                                    backgroundColor: 'var(--color-background-light)', 
                                    color: 'var(--color-text)' 
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = 'rgba(35, 160, 229, 0.1)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = 'var(--color-background-light)';
                                }}
                            >
                                Today
                            </button>
                            <button
                                onClick={setThisWeek}
                                className="px-4 py-2 rounded-lg transition text-sm font-medium"
                                style={{ 
                                    backgroundColor: 'rgba(35, 160, 229, 0.1)', 
                                    color: 'var(--color-brand-blue)' 
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = 'rgba(35, 160, 229, 0.2)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = 'rgba(35, 160, 229, 0.1)';
                                }}
                            >
                                This Week
                            </button>
                            <button
                                onClick={setThisMonth}
                                className="px-4 py-2 rounded-lg transition text-sm font-medium"
                                style={{ 
                                    backgroundColor: 'var(--color-background-light)', 
                                    color: 'var(--color-text)' 
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = 'rgba(35, 160, 229, 0.1)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = 'var(--color-background-light)';
                                }}
                            >
                                This Month
                            </button>
                        </div>

                        {/* Date Inputs */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text)' }}>
                                    Start Date
                                </label>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) =>
                                        setStartDate(e.target.value)
                                    }
                                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent bg-white appearance-none transition"
                                    style={{ borderColor: 'var(--color-border)' }}
                                    onFocus={(e) => {
                                        e.currentTarget.style.borderColor = 'var(--color-brand-blue)';
                                        e.currentTarget.style.boxShadow = '0 0 0 2px rgba(35, 160, 229, 0.2)';
                                    }}
                                    onBlur={(e) => {
                                        e.currentTarget.style.borderColor = 'var(--color-border)';
                                        e.currentTarget.style.boxShadow = 'none';
                                    }}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text)' }}>
                                    End Date
                                </label>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:border-transparent bg-white appearance-none transition"
                                    style={{ borderColor: 'var(--color-border)' }}
                                    onFocus={(e) => {
                                        e.currentTarget.style.borderColor = 'var(--color-brand-blue)';
                                        e.currentTarget.style.boxShadow = '0 0 0 2px rgba(35, 160, 229, 0.2)';
                                    }}
                                    onBlur={(e) => {
                                        e.currentTarget.style.borderColor = 'var(--color-border)';
                                        e.currentTarget.style.boxShadow = 'none';
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div 
                        className="rounded-lg p-4 mb-6 border"
                        style={{
                            backgroundColor: 'rgba(216, 34, 41, 0.1)',
                            color: 'var(--color-brand-red)',
                            borderColor: 'var(--color-brand-red)'
                        }}
                    >
                        {error}
                    </div>
                )}

                {/* Orders List */}
                {filteredOrders.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
                        <div className="mb-4" style={{ color: 'var(--color-brand-blue)' }}>
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
                        <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--color-foreground-dark)' }}>
                            {searchTerm ? "No orders found" : "No orders yet"}
                        </h3>
                        <p style={{ color: 'var(--color-text-secondary)' }}>
                            {searchTerm
                                ? "Try a different search term"
                                : "Start by creating your first order"}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredOrders.map((order) => (
                            <div
                                key={order.id}
                                className="bg-white rounded-xl shadow-md hover:shadow-lg transition p-6"
                            >
                                {/* Order Header */}
                                <div className="flex flex-row justify-between items-start md:items-center mb-4 pb-4 border-b" style={{ borderColor: 'var(--color-border)' }}>
                                    <div>
                                        <h3 className="text-base md:text-xl font-bold" style={{ color: 'var(--color-foreground-dark)' }}>
                                            {order.customer.first_name}{" "}
                                            {order.customer.last_name}
                                        </h3>
                                        <p className="text-xs md:text-md" style={{ color: 'var(--color-brand-red)' }}>
                                            {order.customer.phone_number}
                                        </p>
                                    </div>
                                    <div className="text-right mt-2 md:mt-0 text-xs md:text-sm">
                                        <div style={{ color: 'var(--color-brand-blue)' }}>
                                            Status: {order.status.name}
                                        </div>
                                        <p style={{ color: 'var(--color-text-secondary)' }}>
                                            {formatDate(order.created_at)}
                                        </p>
                                        <p className="font-medium" style={{ color: 'var(--color-brand-red)' }}>
                                            {getTotalItems(order.order_item)}{" "}
                                            item(s)
                                        </p>
                                    </div>
                                </div>

                                {/* Dishes */}
                                <div className="space-y-3 text-sm md:text-md">
                                    <div className="flex items-center gap-2">
                                        <div 
                                            className="w-1 h-4 rounded-full" 
                                            style={{ backgroundColor: 'var(--color-brand-blue)' }}
                                        ></div>
                                        <h4 className="font-semibold uppercase tracking-wide" style={{ color: 'var(--color-foreground-dark)' }}>
                                            Dishes:
                                        </h4>
                                    </div>
                                    <div className="grid gap-3">
                                        {order.order_item.map((orderItem) => (
                                            <div
                                                key={orderItem.id}
                                                className="flex justify-between items-start p-3 rounded-lg"
                                                style={{ backgroundColor: 'var(--color-background-light)' }}
                                            >
                                                <div className="flex-1">
                                                    <p className="font-medium" style={{ color: 'var(--color-foreground-dark)' }}>
                                                        {orderItem.dish.name}
                                                    </p>
                                                </div>
                                                <div 
                                                    className="ml-4 flex items-center justify-center font-semibold px-3 rounded-full"
                                                    style={{ 
                                                        backgroundColor: 'rgba(216, 34, 41, 0.1)', 
                                                        color: 'var(--color-brand-red)' 
                                                    }}
                                                >
                                                    x{orderItem.quantity}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Sides */}
                                <div className="space-y-3 text-sm md:text-md">
                                    {getSidesForOrder(order).length > 0 && (
                                        <div className="mt-1">
                                            <div className="flex items-center gap-2 mb-3">
                                                <div 
                                                    className="w-1 h-4 rounded-full" 
                                                    style={{ backgroundColor: 'var(--color-brand-blue)' }}
                                                ></div>
                                                <h4 className="font-semibold uppercase tracking-wide" style={{ color: 'var(--color-foreground-dark)' }}>
                                                    Sides:
                                                </h4>
                                            </div>
                                            <div className="grid gap-3">
                                                {getSidesForOrder(order).map(
                                                    (side) => (
                                                        <div
                                                            key={side.id}
                                                            className="flex justify-between items-start p-3 rounded-lg"
                                                            style={{ backgroundColor: 'var(--color-background-light)' }}
                                                        >
                                                            <div className="flex-1">
                                                                <p className="font-medium" style={{ color: 'var(--color-foreground-dark)' }}>
                                                                    {side.name}
                                                                </p>
                                                            </div>
                                                            <div 
                                                                className="ml-4 flex items-center justify-center font-semibold px-3 rounded-full"
                                                                style={{ 
                                                                    backgroundColor: 'rgba(216, 34, 41, 0.1)', 
                                                                    color: 'var(--color-brand-red)' 
                                                                }}
                                                            >
                                                                x{side.quantity}
                                                            </div>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Comments */}
                                {order.comments && (
                                    <div className="mt-4 pt-4 border-t md:text-md text-sm" style={{ borderColor: 'var(--color-border)' }}>
                                        <div className="flex items-center gap-2 mb-2">
                                            <div 
                                                className="w-1 h-4 rounded-full" 
                                                style={{ backgroundColor: 'var(--color-brand-blue)' }}
                                            ></div>
                                            <h4 className="font-semibold uppercase tracking-wide" style={{ color: 'var(--color-foreground-dark)' }}>
                                                Comments:
                                            </h4>
                                        </div>
                                        <p className="italic" style={{ color: 'var(--color-text-secondary)' }}>
                                            {order.comments}
                                        </p>
                                    </div>
                                )}

                                <div className="mt-4 pt-4 border-t md:text-md text-sm flex justify-between items-center" style={{ borderColor: 'var(--color-border)' }}>
                                    <h4 className="font-semibold uppercase tracking-wide mb-2" style={{ color: 'var(--color-foreground-dark)' }}>
                                        Total:
                                    </h4>
                                    <p className="font-bold text-lg" style={{ color: 'var(--color-brand-blue)' }}>
                                        ${getTotal(order).toFixed(2)}
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-4 ">
                                    {order.status.id !== 5 &&
                                        order.status.id === 1 && (
                                            <div
                                                className="mt-6 px-4 py-2 font-semibold rounded-lg transition text-center cursor-pointer"
                                                style={{ 
                                                    backgroundColor: 'var(--color-brand-blue)', 
                                                    color: 'var(--color-background-light)' 
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.backgroundColor = 'rgba(35, 160, 229, 0.8)';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.backgroundColor = 'var(--color-brand-blue)';
                                                }}
                                                onClick={() =>
                                                    updateOrderStatus(
                                                        order.id,
                                                        5
                                                    )
                                                }
                                            >
                                                Confirm
                                            </div>
                                        )}
                                    {order.status.id !== 6 &&
                                        order.status.id === 1 && (
                                            <div
                                                className="mt-6 px-4 py-2 font-semibold rounded-lg transition text-center cursor-pointer"
                                                style={{ 
                                                    backgroundColor: 'var(--color-brand-red)', 
                                                    color: 'var(--color-background-light)' 
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.backgroundColor = 'var(--color-brand-dark-red)';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.backgroundColor = 'var(--color-brand-red)';
                                                }}
                                                onClick={() =>
                                                    updateOrderStatus(
                                                        order.id,
                                                        6
                                                    )
                                                }
                                            >
                                                Cancel
                                            </div>
                                        )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Summary */}
                {filteredOrders.length > 0 && (
                    <div className="mt-6 bg-white rounded-xl shadow-md p-6 text-center">
                        <p style={{ color: 'var(--color-text-secondary)' }}>
                            Showing{" "}
                            <span className="font-bold" style={{ color: 'var(--color-brand-red)' }}>
                                {filteredOrders.length}
                            </span>{" "}
                            of{" "}
                            <span className="font-bold" style={{ color: 'var(--color-foreground-dark)' }}>{orders.length}</span>{" "}
                            total orders
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
