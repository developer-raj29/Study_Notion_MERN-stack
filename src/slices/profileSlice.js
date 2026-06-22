import {createSlice} from "@reduxjs/toolkit"

let initialUser = null;
try {
  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    initialUser = JSON.parse(storedUser);
  }
} catch (error) {
  console.error("Failed to parse user from localStorage", error);
  localStorage.removeItem("user");
}

const initialState = {
    user: initialUser,
    loading: false,
};

const profileSlice = createSlice({
    name:"profile",
    initialState: initialState,
    reducers: {
        setUser(state, value) {
            state.user = value.payload;
        },
        setLoading(state, value) {
            state.loading = value.payload;
          },
    },
});

export const {setUser, setLoading} = profileSlice.actions;
export default profileSlice.reducer;