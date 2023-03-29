/* eslint-disable no-param-reassign */
import { createSlice } from "@reduxjs/toolkit";
import { WISDOMISE_EMAIL_KEY, WISDOMISE_TOKEN_KEY } from "config/constants";

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
      const jwtToken = localStorage.getItem(WISDOMISE_TOKEN_KEY) || "";
      state.email = email;
      state.jwtToken = jwtToken;
      state.loading = false;
    },
    saveJWT: (state, action) => {
      state.jwtToken = action.payload;
      localStorage.setItem(WISDOMISE_TOKEN_KEY, state.jwtToken);
    },
    saveEmail: (state, action) => {
      state.email = action.payload;
      localStorage.setItem(WISDOMISE_EMAIL_KEY, state.email);
    },
    saveDestinationEmail: (state, action) => {
      state.destinationEmail = action.payload;
    },
    savePassword: (state, action) => {
      state.password = action.payload;
    },
    clearSessionData(state) {
      localStorage.removeItem(WISDOMISE_EMAIL_KEY);
      localStorage.removeItem(WISDOMISE_TOKEN_KEY);
      state.email = "";
      state.jwtToken = "";
      state.password = "";
      state.destinationEmail = "";
      state.loading = true;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  saveEmail,
  saveJWT,
  savePassword,
  saveDestinationEmail,
  clearSessionData,
  loadSessionData,
} = userInfo.actions;

export default userInfo.reducer;
