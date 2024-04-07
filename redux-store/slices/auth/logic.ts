import { createLogic } from "redux-logic";
import {
  login,
  logout,
  loginFailure,
  loginSuccess,
  profile,
  profileSuccess,
  profileFailed,
  logoutFailure,
  logoutSuccess,
} from ".";
import { instance } from "@/constants/connection";
import { loginUrl, logoutUrl, profileUrl } from "@/constants/endpoints";

const loginLogic = createLogic({
  type: login,
  latest: true,
  async process({ action, getState }, dispatch, done) {
    // do something async
    const { username, password } = action.payload;
    const data = JSON.stringify({
      userName: username,
      userPassword: password,
    });
    try {
      const response = await instance.post(loginUrl, data, {
        headers: {
          Accept: "application/json, text/plain, */*",
          "Accept-Encoding": "gzip, deflate, br, zstd",
          "Accept-Language": "en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7,bn;q=0.6",
          Connection: "keep-alive",
          "Content-Length": 60,
          "Content-Type": "application/json",
        },
      });
      dispatch(loginSuccess(response.data));
    } catch (error) {
      dispatch(
        loginFailure(error?.response?.data || "Login Failed! Please try again!")
      );
    }
    done();
  },
});

const profileLogic = createLogic({
  type: profile,
  latest: true,
  async process({ action, getState }, dispatch, done) {
    // do something async
    const token = getState()?.auth.user.token;
    try {
      const response = await instance.get(profileUrl, {
        headers: {
          Accept: "*/*",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = response.data;
      dispatch(profileSuccess(data));
    } catch (error) {
      dispatch(profileFailed(error));
    }
    done();
  },
});

const logoutLogic = createLogic({
  type: logout,
  latest: true,
  async process({ action, getState }, dispatch, done) {
    // do something async)
    try {
      const token = getState().auth.user.token;
      const response = await instance.post(
        logoutUrl,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      dispatch(logoutSuccess());
    } catch (err) {
      dispatch(logoutFailure(err));
    }
    done();
  },
});

export { loginLogic, logoutLogic, profileLogic };
