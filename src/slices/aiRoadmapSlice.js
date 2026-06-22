import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  roadmaps: [],
  activeRoadmap: null,
  loading: false,
  error: null,
};

const aiRoadmapSlice = createSlice({
  name: "aiRoadmap",
  initialState,
  reducers: {
    setRoadmaps(state, action) {
      state.roadmaps = action.payload;
    },
    setActiveRoadmap(state, action) {
      state.activeRoadmap = action.payload;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
    updateRoadmap(state, action) {
      const index = state.roadmaps.findIndex((r) => r._id === action.payload._id);
      if (index !== -1) {
        state.roadmaps[index] = action.payload;
      }
      if (state.activeRoadmap?._id === action.payload._id) {
        state.activeRoadmap = action.payload;
      }
    },
    clearError(state) {
      state.error = null;
    },
  },
});

export const { setRoadmaps, setActiveRoadmap, setLoading, setError, updateRoadmap, clearError } = aiRoadmapSlice.actions;

export default aiRoadmapSlice.reducer;
