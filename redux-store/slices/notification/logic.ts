import { createLogic } from "redux-logic";
import {
 fetchNotification,
 fetchNotificationsSuccess,
 fetchNotificationsFailure
} from ".";
import { instance } from "@/constants/connection";
import { fetchNotifications } from "../../../constants/endpoints";


const notificationLogic = createLogic({
  type: fetchNotification,
  latest: true,
  async process({ action, getState }, dispatch, done) {
    try {
      const id = action.payload;
      const token = getState().auth?.user?.token;
      const res = await instance.get(fetchNotifications(id), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = res.data;
      dispatch(fetchNotificationsSuccess(data));
    } catch (error) {
      dispatch(fetchNotificationsFailure(error));
    }
    done();
  },
});

export { notificationLogic };
