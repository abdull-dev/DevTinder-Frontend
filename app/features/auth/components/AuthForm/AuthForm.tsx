import { useEffect, useState, useMemo, useRef } from "react";
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

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg className={className || "w-4 h-4"} viewBox="0 0 24 24" fill="currentColor">
      <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
    </svg>
  );
}

function CheckSmallIcon() {
  return (
    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
    </svg>
  );
}

function DropdownSelect({
  label,
  icon,
  items,
  selected,
  setSelected,
  accentColor = "primary",
  placeholder = "Select...",
}: {
  label: string;
  icon: React.ReactNode;
  items: readonly string[];
  selected: string[];
  setSelected: React.Dispatch<React.SetStateAction<string[]>>;
  accentColor?: "primary" | "secondary";
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (open && searchRef.current) searchRef.current.focus();
  }, [open]);

  const toggle = (item: string) => {
    setSelected((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const remove = (item: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelected((prev) => prev.filter((i) => i !== item));
  };

  const filtered = search
    ? items.filter((i) => i.toLowerCase().includes(search.toLowerCase()))
    : items;

  const isPrimary = accentColor === "primary";
  const accentBg = isPrimary ? "bg-primary" : "bg-secondary";
  const accentText = isPrimary ? "text-on-primary" : "text-on-secondary";
  const accentBorder = isPrimary ? "border-primary" : "border-secondary";
  const accentRing = isPrimary ? "ring-primary/15" : "ring-secondary/15";
  const accentHover = isPrimary ? "hover:border-primary/30" : "hover:border-secondary/30";
  const accentBadgeBg = isPrimary ? "bg-primary/10 text-primary border-primary/20" : "bg-secondary/10 text-secondary border-secondary/20";

  return (
    <div className="flex flex-col gap-1.5 relative" ref={ref}>
      <label className={LABEL_CLASS}>
        {label}
        {selected.length > 0 && (
          <span className={`ml-2 text-[10px] font-bold ${isPrimary ? "text-primary" : "text-secondary"} bg-surface-container-high/50 px-2 py-0.5 rounded-full`}>
            {selected.length}
          </span>
        )}
      </label>

      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className={`w-full bg-surface-container border ${
          open ? `${accentBorder}/50 ring-4 ${accentRing}` : `border-transparent ${accentHover}`
        } rounded-2xl px-4 py-2.5 text-left transition-all shadow-inner min-h-[48px] flex items-center gap-3 cursor-pointer group`}
      >
        <span className="text-on-surface-variant/40 shrink-0">{icon}</span>

        {selected.length === 0 ? (
          <span className="text-on-surface-variant/40 font-mono text-sm flex-1">{placeholder}</span>
        ) : (
          <div className="flex flex-wrap gap-1.5 flex-1">
            {selected.slice(0, 4).map((item) => (
              <span
                key={item}
                className={`inline-flex items-center gap-1 ${accentBadgeBg} border px-2.5 py-0.5 rounded-full text-[11px] font-bold`}
              >
                {item}
                <button
                  type="button"
                  onClick={(e) => remove(item, e)}
                  className="opacity-60 hover:opacity-100 cursor-pointer"
                >
                  <CloseSmallIcon className="w-3 h-3" />
                </button>
              </span>
            ))}
            {selected.length > 4 && (
              <span className={`${isPrimary ? "text-primary" : "text-secondary"} text-[11px] font-mono font-bold py-0.5`}>
                +{selected.length - 4} more
              </span>
            )}
          </div>
        )}

        <ChevronDownIcon className={`w-5 h-5 text-on-surface-variant/40 shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      {/* Dropdown panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 right-0 z-50 mt-1 bg-surface/95 backdrop-blur-xl border border-outline-variant/30 rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.15)] overflow-hidden"
          >
            {/* Search */}
            <div className="px-3 pt-3 pb-2">
              <input
                ref={searchRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="w-full bg-surface-container-high/50 border-none rounded-xl px-3 py-2 text-on-surface text-xs outline-none placeholder:text-on-surface-variant/40 focus:ring-1 focus:ring-primary/20"
              />
            </div>

            {/* Items */}
            <div className="px-3 pb-3 max-h-[180px] overflow-y-auto flex flex-wrap gap-1.5">
              {filtered.length === 0 && (
                <p className="text-on-surface-variant/50 text-xs py-2 w-full text-center">No results</p>
              )}
              {filtered.map((item) => {
                const sel = selected.includes(item);
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => toggle(item)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold font-mono tracking-wide transition-all cursor-pointer ${
                      sel
                        ? `${accentBg} ${accentText} shadow-sm`
                        : `bg-surface-container-high/40 text-on-surface-variant hover:bg-surface-container-highest/60`
                    }`}
                  >
                    {sel && <CheckSmallIcon />}
                    {item}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function InterestsBadgeInput({
  interests,
  setInterests,
}: {
  interests: string[];
  setInterests: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  const { ALL_INTERESTS } = require("../../../../lib/interests");
  return (
    <DropdownSelect
      label={AUTH_FORM.SIGNUP.INTERESTS_LABEL}
      icon={<TagIcon className="w-4 h-4" />}
      items={ALL_INTERESTS}
      selected={interests}
      setSelected={setInterests}
      accentColor="primary"
      placeholder="Select your interests..."
    />
  );
}

function LanguagesBadgeInput({
  languages,
  setLanguages,
}: {
  languages: string[];
  setLanguages: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  const { ALL_LANGUAGES } = require("../../../../lib/interests");
  return (
    <DropdownSelect
      label="Programming Languages"
      icon={<svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z" /></svg>}
      items={ALL_LANGUAGES}
      selected={languages}
      setSelected={setLanguages}
      accentColor="secondary"
      placeholder="Select languages you code in..."
    />
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
      <input type="hidden" name="country" value={selectedCountry?.name || ""} />
      <input type="hidden" name="city" value={city} />
    </div>
  );
}

function SignUpForm({
  interests,
  setInterests,
  languages,
  setLanguages,
  photoPreview,
  setPhotoPreview,
  setPhotoFile,
}: {
  interests: string[];
  setInterests: React.Dispatch<React.SetStateAction<string[]>>;
  languages: string[];
  setLanguages: React.Dispatch<React.SetStateAction<string[]>>;
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

      {/* Languages — badge input */}
      <LanguagesBadgeInput languages={languages} setLanguages={setLanguages} />

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
  const [languages, setLanguages] = useState<string[]>([]);
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
        languages,
        country: (fd.get("country") as string) || "",
        city: (fd.get("city") as string) || "",
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
          languages={languages}
          setLanguages={setLanguages}
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
