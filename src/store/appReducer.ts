import { combineReducers } from "@reduxjs/toolkit";
import { horosApi } from "../api/horosApi";
import IASSlice from "./slices/IAS";
import { userInfo } from "./userInfo";

export const appReducer = combineReducers({
  user: userInfo.reducer,
  [horosApi.reducerPath]: horosApi.reducer,
  IAS: IASSlice,
});

export const initialRootState = appReducer(undefined, { type: "$$unused" });

export type RootState = ReturnType<typeof appReducer>;
