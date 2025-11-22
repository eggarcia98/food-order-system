export default function MenuPage() {
    return (
        <div className=" mx-auto relative w-auto max-w-6xl p-6 mt-10 mb-20 ">
            <div className="grid  grid-col-1 md:grid-cols-3 md:grid-rows-2  gap-6 space-y-4">
                <div className="border-4 border-accent rounded-lg p-6 pt-5 bg-white   col-span-3 w-full">
                    {/* Heading overlay */}
                    <h2 className="relative -top-10  -left-3 w-fit bg-white px-3 text-2xl font-extrabold tracking-wider">
                        THE MAINS
                    </h2>

                    {/* Items */}
                    <ul className="space-y-4 mt-2">
                        <li className="flex items-center gap-4">
                            <span className="flex-none w-52 md:w-60 text-lg font-medium">
                                35g Albacore Fish
                            </span>
                            <span className="flex-1 border-b border-dashed border-gray-400"></span>
                            <span className="flex-none w-16 text-right text-lg font-semibold">
                                $ 5
                            </span>
                        </li>

                        <li className="flex items-center gap-4">
                            <span className="flex-none w-52 md:w-60 text-lg font-medium">
                                Fried Egg
                            </span>
                            <span className="flex-1 border-b border-dashed border-gray-400"></span>
                            <span className="flex-none w-16 text-right text-lg font-semibold">
                                $ 2
                            </span>
                        </li>

                        <li className="flex items-center gap-4">
                            <span className="flex-none w-52 md:w-60 text-lg font-medium">
                                Plantain Chips
                            </span>
                            <span className="flex-1 border-b border-dashed border-gray-400"></span>
                            <span className="flex-none w-16 text-right text-lg font-semibold">
                                $ 3
                            </span>
                        </li>

                        <li className="flex items-center gap-4">
                            <span className="flex-none w-52 md:w-60 text-lg font-medium">
                                Coca Cola
                            </span>
                            <span className="flex-1 border-b border-dashed border-gray-400"></span>
                            <span className="flex-none w-16 text-right text-lg font-semibold">
                                $ 3
                            </span>
                        </li>
                    </ul>
                </div>

                
                <div className="border-4 border-accent rounded-lg p-6 bg-white col-span-3 md:col-span-2">
                    {/* Heading overlay */}
                    <h2 className="relative -top-10 -left-3 bg-white px-3 text-2xl font-extrabold tracking-wider w-fit">
                        EXTRAS
                    </h2>

                    {/* Items */}
                    <ul className="space-y-4  ">
                        <li className="flex items-center gap-4">
                            <span className="flex-none w-52 md:w-60 text-lg font-medium">
                                35g Albacore Fish
                            </span>
                            <span className="flex-1 border-b border-dashed border-gray-400"></span>
                            <span className="flex-none w-16 text-right text-lg font-semibold">
                                $ 5
                            </span>
                        </li>

                        <li className="flex items-center gap-4">
                            <span className="flex-none w-52 md:w-60 text-lg font-medium">
                                Fried Egg
                            </span>
                            <span className="flex-1 border-b border-dashed border-gray-400"></span>
                            <span className="flex-none w-16 text-right text-lg font-semibold">
                                $ 2
                            </span>
                        </li>

                        <li className="flex items-center gap-4">
                            <span className="flex-none w-52 md:w-60 text-lg font-medium">
                                Plantain Chips
                            </span>
                            <span className="flex-1 border-b border-dashed border-gray-400"></span>
                            <span className="flex-none w-16 text-right text-lg font-semibold">
                                $ 3
                            </span>
                        </li>

                        <li className="flex items-center gap-4">
                            <span className="flex-none w-52 md:w-60 text-lg font-medium">
                                Coca Cola
                            </span>
                            <span className="flex-1 border-b border-dashed border-gray-400"></span>
                            <span className="flex-none w-16 text-right text-lg font-semibold">
                                $ 3
                            </span>
                        </li>
                    </ul>
                </div>

                <div className="border-4 border-accent-secondary rounded-lg p-6 bg-white col-span-3 md:col-span-1">
                    {/* Heading overlay */}
                    <h2 className="relative -top-10 -left-3 bg-white px-3 text-2xl font-extrabold tracking-wider w-fit">
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
                        <div>
                            <b>Phone: </b>0433807915
                        </div>
                    </p>
                </div>
            </div>
        </div>
    );
}
