import { combineReducers } from "@reduxjs/toolkit";
import { horosApi } from "../api/horosApi";
import { userInfo } from "./userInfo";

export const appReducer = combineReducers({
  user: userInfo.reducer,
  [horosApi.reducerPath]: horosApi.reducer,
});

export type RootState = ReturnType<typeof appReducer>;
