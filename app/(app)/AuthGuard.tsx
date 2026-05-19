"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { BASE_URL } from "../lib/constants";

type AuthStatus = "loading" | "authenticated" | "unauthenticated" | "incomplete";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [checked, setChecked] = useState(false);

  const checkAuth = useCallback(() => {
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
        setStatus(needsOnboarding ? "incomplete" : "authenticated");
      })
      .catch(() => setStatus("unauthenticated"))
      .finally(() => setChecked(true));
  }, []);

  // Check auth only on mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Re-check only when navigating FROM onboarding (user just completed it)
  useEffect(() => {
    if (checked && status === "incomplete" && pathname !== "/onboarding") {
      // User navigated away from onboarding — re-check if profile is now complete
      checkAuth();
    }
  }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!checked) return;
    if (status === "unauthenticated") {
      router.replace("/auth");
    } else if (status === "incomplete" && pathname !== "/onboarding") {
      router.replace("/onboarding");
    } else if (status === "authenticated" && pathname === "/onboarding") {
      router.replace("/feed");
    }
  }, [status, checked, router, pathname]);

  if (!checked || status === "loading") {
    return (
      <div className="h-screen flex items-center justify-center bg-feed-gradient">
        <svg className="w-10 h-10 text-primary animate-spin" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      </div>
    );
  }

  if (status === "unauthenticated") return null;
  if (status === "incomplete" && pathname !== "/onboarding") return null;

  return <>{children}</>;
}
