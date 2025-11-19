import Link from "next/link";
import Image from "next/image";

export default function HeaderComponent() {
    return (
        <header className="bg-white border-b border-brand-blue font-bungee font-bold text-xs sm:text-[20px] ">
            <div className="max-w-6xl mx-auto px-6  flex items-center justify-between">
                <Link href="/" className="flex items-center gap-3">
                    <Image
                        src="/media/logo.png"
                        alt="Los Guayacos Restaurant"
                        width={250}
                        height={250}
                        className="object-contain w-[170px] sm:w-[180px] md:w-[210px] lg:w-[250px] h-auto my-2"
                    />
                </Link>

                <nav aria-label="Main Navigation">
                    <ul className="flex items-center gap-6">
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
                </nav>
            </div>
        </header>
    );
}
