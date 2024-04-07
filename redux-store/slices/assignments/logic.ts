import { createLogic } from "redux-logic";
import {
  fetchAssignments,
  fetchAssignmentsFailure,
  fetchAssignmentsSuccess,
} from ".";
import { instance } from "@/constants/connection";
import { fetchAssignnment } from "../../../constants/endpoints";

const assignmentsLogic = createLogic({
  type: fetchAssignments,
  latest: true,
  async process({ action, getState }, dispatch, done) {
    try {
      const id = action.payload;
      const token = getState().auth?.user?.token;
      const res = await instance.get(fetchAssignnment(id), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = res.data;
      dispatch(fetchAssignmentsSuccess(data));
    } catch (error) {
      dispatch(fetchAssignmentsFailure(error));
    }
    done();
  },
});

export { assignmentsLogic };
