"use client";

import React, { useEffect, useState } from "react";

type MenuVariant = {
    id: number;
    variant_name: string;
    price: number;
    is_active: boolean;
};

type MenuItem = {
    id: number;
    name: string;
    description?: string;
    img_url?: string;
    item_variants: MenuVariant[];
    is_active: boolean;
};

export default function MenuPage() {
    const [menuItems, setMenuItems] = React.useState<MenuItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchMenuitems = async () => {
        try {
            setIsLoading(true);

            const res = await fetch(`/api/menu_items`);

            if (!res.ok) {
                return [];
            }
            console.log("Response:", res);

            const data = await res.json();
            setMenuItems(data);
            return Array.isArray(data) ? data : [];
        } catch (error) {
            return [];
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchMenuitems();
    }, []);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <object
                        data="/loading-icon.svg"
                        type="image/svg+xml"
                        className="h-12 w-12 mx-auto"
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-6xl p-6 mt-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:items-start">
                <div className="relative border-3 border-brand rounded-md px-6 pb-6 pt-8 col-span-3 bg-background">
                    <h2
                        className="absolute -top-3 left-4 px-2 text-xl sm:text-2xl md:text-2xl lg:text-3xl font-black tracking-tight font-bungee leading-none bg-background"
                        style={{ WebkitTextStroke: "0.5px #3D3935" }}
                    >
                        THE MAINS
                    </h2>

                    <ul className="space-y-4">
                        {menuItems
                            .filter((item) => item.is_active)
                            .map((menuItem) => (
                                <li
                                    key={menuItem.id}
                                    className="flex gap-2 md:gap-4 items-center"
                                >
                                    <div className="flex-1">
                                        <div className="text-sm sm:text-base md:text-base lg:text-lg font-medium">
                                            {menuItem.name.toUpperCase()}
                                        </div>
                                        {menuItem.description && (
                                            <div className="text-xs sm:text-sm md:text-sm lg:text-base text-secondary">
                                                {menuItem.description}
                                            </div>
                                        )}

                                        <ul className="space-y-2 ml-4 mt-4">
                                            {menuItem.item_variants
                                                ?.filter(
                                                    (variant) =>
                                                        variant.is_active,
                                                )
                                                .map((variant) => (
                                                    <li
                                                        key={variant.id}
                                                        className="flex items-center gap-4"
                                                    >
                                                        <span className="flex-none w-32 sm:w-40 md:w-52 lg:w-60 text-xs sm:text-sm md:text-sm lg:text-base">
                                                            {
                                                                variant.variant_name
                                                            }
                                                        </span>
                                                        <span className="flex-1 border-b border-dashed border-gray-400"></span>
                                                        <span className="flex-none w-16 text-right text-xs sm:text-sm md:text-sm lg:text-base">
                                                            $ {variant.price}
                                                        </span>
                                                    </li>
                                                ))}
                                        </ul>
                                    </div>
                                    {menuItem.img_url ? (
                                        <img
                                            src={menuItem.img_url}
                                            alt={menuItem.name}
                                            className="w-17 h-17 sm:w-28 sm:h-28 md:w-40 md:h-40 lg:w-48 lg:h-48 object-cover rounded-lg flex-shrink-0"
                                        />
                                    ) : (
                                        <div className="w-17 h-17 sm:w-28 sm:h-28 md:w-40 md:h-40 lg:w-48 lg:h-48 flex-shrink-0"></div>
                                    )}
                                </li>
                            ))}
                    </ul>
                </div>

                <div className="flex flex-wrap md:grid md:grid-cols-[1.5fr_1fr] col-span-3 gap-6 w-full">

                    <div className="border-2 border-foreground rounded-xl px-5 py-4 bg-background w-full flex flex-col">
                            <h3 className="font-bold text-base sm:text-lg md:text-lg lg:text-xl mb-2 font-bungee">
                            EXTRAS
                        </h3>

                            <ul className="space-y-2 flex-1 flex flex-col justify-center">
                            <li className="flex items-center gap-3">
                                <span className="text-foreground">•</span>
                                <span className="flex-1 text-xs sm:text-sm md:text-sm lg:text-base">
                                    35g Albacore Fish
                                </span>
                                <span className=" border-b border-dashed border-gray-300 flex-1"></span>
                                <span className=" text-right text-xs sm:text-sm md:text-sm lg:text-base ml-2">
                                    $ 5
                                </span>
                            </li>

                            <li className="flex items-center gap-3">
                                <span className="text-foreground">•</span>
                                <span className="flex-1 text-xs sm:text-sm md:text-sm lg:text-base">
                                    Fried Egg
                                </span>
                                <span className=" border-b border-dashed border-gray-300 flex-1"></span>
                                <span className=" text-right text-xs sm:text-sm md:text-sm lg:text-base ml-2">
                                    $ 2
                                </span>
                            </li>

                            <li className="flex items-center gap-3">
                                <span className="text-foreground">•</span>
                                <span className="flex-1 text-xs sm:text-sm md:text-sm lg:text-base">
                                    Plantain Chips
                                </span>
                                <span className=" border-b border-dashed border-gray-300 flex-1"></span>
                                <span className=" text-right text-xs sm:text-sm md:text-sm lg:text-base ml-2">
                                    $ 3
                                </span>
                            </li>

                            <li className="flex items-center gap-3">
                                <span className="text-foreground">•</span>
                                <span className="flex-1 text-xs sm:text-sm md:text-sm lg:text-base">
                                    Coca Cola
                                </span>
                                <span className=" border-b border-dashed border-gray-300 flex-1"></span>
                                <span className=" text-right text-xs sm:text-sm md:text-sm lg:text-base ml-2">
                                    $ 3
                                </span>
                            </li>

                            <li className="flex items-center gap-3">
                                <span className="text-foreground">•</span>
                                <span className="flex-1 text-xs sm:text-sm md:text-sm lg:text-base">
                                    Ripe Plantain
                                </span>
                                <span className=" border-b border-dashed border-gray-300 flex-1"></span>
                                <span className=" text-right text-xs sm:text-sm md:text-base lg:text-lg ml-2">
                                    $ 2
                                </span>
                            </li>
                        </ul>
                    </div>

                    <div className="border-2 border-brand-blue rounded-xl px-5 py-4 bg-background h-auto w-full">
                        <h3 className="font-bold text-base sm:text-lg md:text-lg lg:text-xl mb-4 font-bungee">
                            DELIVERY
                        </h3>

                        <div className="space-y-5">
                            <div>
                                <p className="font-semibold text-xs sm:text-sm md:text-sm lg:text-base mb-1 text-foreground">
                                    Extra Fee:
                                </p>
                                <p className="text-xs sm:text-sm md:text-sm lg:text-base text-secondary">
                                    $1.5 for each km from "Los Guayacos
                                    Location" to your place
                                </p>
                            </div>

                            <div>
                                <p className="font-semibold text-xs sm:text-sm md:text-sm lg:text-base mb-2 text-foreground">
                                    Delivery Time:
                                </p>
                                <p className="text-xs sm:text-sm md:text-sm lg:text-base text-secondary mb-3">
                                    11:00AM - 13:00PM
                                </p>
                                <p className="text-brand-red font-semibold text-xs sm:text-sm md:text-sm lg:text-base">
                                    ASK FOR
                                    <br />
                                    AVAILABILITY
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-2 border-brand-blue rounded-xl px-5 py-4 col-span-3 bg-background h-fit">
                    <h3 className="font-bold text-base sm:text-lg md:text-lg lg:text-xl mb-2 font-bungee">
                        INFO
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div>
                            <p className="font-semibold text-xs sm:text-sm md:text-sm lg:text-base mb-2 text-foreground">
                                Location:
                            </p>
                            <p className="text-xs sm:text-sm md:text-sm lg:text-base text-secondary leading-relaxed">
                                26 Chermside St,{" "}
                                <span className="text-brand-red font-semibold">
                                    Grange
                                </span>
                                <br />
                                QLD 4051, Australia
                            </p>
                        </div>

                        <div>
                            <p className="font-semibold text-xs sm:text-sm md:text-sm lg:text-base mb-2 text-foreground">
                                Phone:
                            </p>
                            <p className="text-xs sm:text-sm md:text-sm lg:text-base text-secondary">
                                0433807915
                            </p>
                        </div>

                        <div>
                            <p className="font-semibold text-xs sm:text-sm md:text-sm lg:text-base mb-2 text-foreground">
                                Open Hours:
                            </p>
                            <p className="text-xs sm:text-sm md:text-sm lg:text-base text-secondary">
                                Sun, 10:30 AM - 2:00 PM
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
