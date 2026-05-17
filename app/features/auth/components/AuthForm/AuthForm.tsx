import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import type { AuthMode } from "../AuthCard/AuthCard";
import { AUTH_FORM } from "./constants";
import { Country, City } from "country-state-city";
import { useAppDispatch, useAppSelector } from "@/app/lib/store/hooks";
import { signIn, signUp, resetAuthState } from "@/app/lib/store/slices/authSlice";
import {
  MailIcon,
  LockIcon,
  PersonIcon,
  HeartFilledIcon,
  LocationIcon,
  CameraIcon,
  CalendarIcon,
  GenderIcon,
  DescriptionIcon,
  TagIcon,
} from "../icons";

const INPUT_CLASS =
  "w-full bg-surface-container border border-transparent focus:border-secondary-fixed-dim/50 focus:ring-4 focus:ring-secondary-fixed-dim/20 focus:bg-surface text-on-surface font-mono text-sm tracking-[0.02em] font-medium rounded-full pl-12 pr-5 py-3 outline-none transition-all shadow-inner placeholder:text-on-surface-variant/40";

const SELECT_CLASS =
  "w-full bg-surface-container border border-transparent focus:border-secondary-fixed-dim/50 focus:ring-4 focus:ring-secondary-fixed-dim/20 focus:bg-surface text-on-surface font-mono text-sm tracking-[0.02em] font-medium rounded-full pl-12 pr-5 py-3 outline-none transition-all shadow-inner appearance-none cursor-pointer";

const TEXTAREA_CLASS =
  "w-full bg-surface-container border border-transparent focus:border-secondary-fixed-dim/50 focus:ring-4 focus:ring-secondary-fixed-dim/20 focus:bg-surface text-on-surface font-mono text-sm tracking-[0.02em] font-medium rounded-2xl pl-12 pr-5 py-3 outline-none transition-all shadow-inner placeholder:text-on-surface-variant/40 resize-none";

const LABEL_CLASS =
  "font-mono text-xs tracking-[0.02em] font-medium text-on-surface-variant ml-4";

const ICON_CLASS =
  "w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50";

const TEXTAREA_ICON_CLASS =
  "w-4 h-4 absolute left-4 top-4 text-on-surface-variant/50";

function SignInForm() {
  const c = AUTH_FORM.SIGNIN;
  return (
    <>
      <div className="flex flex-col gap-1.5">
        <label className={LABEL_CLASS}>{c.EMAIL_LABEL}</label>
        <div className="relative">
          <MailIcon className={ICON_CLASS} />
          <input name="emailId" type="email" placeholder={c.EMAIL_PLACEHOLDER} className={INPUT_CLASS} />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className={LABEL_CLASS}>{c.PASSWORD_LABEL}</label>
        <div className="relative">
          <LockIcon className={ICON_CLASS} />
          <input name="password" type="password" placeholder={c.PASSWORD_PLACEHOLDER} className={INPUT_CLASS} />
        </div>
        <div className="flex justify-end px-4">
          <a href={c.FORGOT_PASSWORD_HREF} className="font-mono text-xs text-secondary hover:text-primary transition-colors">
            {c.FORGOT_PASSWORD_TEXT}
          </a>
        </div>
      </div>
    </>
  );
}

function CloseSmallIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
    </svg>
  );
}

function InterestsBadgeInput({
  interests,
  setInterests,
}: {
  interests: string[];
  setInterests: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  const c = AUTH_FORM.SIGNUP;
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const trimmed = inputValue.trim();
      if (trimmed && !interests.includes(trimmed)) {
        setInterests((prev) => [...prev, trimmed]);
      }
      setInputValue("");
    }
    if (e.key === "Backspace" && inputValue === "" && interests.length > 0) {
      setInterests((prev) => prev.slice(0, -1));
    }
  };

  const removeInterest = (interest: string) => {
    setInterests((prev) => prev.filter((i) => i !== interest));
  };

  return (
    <div className="flex flex-col gap-1.5">
      <label className={LABEL_CLASS}>{c.INTERESTS_LABEL}</label>
      <div className="relative">
        <TagIcon className="w-4 h-4 absolute left-4 top-3 text-on-surface-variant/50" />
        <div className="w-full bg-surface-container border border-transparent focus-within:border-secondary-fixed-dim/50 focus-within:ring-4 focus-within:ring-secondary-fixed-dim/20 focus-within:bg-surface text-on-surface font-mono text-sm tracking-[0.02em] font-medium rounded-2xl pl-12 pr-4 py-2 transition-all shadow-inner min-h-[44px] flex flex-wrap gap-1.5 items-center">
          {interests.map((interest) => (
            <span
              key={interest}
              className="inline-flex items-center gap-1 bg-primary/10 text-primary border border-primary/20 px-2.5 py-1 rounded-full text-xs font-bold animate-in fade-in"
            >
              {interest}
              <button
                type="button"
                onClick={() => removeInterest(interest)}
                className="hover:bg-primary/20 rounded-full p-0.5 transition-colors cursor-pointer"
              >
                <CloseSmallIcon className="w-3 h-3" />
              </button>
            </span>
          ))}
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={interests.length === 0 ? c.INTERESTS_PLACEHOLDER : "Add more..."}
            className="flex-1 min-w-[80px] bg-transparent outline-none placeholder:text-on-surface-variant/40 py-1"
          />
        </div>
      </div>
      <p className="font-mono text-[10px] text-on-surface-variant/50 ml-4">
        Press Enter to add
      </p>
    </div>
  );
}

function LocationSelect() {
  const c = AUTH_FORM.SIGNUP;
  const [countryCode, setCountryCode] = useState("");
  const [city, setCity] = useState("");

  const countries = useMemo(() => Country.getAllCountries(), []);
  const cities = useMemo(
    () => (countryCode ? City.getCitiesOfCountry(countryCode) ?? [] : []),
    [countryCode]
  );

  const selectedCountry = useMemo(
    () => countries.find((c) => c.isoCode === countryCode),
    [countries, countryCode]
  );

  return (
    <div className="flex flex-col gap-1.5">
      <label className={LABEL_CLASS}>{c.LOCATION_LABEL}</label>
      <div className="grid grid-cols-2 gap-3">
        <div className="relative">
          <LocationIcon className={ICON_CLASS} />
          <select
            value={countryCode}
            onChange={(e) => { setCountryCode(e.target.value); setCity(""); }}
            className={`${SELECT_CLASS} ${!countryCode ? "text-on-surface-variant/40" : ""}`}
          >
            <option value="" disabled>Country</option>
            {countries.map((c) => (
              <option key={c.isoCode} value={c.isoCode}>
                {c.flag} {c.name}
              </option>
            ))}
          </select>
        </div>
        <div className="relative">
          <LocationIcon className={ICON_CLASS} />
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            disabled={!countryCode}
            className={`${SELECT_CLASS} ${!city ? "text-on-surface-variant/40" : ""} disabled:opacity-50`}
          >
            <option value="" disabled>City</option>
            {cities.map((c) => (
              <option key={`${c.name}-${c.stateCode}`} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <input
        type="hidden"
        name="location"
        value={city && selectedCountry ? `${city}, ${selectedCountry.name}` : ""}
      />
    </div>
  );
}

function SignUpForm({
  interests,
  setInterests,
  photoPreview,
  setPhotoPreview,
  setPhotoFile,
}: {
  interests: string[];
  setInterests: React.Dispatch<React.SetStateAction<string[]>>;
  photoPreview: string | null;
  setPhotoPreview: React.Dispatch<React.SetStateAction<string | null>>;
  setPhotoFile: React.Dispatch<React.SetStateAction<File | null>>;
}) {
  const c = AUTH_FORM.SIGNUP;

  return (
    <>
      {/* First Name & Last Name — side by side */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <label className={LABEL_CLASS}>{c.FIRST_NAME_LABEL}</label>
          <div className="relative">
            <PersonIcon className={ICON_CLASS} />
            <input name="firstName" type="text" placeholder={c.FIRST_NAME_PLACEHOLDER} className={INPUT_CLASS} />
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className={LABEL_CLASS}>{c.LAST_NAME_LABEL}</label>
          <div className="relative">
            <PersonIcon className={ICON_CLASS} />
            <input name="lastName" type="text" placeholder={c.LAST_NAME_PLACEHOLDER} className={INPUT_CLASS} />
          </div>
        </div>
      </div>

      {/* Email */}
      <div className="flex flex-col gap-1.5">
        <label className={LABEL_CLASS}>{c.EMAIL_LABEL}</label>
        <div className="relative">
          <MailIcon className={ICON_CLASS} />
          <input name="emailId" type="email" placeholder={c.EMAIL_PLACEHOLDER} className={INPUT_CLASS} />
        </div>
      </div>

      {/* Password */}
      <div className="flex flex-col gap-1.5">
        <label className={LABEL_CLASS}>{c.PASSWORD_LABEL}</label>
        <div className="relative">
          <LockIcon className={ICON_CLASS} />
          <input name="password" type="password" placeholder={c.PASSWORD_PLACEHOLDER} className={INPUT_CLASS} />
        </div>
      </div>

      {/* Age & Gender — side by side */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <label className={LABEL_CLASS}>{c.AGE_LABEL}</label>
          <div className="relative">
            <CalendarIcon className={ICON_CLASS} />
            <input name="age" type="number" min={18} max={100} placeholder={c.AGE_PLACEHOLDER} className={INPUT_CLASS} />
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className={LABEL_CLASS}>{c.GENDER_LABEL}</label>
          <div className="relative">
            <GenderIcon className={ICON_CLASS} />
            <select name="gender" defaultValue="" className={SELECT_CLASS}>
              {c.GENDER_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value} disabled={opt.value === ""}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Photo Upload */}
      <div className="flex flex-col gap-1.5">
        <label className={LABEL_CLASS}>{c.PHOTO_URL_LABEL}</label>
        <label className="group cursor-pointer">
          <div className="w-full bg-surface-container border-2 border-dashed border-on-surface-variant/20 hover:border-primary/40 rounded-2xl py-5 flex flex-col items-center gap-2 transition-all">
            {photoPreview ? (
              <div className="relative">
                <img
                  src={photoPreview}
                  alt="Preview"
                  className="w-20 h-20 rounded-full object-cover border-2 border-primary/30"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setPhotoFile(null);
                    setPhotoPreview(null);
                  }}
                  className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-error text-white flex items-center justify-center cursor-pointer"
                >
                  <CloseSmallIcon className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <>
                <CameraIcon className="w-8 h-8 text-on-surface-variant/30 group-hover:text-primary/50 transition-colors" />
                <span className="font-mono text-xs text-on-surface-variant/40 group-hover:text-primary/60 transition-colors">
                  Click to upload photo
                </span>
              </>
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setPhotoFile(file);
                setPhotoPreview(URL.createObjectURL(file));
              }
            }}
          />
        </label>
      </div>

      {/* Description */}
      <div className="flex flex-col gap-1.5">
        <label className={LABEL_CLASS}>{c.DESCRIPTION_LABEL}</label>
        <div className="relative">
          <DescriptionIcon className={TEXTAREA_ICON_CLASS} />
          <textarea
            name="Description"
            rows={3}
            placeholder={c.DESCRIPTION_PLACEHOLDER}
            className={TEXTAREA_CLASS}
          />
        </div>
      </div>

      {/* Interests — badge input */}
      <InterestsBadgeInput interests={interests} setInterests={setInterests} />

      {/* Location — country/city dropdowns */}
      <LocationSelect />
    </>
  );
}

export function AuthForm({
  mode,
  onSwitchMode,
}: {
  mode: AuthMode;
  onSwitchMode: (mode: AuthMode) => void;
}) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { loading, error, signUpSuccess, signInSuccess } = useAppSelector((s) => s.auth);
  const [interests, setInterests] = useState<string[]>([]);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const isSignIn = mode === "signin";
  const showLoader = loading || signUpSuccess;
  const submitText = isSignIn ? AUTH_FORM.SIGNIN.SUBMIT_TEXT : AUTH_FORM.SIGNUP.SUBMIT_TEXT;
  const loadingText = isSignIn ? "Signing in..." : signUpSuccess ? "Account created! Redirecting..." : "Creating Account...";

  // On successful signup → show message briefly, then switch to sign in
  useEffect(() => {
    if (!signUpSuccess) return;
    const timer = setTimeout(() => {
      dispatch(resetAuthState());
      onSwitchMode("signin");
    }, 2000);
    return () => clearTimeout(timer);
  }, [signUpSuccess, dispatch, onSwitchMode]);

  // On successful signin → redirect to feed
  useEffect(() => {
    if (!signInSuccess) return;
    router.push("/feed");
  }, [signInSuccess, router]);

  // Reset auth state when switching modes
  useEffect(() => {
    dispatch(resetAuthState());
  }, [mode, dispatch]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);

    if (isSignIn) {
      dispatch(
        signIn({
          emailId: (fd.get("emailId") as string) || "",
          password: (fd.get("password") as string) || "",
        })
      );
      return;
    }

    dispatch(
      signUp({
        firstName: (fd.get("firstName") as string) || "",
        lastName: (fd.get("lastName") as string) || "",
        emailId: (fd.get("emailId") as string) || "",
        password: (fd.get("password") as string) || "",
        age: Number(fd.get("age")) || 0,
        gender: (fd.get("gender") as string) || "",
        photo: photoFile,
        Description: (fd.get("Description") as string) || "",
        interests,
        location: (fd.get("location") as string) || "",
      })
    );
  }

  return (
    <form className="flex flex-col gap-3 relative z-10" onSubmit={handleSubmit}>
      {mode === "signin" ? (
        <SignInForm />
      ) : (
        <SignUpForm
          interests={interests}
          setInterests={setInterests}
          photoPreview={photoPreview}
          setPhotoPreview={setPhotoPreview}
          setPhotoFile={setPhotoFile}
        />
      )}

      {/* Error message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="bg-red-500/10 border border-red-500/30 text-red-600 text-sm font-medium rounded-xl px-4 py-3 text-center"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        type="submit"
        disabled={showLoader}
        layout
        className={`mt-2 w-full font-bold py-3 rounded-full flex items-center justify-center gap-3 transition-all duration-300 relative overflow-hidden cursor-pointer ${
          showLoader
            ? "bg-primary/80 text-on-primary shadow-[0_5px_20px_rgba(168,51,76,0.25)]"
            : "bg-primary text-on-primary hover:bg-on-primary-fixed-variant shadow-[0_10px_25px_rgba(168,51,76,0.35)] hover:shadow-[0_15px_35px_rgba(168,51,76,0.5)] hover:-translate-y-1 group"
        }`}
      >
        {/* Shimmer on hover (idle only) */}
        {!showLoader && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
        )}

        {/* Sliding progress bar */}
        {showLoader && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent"
            animate={{ x: ["-100%", "100%"] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          />
        )}

        <AnimatePresence mode="wait">
          {showLoader ? (
            <motion.span
              key="loading"
              className="flex items-center gap-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <motion.div
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ repeat: Infinity, duration: 0.8, ease: "easeInOut" }}
              >
                <HeartFilledIcon className="w-5 h-5" />
              </motion.div>
              <span>{loadingText}</span>
              <span className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className="w-1 h-1 rounded-full bg-on-primary"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.2 }}
                  />
                ))}
              </span>
            </motion.span>
          ) : (
            <motion.span
              key="idle"
              className="flex items-center gap-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <span>{submitText}</span>
              <HeartFilledIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </form>
  );
}
