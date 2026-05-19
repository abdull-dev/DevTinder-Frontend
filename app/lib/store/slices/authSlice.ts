import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export interface SignInPayload {
  emailId: string;
  password: string;
}

export interface SignUpPayload {
  firstName: string;
  lastName: string;
  emailId: string;
  password: string;
  age: number;
  gender: string;
  photo: File | null;
  Description: string;
  interests: string[];
  languages: string[];
  country: string;
  city: string;
}

interface AuthState {
  loading: boolean;
  error: string | null;
  signUpSuccess: boolean;
  signInSuccess: boolean;
}

const initialState: AuthState = {
  loading: false,
  error: null,
  signUpSuccess: false,
  signInSuccess: false,
};

export const logout = createAsyncThunk<void, void, { rejectValue: string }>(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        return rejectWithValue(data?.message ?? `Logout failed (${res.status})`);
      }
    } catch {
      return rejectWithValue("Network error — is the server running?");
    }
  }
);

export const signIn = createAsyncThunk<void, SignInPayload, { rejectValue: string }>(
  "auth/signIn",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE_URL}/auth/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        return rejectWithValue(data?.message ?? `Sign in failed (${res.status})`);
      }
    } catch {
      return rejectWithValue("Network error — is the server running?");
    }
  }
);

export const googleSignIn = createAsyncThunk<void, string, { rejectValue: string }>(
  "auth/googleSignIn",
  async (accessToken, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE_URL}/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ accessToken }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        return rejectWithValue(data?.message ?? `Google sign-in failed (${res.status})`);
      }
    } catch {
      return rejectWithValue("Network error — is the server running?");
    }
  }
);

export const signUp = createAsyncThunk<void, SignUpPayload, { rejectValue: string }>(
  "auth/signUp",
  async (payload, { rejectWithValue }) => {
    try {
      const fd = new FormData();
      fd.append("firstName", payload.firstName);
      fd.append("lastName", payload.lastName);
      fd.append("emailId", payload.emailId);
      fd.append("password", payload.password);
      fd.append("age", String(payload.age));
      fd.append("gender", payload.gender);
      fd.append("Description", payload.Description);
      fd.append("country", payload.country);
      fd.append("city", payload.city);
      payload.interests.forEach((i) => fd.append("interests", i));
      payload.languages.forEach((l) => fd.append("languages", l));
      if (payload.photo) {
        fd.append("photo", payload.photo);
      }

      const res = await fetch(`${BASE_URL}/auth/signup`, {
        method: "POST",
        body: fd,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        return rejectWithValue(data?.message ?? `Signup failed (${res.status})`);
      }
    } catch {
      return rejectWithValue("Network error — is the server running?");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetAuthState(state) {
      state.loading = false;
      state.error = null;
      state.signUpSuccess = false;
      state.signInSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Sign In
      .addCase(signIn.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.signInSuccess = false;
      })
      .addCase(signIn.fulfilled, (state) => {
        state.loading = false;
        state.signInSuccess = true;
      })
      .addCase(signIn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Something went wrong";
      })
      // Sign Up
      .addCase(signUp.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.signUpSuccess = false;
      })
      .addCase(signUp.fulfilled, (state) => {
        state.loading = false;
        state.signUpSuccess = true;
      })
      .addCase(signUp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Something went wrong";
      })
      // Google Sign In
      .addCase(googleSignIn.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.signInSuccess = false;
      })
      .addCase(googleSignIn.fulfilled, (state) => {
        state.loading = false;
        state.signInSuccess = true;
      })
      .addCase(googleSignIn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Google sign-in failed";
      });
  },
});

export const { resetAuthState } = authSlice.actions;
export default authSlice.reducer;
