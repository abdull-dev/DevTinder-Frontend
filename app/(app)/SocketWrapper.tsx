"use client";

import { useEffect, useState } from "react";
import { SocketProvider } from "../lib/SocketProvider";
import { useAppDispatch, useAppSelector } from "../lib/store/hooks";
import { fetchProfile } from "../lib/store/slices/profileSlice";

export default function SocketWrapper({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const { profile } = useAppSelector((s) => s.profile);

  // Fetch profile once — this is used by socket AND other pages
  useEffect(() => {
    if (!profile) dispatch(fetchProfile());
  }, [dispatch, profile]);

  return <SocketProvider userId={profile?.id || null}>{children}</SocketProvider>;
}
