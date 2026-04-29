import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import productReducer from "./productSlice";

export const store = configureStore({
  reducer: {
    // Authentication state (User, Token)
    auth: authReducer,
    
    // Products state (API items, Loading, Errors)
    products: productReducer,
  },
  // Base64 images ya bade payloads ke liye middleware handling
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;