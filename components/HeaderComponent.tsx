import Image from "next/image";
import Link from "next/link";

export default function HeaderComponent() {
  return (
    <header className="sticky top-0 left-0 right-0 z-50 backdrop-blur-lg bg-linear-to-b from-cream/95 to-cream/90 shadow-sm shadow-foreground/5 transition-all duration-300">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-center px-4 sm:px-6 lg:px-8">
        <Link href="/" aria-label="Los Guayacos home" className="flex items-center justify-center">
          <Image
            src="/media/logo.png"
            alt="Los Guayacos"
            width={180}
            height={48}
            priority
            className="h-10 w-auto object-contain sm:h-11"
          />
        </Link>
      </div>
    </header>
  );
}
