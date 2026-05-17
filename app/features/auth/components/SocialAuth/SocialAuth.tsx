import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { SOCIAL_AUTH } from "./constants";
import { CodeIcon, GoogleIcon } from "../icons";
import { useAppDispatch, useAppSelector } from "../../../../lib/store/hooks";
import { googleSignIn } from "../../../../lib/store/slices/authSlice";

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

const ICON_MAP: Record<string, React.ReactNode> = {
  github: <CodeIcon className="w-5 h-5 text-on-surface" />,
  google: <GoogleIcon className="w-5 h-5" />,
};

function GoogleLoginButton({ disabled }: { disabled: boolean }) {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      dispatch(googleSignIn(tokenResponse.access_token))
        .unwrap()
        .then(() => router.push("/feed"));
    },
  });

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => login()}
      className="w-full bg-surface-container-lowest/50 backdrop-blur-sm border border-outline-variant/40 hover:bg-surface-container text-on-surface font-sans text-sm py-3 rounded-full flex items-center justify-center gap-3 transition-colors shadow-sm hover:shadow-md cursor-pointer disabled:opacity-50"
    >
      {ICON_MAP["google"]}
      Continue with Google
    </button>
  );
}

export function SocialAuth() {
  const { loading } = useAppSelector((s) => s.auth);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="flex flex-col gap-3 relative z-10">
      {SOCIAL_AUTH.PROVIDERS.map((provider) =>
        provider.key === "google" ? (
          mounted ? (
            <GoogleOAuthProvider key={provider.key} clientId={GOOGLE_CLIENT_ID}>
              <GoogleLoginButton disabled={loading} />
            </GoogleOAuthProvider>
          ) : (
            <button
              key={provider.key}
              type="button"
              disabled
              className="w-full bg-surface-container-lowest/50 backdrop-blur-sm border border-outline-variant/40 text-on-surface font-sans text-sm py-3 rounded-full flex items-center justify-center gap-3 transition-colors shadow-sm cursor-pointer opacity-50"
            >
              {ICON_MAP[provider.key]}
              {provider.label}
            </button>
          )
        ) : (
          <button
            key={provider.key}
            type="button"
            disabled={loading}
            className="w-full bg-surface-container-lowest/50 backdrop-blur-sm border border-outline-variant/40 hover:bg-surface-container text-on-surface font-sans text-sm py-3 rounded-full flex items-center justify-center gap-3 transition-colors shadow-sm hover:shadow-md cursor-pointer disabled:opacity-50"
          >
            {ICON_MAP[provider.key]}
            {provider.label}
          </button>
        )
      )}
    </div>
  );
}
