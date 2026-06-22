import { createSlice } from "@reduxjs/toolkit";

let initialToken = null;
try {
  const storedToken = localStorage.getItem("token");
  if (storedToken) {
    initialToken = JSON.parse(storedToken);
  }
} catch (error) {
  console.error("Failed to parse token from localStorage", error);
  localStorage.removeItem("token");
}

const initialState = {
  signupData: null,
  loading: false,
  token: initialToken,
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    setSignupData(state, value) {
      state.signupData = value.payload;
    },
    setLoading(state, value) {
      state.loading = value.payload;
    },
    setToken(state, value) {
      state.token = value.payload;
    },
  },
});

export const { setSignupData, setLoading, setToken } = authSlice.actions;

export default authSlice.reducer;
