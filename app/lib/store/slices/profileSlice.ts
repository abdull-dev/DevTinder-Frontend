import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { ProfileData } from "../../types";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Shape from the backend
interface ApiProfile {
  _id: string;
  firstName: string;
  lastName: string;
  age?: number;
  gender?: string;
  photoURL?: string;
  Description?: string;
  interests?: string[];
  location?: string;
  jobTitle?: string;
  languages?: string[];
  company?: string;
  gallery?: string[];
  isPremium?: boolean;
  premiumPlan?: string | null;
  premiumExpiresAt?: string | null;
}

// Edit payload sent to backend
export interface ProfileEditPayload {
  firstName?: string;
  lastName?: string;
  age?: number;
  gender?: string;
  photoURL?: string;
  Description?: string;
  interests?: string[];
  location?: string;
  jobTitle?: string;
  languages?: string[];
  company?: string;
  gallery?: string[];
}

function mapApiToProfile(api: ApiProfile): ProfileData {
  return {
    id: api._id,
    name: `${api.firstName} ${api.lastName}`,
    age: api.age ?? 0,
    gender: api.gender ?? "",
    jobTitle: api.jobTitle ?? "",
    workplace: api.company ?? "",
    location: api.location ?? "",
    avatarUrl: api.photoURL ?? "",
    bio: api.Description ?? "",
    isPremium: api.isPremium ?? false,
    premiumPlan: api.premiumPlan ?? null,
    premiumExpiresAt: api.premiumExpiresAt ?? null,
    photos: (api.gallery ?? []).map((url, i) => ({
      id: `gallery-${i}`,
      url,
      alt: `Photo ${i + 1}`,
    })),
    techStack: (api.languages ?? []).map((lang, i) => ({
      id: `lang-${i}`,
      label: lang,
      color: "#61dafb",
    })),
    interests: (api.interests ?? []).map((interest, i) => ({
      id: `interest-${i}`,
      label: interest,
      icon: "coffee",
    })),
  };
}

export function mapProfileToApi(profile: ProfileData): ProfileEditPayload {
  const [firstName, ...rest] = profile.name.split(" ");
  return {
    firstName,
    lastName: rest.join(" "),
    age: profile.age,
    gender: profile.gender,
    photoURL: profile.avatarUrl,
    Description: profile.bio,
    interests: profile.interests.map((i) => i.label),
    location: profile.location,
    jobTitle: profile.jobTitle,
    languages: profile.techStack.map((s) => s.label),
    company: profile.workplace,
    gallery: profile.photos.map((p) => p.url),
  };
}

// Upload profile photo (avatar)
export const uploadProfilePhoto = createAsyncThunk<string, File, { rejectValue: string }>(
  "profile/uploadProfilePhoto",
  async (file, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("photo", file);

      const res = await fetch(`${BASE_URL}/profile/photo`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        return rejectWithValue(data?.message ?? `Upload failed (${res.status})`);
      }

      const data = await res.json();
      return data.photoURL as string;
    } catch {
      return rejectWithValue("Network error — is the server running?");
    }
  }
);

// Upload gallery photos
export const uploadGalleryPhotos = createAsyncThunk<string[], File[], { rejectValue: string }>(
  "profile/uploadGalleryPhotos",
  async (files, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      files.forEach((file) => formData.append("photos", file));

      const res = await fetch(`${BASE_URL}/profile/gallery`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        return rejectWithValue(data?.message ?? `Upload failed (${res.status})`);
      }

      const data = await res.json();
      return data.gallery as string[];
    } catch {
      return rejectWithValue("Network error — is the server running?");
    }
  }
);

interface ProfileState {
  profile: ProfileData | null;
  snapshot: ProfileData | null;
  loading: boolean;
  error: string | null;
  saving: boolean;
  saveError: string | null;
  saveSuccess: boolean;
}

const initialState: ProfileState = {
  profile: null,
  snapshot: null,
  loading: false,
  error: null,
  saving: false,
  saveError: null,
  saveSuccess: false,
};

export const fetchProfile = createAsyncThunk<ProfileData, void, { rejectValue: string }>(
  "profile/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE_URL}/profile/view`, {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        return rejectWithValue(data?.message ?? `Failed to load profile (${res.status})`);
      }

      const data = await res.json();
      const apiProfile: ApiProfile = data.user ?? data.data ?? data;
      return mapApiToProfile(apiProfile);
    } catch {
      return rejectWithValue("Network error — is the server running?");
    }
  }
);

export const editProfile = createAsyncThunk<ProfileData | null, ProfileEditPayload, { rejectValue: string }>(
  "profile/editProfile",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE_URL}/profile/edit`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        return rejectWithValue(data?.message ?? `Profile update failed (${res.status})`);
      }

      const data = await res.json();
      const apiProfile: ApiProfile | undefined = data.user ?? data.data;
      // If the API returns the updated user, map it; otherwise keep local state
      return apiProfile?.firstName ? mapApiToProfile(apiProfile) : null;
    } catch {
      return rejectWithValue("Network error — is the server running?");
    }
  }
);

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    resetSaveState(state) {
      state.saving = false;
      state.saveError = null;
      state.saveSuccess = false;
    },
    snapshotProfile(state) {
      if (state.profile) {
        state.snapshot = JSON.parse(JSON.stringify(state.profile));
      }
    },
    updateProfileLocal(state, action: { payload: Partial<ProfileData> }) {
      if (state.profile) {
        Object.assign(state.profile, action.payload);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Something went wrong";
      })
      // Edit
      .addCase(editProfile.pending, (state) => {
        state.saving = true;
        state.saveError = null;
        state.saveSuccess = false;
        // Revert to snapshot while saving so UI shows old data + loader
        if (state.snapshot) {
          state.profile = JSON.parse(JSON.stringify(state.snapshot));
        }
      })
      .addCase(editProfile.fulfilled, (state, action) => {
        state.saving = false;
        state.saveSuccess = true;
        // Apply server response if available, otherwise re-apply from payload's mapping
        if (action.payload) {
          state.profile = action.payload;
        }
        state.snapshot = null;
      })
      .addCase(editProfile.rejected, (state, action) => {
        state.saving = false;
        state.saveError = action.payload ?? "Something went wrong";
        // Keep snapshot data on failure
        state.snapshot = null;
      })
      // Upload profile photo
      .addCase(uploadProfilePhoto.fulfilled, (state, action) => {
        if (state.profile) {
          state.profile.avatarUrl = action.payload;
        }
      })
      // Upload gallery photos
      .addCase(uploadGalleryPhotos.fulfilled, (state, action) => {
        if (state.profile) {
          state.profile.photos = action.payload.map((url, i) => ({
            id: `gallery-${i}`,
            url,
            alt: `Photo ${i + 1}`,
          }));
        }
      });
  },
});

export const { resetSaveState, snapshotProfile, updateProfileLocal } = profileSlice.actions;
export default profileSlice.reducer;
