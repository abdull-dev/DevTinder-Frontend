import { APP_NAVBAR } from "./constants";
import { SearchIcon, NotificationsIcon } from "../icons";

export function AppNavbar() {
  return (
    <header className="flex justify-between items-center px-3 sm:px-6 h-14 sm:h-16 w-full fixed top-0 z-50 bg-surface/30 backdrop-blur-[20px] border-b border-white/20 shadow-[0_4px_20px_rgba(168,51,76,0.15)]">
      {/* Brand */}
      <div className="flex items-center gap-4">
        <span className="text-xl sm:text-[28px] leading-[1.2] font-extrabold text-primary drop-shadow-[0_0_8px_rgba(168,51,76,0.4)]">
          {APP_NAVBAR.BRAND_NAME}
        </span>
      </div>

      {/* Search bar - desktop only */}
      <div className="hidden md:flex flex-1 max-w-xl px-12">
        <div className="relative w-full group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <SearchIcon className="w-5 h-5 text-primary/60 group-focus-within:text-primary transition-colors" />
          </div>
          <input
            type="text"
            placeholder={APP_NAVBAR.SEARCH_PLACEHOLDER}
            className="w-full bg-surface-container-low border-none rounded-full py-2.5 pl-12 pr-6 focus:ring-2 focus:ring-primary/30 font-sans text-on-surface-variant placeholder:text-on-surface-variant/40 transition-all shadow-inner outline-none"
          />
        </div>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-4">
        <button className="p-2 rounded-full hover:bg-primary-container/20 transition-all duration-300 active:scale-95 cursor-pointer">
          <NotificationsIcon className="w-6 h-6 text-primary" />
        </button>
      </div>
    </header>
  );
}
