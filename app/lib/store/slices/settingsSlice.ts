import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const updatePassword = createAsyncThunk<
  void,
  { oldPassword: string; newPassword: string },
  { rejectValue: string }
>(
  "settings/updatePassword",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE_URL}/settings/password/update`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        return rejectWithValue(data?.message ?? `Password update failed (${res.status})`);
      }
    } catch {
      return rejectWithValue("Network error — is the server running?");
    }
  }
);

export const updateEmail = createAsyncThunk<
  void,
  { currentEmail: string; newEmail: string },
  { rejectValue: string }
>(
  "settings/updateEmail",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE_URL}/settings/email/update`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        return rejectWithValue(data?.message ?? `Email update failed (${res.status})`);
      }
    } catch {
      return rejectWithValue("Network error — is the server running?");
    }
  }
);

interface SettingsState {
  loading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: SettingsState = {
  loading: false,
  error: null,
  success: false,
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    resetSettingsState(state) {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Password
      .addCase(updatePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updatePassword.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(updatePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Something went wrong";
      })
      // Email
      .addCase(updateEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateEmail.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(updateEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Something went wrong";
      });
  },
});

export const { resetSettingsState } = settingsSlice.actions;
export default settingsSlice.reducer;
