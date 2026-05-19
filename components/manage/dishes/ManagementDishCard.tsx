"use client";

import MainDishComponent from "./main-dish/MainDishComponent";
import VariantDishComponent from "./variant-dish/VariantDishComponent";
import type { MenuItem } from "@/lib/domain";

interface ManagementDishCardProps {
    dish: MenuItem;
}

export default function ManagementDishCard({ dish }: ManagementDishCardProps) {
    return (
        <div
            key={dish.id}
            className="rounded-3xl bg-white/85 p-6 shadow-[0_18px_60px_rgba(31,26,23,0.08)] ring-1 ring-black/5"
        >
            {/* Dish Header */}
            <MainDishComponent dish={dish} />


            {/* Variants Section */}
            <VariantDishComponent itemVariants={dish.item_variants} />
        </div>
    );
}   
