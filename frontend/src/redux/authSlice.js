import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { auth, googleProvider, signInWithPopup } from "../firebase/firebase.js";
import { VITE_API_BASE_URL } from "../components/index.js";


// Async action to fetch user profile
export const fetchUserProfile = createAsyncThunk("auth/fetchUserProfile", async (_, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token found");

    const response = await axios.get(`${VITE_API_BASE_URL}user/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || "Failed to fetch profile");
  }
});

// Fetch user's trades
export const fetchUserTrades = createAsyncThunk(`auth/fetchUserTrades`, async (_, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem("token");
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.get(`${VITE_API_BASE_URL}trade/mytrades`, config);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || "Failed to fetch trades");
  }
});

// Delete trade
// export const deleteTrade = createAsyncThunk(
//   "trades/deleteTrade",
//   async (tradeId, { rejectWithValue }) => {
//     try {
//       await axios.delete(`/api/trades/${tradeId}`);
//       return tradeId; 
//     } catch (error) {
//       return rejectWithValue(error.response?.data || "Error deleting trade");
//     }
//   }
// );

// Google Sign-in
export const signInWithGoogle = createAsyncThunk(
  "auth/signInWithGoogle",
  async (_, { rejectWithValue }) => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Send user info to backend for token
      const response = await axios.post(
        `${VITE_API_BASE_URL}auth/google`,
        {
          username: user.displayName,
          email: user.email,
          photoURL : user.photoURL,
          uid: user.uid,
        },
        {
          headers: { "Content-Type": "application/json" }, 
        }
      );

      localStorage.setItem("token", response.data.token);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Google Sign-in failed");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isAuthenticated: !!localStorage.getItem("token"),
    // user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null, // Fix here
    token: localStorage.getItem("token") || null,
    trades: [],
    loading: false,
    tradeLoading: false,
    error: null,
    tradeError: null,
  },  
  reducers: {
    login: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("user", JSON.stringify(action.payload.user));
    },
       
    setUser: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.trades = [];
      state.token = null;  // Clear token
      localStorage.removeItem("token");
    },    
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.loading = false;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.error = action.payload;
        state.isAuthenticated = false;
        state.loading = false;
      })
      // Fetch user trades
      .addCase(fetchUserTrades.pending, (state) => { state.tradeLoading = true; })
      .addCase(fetchUserTrades.fulfilled, (state, action) => {
        state.tradeLoading = false;
        state.trades = action.payload;
      })
      .addCase(fetchUserTrades.rejected, (state, action) => {
        state.tradeLoading = false;
        state.tradeError = action.payload;
      })

      .addCase(signInWithGoogle.pending, (state) => { state.loading = true; })
      .addCase(signInWithGoogle.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(signInWithGoogle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
  },
});

export const { login , logout , setUser} = authSlice.actions;
export default authSlice.reducer;
