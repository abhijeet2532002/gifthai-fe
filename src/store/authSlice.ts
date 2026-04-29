import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";

// 1. Backend response structure mein 'address' add kiya
interface UserData {
  userId: number;
  fName: string;
  lName: string;
  role: string;
  avatar: string; 
  address?: string; // Naya field add kiya
  email?: string; 
}

interface AuthState { 
  user: UserData | null;
  token: string | null;
}

const initialState: AuthState = {
  user: JSON.parse(localStorage.getItem("user") || "null"),
  token: localStorage.getItem("token"),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: UserData; accessToken: string }>) => {
      const { user, accessToken } = action.payload;
      
      try {
        const decoded: any = jwtDecode(accessToken);
        // Backend ke hisaab se 'sub' ya 'email' lein
        user.email = decoded.sub || decoded.email; 
      } catch (e) {
        console.error("Token decoding failed", e);
      }

      state.user = user;
      state.token = accessToken;

      localStorage.setItem("token", accessToken);
      localStorage.setItem("user", JSON.stringify(user));
    },

    // 2. Is reducer se address (ya koi bhi field) update ho jayegi
    // Example: dispatch(updateUser({ address: 'Mumbai, India' }))
    updateUser: (state, action: PayloadAction<Partial<UserData>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        localStorage.setItem("user", JSON.stringify(state.user));
      }
    },

    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  },
});

export const { setCredentials, logout, updateUser } = authSlice.actions;
export default authSlice.reducer;