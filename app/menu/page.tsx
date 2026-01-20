import React from "react";

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
    item_variants: MenuVariant[];
};

async function getMenuItems(): Promise<MenuItem[]> {
    const baseUrl =
        process.env.NEXT_PUBLIC_BASE_URL ||
        process.env.NEXTAUTH_URL ||
        "http://localhost:3000";

    try {
        const res = await fetch(`${baseUrl}/api/menu_items`, {
            cache: "no-store",
        });

        if (!res.ok) {
            console.error("Failed to fetch menu items", res.statusText);
            return [];
        }

        const data = await res.json();
        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error("Error fetching menu items", error);
        return [];
    }
}

export default async function MenuPage() {
    const menuItems = await getMenuItems();

    return (
        <div className=" mx-auto relative w-auto max-w-6xl p-6 m-8 ">
            <div className="grid grid-col-1 md:grid-cols-3 md:grid-rows-2  gap-6 space-y-4">
                <div className="relative border-3 border-brand rounded-md px-6 pb-6 pt-8 col-span-3 w-full bg-background">
                    <h2
                        className="absolute -top-3 left-4 px-2 text-2xl font-black tracking-tight font-bungee leading-none  bg-background"
                        style={{ WebkitTextStroke: "0.5px #3D3935" }}
                    >
                        THE MAINS
                    </h2>

                    <ul className="space-y-4 ">
                        {menuItems.length === 0 && (
                            <li className="text-sm text-secondary">
                                Menu coming soon.
                            </li>
                        )}

                        {menuItems.map((menuItem) => (
                            <li key={menuItem.id} className="">
                                <div className="text-lg font-medium">
                                    {menuItem.name.toUpperCase()}
                                </div>
                                {menuItem.description && (
                                    <div className="text-sm text-secondary">
                                        {menuItem.description}
                                    </div>
                                )}

                                <ul className="space-y-2 ml-4 mt-4">
                                    {menuItem.item_variants
                                        ?.filter((variant) => variant.is_active)
                                        .map((variant) => (
                                            <li
                                                key={variant.id}
                                                className="flex items-center gap-4 "
                                            >
                                                <span className="flex-none w-52 md:w-60 ">
                                                    {variant.variant_name}
                                                </span>
                                                <span className="flex-1 border-b border-dashed border-gray-400"></span>
                                                <span className="flex-none w-16 text-right ">
                                                    $ {variant.price}
                                                </span>
                                            </li>
                                        ))}
                                </ul>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="relative border-3 h-fit border-brand rounded-lg px-6 pb-6 pt-8 col-span-3 md:col-span-2 bg-background">
                    <h2
                        className="absolute -top-3 left-4 px-2 text-2xl font-black tracking-tight font-bungee leading-none bg-background"
                        style={{ WebkitTextStroke: "0.5px #3D3935" }}
                    >
                        EXTRAS
                    </h2>

                    <ul className="space-y-4  ">
                        <li className="flex items-center gap-4">
                            <span className="flex-none w-52 md:w-60 text-lg ">
                                35g Albacore Fish
                            </span>
                            <span className="flex-1 border-b border-dashed border-gray-400"></span>
                            <span className="flex-none w-16 text-right text-lg ">
                                $ 5
                            </span>
                        </li>

                        <li className="flex items-center gap-4">
                            <span className="flex-none w-52 md:w-60 text-lg ">
                                Fried Egg
                            </span>
                            <span className="flex-1 border-b border-dashed border-gray-400"></span>
                            <span className="flex-none w-16 text-right text-lg ">
                                $ 2
                            </span>
                        </li>

                        <li className="flex items-center gap-4">
                            <span className="flex-none w-52 md:w-60 text-lg ">
                                Plantain Chips
                            </span>
                            <span className="flex-1 border-b border-dashed border-gray-400"></span>
                            <span className="flex-none w-16 text-right text-lg ">
                                $ 3
                            </span>
                        </li>

                        <li className="flex items-center gap-4">
                            <span className="flex-none w-52 md:w-60 text-lg ">
                                Coca Cola
                            </span>
                            <span className="flex-1 border-b border-dashed border-gray-400"></span>
                            <span className="flex-none w-16 text-right text-lg ">
                                $ 3
                            </span>
                        </li>
                    </ul>
                </div>

                <div className="relative border-3 h-fit border-brand-blue rounded-md px-6 pb-6 pt-8 col-span-3 md:col-span-1 bg-background">
                    <h2
                        className="absolute -top-3 left-4 px-2 text-2xl font-black tracking-tight font-bungee leading-none bg-background"
                        style={{ WebkitTextStroke: "0.5px #3D3935" }}
                    >
                        INFO
                    </h2>
                    <p className="text-lg text-foreground mb-2">
                        <b>Location: </b> 10 Malt Street, Fortitude Valley QLD
                        4006
                    </p>
                    <p className="text-lg text-foreground mb-2 flex flex-col">
                        <b>Open Hours: </b> Sun, 10:30 AM - 2:00 PM
                    </p>
                    <p className="text-lg text-foreground ">
                        <b>Phone: </b>0433807915
                    </p>
                </div>
            </div>
        </div>
    );
}