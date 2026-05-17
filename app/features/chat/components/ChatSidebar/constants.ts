export const MATCHES_AVATARS = [
  {
    name: "Alex",
    imageSrc:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBEy93jh2nCS0EBxuOEngC9x6DJpkcimyRRT26m8_5OEYJLbXtvKNX4V8AefqWHf0pF9_QirXCF64ASjLxaGS16h-iuPgGRw9hTRm47Rgb4lsGU9XBdpGaKHAe4vc2-mAr9osfjBKeypzIFgVet1Kv1m71zoeKL_vspJbdbIx-PCdX8KzDYaDR5JptOVkWYYUx0bBup6Nysp9m0VrMhGV8PXXbaZKyqPvpHr7EHsZbqIch4nlU0bbZvhPwZsRl7iEYJ6IwlCKynMEGO",
    hasImage: true,
  },
  { name: "Jordan", hasImage: false },
  { name: "Casey", hasImage: false },
] as const;

export const MESSAGE_THREADS = [
  {
    name: "Sarah",
    lastMessage: "Typing...",
    time: "10:48 AM",
    isActive: true,
    imageSrc:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBEy93jh2nCS0EBxuOEngC9x6DJpkcimyRRT26m8_5OEYJLbXtvKNX4V8AefqWHf0pF9_QirXCF64ASjLxaGS16h-iuPgGRw9hTRm47Rgb4lsGU9XBdpGaKHAe4vc2-mAr9osfjBKeypzIFgVet1Kv1m71zoeKL_vspJbdbIx-PCdX8KzDYaDR5JptOVkWYYUx0bBup6Nysp9m0VrMhGV8PXXbaZKyqPvpHr7EHsZbqIch4nlU0bbZvhPwZsRl7iEYJ6IwlCKynMEGO",
    hasImage: true,
    isTyping: true,
  },
  {
    name: "Marcus",
    lastMessage: "That React Native bug was tough...",
    time: "Yesterday",
    isActive: false,
    hasImage: false,
    isTyping: false,
  },
] as const;
