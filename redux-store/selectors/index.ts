import { RootState } from "../store";

// auth
export const getUser = (state: RootState) => state.auth?.user;
export const getIsAuth = (state: RootState) => state.auth?.isAuthenticated;
export const getIsLoading = (state: RootState) => state.auth?.loading;
export const getError = (state: RootState) => state.auth?.error;
export const getProfile = (state: RootState) => state.auth?.profile;

// assignment
export const getAssignments = (state: RootState) =>
  state.assignments?.assignments;
export const getIsLoadingAssignments = (state: RootState) =>
  state.assignments?.loading;
export const getErrorAssignments = (state: RootState) =>
  state.assignments?.error;

// attendance
export const getAttendance = (state: RootState) =>
  state.attendances?.attendance;
export const getIsLoadingAttendance = (state: RootState) =>
  state.attendances?.loading;
export const getErrorAttendance = (state: RootState) =>
  state.attendances?.error;

//Notification
export const getNotifications = (state: RootState) =>
  state.notifications?.notification;
export const getIsLoadingNotifications = (state: RootState) =>
  state.notifications?.loading;
export const getErrorNotifications = (state: RootState) =>
  state.notifications?.error;
