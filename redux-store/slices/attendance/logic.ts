import { createLogic } from "redux-logic";
import {
  fetchAttendances,
  fetchAttendanceFailed,
  fetchAttendanceSuccess,
} from ".";
import { instance } from "@/constants/connection";
import { fetchAttendance } from "../../../constants/endpoints";

const attendanceLogic = createLogic({
  type: fetchAttendances,
  latest: true,
  async process({ action, getState }, dispatch, done) {
    try {
      const id = action.payload;
      const token = getState().auth?.user?.token;
      const res = await instance.get(fetchAttendance(id), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = res.data;
      dispatch(fetchAttendanceSuccess(data));
    } catch (error) {
      dispatch(fetchAttendanceFailed(error));
    }
    done();
  },
});

export { attendanceLogic };
