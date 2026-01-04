export default function MenuPage() {
    return (
        <div className=" mx-auto relative w-auto max-w-6xl p-6 m-8 ">
            <div className="grid grid-col-1 md:grid-cols-3 md:grid-rows-2  gap-6 space-y-4">
                <div className="relative border-3 border-brand rounded-md px-6 pb-6 pt-8 col-span-3 w-full bg-background">
                    {/* Section heading overlaying the border */}
                    <h2
                        className="absolute -top-3 left-4 px-2 text-2xl font-black tracking-tight font-bungee leading-none  bg-background"
                        style={{ WebkitTextStroke: "0.5px #3D3935" }}
                    >
                        THE MAINS
                    </h2>

                    {/* Items */}
                    <ul className="space-y-4 ">
                        <div>
                            <div className="text-lg font-medium">
                                ENCEBOLLADO (DRINK INCLUDED)
                            </div>
                            <div className="text-sm text-secondary mb-1">
                                A classic Ecuadorian Soup of Albacore Fish,
                                Onion and Cassava. Perfect to recover you after
                                HangOver
                            </div>
                            <ul className="space-y-2 ml-4 mt-4">
                                <li className="flex items-center gap-4 ">
                                    <span className="flex-none w-52 md:w-60 ">
                                        Encebollado + Plantain Chips
                                    </span>
                                    <span className="flex-1 border-b border-dashed border-gray-400"></span>
                                    <span className="flex-none w-16 text-right ">
                                        $ 22
                                    </span>
                                </li>
                                <li className="flex items-center gap-4">
                                    <span className="flex-none w-52 md:w-60 ">
                                        Encebollado
                                    </span>
                                    <span className="flex-1 border-b border-dashed border-gray-400"></span>
                                    <span className="flex-none w-16 text-right ">
                                        $ 19
                                    </span>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <div className="text-lg font-medium">
                                GUATITA (DRINK INCLUDED)
                            </div>
                            <div className="text-sm text-secondary mb-1">
                                A classic Ecuadorian tripe stew in a creamy
                                peanut sauce, served with potatoes and rice
                            </div>
                            <ul className="space-y-2 ml-4 mt-4">
                                <li className="flex items-center gap-4 ">
                                    <span className="flex-none w-52 md:w-60 ">
                                        Guatita + Plantain Chips
                                    </span>
                                    <span className="flex-1 border-b border-dashed border-gray-400"></span>
                                    <span className="flex-none w-16 text-right ">
                                        $ 22
                                    </span>
                                </li>
                                <li className="flex items-center gap-4">
                                    <span className="flex-none w-52 md:w-60 ">
                                        Guatita
                                    </span>
                                    <span className="flex-1 border-b border-dashed border-gray-400"></span>
                                    <span className="flex-none w-16 text-right ">
                                        $ 18
                                    </span>
                                </li>
                            </ul>
                        </div>

                        <div>
                            <div className="text-lg font-medium">BOLON</div>
                            <div className="text-sm text-secondary mb-1">
                                Mashed green plantain mixed with cheese or pork
                                cracklings, shaped into a ball
                            </div>
                            <ul className="space-y-2 ml-4 mt-4">
                                <li className="flex items-center gap-4 ">
                                    <span className="flex-none w-52 md:w-60 ">
                                        Pork Belly Bolon
                                    </span>
                                    <span className="flex-1 border-b border-dashed border-gray-400"></span>
                                    <span className="flex-none w-16 text-right ">
                                        $ 17
                                    </span>
                                </li>
                                <li className="flex items-center gap-4">
                                    <span className="flex-none w-52 md:w-60 ">
                                        Cheese Bolon
                                    </span>
                                    <span className="flex-1 border-b border-dashed border-gray-400"></span>
                                    <span className="flex-none w-16 text-right ">
                                        $ 17
                                    </span>
                                </li>
                                <li className="flex items-center gap-4">
                                    <span className="flex-none w-52 md:w-60 ">
                                        Mixed Bolon (cheese and pork belly)
                                    </span>
                                    <span className="flex-1 border-b border-dashed border-gray-400"></span>
                                    <span className="flex-none w-16 text-right ">
                                        $ 20
                                    </span>
                                </li>
                            </ul>
                        </div>
                    </ul>
                </div>

                <div className="relative border-3 h-fit border-brand rounded-lg px-6 pb-6 pt-8 col-span-3 md:col-span-2 bg-background">
                    {/* Section heading overlaying the border */}
                    <h2
                        className="absolute -top-3 left-4 px-2 text-2xl font-black tracking-tight font-bungee leading-none bg-background"
                        style={{ WebkitTextStroke: "0.5px #3D3935" }}
                    >
                        EXTRAS
                    </h2>

                    {/* Items */}
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
                    {/* Section heading overlaying the border */}
                    <h2
                        className="absolute -top-3 left-4 px-2 text-2xl font-black tracking-tight font-bungee leading-none bg-background"
                        style={{ WebkitTextStroke: "0.5px #3D3935" }}
                    >
                        INFO
                    </h2>
                    {/* Items */}
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
