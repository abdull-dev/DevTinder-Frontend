import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { User } from "../../types";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Shape returned by the backend
interface ApiFeedUser {
  _id: string;
  firstName: string;
  lastName: string;
  emailId?: string;
  age?: number;
  gender?: string;
  photoURL?: string;
  Description?: string;
  interests?: string[];
  location?: string;
  jobTitle?: string;
  languages?: string[];
  isPremium?: boolean;
}

function mapApiUserToUser(apiUser: ApiFeedUser): User {
  return {
    id: apiUser._id,
    name: `${apiUser.firstName} ${apiUser.lastName}`,
    age: apiUser.age ?? 0,
    gender: apiUser.gender ?? "",
    title: apiUser.jobTitle ?? "",
    avatarUrl: apiUser.photoURL ?? "",
    isOnline: false,
    isVerified: false,
    isPremium: apiUser.isPremium ?? false,
    bio: apiUser.Description ?? "",
    quote: "",
    work: apiUser.jobTitle ?? "",
    location: apiUser.location ?? "",
    techStack: (apiUser.interests ?? []).map((interest) => ({
      label: interest,
      variant: "primary" as const,
    })),
    badges: [],
  };
}

interface FeedState {
  users: User[];
  page: number;
  loading: boolean;
  error: string | null;
}

const initialState: FeedState = {
  users: [],
  page: 1,
  loading: false,
  error: null,
};

const FEED_LIMIT = 10;

export const fetchFeed = createAsyncThunk<
  User[],
  { page: number; limit?: number },
  { rejectValue: string }
>(
  "feed/fetchFeed",
  async ({ page, limit = FEED_LIMIT }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE_URL}/feed?page=${page}&limit=${limit}`, {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        return rejectWithValue(data?.message ?? `Failed to load feed (${res.status})`);
      }

      const data = await res.json();
      const apiUsers: ApiFeedUser[] = Array.isArray(data) ? data : data.data ?? data.users ?? [];
      return apiUsers.map(mapApiUserToUser);
    } catch {
      return rejectWithValue("Network error — is the server running?");
    }
  }
);

export const sendRequest = createAsyncThunk<
  void,
  { status: "interested" | "ignored"; toUserId: string },
  { rejectValue: string }
>(
  "feed/sendRequest",
  async ({ status, toUserId }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE_URL}/request/send/${status}/${toUserId}`, {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        return rejectWithValue(data?.message ?? `Request failed (${res.status})`);
      }
    } catch {
      return rejectWithValue("Network error — is the server running?");
    }
  }
);

const feedSlice = createSlice({
  name: "feed",
  initialState,
  reducers: {
    removeTopUser(state) {
      state.users.shift();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeed.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeed.fulfilled, (state, action) => {
        state.loading = false;
        // Append only new users — deduplicate by id
        const existingIds = new Set(state.users.map((u) => u.id));
        const newUsers = action.payload.filter((u) => !existingIds.has(u.id));
        state.users.push(...newUsers);
        state.page += 1;
      })
      .addCase(fetchFeed.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Something went wrong";
      });
  },
});

export const { removeTopUser } = feedSlice.actions;
export default feedSlice.reducer;
