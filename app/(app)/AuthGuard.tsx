"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { BASE_URL } from "../lib/constants";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [status, setStatus] = useState<"loading" | "authenticated" | "unauthenticated" | "incomplete">("loading");

  const checkAuth = useCallback(() => {
    setStatus("loading");
    fetch(`${BASE_URL}/profile/view`, { credentials: "include" })
      .then(async (res) => {
        if (!res.ok) {
          setStatus("unauthenticated");
          return;
        }
        const data = await res.json();
        const user = data.user ?? data.data ?? data;
        const needsOnboarding =
          !user.age ||
          !user.gender ||
          !user.country ||
          !user.city ||
          !user.interests ||
          user.interests.length === 0 ||
          !user.languages ||
          user.languages.length === 0;
        if (needsOnboarding) {
          setStatus("incomplete");
        } else {
          setStatus("authenticated");
        }
      })
      .catch(() => {
        setStatus("unauthenticated");
      });
  }, []);

  // Check auth on mount and when pathname changes (e.g. after onboarding completes)
  useEffect(() => {
    checkAuth();
  }, [pathname, checkAuth]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/auth");
    }
    if (status === "incomplete" && pathname !== "/onboarding") {
      router.replace("/onboarding");
    }
    if (status === "authenticated" && pathname === "/onboarding") {
      router.replace("/feed");
    }
  }, [status, router, pathname]);

  if (status === "loading") {
    return (
      <div className="h-screen flex items-center justify-center bg-feed-gradient">
        <div className="flex flex-col items-center gap-3">
          <svg className="w-10 h-10 text-primary animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") return null;
  if (status === "incomplete" && pathname !== "/onboarding") return null;

  return <>{children}</>;
}
