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

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading orders...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 py-12 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                Orders History
                            </h1>
                            <p className="text-gray-600">
                                View and search past orders
                            </p>
                        </div>
                        <Link
                            href="/"
                            className="px-6 py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition shadow-lg hover:shadow-xl"
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
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white appearance-none"
                        />
                    </div>

                    {/* Date Filter */}
                    <div className="mt-6 space-y-4">
                        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                            Date Range
                        </h3>

                        {/* Quick Filters */}
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={setToday}
                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm font-medium"
                            >
                                Today
                            </button>
                            <button
                                onClick={setThisWeek}
                                className="px-4 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition text-sm font-medium"
                            >
                                This Week
                            </button>
                            <button
                                onClick={setThisMonth}
                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm font-medium"
                            >
                                This Month
                            </button>
                        </div>

                        {/* Date Inputs */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Start Date
                                </label>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) =>
                                        setStartDate(e.target.value)
                                    }
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white appearance-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    End Date
                                </label>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white appearance-none"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 text-red-800 border border-red-200 rounded-lg p-4 mb-6">
                        {error}
                    </div>
                )}

                {/* Orders List */}
                {filteredOrders.length === 0 ? (
                    <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
                        <div className="text-gray-400 mb-4">
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
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">
                            {searchTerm ? "No orders found" : "No orders yet"}
                        </h3>
                        <p className="text-gray-500">
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
                                <div className="flex flex-row justify-between items-start md:items-center mb-4 pb-4 border-b border-gray-200">
                                    <div>
                                        <h3 className="text-base md:text-xl font-bold text-gray-900">
                                            {order.customer.first_name}{" "}
                                            {order.customer.last_name}
                                        </h3>
                                        <p className="text-xs md:text-md text-gray-600">
                                            {order.customer.phone_number}
                                        </p>
                                    </div>
                                    <div className="text-right mt-2 md:mt-0">
                                        <div className="text-xs md:text-sm text-orange-600">
                                            Status: {order.status.name}
                                        </div>
                                        <p className="text-xs md:text-sm text-gray-500">
                                            {formatDate(order.created_at)}
                                        </p>
                                        <p className="text-xs md:text-sm font-medium text-orange-600">
                                            {getTotalItems(order.order_item)}{" "}
                                            item(s)
                                        </p>
                                    </div>
                                </div>

                                {/* Dishes */}
                                <div className="space-y-3">
                                    <h4 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">
                                        Dishes:
                                    </h4>
                                    <div className="grid gap-3">
                                        {order.order_item.map((orderItem) => (
                                            <div
                                                key={orderItem.id}
                                                className="flex justify-between items-start bg-gray-50 p-3 rounded-lg"
                                            >
                                                <div className="flex-1">
                                                    <p className="font-medium text-gray-900">
                                                        {orderItem.dish.name}
                                                    </p>
                                                </div>
                                                <div className="ml-4 flex items-center justify-center bg-orange-100 text-orange-800 font-semibold px-3 py-1 rounded-full text-sm">
                                                    x{orderItem.quantity}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Comments */}
                                {order.comments && (
                                    <div className="mt-4 pt-4 border-t border-gray-200">
                                        <h4 className="font-semibold text-gray-700 text-sm uppercase tracking-wide mb-2">
                                            Comments:
                                        </h4>
                                        <p className="text-gray-600 italic">
                                            {order.comments}
                                        </p>
                                    </div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
                                    {order.status.id !== 5 &&
                                        order.status.id === 1 && (
                                            <div
                                                className="mt-6 px-4 py-2 mx-15 bg-green-700 text-white font-semibold rounded-lg hover:bg-green-800 transition text-center cursor-pointer"
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
                                                className="mt-6 px-4 py-2 mx-15 
                                                    bg-red-700 text-white font-semibold rounded-lg hover:bg-red-800 transition text-center cursor-pointer"
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
                        <p className="text-gray-600">
                            Showing{" "}
                            <span className="font-bold text-orange-600">
                                {filteredOrders.length}
                            </span>{" "}
                            of{" "}
                            <span className="font-bold">{orders.length}</span>{" "}
                            total orders
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
