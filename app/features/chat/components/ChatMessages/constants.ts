export interface ChatMessage {
  id: string;
  type: "received" | "sent" | "system";
  text: string;
  time: string;
  showAvatar: boolean;
  hasReaction?: boolean;
  codeSnippet?: string;
}

export const MATCH_INFO = {
  TEXT: "You and Sarah matched 2 hours ago.\nStart the conversation!",
} as const;

export const MESSAGES: ChatMessage[] = [
  {
    id: "1",
    type: "received",
    text: "Hey! I saw your profile and loved that you also prefer TypeScript over JavaScript. \uD83D\uDE05",
    time: "10:42 AM",
    showAvatar: true,
  },
  {
    id: "2",
    type: "sent",
    text: "Hi Sarah! Thanks! Yeah, static typing saves me from so many headaches. Are you working on anything fun right now?",
    time: "10:45 AM",
    showAvatar: false,
  },
  {
    id: "3",
    type: "received",
    text: "Mostly just refactoring some legacy code into React hooks today. It's... a process. But I'm surviving with enough coffee! \u2615",
    time: "10:48 AM",
    showAvatar: false,
    hasReaction: true,
  },
  {
    id: "4",
    type: "sent",
    text: "Oh nice! Hook refactors can be so satisfying once they're done. Here's a little motivation:",
    time: "10:50 AM",
    showAvatar: false,
    codeSnippet:
      "const refactorCode = (legacy) => {\n  return legacy.map(bug => '\u2764\uFE0F');\n};",
  },
];

export const AVATAR_SRC =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBEy93jh2nCS0EBxuOEngC9x6DJpkcimyRRT26m8_5OEYJLbXtvKNX4V8AefqWHf0pF9_QirXCF64ASjLxaGS16h-iuPgGRw9hTRm47Rgb4lsGU9XBdpGaKHAe4vc2-mAr9osfjBKeypzIFgVet1Kv1m71zoeKL_vspJbdbIx-PCdX8KzDYaDR5JptOVkWYYUx0bBup6Nysp9m0VrMhGV8PXXbaZKyqPvpHr7EHsZbqIch4nlU0bbZvhPwZsRl7iEYJ6IwlCKynMEGO";
