import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export interface ConnectUser {
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
}

export interface ConnectRequest {
  _id: string;
  fromUserId: ConnectUser | string;
  toUserId: ConnectUser | string;
  status: string;
  createdAt?: string;
}

interface ConnectsState {
  received: ConnectRequest[];
  sent: ConnectRequest[];
  receivedLoading: boolean;
  sentLoading: boolean;
  receivedError: string | null;
  sentError: string | null;
}

const initialState: ConnectsState = {
  received: [],
  sent: [],
  receivedLoading: false,
  sentLoading: false,
  receivedError: null,
  sentError: null,
};

export const fetchReceived = createAsyncThunk<ConnectRequest[], void, { rejectValue: string }>(
  "connects/fetchReceived",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE_URL}/user/connections/recieved`, {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        return rejectWithValue(data?.message ?? `Failed to load received requests (${res.status})`);
      }

      const data = await res.json();
      return Array.isArray(data) ? data : data.users ?? data.data ?? data.requests ?? data.connections ?? [];
    } catch {
      return rejectWithValue("Network error — is the server running?");
    }
  }
);

export const fetchSent = createAsyncThunk<ConnectRequest[], void, { rejectValue: string }>(
  "connects/fetchSent",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE_URL}/user/connections/sent`, {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        return rejectWithValue(data?.message ?? `Failed to load sent requests (${res.status})`);
      }

      const data = await res.json();
      return Array.isArray(data) ? data : data.users ?? data.data ?? data.requests ?? data.connections ?? [];
    } catch {
      return rejectWithValue("Network error — is the server running?");
    }
  }
);

export const reviewRequest = createAsyncThunk<
  { requestId: string; status: string },
  { requestId: string; status: "accepted" | "rejected" },
  { rejectValue: string }
>(
  "connects/reviewRequest",
  async ({ requestId, status }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE_URL}/request/review/${status}/${requestId}`, {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        return rejectWithValue(data?.message ?? `Review failed (${res.status})`);
      }

      return { requestId, status };
    } catch {
      return rejectWithValue("Network error — is the server running?");
    }
  }
);

export const cancelRequest = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>(
  "connects/cancelRequest",
  async (requestId, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE_URL}/request/cancel/${requestId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        return rejectWithValue(data?.message ?? `Cancel failed (${res.status})`);
      }

      return requestId;
    } catch {
      return rejectWithValue("Network error — is the server running?");
    }
  }
);

const connectsSlice = createSlice({
  name: "connects",
  initialState,
  reducers: {
    removeReceivedRequest(state, action: { payload: string }) {
      state.received = state.received.filter((r) => r._id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      // Received
      .addCase(fetchReceived.pending, (state) => {
        state.receivedLoading = true;
        state.receivedError = null;
      })
      .addCase(fetchReceived.fulfilled, (state, action) => {
        state.receivedLoading = false;
        state.received = action.payload;
      })
      .addCase(fetchReceived.rejected, (state, action) => {
        state.receivedLoading = false;
        state.receivedError = action.payload ?? "Something went wrong";
      })
      // Sent
      .addCase(fetchSent.pending, (state) => {
        state.sentLoading = true;
        state.sentError = null;
      })
      .addCase(fetchSent.fulfilled, (state, action) => {
        state.sentLoading = false;
        state.sent = action.payload;
      })
      .addCase(fetchSent.rejected, (state, action) => {
        state.sentLoading = false;
        state.sentError = action.payload ?? "Something went wrong";
      })
      // Review (accept/reject)
      .addCase(reviewRequest.fulfilled, (state, action) => {
        state.received = state.received.filter((r) => r._id !== action.payload.requestId);
      })
      // Cancel
      .addCase(cancelRequest.fulfilled, (state, action) => {
        state.sent = state.sent.filter((r) => r._id !== action.payload);
      });
  },
});

export const { removeReceivedRequest } = connectsSlice.actions;
export default connectsSlice.reducer;
