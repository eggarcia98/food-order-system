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
            <div className="grid grid-col-1 md:grid-cols-3 md:grid-rows-2 gap-6 space-y-4">
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

                {/* EXTRAS Section */}
                <div className="border-2 border-foreground rounded-xl px-5 py-4 col-span-3 md:col-span-1 bg-background">
                    <h3 className="font-bold text-lg mb-4 font-bungee">EXTRAS</h3>

                    <ul className="space-y-2">
                        <li className="flex items-center gap-3">
                            <span className="text-foreground">•</span>
                            <span className="flex-1 text-sm">35g Albacore Fish</span>
                            <span className=" border-b border-dashed border-gray-300 flex-1"></span>
                            <span className=" text-right text-sm ml-2">$ 5</span>
                        </li>

                        <li className="flex items-center gap-3">
                            <span className="text-foreground">•</span>
                            <span className="flex-1 text-sm">Fried Egg</span>
                            <span className=" border-b border-dashed border-gray-300 flex-1"></span>
                            <span className=" text-right text-sm ml-2">$ 2</span>
                        </li>

                        <li className="flex items-center gap-3">
                            <span className="text-foreground">•</span>
                            <span className="flex-1 text-sm">Plantain Chips</span>
                            <span className=" border-b border-dashed border-gray-300 flex-1"></span>
                            <span className=" text-right text-sm ml-2">$ 3</span>
                        </li>

                        <li className="flex items-center gap-3">
                            <span className="text-foreground">•</span>
                            <span className="flex-1 text-sm">Coca Cola</span>
                            <span className=" border-b border-dashed border-gray-300 flex-1"></span>
                            <span className=" text-right text-sm ml-2">$ 3</span>
                        </li>

                        <li className="flex items-center gap-3">
                            <span className="text-foreground">•</span>
                            <span className="flex-1 text-sm">Ripe Plantain</span>
                            <span className=" border-b border-dashed border-gray-300 flex-1"></span>
                            <span className=" text-right text-sm ml-2">$ 2</span>
                        </li>
                    </ul>
                </div>

                {/* DELIVERY Section */}
                <div className="border-2 border-brand-blue rounded-xl px-5 py-4 col-span-3 md:col-span-2 bg-background">
                    <h3 className="font-bold text-lg mb-4 font-bungee">DELIVERY</h3>
                    
                    <div className="space-y-5">
                        <div>
                            <p className="font-semibold text-sm mb-2 text-foreground">Extra Fee:</p>
                            <p className="text-sm text-secondary">$1.5 for each km from "Los Guayacos Location" to your place</p>
                        </div>

                        <div>
                            <p className="font-semibold text-sm mb-2 text-foreground">Delivery Time:</p>
                            <p className="text-sm text-secondary mb-3">11:00AM - 13:00PM</p>
                            <p className="text-brand-red font-semibold text-sm">ASK FOR<br/>AVAILABILITY</p>
                        </div>
                    </div>
                </div>

                {/* INFO Section */}
                <div className="border-2 border-brand-blue rounded-xl px-5 py-4 col-span-3 bg-background">
                    <h3 className="font-bold text-lg mb-4 font-bungee">INFO</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div>
                            <p className="font-semibold text-sm mb-2 text-foreground">Location:</p>
                            <p className="text-sm text-secondary leading-relaxed">26 Chermside St, <span className="text-brand-red font-semibold">Grange</span><br/>QLD 4051, Australia</p>
                        </div>

                        <div>
                            <p className="font-semibold text-sm mb-2 text-foreground">Phone:</p>
                            <p className="text-sm text-secondary">0433807915</p>
                        </div>

                        <div>
                            <p className="font-semibold text-sm mb-2 text-foreground">Open Hours:</p>
                            <p className="text-sm text-secondary">Sun, 10:30 AM - 2:00 PM</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}