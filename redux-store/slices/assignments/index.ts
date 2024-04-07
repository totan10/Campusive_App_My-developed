import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  assignments: [],
  loading: false,
  error: null,
};

const assignments = createSlice({
  name: "assignments",
  initialState,
  reducers: {
    fetchAssignments: (state) => {
      state.loading = true;
    },
    fetchAssignmentsSuccess: (state, action) => {
      state.loading = false;
      state.assignments = action.payload;
    },
    fetchAssignmentsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchAssignments,
  fetchAssignmentsSuccess,
  fetchAssignmentsFailure,
} = assignments.actions;

export default assignments.reducer;
