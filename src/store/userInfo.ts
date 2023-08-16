/* eslint-disable no-param-reassign */
import { createSlice } from "@reduxjs/toolkit";
import { jwtToken as _jwtToken } from "config/axios";
import { JwtTokenKey, WISDOMISE_EMAIL_KEY } from "config/constants";

export const userInfo = createSlice({
  name: "userInfo",
  initialState: {
    jwtToken: "",
    email: "",
    destinationEmail: "",
    password: "",
    loading: true,
  },
  reducers: {
    loadSessionData(state) {
      const email = localStorage.getItem(WISDOMISE_EMAIL_KEY) || "";
      const jwtToken = localStorage.getItem(JwtTokenKey) || _jwtToken;
      state.email = email;
      state.jwtToken = jwtToken;
      state.loading = false;
    },
  },
});

// Action creators are generated for each case reducer function
export const { loadSessionData } = userInfo.actions;

