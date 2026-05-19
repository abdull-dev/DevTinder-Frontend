import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export interface MatchUser {
  _id: string;
  firstName: string;
  lastName: string;
  age?: number;
  gender?: string;
  photoURL?: string;
  Description?: string;
  interests?: string[];
  country?: string;
  city?: string;
  jobTitle?: string;
  isPremium?: boolean;
}

interface MatchesState {
  matches: MatchUser[];
  loading: boolean;
  error: string | null;
}

const initialState: MatchesState = {
  matches: [],
  loading: false,
  error: null,
};

export const fetchMatches = createAsyncThunk<MatchUser[], void, { rejectValue: string }>(
  "matches/fetchMatches",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE_URL}/user/connections/matches`, {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        return rejectWithValue(data?.message ?? `Failed to load matches (${res.status})`);
      }

      const data = await res.json();
      return Array.isArray(data) ? data : data.data ?? data.matches ?? data.users ?? [];
    } catch {
      return rejectWithValue("Network error — is the server running?");
    }
  }
);

const matchesSlice = createSlice({
  name: "matches",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMatches.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMatches.fulfilled, (state, action) => {
        state.loading = false;
        state.matches = action.payload;
      })
      .addCase(fetchMatches.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Something went wrong";
      });
  },
});

export default matchesSlice.reducer;
