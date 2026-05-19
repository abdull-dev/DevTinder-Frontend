"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppDispatch, useAppSelector } from "../../lib/store/hooks";
import {
  fetchPremiumStatus,
  activateTestPremium,
  cancelPremium,
} from "../../lib/store/slices/premiumSlice";

function CrownIcon({ className }: { className?: string }) {
  return (
    <svg className={className || "w-6 h-6"} viewBox="0 0 24 24" fill="currentColor">
      <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg className="w-5 h-5 text-amber-500 shrink-0" viewBox="0 0 24 24" fill="currentColor">
      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
    </svg>
  );
}

const FEATURES = [
  "Unlimited messaging with all your matches",
  "See who liked your profile",
  "Priority in the feed - get more visibility",
  "Premium badge on your profile",
  "Ad-free experience",
];

type Plan = "monthly" | "yearly";

// Success screen shown after payment before transitioning to premium view
function SuccessScreen({ plan, onContinue }: { plan: string; onContinue: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onContinue, 3000);
    return () => clearTimeout(timer);
  }, [onContinue]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      className="w-full max-w-lg mx-auto flex flex-col items-center justify-center text-center py-20"
    >
      {/* Animated checkmark */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
        className="w-28 h-28 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-[0_12px_40px_rgba(16,185,129,0.4)] mb-8"
      >
        <motion.svg
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="w-14 h-14 text-white"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={3}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <motion.path d="M5 13l4 4L19 7" />
        </motion.svg>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="text-3xl font-bold text-on-surface mb-3"
      >
        Payment Successful!
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="text-on-surface-variant text-lg mb-2"
      >
        Welcome to <span className="font-bold text-amber-500">DevTinder Premium</span>
      </motion.p>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="text-on-surface-variant/60 text-sm capitalize"
      >
        {plan} plan activated
      </motion.p>

      {/* Confetti-like particles */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="mt-10 flex items-center gap-2 text-on-surface-variant/40 text-sm"
      >
        <div className="w-4 h-4 border-2 border-on-surface-variant/30 border-t-on-surface-variant/60 rounded-full animate-spin" />
        Redirecting...
      </motion.div>
    </motion.div>
  );
}

// Premium active view with cancel option
function PremiumActiveView() {
  const dispatch = useAppDispatch();
  const { premiumPlan, premiumExpiresAt, loading, error } = useAppSelector((s) => s.premium);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleCancel = () => {
    dispatch(cancelPremium());
    setShowConfirm(false);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-amber-50 to-yellow-50 backdrop-blur-xl rounded-[2rem] border border-amber-200 shadow-[0_12px_40px_rgba(245,158,11,0.15)] p-5 md:p-8 text-center"
      >
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center shadow-lg">
          <CrownIcon className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-on-surface mb-2">
          You&apos;re Premium!
        </h1>
        <p className="text-on-surface-variant mb-4">
          Enjoy all premium features with your{" "}
          <span className="font-bold text-amber-600 capitalize">{premiumPlan}</span>{" "}
          plan.
        </p>
        {premiumExpiresAt && (
          <p className="text-on-surface-variant/60 text-sm">
            Expires on{" "}
            {new Date(premiumExpiresAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        )}

        <div className="mt-8 pt-6 border-t border-amber-200">
          <h3 className="font-bold text-on-surface mb-4">Your Premium Benefits</h3>
          <div className="space-y-3 text-left max-w-sm mx-auto">
            {FEATURES.map((feature) => (
              <div key={feature} className="flex items-center gap-3">
                <CheckIcon />
                <span className="text-on-surface-variant text-sm">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Cancel Subscription */}
        <div className="mt-8 pt-6 border-t border-amber-200">
          {error && (
            <p className="text-error text-sm mb-4">{error}</p>
          )}

          <AnimatePresence mode="wait">
            {!showConfirm ? (
              <motion.button
                key="cancel-btn"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowConfirm(true)}
                className="text-on-surface-variant/50 text-sm hover:text-error transition-colors cursor-pointer underline underline-offset-4"
              >
                Cancel Subscription
              </motion.button>
            ) : (
              <motion.div
                key="confirm-box"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-error/5 border border-error/20 rounded-2xl p-5 max-w-sm mx-auto"
              >
                <p className="text-on-surface font-medium text-sm mb-1">
                  Are you sure?
                </p>
                <p className="text-on-surface-variant/70 text-xs mb-4">
                  You will lose access to all premium features immediately.
                </p>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={() => setShowConfirm(false)}
                    className="px-5 py-2 rounded-full text-sm font-medium bg-surface-container-high/60 text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer"
                  >
                    Keep Premium
                  </button>
                  <button
                    onClick={handleCancel}
                    disabled={loading}
                    className="px-5 py-2 rounded-full text-sm font-medium bg-error text-white hover:bg-error/90 transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {loading ? "Cancelling..." : "Yes, Cancel"}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

export default function PremiumPage() {
  const dispatch = useAppDispatch();
  const { isPremium, loading, error } = useAppSelector((s) => s.premium);
  const [selectedPlan, setSelectedPlan] = useState<Plan>("monthly");
  const [showSuccess, setShowSuccess] = useState(false);
  const [activatedPlan, setActivatedPlan] = useState<string>("");

  useEffect(() => {
    dispatch(fetchPremiumStatus());
  }, [dispatch]);

  const handleActivate = (plan: Plan) => {
    dispatch(activateTestPremium(plan)).then((action) => {
      if (activateTestPremium.fulfilled.match(action)) {
        setActivatedPlan(plan);
        setShowSuccess(true);
      }
    });
  };

  // Success transition screen
  if (showSuccess) {
    return (
      <AnimatePresence mode="wait">
        <SuccessScreen
          plan={activatedPlan}
          onContinue={() => setShowSuccess(false)}
        />
      </AnimatePresence>
    );
  }

  // Already premium — show status + cancel
  if (isPremium) {
    return <PremiumActiveView />;
  }

  // Plan selection & purchase
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-400 to-yellow-500 text-white px-5 py-2 rounded-full shadow-lg mb-4"
        >
          <CrownIcon className="w-5 h-5" />
          <span className="font-bold text-sm tracking-wider">DEVTINDER PREMIUM</span>
        </motion.div>
        <h1 className="text-2xl md:text-[40px] leading-tight font-bold text-on-surface mb-3">
          Upgrade Your Experience
        </h1>
        <p className="text-on-surface-variant max-w-md mx-auto">
          Unlock premium features and connect with developers like never before.
        </p>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-error/10 border border-error/30 text-error rounded-xl px-4 py-3 text-center mb-6 max-w-md mx-auto"
        >
          {error}
        </motion.div>
      )}

      {/* Plan Cards */}
      <div className="grid md:grid-cols-2 gap-6 mb-10">
        {/* Monthly Plan */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onClick={() => setSelectedPlan("monthly")}
          className={`relative p-5 md:p-8 rounded-[2rem] border-2 text-left transition-all cursor-pointer ${selectedPlan === "monthly"
              ? "border-amber-400 bg-gradient-to-br from-amber-50/80 to-yellow-50/80 shadow-[0_12px_40px_rgba(245,158,11,0.2)]"
              : "border-white/60 bg-white/60 hover:border-amber-200"
            }`}
        >
          {selectedPlan === "monthly" && (
            <div className="absolute top-4 right-4 w-6 h-6 bg-amber-400 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
              </svg>
            </div>
          )}
          <h3 className="text-lg font-bold text-on-surface mb-1">Monthly</h3>
          <div className="flex items-baseline gap-1 mb-3">
            <span className="text-2xl sm:text-4xl font-extrabold text-on-surface">Rs 500</span>
            <span className="text-on-surface-variant text-sm">/month</span>
          </div>
          <p className="text-on-surface-variant text-sm">
            Perfect for trying out premium features. Cancel anytime.
          </p>
        </motion.button>

        {/* Yearly Plan */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onClick={() => setSelectedPlan("yearly")}
          className={`relative p-8 rounded-[2rem] border-2 text-left transition-all cursor-pointer ${selectedPlan === "yearly"
              ? "border-amber-400 bg-gradient-to-br from-amber-50/80 to-yellow-50/80 shadow-[0_12px_40px_rgba(245,158,11,0.2)]"
              : "border-white/60 bg-white/60 hover:border-amber-200"
            }`}
        >
          <div className="absolute top-4 left-4 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
            SAVE 33%
          </div>
          {selectedPlan === "yearly" && (
            <div className="absolute top-4 right-4 w-6 h-6 bg-amber-400 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
              </svg>
            </div>
          )}
          <h3 className="text-lg font-bold text-on-surface mb-1 mt-4">Yearly</h3>
          <div className="flex items-baseline gap-1 mb-3">
            <span className="text-2xl sm:text-4xl font-extrabold text-on-surface">Rs 4,000</span>
            <span className="text-on-surface-variant text-sm">/year</span>
          </div>
          <p className="text-on-surface-variant text-sm">
            Best value! Save Rs 2,000 compared to monthly billing.
          </p>
        </motion.button>
      </div>

      {/* Features */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white/60 backdrop-blur-xl rounded-[2rem] border border-white/60 p-5 md:p-8 mb-8"
      >
        <h3 className="font-bold text-on-surface text-lg mb-5">What you get with Premium</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          {FEATURES.map((feature) => (
            <div key={feature} className="flex items-center gap-3">
              <CheckIcon />
              <span className="text-on-surface-variant text-sm">{feature}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Activate Button */}
      <div className="flex flex-col items-center gap-4">
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => handleActivate(selectedPlan)}
          disabled={loading}
          className="w-full max-w-md px-8 py-4 bg-gradient-to-r from-amber-400 to-yellow-500 text-white font-bold text-lg rounded-full shadow-[0_8px_30px_rgba(245,158,11,0.4)] hover:shadow-[0_12px_40px_rgba(245,158,11,0.5)] transition-all disabled:opacity-50 cursor-pointer"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Processing...
            </span>
          ) : (
            `Activate Premium - Test Mode - Rs ${selectedPlan === "monthly" ? "500" : "4,000"}`
          )}
        </motion.button>

        <p className="text-on-surface-variant/50 text-xs text-center max-w-sm">
          Payment gateway integration coming soon. Currently using test activation.
        </p>
      </div>
    </div>
  );
}
