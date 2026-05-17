import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export interface ChatMessage {
  _id: string;
  senderId: string;
  receiverId: string;
  text: string;
  createdAt: string;
}

export interface ChatPartner {
  _id: string;
  firstName: string;
  lastName: string;
  photoURL?: string;
  isOnline: boolean;
}

interface ChatState {
  messages: ChatMessage[];
  partners: ChatPartner[];
  activePartnerId: string | null;
  typingUsers: string[]; // userIds currently typing
  onlineUsers: string[]; // userIds currently online
  loading: boolean;
  error: string | null;
}

const initialState: ChatState = {
  messages: [],
  partners: [],
  activePartnerId: null,
  typingUsers: [],
  onlineUsers: [],
  loading: false,
  error: null,
};

export const fetchChatHistory = createAsyncThunk<
  ChatMessage[],
  string, // partnerId
  { rejectValue: string }
>(
  "chat/fetchHistory",
  async (partnerId, { rejectWithValue }) => {
    try {
      const res = await fetch(`${BASE_URL}/chat/${partnerId}`, {
        credentials: "include",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        return rejectWithValue(data?.message ?? "Failed to load messages");
      }
      return await res.json();
    } catch {
      return rejectWithValue("Network error");
    }
  }
);

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setActivePartner(state, action: { payload: string | null }) {
      state.activePartnerId = action.payload;
      state.messages = [];
      state.typingUsers = [];
    },
    addMessage(state, action: { payload: ChatMessage }) {
      state.messages.push(action.payload);
    },
    setPartners(state, action: { payload: ChatPartner[] }) {
      state.partners = action.payload;
    },
    setUserOnline(state, action: { payload: string }) {
      if (!state.onlineUsers.includes(action.payload)) {
        state.onlineUsers.push(action.payload);
      }
      const partner = state.partners.find((p) => p._id === action.payload);
      if (partner) partner.isOnline = true;
    },
    setUserOffline(state, action: { payload: string }) {
      state.onlineUsers = state.onlineUsers.filter((id) => id !== action.payload);
      const partner = state.partners.find((p) => p._id === action.payload);
      if (partner) partner.isOnline = false;
    },
    setUserTyping(state, action: { payload: string }) {
      if (!state.typingUsers.includes(action.payload)) {
        state.typingUsers.push(action.payload);
      }
    },
    clearUserTyping(state, action: { payload: string }) {
      state.typingUsers = state.typingUsers.filter((id) => id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChatHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChatHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload;
      })
      .addCase(fetchChatHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Something went wrong";
      });
  },
});

export const {
  setActivePartner,
  addMessage,
  setPartners,
  setUserOnline,
  setUserOffline,
  setUserTyping,
  clearUserTyping,
} = chatSlice.actions;
export default chatSlice.reducer;
