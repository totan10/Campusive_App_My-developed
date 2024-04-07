export const loginUrl = "/auth/user/login";

export const profileUrl = "/user/me";

export const logoutUrl = "/user/logout";

export const fetchAssignnment = (id: string) =>
  `/academic/institute/class/attendance/student/assignment/${id}`;

export const fetchNotifications= (id: string) =>
  `/academic/notification/student/notify/${id}`;

export const studentProfile = (id: string) =>
  `/subscriber/student/profile/${id}`;

export const profileImage = (id: string) => `/master/file/downloadImage/${id}`;

export const fetchAttendance = (id: string) =>
  `/academic/institute/class/attendance/student/attendance/${id}`;

export const downloadAssignment = (id: string) =>
  `/master/file//assignment/download/${id}`;

export const resetPassword = "/user/me/resetPassword";

export const tac = "/user/me/termsCondition";

export const chnageUsername = "/user/me/changeUsername";
