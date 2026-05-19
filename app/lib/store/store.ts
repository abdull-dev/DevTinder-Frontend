import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import feedReducer from "./slices/feedSlice";
import matchesReducer from "./slices/matchesSlice";
import connectsReducer from "./slices/connectsSlice";
import settingsReducer from "./slices/settingsSlice";
import profileReducer from "./slices/profileSlice";
import premiumReducer from "./slices/premiumSlice";

export const makeStore = () =>
  configureStore({
    reducer: {
      auth: authReducer,
      feed: feedReducer,
      matches: matchesReducer,
      connects: connectsReducer,
      settings: settingsReducer,
      profile: profileReducer,
      premium: premiumReducer,
    },
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
