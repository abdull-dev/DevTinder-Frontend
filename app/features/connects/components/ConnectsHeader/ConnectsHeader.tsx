import { CONNECTS_HEADER } from "./constants";

export function ConnectsHeader() {
  return (
    <div className="flex flex-col items-center text-center gap-4">
      <h1 className="text-5xl md:text-[56px] font-extrabold tracking-[-0.02em] animated-gradient-text drop-shadow-[0_4px_12px_rgba(168,51,76,0.1)]">
        {CONNECTS_HEADER.HEADING}
      </h1>
      <p className="text-on-surface-variant max-w-lg">
        {CONNECTS_HEADER.DESCRIPTION}
      </p>
    </div>
  );
}
