// Re-export types for backward compat
export type { User as UserProfile } from "../../../../lib/types";

const TAG_STYLES = {
  primary:
    "bg-primary-container/20 border-primary-container/40 text-on-primary-container",
  secondary:
    "bg-secondary-container/20 border-secondary-container/40 text-on-secondary-container",
  tertiary:
    "bg-tertiary-container/20 border-tertiary-container/40 text-on-tertiary-container",
  neutral:
    "bg-surface-container-highest border-outline-variant text-on-surface-variant",
} as const;

export function getTagStyle(variant: keyof typeof TAG_STYLES) {
  return TAG_STYLES[variant];
}

export const SUGGESTION_TEXT = "Swipe to find your pair programmer";
