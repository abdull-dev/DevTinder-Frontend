export const SIDEBAR_NAV_ITEMS = [
  { key: "discover", href: "/feed", icon: "heart" },
  { key: "chat", href: "/chat", icon: "chat" },
  { key: "matches", href: "/matches", icon: "group" },
  { key: "connects", href: "/connects", icon: "terminal" },
  { key: "profile", href: "/profile", icon: "person" },
  { key: "premium", href: "/premium", icon: "crown" },
] as const;

export const SIDEBAR_SETTINGS = {
  key: "settings",
  href: "/settings",
  icon: "settings",
} as const;
