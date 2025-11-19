import Image from "next/image";
import Link from "next/link";

export default function FooterComponent() {
    return (
        <div className="font-bungee flex justify-start items-center  bg-white border-b border-brand-blue font-bold text-xs sm:text-[20px] p-4 border-t-1">
            <ul className="flex gap-6">
                <li>
                    <Link
                        href="/"
                        className="text-secondary hover:text-brand-blue"
                    >
                        Menu
                    </Link>
                </li>
                <li>
                    <Link
                        href="/orders"
                        className="text-secondary hover:text-brand-blue"
                    >
                        Contact
                    </Link>
                </li>
            </ul>
            <div
                className="marquee hidden"
                role="region"
                aria-label="Promotional banner"
            >
                <div className="marquee__content">
                    {/* Duplicate the message to create a seamless loop */}
                    <Image
                        src="/media/banner_item_1.png"
                        alt="Delicious Ecuadorian Food"
                        width={150}
                        height={150}
                        className="object-contain h-auto"
                    />
                    <Image
                        src="/media/banner_item_2.png"
                        alt="Delicious Ecuadorian Food"
                        width={150}
                        height={150}
                        className="object-contain h-auto"
                    />
                </div>
            </div>
        </div>
    );
}