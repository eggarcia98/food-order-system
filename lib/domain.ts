/**
 * Domain-wide TypeScript interfaces and types
 * This module consolidates all type definitions for menu items, orders, customers, and related entities
 */

// ============ Menu Items ============
export interface ItemVariant {
    id: number;
    item_id: number;
    variant_name: string;
    price: number;
    is_active: boolean;
    image_url?: string;
    img?: string;
    extras?: string;
}

export interface MenuItem {
    id: number;
    category_id: number;
    name: string;
    description: string;
    img_url?: string;
    item_variants: ItemVariant[];
    is_active: boolean;
}

export interface MenuCategory {
    category_id: number;
    category_name: string;
}

export interface SelectedVariant {
    item_id: number;
    item_name: string;
    variant_id: number;
    variant_name: string;
    price: number;
    quantity: number;
}

// ============ Extras ============
export interface ExtraItem {
    extra_id: number;
    name: string;
    price: number;
    is_active: boolean;
}

export interface MenuExtra {
    extra_id: number;
    name: string;
    cost: number;
    price: number;
    description: string;
}

// ============ Sides ============
export interface SideItem {
    id: number;
    name: string;
    price?: number;
    quantity?: number;
}

// ============ Customer ============
export interface Customer {
    id: number;
    first_name: string;
    last_name: string;
    phone_number: string;
    nationality_id: number;
}

export interface Nationality {
    id: number;
    name: string;
}

// ============ Orders ============
export interface OrderItem {
    id: number;
    order_id: number;
    quantity: number;
    variant_id: number;
    ItemVariant: ItemVariant & {
        MenuItem?: {
            id: number;
            name: string;
            category_id: number | null;
        };
    };
}

export interface OrderExtraItem {
    id: number;
    order_id: number;
    extra_id: number;
    quantity: number;
    MenuExtras: MenuExtra;
}

export interface FulfillmentType {
    id: number;
    name: string;
}

export interface OrderStatus {
    id: number;
    name: string;
    status_code?: string;
}

export interface Order {
    id: number;
    order_code: string;
    customer_id: number;
    comments: string;
    created_at: Date;
    arrival_from?: Date | null;
    arrival_to?: Date | null;
    customer_confirmed_at?: Date | null;
    fulfillment_type?: FulfillmentType | null;
    is_info_sent: boolean;
    customer: Customer;
    order_items: OrderItem[];
    order_item_extras: OrderExtraItem[];
    status_id: number;
    status: OrderStatus;
    confirmationLinkUrl?: string | null;
}

// ============ Modal Props ============
export interface AddMainItemModalProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    menuItems: MenuItem[];
    setConfirmedMainItems: (
        updater: (prev: import("@/lib/order-types").MainOrderItem[]) => import("@/lib/order-types").MainOrderItem[]
    ) => void;
}

export interface AddExtraItemModalProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    extraItems: ExtraItem[];
    setConfirmedExtraItems: (
        updater: (prev: import("@/lib/order-types").ExtraOrderItem[]) => import("@/lib/order-types").ExtraOrderItem[]
    ) => void;
}

export interface AddItemModalProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    sides: SideItem[];
    menuItems: MenuItem[];
    setConfirmedOrderList: (
        updater: (prev: import("@/lib/order-types").OrderEntry[]) => import("@/lib/order-types").OrderEntry[]
    ) => void;
}

// ============ API Request/Response Types ============
export interface CreateOrderRequest {
    client: {
        firstName: string;
        lastName: string;
        nationality: { id: number };
        phoneNumber: string;
    };
    mainItems: import("@/lib/order-types").MainOrderItem[];
    extraItems: import("@/lib/order-types").ExtraOrderItem[];
    comments: string;
}

export interface CreateOrderResponse {
    id: number;
    order_code: string;
}

// ============ Order Confirmation ============
export interface ConfirmationLink {
    id: number;
    token: string;
    order_id: number;
    expires_at: Date;
    used_at: Date | null;
    created_at: Date;
}

export interface ConfirmationRequest {
    fulfillmentTypeId: number;
    arrivalFrom: string;
    arrivalTo: string;
}

export interface ConfirmationResponse {
    order: Order;
    fulfillmentTypes?: FulfillmentType[];
    link?: {
        token: string;
        expires_at: Date;
        used_at: Date | null;
    };
    updated?: boolean;
}
