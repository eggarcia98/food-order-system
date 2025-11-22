export default function MenuPage() {
    return (
        <div className="max-w-xl mx-auto relative">
            <div className="border-4 border-red-600 rounded-lg p-6 pt-8 bg-white">
                {/* Heading overlay */}
                <h2 className="absolute -top-4 left-6 bg-white px-3 text-2xl font-extrabold tracking-wider">
                    EXTRAS
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
        </div>
    );
}
