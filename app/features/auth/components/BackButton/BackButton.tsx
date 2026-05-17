import Link from "next/link";
import { ArrowBackIcon } from "../icons";
import { BACK_BUTTON } from "./constants";

export function BackButton() {
  return (
    <Link
      href={BACK_BUTTON.HREF}
      aria-label={BACK_BUTTON.ARIA_LABEL}
      className="fixed top-6 left-6 z-50 w-12 h-12 flex items-center justify-center rounded-full bg-surface/60 backdrop-blur-[20px] border border-white/50 shadow-[0_4px_20px_rgba(168,51,76,0.1)] text-on-surface-variant hover:text-primary hover:shadow-[0_8px_30px_rgba(168,51,76,0.2)] transition-all duration-300 hover:-translate-x-0.5"
    >
      <ArrowBackIcon className="w-5 h-5" />
    </Link>
  );
}
