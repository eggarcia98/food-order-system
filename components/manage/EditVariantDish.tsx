"use client";

export default function EditVariantDish({ itemVariant, setVariantFormData, variantFormData, setEditMode }) {

    const handleUpdateVariant = async () => {


    }

    return (
        <div className="flex-1 grid gap-2 md:grid-cols-[minmax(0,1fr)_120px_auto_auto]"
            key={`${itemVariant.id}`}
        >
            `${itemVariant.id}-${itemVariant.name}`
            <input
                type="text"
                value={variantFormData.name}
                onChange={(e) =>
                    setVariantFormData({
                        ...variantFormData,
                        name: e.target.value,
                    })
                }
                className="input-brand rounded-2xl border-0 bg-white text-sm"
            />
            <input
                type="number"
                value={variantFormData.price}
                onChange={(e) =>
                    setVariantFormData({
                        ...variantFormData,
                        price: e.target.value,
                    })
                }
                step="0.01"
                className="input-brand rounded-2xl border-0 bg-white text-sm"
            />
            <button
                type="button"
                onClick={() =>
                    handleUpdateVariant()
                }
                className="rounded-2xl bg-brand-blue px-4 py-2 text-sm font-medium text-white"
            >
                Save
            </button>
            <button
                type="button"
                onClick={() => setEditMode(false)}
                className="rounded-2xl bg-[#f7f3ee] px-4 py-2 text-sm font-medium text-foreground"
            >
                Cancel
            </button>
        </div>
    )
}