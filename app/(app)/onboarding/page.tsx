"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Country, City } from "country-state-city";
import { useAppSelector, useAppDispatch } from "../../lib/store/hooks";
import { fetchProfile } from "../../lib/store/slices/profileSlice";
import { ALL_INTERESTS, ALL_LANGUAGES } from "../../lib/interests";
import { BASE_URL } from "../../lib/constants";
import { resolvePhotoUrl } from "../../lib/utils";

const STEPS = [
  { id: 1, title: "About You", icon: "person" },
  { id: 2, title: "Location", icon: "location" },
  { id: 3, title: "Languages", icon: "code" },
  { id: 4, title: "Interests", icon: "star" },
] as const;

function PersonIcon() {
  return (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
    </svg>
  );
}

function CodeIcon() {
  return (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
      <path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z" />
    </svg>
  );
}

function CheckCircleIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z" />
    </svg>
  );
}

const stepIconMap = { person: PersonIcon, location: LocationIcon, code: CodeIcon, star: StarIcon };

const slideVariants = {
  enter: { opacity: 0, x: 60 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -60 },
};

export default function OnboardingPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { profile } = useAppSelector((s) => s.profile);

  const [step, setStep] = useState(1);
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [city, setCity] = useState("");
  const [description, setDescription] = useState("");

  const countries = useMemo(() => Country.getAllCountries(), []);
  const selectedCountry = useMemo(
    () => countries.find((c) => c.isoCode === countryCode),
    [countries, countryCode]
  );
  const cities = useMemo(
    () => (countryCode ? City.getCitiesOfCountry(countryCode) || [] : []),
    [countryCode]
  );
  const [languages, setLanguages] = useState<string[]>([]);
  const [interests, setInterests] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Fetch profile and pre-fill existing data
  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  useEffect(() => {
    if (!profile) return;
    if (profile.age) setAge(String(profile.age));
    if (profile.gender) setGender(profile.gender);
    if (profile.country) {
      const match = countries.find((c) => c.name === profile.country);
      if (match) setCountryCode(match.isoCode);
    }
    if (profile.city) setCity(profile.city);
    if (profile.bio && profile.bio !== "description will show here") setDescription(profile.bio);
    if (profile.techStack.length > 0) setLanguages(profile.techStack.map((s) => s.label));
    if (profile.interests.length > 0) setInterests(profile.interests.map((i) => i.label));
  }, [profile]);

  const canNext = () => {
    if (step === 1) return !!age && Number(age) >= 18 && !!gender;
    if (step === 2) return !!countryCode && !!city;
    if (step === 3) return languages.length >= 1;
    if (step === 4) return interests.length >= 3;
    return false;
  };

  const toggleLanguage = (lang: string) => {
    setLanguages((prev) =>
      prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]
    );
  };

  const toggleInterest = (interest: string) => {
    setInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  const handleSubmit = async () => {
    setSaving(true);
    setError("");
    try {
      const payload: Record<string, unknown> = {
        profileComplete: true,
        age: Number(age),
        gender,
        country: selectedCountry?.name || "",
        city,
        languages,
        interests,
      };
      if (description) payload.Description = description;

      const res = await fetch(`${BASE_URL}/profile/edit`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        router.replace("/feed");
      } else {
        setError("Failed to save. Please try again.");
      }
    } catch {
      setError("Network error. Please try again.");
    }
    setSaving(false);
  };

  const avatarUrl = profile?.avatarUrl ? resolvePhotoUrl(profile.avatarUrl) : null;

  return (
    <div className="w-full max-w-xl mx-auto py-4 sm:py-8 px-2">
      {/* User greeting card */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4 mb-6"
      >
        {avatarUrl && (
          <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-primary shrink-0">
            <Image
              src={avatarUrl}
              alt={profile?.name || ""}
              width={56}
              height={56}
              unoptimized
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-on-surface">
            Welcome, {profile?.name?.split(" ")[0] || "there"}!
          </h1>
          <p className="text-on-surface-variant text-sm">Let&apos;s set up your profile</p>
        </div>
      </motion.div>

      {/* Step indicators */}
      <div className="flex gap-3 mb-8">
        {STEPS.map((s) => {
          const Icon = stepIconMap[s.icon];
          const isActive = step === s.id;
          const isDone = step > s.id;
          return (
            <button
              key={s.id}
              onClick={() => { if (isDone) setStep(s.id); }}
              className={`flex-1 flex items-center gap-2 px-3 py-2.5 rounded-xl transition-all font-mono text-xs font-medium ${
                isActive
                  ? "bg-primary text-on-primary shadow-[0_4px_15px_rgba(255,117,140,0.3)]"
                  : isDone
                    ? "bg-primary/10 text-primary cursor-pointer"
                    : "bg-surface-container text-on-surface-variant/50"
              }`}
            >
              {isDone ? <CheckCircleIcon /> : <Icon />}
              <span className="hidden sm:inline">{s.title}</span>
            </button>
          );
        })}
      </div>

      {/* Main card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-surface/60 backdrop-blur-xl rounded-[2rem] border border-outline-variant/20 shadow-[0_20px_60px_rgba(168,51,76,0.08)] overflow-hidden"
      >
        {/* Step header gradient */}
        <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent px-6 sm:px-8 pt-6 pb-4">
          <p className="font-mono text-xs text-primary/70 mb-1">Step {step} of {STEPS.length}</p>
          <h2 className="text-xl font-bold text-on-surface">
            {step === 1 && "Tell us about yourself"}
            {step === 2 && "Where are you from?"}
            {step === 3 && "What do you code in?"}
            {step === 4 && "What are you into?"}
          </h2>
        </div>

        <div className="px-6 sm:px-8 py-6">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-error/10 border border-error/20 text-error rounded-xl px-4 py-2.5 text-sm mb-5"
            >
              {error}
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            {/* Step 1 */}
            {step === 1 && (
              <motion.div
                key="step1"
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.25 }}
                className="space-y-5"
              >
                <div>
                  <label className="block text-on-surface text-sm font-semibold mb-2">How old are you?</label>
                  <input
                    type="number"
                    min={18}
                    max={100}
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="18"
                    className="w-full bg-surface-container border border-outline-variant/30 rounded-2xl px-5 py-3.5 text-on-surface font-mono text-base outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all"
                  />
                  {age && Number(age) < 18 && (
                    <p className="text-error text-xs mt-1.5 ml-1">Must be at least 18</p>
                  )}
                </div>

                <div>
                  <label className="block text-on-surface text-sm font-semibold mb-2">Gender</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: "male", emoji: "👨" },
                      { value: "female", emoji: "👩" },
                      { value: "other", emoji: "🧑" },
                    ].map((g) => (
                      <button
                        key={g.value}
                        onClick={() => setGender(g.value)}
                        className={`py-3.5 rounded-2xl font-medium text-sm capitalize transition-all cursor-pointer flex flex-col items-center gap-1 ${
                          gender === g.value
                            ? "bg-primary text-on-primary shadow-[0_4px_15px_rgba(255,117,140,0.25)]"
                            : "bg-surface-container border border-outline-variant/30 text-on-surface-variant hover:border-primary/40"
                        }`}
                      >
                        <span className="text-lg">{g.emoji}</span>
                        {g.value}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-on-surface text-sm font-semibold mb-2">
                    Bio <span className="text-on-surface-variant/50 font-normal">(optional)</span>
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    maxLength={100}
                    rows={3}
                    placeholder="I turn coffee into code..."
                    className="w-full bg-surface-container border border-outline-variant/30 rounded-2xl px-5 py-3.5 text-on-surface text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all resize-none"
                  />
                  <p className="text-on-surface-variant/40 text-xs text-right mt-1">{description.length}/100</p>
                </div>
              </motion.div>
            )}

            {/* Step 2 */}
            {step === 2 && (
              <motion.div
                key="step2"
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.25 }}
                className="space-y-5"
              >
                <div>
                  <label className="block text-on-surface text-sm font-semibold mb-2">Country</label>
                  <select
                    value={countryCode}
                    onChange={(e) => { setCountryCode(e.target.value); setCity(""); }}
                    className={`w-full bg-surface-container border border-outline-variant/30 rounded-2xl px-5 py-3.5 text-on-surface text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all appearance-none cursor-pointer ${!countryCode ? "text-on-surface-variant/40" : ""}`}
                  >
                    <option value="" disabled>Select your country</option>
                    {countries.map((c) => (
                      <option key={c.isoCode} value={c.isoCode}>
                        {c.flag} {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-on-surface text-sm font-semibold mb-2">City</label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    disabled={!countryCode}
                    className={`w-full bg-surface-container border border-outline-variant/30 rounded-2xl px-5 py-3.5 text-on-surface text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all appearance-none cursor-pointer disabled:opacity-50 ${!city ? "text-on-surface-variant/40" : ""}`}
                  >
                    <option value="" disabled>
                      {countryCode ? "Select your city" : "Select a country first"}
                    </option>
                    {cities.map((c) => (
                      <option key={`${c.name}-${c.stateCode}`} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="bg-primary/5 rounded-2xl p-4 border border-primary/10">
                  <p className="text-on-surface-variant text-xs leading-relaxed">
                    Your location helps us show you developers nearby. You can change this anytime in your profile settings.
                  </p>
                </div>
              </motion.div>
            )}

            {/* Step 3 — Languages */}
            {step === 3 && (
              <motion.div
                key="step3"
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.25 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between">
                  <p className="text-on-surface-variant text-sm">
                    Select at least <span className="text-secondary font-bold">1</span> language
                  </p>
                  <span className={`font-mono text-sm font-bold ${languages.length >= 1 ? "text-secondary" : "text-on-surface-variant/50"}`}>
                    {languages.length} selected
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 max-h-[300px] overflow-y-auto pr-1">
                  {ALL_LANGUAGES.map((lang) => {
                    const selected = languages.includes(lang);
                    return (
                      <motion.button
                        key={lang}
                        onClick={() => toggleLanguage(lang)}
                        whileTap={{ scale: 0.95 }}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${
                          selected
                            ? "bg-secondary text-on-secondary shadow-[0_2px_10px_rgba(168,51,76,0.2)]"
                            : "bg-surface-container border border-outline-variant/30 text-on-surface-variant hover:border-secondary/40 hover:text-secondary"
                        }`}
                      >
                        {lang}
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Step 4 — Interests */}
            {step === 4 && (
              <motion.div
                key="step4"
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.25 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between">
                  <p className="text-on-surface-variant text-sm">
                    Select at least <span className="text-primary font-bold">3</span> interests
                  </p>
                  <span className={`font-mono text-sm font-bold ${interests.length >= 3 ? "text-primary" : "text-on-surface-variant/50"}`}>
                    {interests.length} selected
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 max-h-[300px] overflow-y-auto pr-1">
                  {ALL_INTERESTS.map((interest) => {
                    const selected = interests.includes(interest);
                    return (
                      <motion.button
                        key={interest}
                        onClick={() => toggleInterest(interest)}
                        whileTap={{ scale: 0.95 }}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${
                          selected
                            ? "bg-primary text-on-primary shadow-[0_2px_10px_rgba(255,117,140,0.25)]"
                            : "bg-surface-container border border-outline-variant/30 text-on-surface-variant hover:border-primary/40 hover:text-primary"
                        }`}
                      >
                        {interest}
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex gap-3 mt-8">
            {step > 1 && (
              <button
                onClick={() => setStep((s) => s - 1)}
                className="px-6 py-3.5 rounded-full bg-surface-container-high/60 text-on-surface-variant font-bold text-sm hover:bg-surface-container-high transition-colors cursor-pointer"
              >
                Back
              </button>
            )}
            {step < STEPS.length ? (
              <button
                onClick={() => setStep((s) => s + 1)}
                disabled={!canNext()}
                className="flex-1 py-3.5 rounded-full bg-primary text-on-primary font-bold text-sm shadow-[0_4px_20px_rgba(255,117,140,0.3)] hover:shadow-[0_6px_25px_rgba(255,117,140,0.4)] hover:scale-[1.01] transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none disabled:hover:scale-100 flex items-center justify-center gap-2"
              >
                Continue
                <ArrowIcon />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!canNext() || saving}
                className="flex-1 py-3.5 rounded-full bg-gradient-to-r from-primary to-primary-container text-on-primary font-bold text-sm shadow-[0_4px_20px_rgba(255,117,140,0.3)] hover:shadow-[0_6px_25px_rgba(255,117,140,0.4)] hover:scale-[1.01] transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none disabled:hover:scale-100 flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    Get Started
                    <ArrowIcon />
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
