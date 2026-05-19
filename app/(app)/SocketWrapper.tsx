"use client";

import { useEffect, useState } from "react";
import { SocketProvider } from "../lib/SocketProvider";
import { BASE_URL } from "../lib/constants";

export default function SocketWrapper({ children }: { children: React.ReactNode }) {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${BASE_URL}/profile/view`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        const user = data.user ?? data.data ?? data;
        setUserId(user?._id || null);
      })
      .catch(() => {});
  }, []);

  return <SocketProvider userId={userId}>{children}</SocketProvider>;
}
