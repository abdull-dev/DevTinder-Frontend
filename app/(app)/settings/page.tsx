"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAppDispatch, useAppSelector } from "../../lib/store/hooks";
import {
  updatePassword,
  updateEmail,
  resetSettingsState,
} from "../../lib/store/slices/settingsSlice";
import { logout } from "../../lib/store/slices/authSlice";

// ── Icons ──
function SettingsGearIcon() {
  return (
    <svg className="w-10 h-10 text-primary" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.07.62-.07.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
    </svg>
  );
}


function LogoutIcon() {
  return (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
    </svg>
  );
}

function DeleteIcon() {
  return (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
      <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM8 9h8v10H8V9zm7.5-5l-1-1h-5l-1 1H5v2h14V4z" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
      <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
    </svg>
  );
}

function WarningIcon() {
  return (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
      <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
    </svg>
  );
}

function VisibilityIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
    </svg>
  );
}

function VisibilityOffIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
    </svg>
  );
}

// ── Change Password Dialog ──
function ChangePasswordDialog({ onClose }: { onClose: () => void }) {
  const dispatch = useAppDispatch();
  const { loading, error, success } = useAppSelector((s) => s.settings);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);

  useEffect(() => {
    dispatch(resetSettingsState());
  }, [dispatch]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(onClose, 1200);
      return () => clearTimeout(timer);
    }
  }, [success, onClose]);

  const isValid =
    currentPassword.length > 0 &&
    newPassword.length >= 8 &&
    newPassword === confirmPassword;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || loading) return;
    dispatch(updatePassword({ oldPassword: currentPassword, newPassword }));
  };

  const inputClass =
    "w-full bg-surface-container-low border border-outline-variant/30 rounded-xl pl-4 pr-12 py-3.5 text-on-surface outline-none transition-all focus:border-primary/40 focus:shadow-[0_0_0_4px_rgba(168,51,76,0.1)]";

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
      <motion.div
        className="relative bg-surface/95 backdrop-blur-xl rounded-[2rem] border border-white/50 shadow-[0_20px_60px_rgba(168,51,76,0.2)] w-full max-w-md p-5 md:p-8"
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: "spring", stiffness: 350, damping: 28 }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-surface-container-high/50 flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-primary-container/20 transition-colors cursor-pointer"
        >
          <CloseIcon />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
            <LockIcon />
          </div>
          <div>
            <h2 className="text-xl font-bold text-on-surface">Change Password</h2>
            <p className="text-xs text-on-surface-variant/60">Keep your account secure</p>
          </div>
        </div>

        {success ? (
          <div className="flex flex-col items-center gap-3 py-8 text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-green-600">
              <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
              </svg>
            </div>
            <p className="font-bold text-on-surface">Password updated!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-600 text-sm font-medium rounded-xl px-4 py-3 text-center">
                {error}
              </div>
            )}

            <div>
              <label className="font-mono text-xs text-on-surface-variant mb-1.5 block ml-1">Current Password</label>
              <div className="relative">
                <input type={showCurrent ? "text" : "password"} value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="Enter current password" className={inputClass} />
                <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant/40 hover:text-on-surface-variant cursor-pointer">
                  {showCurrent ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </button>
              </div>
            </div>

            <div>
              <label className="font-mono text-xs text-on-surface-variant mb-1.5 block ml-1">New Password</label>
              <div className="relative">
                <input type={showNew ? "text" : "password"} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="At least 8 characters" className={inputClass} />
                <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant/40 hover:text-on-surface-variant cursor-pointer">
                  {showNew ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </button>
              </div>
              {newPassword.length > 0 && newPassword.length < 8 && (
                <p className="text-xs text-error mt-1 ml-1">Must be at least 8 characters</p>
              )}
            </div>

            <div>
              <label className="font-mono text-xs text-on-surface-variant mb-1.5 block ml-1">Confirm New Password</label>
              <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Re-enter new password" className={inputClass} />
              {confirmPassword.length > 0 && newPassword !== confirmPassword && (
                <p className="text-xs text-error mt-1 ml-1">Passwords don&apos;t match</p>
              )}
            </div>

            <div className="flex gap-3 mt-2">
              <button type="button" onClick={onClose} className="flex-1 py-3 rounded-full border border-outline-variant/30 text-on-surface-variant font-bold hover:bg-surface-container-high/50 transition-colors cursor-pointer">
                Cancel
              </button>
              <button type="submit" disabled={!isValid || loading} className="flex-1 py-3 rounded-full bg-primary text-on-primary font-bold shadow-[0_4px_16px_rgba(168,51,76,0.3)] hover:bg-on-primary-fixed-variant transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed">
                {loading ? "Updating..." : "Update Password"}
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </motion.div>
  );
}

// ── Change Email Dialog ──
function ChangeEmailDialog({ onClose }: { onClose: () => void }) {
  const dispatch = useAppDispatch();
  const { loading, error, success } = useAppSelector((s) => s.settings);
  const [currentEmail, setCurrentEmail] = useState("");
  const [newEmail, setNewEmail] = useState("");

  useEffect(() => {
    dispatch(resetSettingsState());
  }, [dispatch]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(onClose, 1200);
      return () => clearTimeout(timer);
    }
  }, [success, onClose]);

  const isValidCurrentEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(currentEmail);
  const isValidNewEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail);
  const isValid = isValidCurrentEmail && isValidNewEmail && currentEmail !== newEmail;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || loading) return;
    dispatch(updateEmail({ currentEmail, newEmail }));
  };

  const inputClass =
    "w-full bg-surface-container-low border border-outline-variant/30 rounded-xl pl-4 pr-12 py-3.5 text-on-surface outline-none transition-all focus:border-primary/40 focus:shadow-[0_0_0_4px_rgba(168,51,76,0.1)]";

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
      <motion.div
        className="relative bg-surface/95 backdrop-blur-xl rounded-[2rem] border border-white/50 shadow-[0_20px_60px_rgba(168,51,76,0.2)] w-full max-w-md p-5 md:p-8"
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: "spring", stiffness: 350, damping: 28 }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-surface-container-high/50 flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-primary-container/20 transition-colors cursor-pointer"
        >
          <CloseIcon />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-tertiary/10 flex items-center justify-center text-tertiary">
            <MailIcon />
          </div>
          <div>
            <h2 className="text-xl font-bold text-on-surface">Change Email</h2>
            <p className="text-xs text-on-surface-variant/60">Update your email address</p>
          </div>
        </div>

        {success ? (
          <div className="flex flex-col items-center gap-3 py-8 text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-green-600">
              <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
              </svg>
            </div>
            <p className="font-bold text-on-surface">Email updated!</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-600 text-sm font-medium rounded-xl px-4 py-3 text-center">
                {error}
              </div>
            )}

            <div>
              <label className="font-mono text-xs text-on-surface-variant mb-1.5 block ml-1">Current Email</label>
              <input type="email" value={currentEmail} onChange={(e) => setCurrentEmail(e.target.value)} placeholder="your-current-email@example.com" className={inputClass} />
              {currentEmail.length > 0 && !isValidCurrentEmail && (
                <p className="text-xs text-error mt-1 ml-1">Enter a valid email</p>
              )}
            </div>

            <div>
              <label className="font-mono text-xs text-on-surface-variant mb-1.5 block ml-1">New Email</label>
              <input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="your-new-email@example.com" className={inputClass} />
              {newEmail.length > 0 && !isValidNewEmail && (
                <p className="text-xs text-error mt-1 ml-1">Enter a valid email</p>
              )}
              {isValidCurrentEmail && isValidNewEmail && currentEmail === newEmail && (
                <p className="text-xs text-error mt-1 ml-1">New email must be different</p>
              )}
            </div>

            <div className="flex gap-3 mt-2">
              <button type="button" onClick={onClose} className="flex-1 py-3 rounded-full border border-outline-variant/30 text-on-surface-variant font-bold hover:bg-surface-container-high/50 transition-colors cursor-pointer">
                Cancel
              </button>
              <button type="submit" disabled={!isValid || loading} className="flex-1 py-3 rounded-full bg-primary text-on-primary font-bold shadow-[0_4px_16px_rgba(168,51,76,0.3)] hover:bg-on-primary-fixed-variant transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed">
                {loading ? "Updating..." : "Update Email"}
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </motion.div>
  );
}

// ── Data ──
const SETTINGS_DATA = {
  heading: "Settings",
  subtitle: "Customize your coding match experience",
  sections: [
    {
      id: "preferences",
      label: "Account Preference",
      accentColor: "bg-primary",
      items: [
        {
          id: "password",
          icon: "lock",
          iconBg: "bg-primary/10",
          iconColor: "text-primary",
          hoverColor: "group-hover:text-primary",
          title: "Change Password",
          description: "Keep your account secure",
          hasChevron: true,
        },
        {
          id: "email",
          icon: "mail",
          iconBg: "bg-tertiary/10",
          iconColor: "text-tertiary",
          hoverColor: "group-hover:text-tertiary",
          title: "Change Email",
          description: "Update your email address",
          hasChevron: true,
        },
      ],
    },
    {
      id: "management",
      label: "Account Management",
      accentColor: "bg-error/60",
      items: [
        {
          id: "logout",
          icon: "logout",
          iconBg: "bg-surface-variant/50",
          iconColor: "text-on-surface-variant",
          hoverColor: "",
          title: "Logout",
          description: "Sign out of your current session",
          hasChevron: false,
          isLogout: true,
        },
        {
          id: "delete",
          icon: "delete",
          iconBg: "bg-error/10",
          iconColor: "text-error",
          hoverColor: "",
          title: "Delete Account",
          description: "Permanently remove your developer profile",
          hasChevron: false,
          isDanger: true,
          hasWarning: true,
        },
      ],
    },
  ],
} as const;

const ICON_MAP: Record<string, React.FC> = {
  lock: LockIcon,
  mail: MailIcon,
  logout: LogoutIcon,
  delete: DeleteIcon,
};

export default function SettingsPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [showEmailDialog, setShowEmailDialog] = useState(false);

  const handleItemClick = (itemId: string) => {
    switch (itemId) {
      case "password":
        setShowPasswordDialog(true);
        break;
      case "email":
        setShowEmailDialog(true);
        break;
      case "logout":
        dispatch(logout()).then(() => router.push("/auth"));
        break;
      case "delete":
        break;
      default:
        break;
    }
  };

  return (
    <div className="w-full h-full max-w-2xl mx-auto flex flex-col items-center relative">
      {/* Top spacer */}
      <div className="flex-1 min-h-4" />

      {/* Header */}
      <div className="mb-6 flex flex-col items-center gap-3 text-center shrink-0">
        <motion.div
          className="w-14 h-14 rounded-3xl bg-primary/10 flex items-center justify-center shadow-[0_8px_20px_rgba(168,51,76,0.1)]"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <SettingsGearIcon />
        </motion.div>
        <div>
          <h1 className="text-[32px] leading-[1.2] font-extrabold text-on-surface tracking-tight">
            {SETTINGS_DATA.heading}
          </h1>
          <p className="text-on-surface-variant mt-1 opacity-70">
            {SETTINGS_DATA.subtitle}
          </p>
        </div>
      </div>

      {/* Settings sections */}
      <div className="w-full space-y-6 shrink-0">
        {SETTINGS_DATA.sections.map((section, sIdx) => (
          <section
            key={section.id}
            className={`space-y-3 ${sIdx > 0 ? "pt-6 border-t border-outline-variant/20" : ""}`}
          >
            <div className="flex items-center gap-3 ml-2 mb-3">
              <span
                className={`w-1.5 h-6 ${section.accentColor} rounded-full`}
              />
              <h2 className="font-mono text-sm tracking-[0.02em] font-bold text-on-surface-variant uppercase">
                {section.label}
              </h2>
            </div>

            <div className="grid gap-3">
              {section.items.map((item, itemIdx) => {
                const Icon = ICON_MAP[item.icon];
                const isDanger = "isDanger" in item && item.isDanger;
                const isLogout = "isLogout" in item && item.isLogout;
                const hasWarning = "hasWarning" in item && item.hasWarning;

                return (
                  <motion.button
                    key={item.id}
                    onClick={() => handleItemClick(item.id)}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 260, damping: 22, delay: 0.15 + sIdx * 0.15 + itemIdx * 0.07 }}
                    whileHover={{ y: -2 }}
                    className={`group flex items-center justify-between p-4 md:p-5 backdrop-blur-[24px] border rounded-xl transition-all duration-500 cursor-pointer text-left w-full ${
                      isDanger
                        ? "bg-error/5 border-error/10 shadow-[0_10px_40px_-10px_rgba(186,26,26,0.15)] hover:shadow-[0_20px_50px_-12px_rgba(186,26,26,0.25)] hover:-translate-y-1"
                        : isLogout
                          ? "bg-white/40 border-white/60 hover:bg-error-container/20 hover:border-error/20"
                          : "bg-white/60 border-white/80 shadow-[0_10px_40px_-10px_rgba(168,51,76,0.15)] hover:shadow-[0_20px_50px_-12px_rgba(168,51,76,0.25)] hover:-translate-y-1"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-300 shrink-0 ${
                          isLogout
                            ? `${item.iconBg} ${item.iconColor} group-hover:bg-error/10 group-hover:text-error`
                            : `${item.iconBg} ${item.iconColor} group-hover:scale-110`
                        }`}
                      >
                        <Icon />
                      </div>
                      <div>
                        <span
                          className={`text-lg font-bold block ${
                            isDanger
                              ? "text-error"
                              : isLogout
                                ? "text-on-surface group-hover:text-error transition-colors"
                                : "text-on-surface"
                          }`}
                        >
                          {item.title}
                        </span>
                        <span
                          className={`text-xs block ${
                            isDanger
                              ? "text-error/60"
                              : isLogout
                                ? "text-on-surface-variant/60 group-hover:text-error/60"
                                : "text-on-surface-variant/60"
                          }`}
                        >
                          {item.description}
                        </span>
                      </div>
                    </div>

                    {item.hasChevron && (
                      <span
                        className={`text-on-surface-variant/30 ${item.hoverColor} group-hover:translate-x-1 transition-all`}
                      >
                        <ChevronRightIcon />
                      </span>
                    )}
                    {hasWarning && (
                      <span className="text-error/30 group-hover:translate-x-1 transition-transform">
                        <WarningIcon />
                      </span>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      {/* Bottom spacer */}
      <div className="flex-1 min-h-4" />

      {/* Decorative background heart */}
      <div className="fixed bottom-0 right-0 p-12 opacity-[0.04] pointer-events-none hidden lg:block">
        <svg
          className="w-[240px] h-[240px]"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      </div>

      {/* Change Password Dialog */}
      <AnimatePresence>
        {showPasswordDialog && (
          <ChangePasswordDialog onClose={() => setShowPasswordDialog(false)} />
        )}
      </AnimatePresence>

      {/* Change Email Dialog */}
      <AnimatePresence>
        {showEmailDialog && (
          <ChangeEmailDialog onClose={() => setShowEmailDialog(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
