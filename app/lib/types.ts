// ── User ──
export interface User {
  id: string;
  name: string;
  age: number;
  gender: string;
  title: string;
  avatarUrl: string;
  isOnline: boolean;
  isVerified: boolean;
  isPremium: boolean;
  bio: string;
  quote: string;
  work: string;
  country: string;
  city: string;
  techStack: TechTag[];
  badges: Badge[];
}

export interface TechTag {
  label: string;
  variant: "primary" | "secondary" | "tertiary" | "neutral";
}

export interface Badge {
  label: string;
  variant: "white" | "primary";
}

// ── Chat ──
export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  status?: "sent" | "delivered" | "read";
  codeSnippet?: string;
  reaction?: string;
}

export interface ChatThread {
  id: string;
  user: Pick<User, "id" | "name" | "avatarUrl" | "isOnline">;
  lastMessage: string;
  lastMessageTime: string;
  isTyping: boolean;
  unreadCount: number;
}

// ── Matches ──
export interface Match {
  id: string;
  user: Pick<User, "id" | "name" | "age" | "avatarUrl" | "isOnline">;
  techLabel: string;
  techIcon: "terminal" | "database" | "palette" | "cloud";
  variant: "pink" | "blue" | "purple" | "orange";
  emoji: string;
  matchedAt: string;
}

// ── Profile ──
export interface ProfileData {
  id: string;
  name: string;
  age: number;
  gender: string;
  jobTitle: string;
  workplace: string;
  country: string;
  city: string;
  avatarUrl: string;
  bio: string;
  profileComplete: boolean;
  isPremium: boolean;
  premiumPlan: string | null;
  premiumExpiresAt: string | null;
  photos: ProfilePhoto[];
  techStack: SkillTag[];
  interests: InterestTag[];
}

export interface ProfilePhoto {
  id: string;
  url: string;
  alt: string;
}

export interface SkillTag {
  id: string;
  label: string;
  color: string; // dot color hex
}

export interface InterestTag {
  id: string;
  label: string;
  icon: string;
}

// ── Connections ──
export interface ConnectionRequest {
  id: string;
  user: Pick<User, "id" | "name" | "avatarUrl" | "isVerified">;
  handle: string;
  codeSnippet: string[];
  status: "pending" | "accepted" | "rejected";
  createdAt: string;
}
