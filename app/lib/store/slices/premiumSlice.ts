import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface PremiumState {
  isPremium: boolean;
  premiumPlan: string | null;
  premiumExpiresAt: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: PremiumState = {
  isPremium: false,
  premiumPlan: null,
  premiumExpiresAt: null,
  loading: false,
  error: null,
};

export const fetchPremiumStatus = createAsyncThunk<
  { isPremium: boolean; premiumPlan: string | null; premiumExpiresAt: string | null },
  void,
  { rejectValue: string }
>(
  "premium/fetchStatus",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE_URL}/premium/status`, {
        credentials: "include",
      });
      if (!res.ok) {
        return rejectWithValue("Failed to fetch premium status");
      }
      return await res.json();
    } catch {
      return rejectWithValue("Network error");
    }
  }
);

export const cancelPremium = createAsyncThunk<
  void,
  void,
  { rejectValue: string }
>(
  "premium/cancel",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE_URL}/premium/cancel`, {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        return rejectWithValue(data?.message ?? "Failed to cancel");
      }
    } catch {
      return rejectWithValue("Network error");
    }
  }
);

export const activateTestPremium = createAsyncThunk<
  { isPremium: boolean; premiumPlan: string; premiumExpiresAt: string },
  "monthly" | "yearly",
  { rejectValue: string }
>(
  "premium/activateTest",
  async (plan, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE_URL}/premium/activate-test`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ plan }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        return rejectWithValue(data?.message ?? "Activation failed");
      }
      const data = await res.json();
      return {
        isPremium: data.isPremium,
        premiumPlan: data.premiumPlan,
        premiumExpiresAt: data.premiumExpiresAt,
      };
    } catch {
      return rejectWithValue("Network error");
    }
  }
);

const premiumSlice = createSlice({
  name: "premium",
  initialState,
  reducers: {
    resetPremiumError(state) {
      state.error = null;
    },
    setPremiumFromProfile(state, action: { payload: { isPremium: boolean; premiumPlan: string | null; premiumExpiresAt: string | null } }) {
      state.isPremium = action.payload.isPremium;
      state.premiumPlan = action.payload.premiumPlan;
      state.premiumExpiresAt = action.payload.premiumExpiresAt;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPremiumStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPremiumStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.isPremium = action.payload.isPremium;
        state.premiumPlan = action.payload.premiumPlan;
        state.premiumExpiresAt = action.payload.premiumExpiresAt;
      })
      .addCase(fetchPremiumStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Something went wrong";
      })
      .addCase(cancelPremium.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelPremium.fulfilled, (state) => {
        state.loading = false;
        state.isPremium = false;
        state.premiumPlan = null;
        state.premiumExpiresAt = null;
      })
      .addCase(cancelPremium.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to cancel";
      })
      .addCase(activateTestPremium.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(activateTestPremium.fulfilled, (state, action) => {
        state.loading = false;
        state.isPremium = action.payload.isPremium;
        state.premiumPlan = action.payload.premiumPlan;
        state.premiumExpiresAt = action.payload.premiumExpiresAt;
      })
      .addCase(activateTestPremium.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Activation failed";
      });
  },
});

export const { resetPremiumError, setPremiumFromProfile } = premiumSlice.actions;
export default premiumSlice.reducer;
