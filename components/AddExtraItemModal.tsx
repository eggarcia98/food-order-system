"use client";

import React, { useEffect } from "react";

interface ExtraItem {
    extra_id: number;
    name: string;
    price: number;
    is_active: boolean;
}

export default function AddExtraItemModal({
    open,
    setOpen,
    extraItems,
    setConfirmedExtraItems,
}: any) {
    const [extraQuantities, setExtraQuantities] = React.useState<any>({});

    useEffect(() => {
        setExtraQuantities(() =>
            extraItems.reduce(
                (acc: any, extra: ExtraItem) => ({
                    ...acc,
                    [extra.extra_id]: 0,
                }),
                {},
            ),
        );
    }, [extraItems]);

    const handleIncrement = (id: number) => {
        const updatedExtraQuantities = {
            ...extraQuantities,
            [id]: extraQuantities[id] + 1,
        };
        setExtraQuantities(updatedExtraQuantities);
    };

    const handleDecrement = async (id: number) => {
        if (extraQuantities[id] <= 0) return;
        const updatedExtraQuantities = {
            ...extraQuantities,
            [id]: extraQuantities[id] - 1,
        };
        setExtraQuantities(updatedExtraQuantities);
    };

    const resetForm = () => {
        setExtraQuantities(
            extraItems.reduce(
                (acc: any, extra: ExtraItem) => ({
                    ...acc,
                    [extra.extra_id]: 0,
                }),
                {},
            ),
        );
    };

    const confirmExtraItems = () => {
        const selectedExtras = extraItems
            .filter((extra: ExtraItem) => extraQuantities[extra.extra_id] > 0)
            .map((extra: ExtraItem) => ({
                extra_id: extra.extra_id,
                name: extra.name,
                quantity: extraQuantities[extra.extra_id],
                price: extra.price,
            }));

        if (selectedExtras.length === 0) return;

        setConfirmedExtraItems((prev: any) => [...prev, ...selectedExtras]);
        resetForm();
        setOpen(false);
    };

    if (!open) return null;

    return (
        <div
            className={`fixed inset-x-0 bottom-0 z-50 bg-white shadow-xl transition-transform duration-500 ease-out
    ${open ? "translate-y-0" : "translate-y-full"}
    rounded-t-3xl max-h-[80vh] flex flex-col
    md:rounded-2xl md:left-1/2 md:top-1/2 md:bottom-auto md:translate-x-[-50%] md:translate-y-[-50%]
    md:max-w-lg md:w-[90%] md:h-auto
  `}
        >
            <div className="p-4 border-b flex justify-between items-center border-brand">
                <h2 className="text-lg font-semibold text-foreground">
                    Add Extra Items
                </h2>
                <button
                    onClick={() => setOpen(false)}
                    className="transition text-secondary"
                >
                    ✕
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 smooth-scroll">

                <div>
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-1 h-4 rounded-full bg-brand-blue"></div>
                        <h3 className="text-lg font-semibold text-foreground">
                            Available Extras
                        </h3>
                    </div>
                    <div className="flex flex-col gap-2">
                        {extraItems.map((extra: ExtraItem) => (
                            <div
                                key={extra.extra_id}
                                className="flex justify-between items-center border-b p-2 px-3 text-sm border-brand"
                            >
                                <div className="flex flex-col">
                                    <span className="text-secondary font-medium">
                                        {extra.name}
                                    </span>
                                    <span className="text-xs text-brand-red">
                                        ${extra.price}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div
                                        className="px-2 rounded font-bold cursor-pointer transition bg-bg-light"
                                        onClick={() =>
                                            handleDecrement(extra.extra_id)
                                        }
                                    >
                                        -
                                    </div>
                                    <span className="w-6 text-center text-brand-red">
                                        {extraQuantities[extra.extra_id] ?? 0}
                                    </span>
                                    <div
                                        className="px-2 rounded font-bold cursor-pointer transition bg-bg-light"
                                        onClick={() =>
                                            handleIncrement(extra.extra_id)
                                        }
                                    >
                                        +
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-6 flex justify-end gap-2">
                    <div
                        onClick={() => {
                            setOpen(false);
                        }}
                        className="px-4 py-2 rounded-xl cursor-pointer transition bg-bg-light text-secondary"
                    >
                        Cancel
                    </div>
                    <div
                        onClick={() => confirmExtraItems()}
                        className="px-4 py-2 rounded-xl cursor-pointer transition btn-brand-blue"
                    >
                        Add
                    </div>
                </div>
            </div>
        </div>
    );
}
