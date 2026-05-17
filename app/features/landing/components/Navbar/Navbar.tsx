import Link from "next/link";
import { NAVBAR } from "./constants";

export function Navbar() {
  return (
    <header className="flex justify-between items-center px-6 h-16 w-full fixed top-0 z-50 bg-surface/30 backdrop-blur-[20px] border-b border-white/20 shadow-[0_4px_20px_rgba(168,51,76,0.15)]">
      <div className="text-[28px] leading-[1.2] font-extrabold text-primary drop-shadow-[0_0_8px_rgba(168,51,76,0.4)]">
        {NAVBAR.BRAND_NAME}
      </div>
      <div className="flex gap-4">
        <Link
          href={NAVBAR.SIGN_IN_HREF}
          className="text-primary font-bold hover:bg-primary-container/20 transition-all duration-300 px-4 py-2 rounded-full hidden md:block"
        >
          {NAVBAR.SIGN_IN_TEXT}
        </Link>
      </div>
    </header>
  );
}
