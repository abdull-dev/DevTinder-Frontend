import type { User, Message, ChatThread, Match, ConnectionRequest, ProfileData } from "./types";

// ── Current logged-in user ──
export const CURRENT_USER: Pick<User, "id" | "name" | "avatarUrl"> = {
  id: "me",
  name: "You",
  avatarUrl:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuA_oOgkq88__yPA225bqF-_wdxz5j19AYblsGJtOJ8P1iuOP79m13M-KdoZDvjMlZWZia-SshWNn92FdOjLYvUXopHU7cT9f28SW0T57h5b0ABfnhe2xyvtXineGq6qYBqJf8qlx7G4XbTMOQGTP-n4rF527FJ3U6EV6FbxkU9hGltQPMqn1eBWyrSPTQ7lplq9xHc6RJkKCOpsdxqRO-1etVl72phkCAKtfBob3QWbAOAxRGs_vGcaNWK0WqJnqvISXmFPtzbRiRy6",
};

// ── Feed users (for swipe stack) ──
export const FEED_USERS: User[] = [
  {
    id: "sarah-1",
    name: "Sarah",
    age: 26,
    gender: "female",
    title: "Frontend Alchemist",
    avatarUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBlAkJJ6JG3P85Wri8lkQhqwo9hRIJLXIOitPjA70fHZamBnqDx9qsPckA1QbzG6AZnaI8qRH1NkxCxnYT5r17u4VhSMx1rG2bzwhuIvwwyyDFD-Y-5JVBuPsfCfBE6T7cDGv9Yr8wG2Qy_I2lmB-v7213Q3DXgBRxhk6ufQqcs-64QYB6WMB7NahRurZkPcj7kMMQwU74u8kCBXP2Mmdakd3vRH5CWXNKadvS0xHVAwwdO0w7cURPSOL9R4yp_CXV3d72QiqgrQrun",
    isOnline: true,
    isVerified: true,
    isPremium: false,
    bio: "I turn coffee into CSS and dreams into responsive layouts. Passionate about clean code, accessibility, and creating digital experiences that feel like magic. \u2728",
    quote: '"Looking for my significant other to help me solve a merge conflict or two."',
    work: "Senior Engineer @ Vercel",
    location: "Remote \u00b7 SF",
    techStack: [
      { label: "React", variant: "primary" },
      { label: "TypeScript", variant: "secondary" },
      { label: "Tailwind", variant: "tertiary" },
      { label: "Framer Motion", variant: "neutral" },
    ],
    badges: [
      { label: "Top Talent", variant: "white" },
      { label: "Online", variant: "primary" },
    ],
  },
  {
    id: "elena-2",
    name: "Elena",
    age: 24,
    gender: "female",
    title: "Full-Stack Enchantress",
    avatarUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCRi8rmqpuP_HDHBSB114JGFd10vUjKKusxqzDy1Hv3l5TqgNGeoY9pLpvem7-7lNXtqBM3DBNfTG0Y2PWAyLCxDZ0pjjVcyPMFnkn6jHvo6GuyJmfbhY3WFkNs2hwKd8w4Zgc47lUJ9EWUwSSV-MPPqkYz0SjOeUIEZeJ32ms8gSc_Dyfq9zIVY4Dg-MyDIAIF8vWOQr0pz6K--0dWGKa9l9gVFCO49gCnTiyBC7yN9_Zbgz7IYA8_34KklC-7_-d6dRcw65fvxsAp",
    isOnline: true,
    isVerified: false,
    isPremium: false,
    bio: "Building scalable web apps by day, contributing to open source by night. Firm believer that good code reads like poetry.",
    quote: '"My love language is clean pull requests."',
    work: "Tech Lead @ Stripe",
    location: "New York, NY",
    techStack: [
      { label: "Next.js", variant: "primary" },
      { label: "Node.js", variant: "secondary" },
      { label: "PostgreSQL", variant: "tertiary" },
    ],
    badges: [{ label: "Online", variant: "primary" }],
  },
  {
    id: "marcus-3",
    name: "Marcus",
    age: 29,
    gender: "male",
    title: "Backend Wizard",
    avatarUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCwbwas2b5_fiNAM8q9CXPqK7KRKCRIFurORHbsFAtoMsHO91xTF8q8d9aGpJ-Ypl9dmfA_lmw6qEey0KhfBg-4WLbVeJKkCwXPEVJrzRT74TDZEn_b26eZ0f0MeaJf4J5J5eKzxIKYVozHvfLabHYzWs0Rs1lsjlT4Qsb4hEF7EpnOx9YOaJlGnLqETVp0bNld1G_50LBTfvxqb9zVF4MDDsaL-q93UlbA6RVPwoxBxwOJOKa-jdBqqAKW_i43N0wEhCat403QDfSu",
    isOnline: false,
    isVerified: true,
    isPremium: false,
    bio: "Distributed systems enthusiast who believes every problem can be solved with the right data structure. Also makes killer espresso.",
    quote: '"Looking for someone to pair program and share late-night debugging sessions."',
    work: "Staff Engineer @ Netflix",
    location: "Remote \u00b7 LA",
    techStack: [
      { label: "Python", variant: "primary" },
      { label: "Django", variant: "secondary" },
      { label: "AWS", variant: "neutral" },
    ],
    badges: [{ label: "Top Talent", variant: "white" }],
  },
  {
    id: "aria-4",
    name: "Aria",
    age: 25,
    gender: "female",
    title: "Design Engineer",
    avatarUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAg5cuh-OJ5mhccHPTOQbtX5gi76Y3LLYV0hUD3lHq-hTeNF1gWHQtrA_oCvHc43BnDq8o7XsAugsNvnvLTo3LFUyGu1V5_vwCJjPHftyF4zh4_CgdARX6l5IazcUlLMvIFaDVKy89ZprxBtvNUpawV7jX1ZsJVLqYtrJm_AFIuMIqhKPBkcwTDX4P52XGcTzZ6YKMkTTeSWK_vMTZTvWnuOjPSqOWaBXcckZsprh1_LC2-2gSm7g1okD5Je_ENK4As9g8grcnWFPNe",
    isOnline: true,
    isVerified: false,
    isPremium: false,
    bio: "Where design meets code. I craft pixel-perfect interfaces and believe great UX is invisible. Currently obsessed with micro-interactions.",
    quote: '"You had me at border-radius: 50%."',
    work: "Design Engineer @ Linear",
    location: "London, UK",
    techStack: [
      { label: "Figma", variant: "primary" },
      { label: "React", variant: "secondary" },
      { label: "CSS", variant: "tertiary" },
      { label: "Motion", variant: "neutral" },
    ],
    badges: [
      { label: "Online", variant: "primary" },
      { label: "New", variant: "white" },
    ],
  },
  {
    id: "david-5",
    name: "David",
    age: 31,
    gender: "male",
    title: "DevOps Architect",
    avatarUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDgeF_qpJlK23m1XPomyKu0dFoe-gSFpxHZwFaC8Y3jWfoyhA3J7d6_1AFq9YWkVf5_9GigOnlKRNR97xnZJXgcjQlx_ZSFIO2AeqEqQWTS6u6xRSgCqvfTlznrXZlXQtQSuT_neNjdABOP174o7xUhVtuDwN4gWreUHlBIYGg0cYuqfPm0tJFacBhDKzpp_wHP7eRrbkzHT9yLM0GHfczuoyAcHrVHZx31HoMvurClXgylGL1yfrltomVDq6eD9le2EkuL2Q5gnCZ4",
    isOnline: false,
    isVerified: true,
    isPremium: false,
    bio: "I automate everything so you don't have to. Passionate about infrastructure as code, CI/CD pipelines, and making deploys boring.",
    quote: '"My ideal date? kubectl apply -f love.yaml"',
    work: "Principal SRE @ Google",
    location: "Seattle, WA",
    techStack: [
      { label: "Kubernetes", variant: "primary" },
      { label: "Terraform", variant: "secondary" },
      { label: "Go", variant: "tertiary" },
    ],
    badges: [{ label: "Top Talent", variant: "white" }],
  },
];

// ── Matches ──
export const MATCHES: Match[] = [
  {
    id: "match-1",
    user: { id: "elena-2", name: "Elena", age: 26, avatarUrl: FEED_USERS[1].avatarUrl, isOnline: true },
    techLabel: "React & TS",
    techIcon: "terminal",
    variant: "pink",
    emoji: "\u2764\uFE0F",
    matchedAt: "2 hours ago",
  },
  {
    id: "match-2",
    user: { id: "marcus-3", name: "Marcus", age: 29, avatarUrl: FEED_USERS[2].avatarUrl, isOnline: false },
    techLabel: "Python & Django",
    techIcon: "database",
    variant: "blue",
    emoji: "\u2728",
    matchedAt: "1 day ago",
  },
  {
    id: "match-3",
    user: { id: "aria-4", name: "Sarah", age: 25, avatarUrl: FEED_USERS[3].avatarUrl, isOnline: false },
    techLabel: "UI/UX Design",
    techIcon: "palette",
    variant: "purple",
    emoji: "\uD83C\uDF38",
    matchedAt: "3 days ago",
  },
  {
    id: "match-4",
    user: { id: "david-5", name: "David", age: 31, avatarUrl: FEED_USERS[4].avatarUrl, isOnline: true },
    techLabel: "DevOps & AWS",
    techIcon: "cloud",
    variant: "orange",
    emoji: "\u2601\uFE0F",
    matchedAt: "5 days ago",
  },
];

// ── Connection Requests ──
export const CONNECTION_REQUESTS: ConnectionRequest[] = [
  {
    id: "conn-1",
    user: {
      id: "alex-10",
      name: "Alex Chen",
      avatarUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAaUA6WIFFGVdmgYR_Pt7wn3sucZFWYQ10JpGVy00Jx8wimDNhulg-FcNQOHsvFhUy6sLMotA-VqwI6gEDTrVx4AchIvygo7VBFwAz3uiEjuqZ6u0RgdbtGaFv5wasHR9YSZ96b_poWN5x_jO8QzTF4zBlEIQ76-YUo3TqejgNCUwCrPtuY8MRxedq12anTHzS0K08n5_ZVGfJ7PhF1qUe0Fd0b6BbXv5KnQr9aFTAjNK_6wRw5Tq-lfpo4WZAGg70ihYyHjUmFkQDJ",
      isVerified: true,
    },
    handle: "@frontend_poet",
    codeSnippet: [
      'if (coffee === empty) {',
      '  await fetch("date");',
      '}',
    ],
    status: "pending",
    createdAt: "2 hours ago",
  },
  {
    id: "conn-2",
    user: {
      id: "sam-11",
      name: "Sam Rivera",
      avatarUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAP5SBqAJZUoYI9vBCVk3g3rTPEK9OiY0z7ZrWdUNcUCI-Ku3X3y8bq0_Uwpwq3CHzGNeYCduGzJ2TUSGwOnP9NZJaPio01_F6F7XQXM2vfRxfX3iLCCeJC64utp_98EHjYjBBZuKgUrWrshLcaM5724rwXv1Wt15g0LxuwNjULBMHa1kZeic2Cp4l1OMr2iLXyWSDc1s1UbTK2kz6fyo2BSCVMG70sf-qAsIyyL2PizZRPzSaAi5sPwY4EwzIxRra77isQtr0iF59_",
      isVerified: false,
    },
    handle: "@data_dreamer",
    codeSnippet: [
      '<span class="text-secondary">SELECT</span> heart',
      '<span class="text-secondary">FROM</span> universe',
      '<span class="text-secondary">WHERE</span> soulmate = true;',
    ],
    status: "pending",
    createdAt: "5 hours ago",
  },
];

// ── Chat threads ──
export const CHAT_THREADS: ChatThread[] = [
  {
    id: "thread-sarah",
    user: { id: "sarah-1", name: "Sarah", avatarUrl: FEED_USERS[0].avatarUrl, isOnline: true },
    lastMessage: "Typing...",
    lastMessageTime: "10:48 AM",
    isTyping: true,
    unreadCount: 0,
  },
  {
    id: "thread-marcus",
    user: { id: "marcus-3", name: "Marcus", avatarUrl: FEED_USERS[2].avatarUrl, isOnline: false },
    lastMessage: "That React Native bug was tough...",
    lastMessageTime: "Yesterday",
    isTyping: false,
    unreadCount: 0,
  },
];

// ── Chat messages (for sarah thread) ──
export const CHAT_MESSAGES: Message[] = [
  {
    id: "msg-1",
    senderId: "sarah-1",
    text: "Hey! I saw your profile and loved that you also prefer TypeScript over JavaScript. \uD83D\uDE05",
    timestamp: "10:42 AM",
    status: "read",
  },
  {
    id: "msg-2",
    senderId: "me",
    text: "Hi Sarah! Thanks! Yeah, static typing saves me from so many headaches. Are you working on anything fun right now?",
    timestamp: "10:45 AM",
    status: "read",
  },
  {
    id: "msg-3",
    senderId: "sarah-1",
    text: "Mostly just refactoring some legacy code into React hooks today. It's... a process. But I'm surviving with enough coffee! \u2615",
    timestamp: "10:48 AM",
    status: "read",
    reaction: "\u2764\uFE0F",
  },
  {
    id: "msg-4",
    senderId: "me",
    text: "Oh nice! Hook refactors can be so satisfying once they're done. Here's a little motivation:",
    timestamp: "10:50 AM",
    status: "delivered",
    codeSnippet: "const refactorCode = (legacy) => {\n  return legacy.map(bug => '\u2764\uFE0F');\n};",
  },
];

// ── My Profile ──
export const MY_PROFILE: ProfileData = {
  id: "me",
  name: "Eleanor",
  age: 26,
  gender: "Female",
  jobTitle: "Senior Frontend Engineer",
  workplace: "TechCorp Inc.",
  location: "San Francisco, CA",
  avatarUrl:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAgZrJplKIuxD0bpk2IdUy5JGKE6r0CdTcVowp8mSsdLWC-_zCf5gkD6OKSwfYNaF0WI5-rJ7txG0ls_WjYiNWmmdFMTTIAOB0pkrVlzGTqIL-jv08UySpvq8ywXRO_cTjpjiA5X09lnHRcM7Jjf22kRbVppxyLnQe4SZ8hWttK3xpTNJUv_Rm8Lm8Q7uHm0QGNsLyBMYNHIwQNv4m0Xr85SUV5ByIPtwTzFNSJR0KhHaz98DWDgPRf4ksbSk7tpj3LCGiyWpgVWd6H",
  isPremium: false,
  premiumPlan: null,
  premiumExpiresAt: null,
  bio: "Just a girl trying to center divs and find someone who understands my obscure CSS jokes. I believe in clean code, dirty martinis, and romanticizing the terminal. Let's build something beautiful together. \uD83D\uDC85\u2728",
  photos: [
    {
      id: "photo-1",
      url: "https://lh3.googleusercontent.com/aida-public/AB6AXuCZvYR_WlE9yWesM91wAo0o2Arc1BemjOFkl7V1JXPMTWb9HF5ix7kOmjJz3eY_TR12SpisLPghk-ReO5n3xJ9qTH3Ao5G0ilkh4kaquKOcUCd-firbQsrUWHZTlJeUUZvVBsh-oWnJDz6aqy17PT6jzzmS7j8ScmFL33tCAcr4uHPUkT_uSKXVisiJipMjVzrXiVii08FPx_k1nOKpz1U1SuWenjq90jKKAjK1Vam7D1y_pqCjd5GprbeGuIIYuZGFzJogECJVrWdl",
      alt: "Laughing at a cafe with a coffee mug",
    },
    {
      id: "photo-2",
      url: "https://lh3.googleusercontent.com/aida-public/AB6AXuAAiEj4WXnjw4zVEhJ_pw8bmOuBKswwASjvdcXxmVeGpo8qiFmuhngD933mnwJ6xK5CRym4h7V_3E4q3XiNwlGO_dNaJhRZkunun5Yg8GgsELi9yqpZ0EQ3yFCAowxECZKLQa7XGp9oFruMnaf1a0W0YNZyJELhB2LsZI4ERmf4f-WG9cvGkxS5FN314auIFab8B1uah5Qa08YP2_8J_WJXc7lDDKyjbAXCZF-15QinKgW7S5_2YG3rqdCCnLp9GTNmVF4-Xewzddfe",
      alt: "Typing on a pastel mechanical keyboard",
    },
    {
      id: "photo-3",
      url: "https://lh3.googleusercontent.com/aida-public/AB6AXuCDj3RlWISI7S9iXK0hL-lXro8TkshnVOQACUhYwt_YMfvMJyy5-dTYgLLlkq5Xuqdrhn3spKfJTdUmDXyJ42bmlfRuakLKMeiQCbLUR0etAdeE1HlCpu00uVhzbpDO-VGvL3XzESf0wa0j__mrGBpb-wO9ITVBhTkuHeKUUSMUBFBz9F_uyJVSDKMWK1qcBY4kX9-ZDzq8rIoQF2-TJkCHi7RA7Oxdtut1SbxJskVH6Fz4twUImqwqroRjEhWLb3sN9LecIrQFzpX9",
      alt: "Colorful code on a monitor",
    },
  ],
  techStack: [
    { id: "js", label: "JavaScript", color: "#f1e05a" },
    { id: "ts", label: "TypeScript", color: "#3178c6" },
    { id: "react", label: "React", color: "#61dafb" },
    { id: "tw", label: "Tailwind", color: "#38bdf8" },
  ],
  interests: [
    { id: "coffee", label: "Coffee", icon: "coffee" },
    { id: "scifi", label: "Sci-Fi Movies", icon: "movie" },
    { id: "design", label: "UI Design", icon: "design" },
  ],
};

// ── Match avatars for chat sidebar ──
export const CHAT_MATCH_AVATARS = [
  { id: "alex-10", name: "Alex", avatarUrl: CONNECTION_REQUESTS[0].user.avatarUrl, hasImage: true },
  { id: "jordan-12", name: "Jordan", hasImage: false },
  { id: "casey-13", name: "Casey", hasImage: false },
];
