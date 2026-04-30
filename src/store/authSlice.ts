import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";

// 1. Naye response ke hisaab se Interfaces define kiye
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
  address: Address[]; // String ki jagah Array of Objects
  mobile: string[];    // Array of strings
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
    setCredentials: (state, action: PayloadAction<any>) => {
      // Direct pure response ko destructure kar rahe hain
      const { accessToken, ...userData } = action.payload;

      console.log("xxxxxxxxxxx ",userData);
      

      const user: UserData = {
        ...userData,
        email: "" // Initializing
      };

      try {
        const decoded: any = jwtDecode(accessToken);
        // Response mein token se email nikal kar set kar rahe hain
        user.email = decoded.sub || decoded.email;
      } catch (e) {
        console.error("Token decoding failed", e);
      }

      state.user = user;
      state.token = accessToken;

      localStorage.setItem("token", accessToken);
      localStorage.setItem("user", JSON.stringify(user));
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
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  },
});

export const { setCredentials, logout, updateUser } = authSlice.actions;
export default authSlice.reducer;