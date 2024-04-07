import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  attendance: [],
  loading: false,
  error: null,
};

const attendanceSlice = createSlice({
  name: "attendances",
  initialState,
  reducers: {
    fetchAttendances: (state) => {
      state.loading = true;
    },
    fetchAttendanceSuccess: (state, action) => {
      state.loading = false;
      state.attendance = action.payload;
    },
    fetchAttendanceFailed: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  clearError,
  fetchAttendances,
  fetchAttendanceFailed,
  fetchAttendanceSuccess,
} = attendanceSlice.actions;

export default attendanceSlice.reducer;
