export const MATCHES_PAGE = {
  HEADING: "Mutual Connections",
  DESCRIPTION:
    "These developers liked your codebase. Start a romantic pair-programming session today.",
} as const;

export type MatchVariant = "pink" | "blue" | "purple" | "orange";

export interface MatchData {
  name: string;
  emoji: string;
  techLabel: string;
  techIcon: "terminal" | "database" | "palette" | "cloud";
  ctaText: string;
  imageSrc: string;
  isOnline: boolean;
  variant: MatchVariant;
}

const VARIANT_STYLES: Record<
  MatchVariant,
  { tagBg: string; tagText: string; tagBorder: string; btnGradient: string; btnShadow: string }
> = {
  pink: {
    tagBg: "bg-pink-50",
    tagText: "text-pink-600",
    tagBorder: "border-pink-100",
    btnGradient: "from-primary-container to-pink-300",
    btnShadow: "shadow-[0_8px_20px_rgba(255,117,140,0.3)] hover:shadow-[0_10px_25px_rgba(255,117,140,0.5)]",
  },
  blue: {
    tagBg: "bg-blue-50",
    tagText: "text-blue-600",
    tagBorder: "border-blue-100",
    btnGradient: "from-secondary-container to-blue-300",
    btnShadow: "shadow-[0_8px_20px_rgba(115,54,205,0.2)] hover:shadow-[0_10px_25px_rgba(115,54,205,0.4)]",
  },
  purple: {
    tagBg: "bg-purple-50",
    tagText: "text-purple-600",
    tagBorder: "border-purple-100",
    btnGradient: "from-primary-container to-pink-300",
    btnShadow: "shadow-[0_8px_20px_rgba(255,117,140,0.3)] hover:shadow-[0_10px_25px_rgba(255,117,140,0.5)]",
  },
  orange: {
    tagBg: "bg-orange-50",
    tagText: "text-orange-600",
    tagBorder: "border-orange-100",
    btnGradient: "from-primary-container to-pink-300",
    btnShadow: "shadow-[0_8px_20px_rgba(255,117,140,0.3)] hover:shadow-[0_10px_25px_rgba(255,117,140,0.5)]",
  },
};

export function getVariantStyles(variant: MatchVariant) {
  return VARIANT_STYLES[variant];
}

export const MATCHES: MatchData[] = [
  {
    name: "Elena, 26",
    emoji: "\u2764\uFE0F",
    techLabel: "React & TS",
    techIcon: "terminal",
    ctaText: "Chat with Elena",
    imageSrc:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCRi8rmqpuP_HDHBSB114JGFd10vUjKKusxqzDy1Hv3l5TqgNGeoY9pLpvem7-7lNXtqBM3DBNfTG0Y2PWAyLCxDZ0pjjVcyPMFnkn6jHvo6GuyJmfbhY3WFkNs2hwKd8w4Zgc47lUJ9EWUwSSV-MPPqkYz0SjOeUIEZeJ32ms8gSc_Dyfq9zIVY4Dg-MyDIAIF8vWOQr0pz6K--0dWGKa9l9gVFCO49gCnTiyBC7yN9_Zbgz7IYA8_34KklC-7_-d6dRcw65fvxsAp",
    isOnline: true,
    variant: "pink",
  },
  {
    name: "Marcus, 29",
    emoji: "\u2728",
    techLabel: "Python & Django",
    techIcon: "database",
    ctaText: "Chat with Marcus",
    imageSrc:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCwbwas2b5_fiNAM8q9CXPqK7KRKCRIFurORHbsFAtoMsHO91xTF8q8d9aGpJ-Ypl9dmfA_lmw6qEey0KhfBg-4WLbVeJKkCwXPEVJrzRT74TDZEn_b26eZ0f0MeaJf4J5J5eKzxIKYVozHvfLabHYzWs0Rs1lsjlT4Qsb4hEF7EpnOx9YOaJlGnLqETVp0bNld1G_50LBTfvxqb9zVF4MDDsaL-q93UlbA6RVPwoxBxwOJOKa-jdBqqAKW_i43N0wEhCat403QDfSu",
    isOnline: false,
    variant: "blue",
  },
  {
    name: "Sarah, 25",
    emoji: "\uD83C\uDF38",
    techLabel: "UI/UX Design",
    techIcon: "palette",
    ctaText: "Chat with Sarah",
    imageSrc:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAg5cuh-OJ5mhccHPTOQbtX5gi76Y3LLYV0hUD3lHq-hTeNF1gWHQtrA_oCvHc43BnDq8o7XsAugsNvnvLTo3LFUyGu1V5_vwCJjPHftyF4zh4_CgdARX6l5IazcUlLMvIFaDVKy89ZprxBtvNUpawV7jX1ZsJVLqYtrJm_AFIuMIqhKPBkcwTDX4P52XGcTzZ6YKMkTTeSWK_vMTZTvWnuOjPSqOWaBXcckZsprh1_LC2-2gSm7g1okD5Je_ENK4As9g8grcnWFPNe",
    isOnline: false,
    variant: "purple",
  },
  {
    name: "David, 31",
    emoji: "\u2601\uFE0F",
    techLabel: "DevOps & AWS",
    techIcon: "cloud",
    ctaText: "Chat with David",
    imageSrc:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDgeF_qpJlK23m1XPomyKu0dFoe-gSFpxHZwFaC8Y3jWfoyhA3J7d6_1AFq9YWkVf5_9GigOnlKRNR97xnZJXgcjQlx_ZSFIO2AeqEqQWTS6u6xRSgCqvfTlznrXZlXQtQSuT_neNjdABOP174o7xUhVtuDwN4gWreUHlBIYGg0cYuqfPm0tJFacBhDKzpp_wHP7eRrbkzHT9yLM0GHfczuoyAcHrVHZx31HoMvurClXgylGL1yfrltomVDq6eD9le2EkuL2Q5gnCZ4",
    isOnline: true,
    variant: "orange",
  },
];
