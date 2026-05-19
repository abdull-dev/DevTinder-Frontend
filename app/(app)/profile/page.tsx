"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { ProfileHero } from "../../features/profile/components/ProfileHero/ProfileHero";
import { BioSection } from "../../features/profile/components/BioSection/BioSection";
import { Gallery } from "../../features/profile/components/Gallery/Gallery";
import { TechStack } from "../../features/profile/components/TechStack/TechStack";
import { Interests } from "../../features/profile/components/Interests/Interests";
import { useAppDispatch, useAppSelector } from "../../lib/store/hooks";
import {
  fetchProfile,
  editProfile,
  updateProfileLocal,
  snapshotProfile,
  mapProfileToApi,
  uploadProfilePhoto,
  uploadGalleryPhotos,
} from "../../lib/store/slices/profileSlice";
import type { ProfileData } from "../../lib/types";

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { type: "spring" as const, stiffness: 260, damping: 22, delay },
});

type EditSection = "hero" | "bio" | "gallery" | "tech" | "interests" | null;

function ProfileSkeleton() {
  return (
    <div className="w-full max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-12 animate-pulse">
      <div className="flex flex-col gap-4 md:col-span-5">
        <div className="bg-white/60 rounded-[2rem] p-6">
          <div className="w-28 h-28 rounded-full bg-surface-container-high/40 mx-auto mb-4" />
          <div className="h-7 w-40 bg-surface-container-high/40 rounded-full mx-auto mb-2" />
          <div className="h-4 w-32 bg-surface-container-high/30 rounded-full mx-auto mb-2" />
          <div className="h-4 w-48 bg-surface-container-high/20 rounded-full mx-auto" />
        </div>
        <div className="bg-white/60 rounded-[2rem] p-6">
          <div className="h-5 w-24 bg-surface-container-high/40 rounded-full mb-3" />
          <div className="h-4 w-full bg-surface-container-high/20 rounded-full mb-2" />
          <div className="h-4 w-3/4 bg-surface-container-high/20 rounded-full" />
        </div>
      </div>
      <div className="flex flex-col gap-4 md:col-span-7">
        <div className="bg-white/60 rounded-[2rem] p-6">
          <div className="h-5 w-20 bg-surface-container-high/40 rounded-full mb-4" />
          <div className="grid grid-cols-3 gap-3">
            <div className="aspect-square bg-surface-container-high/30 rounded-2xl" />
            <div className="aspect-square bg-surface-container-high/30 rounded-2xl" />
            <div className="aspect-square bg-surface-container-high/30 rounded-2xl" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white/60 rounded-[2rem] p-6">
            <div className="h-5 w-28 bg-surface-container-high/40 rounded-full mb-3" />
            <div className="flex gap-2">
              <div className="h-7 w-20 bg-surface-container-high/30 rounded-full" />
              <div className="h-7 w-24 bg-surface-container-high/30 rounded-full" />
            </div>
          </div>
          <div className="bg-white/60 rounded-[2rem] p-6">
            <div className="h-5 w-24 bg-surface-container-high/40 rounded-full mb-3" />
            <div className="flex gap-2">
              <div className="h-7 w-20 bg-surface-container-high/30 rounded-full" />
              <div className="h-7 w-16 bg-surface-container-high/30 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const { profile, loading, error, saving, uploading } = useAppSelector((s) => s.profile);
  const [editing, setEditing] = useState<EditSection>(null);

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  const toggleEdit = useCallback(
    (section: EditSection) => {
      if (editing === section && profile) {
        // Closing edit → save to API, then re-fetch fresh data
        const payload = mapProfileToApi(profile);
        dispatch(editProfile(payload)).then(() => {
          dispatch(fetchProfile());
        });
        setEditing(null);
      } else {
        // Opening edit → snapshot current state
        dispatch(snapshotProfile());
        setEditing(section);
      }
    },
    [editing, profile, dispatch]
  );

  const handleUpdate = useCallback(
    (fields: Partial<ProfileData>) => {
      dispatch(updateProfileLocal(fields));
    },
    [dispatch]
  );

  const handleBioUpdate = useCallback(
    (bio: string) => {
      dispatch(updateProfileLocal({ bio }));
    },
    [dispatch]
  );

  const handleRemovePhoto = useCallback(
    (photoId: string) => {
      if (!profile) return;
      dispatch(
        updateProfileLocal({
          photos: profile.photos.filter((p) => p.id !== photoId),
        })
      );
    },
    [dispatch, profile]
  );

  const handleAvatarUpload = useCallback(
    (file: File) => {
      dispatch(uploadProfilePhoto(file));
    },
    [dispatch]
  );

  const handleGalleryUpload = useCallback(
    (files: File[]) => {
      dispatch(uploadGalleryPhotos(files));
    },
    [dispatch]
  );

  const handleRemoveSkill = useCallback(
    (skillId: string) => {
      if (!profile) return;
      dispatch(
        updateProfileLocal({
          techStack: profile.techStack.filter((s) => s.id !== skillId),
        })
      );
    },
    [dispatch, profile]
  );

  const handleRemoveInterest = useCallback(
    (interestId: string) => {
      if (!profile) return;
      dispatch(
        updateProfileLocal({
          interests: profile.interests.filter((i) => i.id !== interestId),
        })
      );
    },
    [dispatch, profile]
  );

  const handleAddInterest = useCallback(
    (label: string) => {
      if (!profile) return;
      dispatch(
        updateProfileLocal({
          interests: [
            ...profile.interests,
            { id: `interest-${Date.now()}`, label, icon: "coffee" },
          ],
        })
      );
    },
    [dispatch, profile]
  );

  if (loading) {
    return <ProfileSkeleton />;
  }

  if (error && !profile) {
    return (
      <motion.div
        className="flex flex-col items-center justify-center h-full gap-4 text-center px-6"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="text-5xl">⚠️</div>
        <h2 className="text-2xl font-bold text-error">Failed to load profile</h2>
        <p className="text-on-surface-variant max-w-sm">{error}</p>
        <motion.button
          onClick={() => dispatch(fetchProfile())}
          className="mt-2 px-6 py-3 bg-primary text-on-primary font-bold rounded-full cursor-pointer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Try Again
        </motion.button>
      </motion.div>
    );
  }

  if (!profile) return null;

  return (
    <div className="w-full max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-12 relative">
      {/* Saving overlay */}
      {saving && (
        <div className="absolute inset-0 z-50 bg-surface/60 backdrop-blur-sm rounded-3xl flex flex-col items-center justify-center gap-3">
          <svg className="w-8 h-8 text-primary animate-spin" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <p className="text-sm font-semibold text-primary animate-pulse">Saving changes...</p>
        </div>
      )}

      <div className="flex flex-col gap-4 md:col-span-5">
        <motion.div {...fadeUp(0)}>
          <ProfileHero
            profile={profile}
            isEditing={editing === "hero"}
            uploading={uploading}
            onToggleEdit={() => toggleEdit("hero")}
            onUpdate={handleUpdate}
            onAvatarUpload={handleAvatarUpload}
          />
        </motion.div>
        <motion.div {...fadeUp(0.08)}>
          <BioSection
            bio={profile.bio}
            isEditing={editing === "bio"}
            onToggleEdit={() => toggleEdit("bio")}
            onUpdate={handleBioUpdate}
          />
        </motion.div>
      </div>

      <div className="flex flex-col gap-4 md:col-span-7">
        <motion.div {...fadeUp(0.04)}>
          <Gallery
            photos={profile.photos}
            isEditing={editing === "gallery"}
            uploading={uploading}
            onToggleEdit={() => toggleEdit("gallery")}
            onRemove={handleRemovePhoto}
            onUpload={handleGalleryUpload}
          />
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <motion.div {...fadeUp(0.12)}>
            <TechStack
              skills={profile.techStack}
              isEditing={editing === "tech"}
              onToggleEdit={() => toggleEdit("tech")}
              onRemove={handleRemoveSkill}
            />
          </motion.div>
          <motion.div {...fadeUp(0.16)}>
            <Interests
              interests={profile.interests}
              isEditing={editing === "interests"}
              onToggleEdit={() => toggleEdit("interests")}
              onRemove={handleRemoveInterest}
              onAdd={handleAddInterest}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
