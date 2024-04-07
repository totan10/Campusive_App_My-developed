// import store from "@/redux-store/store";
import { logoutSuccess } from "@/redux-store/slices/auth";
import store from "@/redux-store/store";
import axios from "axios";

// # EXPO_PUBLIC_API_URL=https://api.campusive-uat.sysbean.com
//export const EXPO_PUBLIC_API_URL = "https://api.campusive.com";
export const EXPO_PUBLIC_API_URL ="https://api.campusive-uat.sysbean.com"

export const instance = axios.create({
  baseURL: EXPO_PUBLIC_API_URL,
});

instance.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    return config;
  },
  function (error) {
    // Do something with request error
    throw new Error(error);
  }
);

// Add a response interceptor
instance.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  },
  function (error) {
    const code = error?.response?.status;
    if (code == 401) {
      store.dispatch(logoutSuccess());
    }

    return Promise.reject(error);
  }
);
