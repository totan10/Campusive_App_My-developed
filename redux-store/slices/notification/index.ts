import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  notification: [],
  loading: false,
  error: null,
};

const notification = createSlice({
  name: "notification",
  initialState,
  reducers: {
    fetchNotification: (state) => {
      state.loading = true;
    },
    fetchNotificationsSuccess: (state, action) => {
      state.loading = false;
      state.notification = action.payload;
    },
    fetchNotificationsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchNotification,
  fetchNotificationsSuccess,
  fetchNotificationsFailure,
} = notification.actions;

export default notification.reducer;
