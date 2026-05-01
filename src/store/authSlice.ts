import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";

interface Address {
  state: string;
  pincode: string;
  landmark: string;
}

interface UserData {
  userId: number;
  fName: string;
  lName: string;
  role: string;
  avatar: string;
  address: Address[];
  mobile: string[];
  email?: string;
}

interface AuthState {
  user: UserData | null;
  token: string | null;
  refreshToken: string | null; // 1. Refresh Token add kiya
}

const initialState: AuthState = {
  user: JSON.parse(localStorage.getItem("user") || "null"),
  token: localStorage.getItem("token"),
  refreshToken: localStorage.getItem("refreshToken"), // 2. LocalStorage se uthaya
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<any>) => {
      // 3. Payload se refreshToken bhi nikalein
      const { accessToken, refreshToken, ...userData } = action.payload;

      const user: UserData = {
        ...userData,
        email: ""
      };

      try {
        const decoded: any = jwtDecode(accessToken);
        user.email = decoded.sub || decoded.email;
      } catch (e) {
        console.error("Token decoding failed", e);
      }

      state.user = user;
      state.token = accessToken;
      state.refreshToken = refreshToken; // State update

      localStorage.setItem("token", accessToken);
      localStorage.setItem("refreshToken", refreshToken); // Storage update
      localStorage.setItem("user", JSON.stringify(user));
    },

    // 4. Sirf Token update karne ke liye (Refresh Token API ke baad use hoga)
    setToken: (state, action: PayloadAction<{ accessToken: string }>) => {
      state.token = action.payload.accessToken;
      localStorage.setItem("token", action.payload.accessToken);
    },

    updateUser: (state, action: PayloadAction<Partial<UserData>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
        localStorage.setItem("user", JSON.stringify(state.user));
      }
    },

    logout: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken"); // Saaf safayi
      localStorage.removeItem("user");
    },
  },
});

export const { setCredentials, logout, updateUser, setToken } = authSlice.actions;
export default authSlice.reducer;