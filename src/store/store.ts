import { configureStore } from "@reduxjs/toolkit";
import { horosApi } from "../api/horosApi";
import { rtkQueryErrorMiddleware } from "../api/rtkQueryErrorMiddleware";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { chainReducers } from "utils/chainReducers";
import { appReducer, RootState } from "./appReducer";
import { signoutReducer } from "./slices/signout";
import IASReducer from "./slices/IAS";

export const store = configureStore({
  reducer: chainReducers<any>(appReducer, signoutReducer, IASReducer),
  middleware: (getDefaultMiddleware) => [
    ...getDefaultMiddleware(),
    horosApi.middleware,
    rtkQueryErrorMiddleware,
  ],
});

export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export type AppStore = typeof store;

export default store;
