"use client";

import VariantDishItem from "./VariantDishItem";
import type { ItemVariant } from "@/lib/domain";

interface VariantDishComponentProps {
    itemVariants: ItemVariant[];
}

export default function VariantDishComponent({ itemVariants }: VariantDishComponentProps) {
    if (!itemVariants || itemVariants.length === 0)
        return <p className="text-sm text-light">No variants</p>;

    return (
        <div className="mt-6 border-t border-black/5 pt-6">
            <p className="mb-4 text-sm font-bold text-foreground">
                Variants ({itemVariants.length})
            </p>

            <div className="space-y-2">
                {itemVariants.map((itemVariant) => (
                    <VariantDishItem
                        itemVariant={itemVariant}
                        key={`${itemVariant.id}-${itemVariant.variant_name}`} />
                ))}
            </div>


        </div>
    )
}
