import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { horosApi } from "../api/horosApi";
import { rtkQueryErrorMiddleware } from "../api/rtkQueryErrorMiddleware";
import { appReducer, RootState } from "./appReducer";

const store = configureStore({
  reducer: appReducer,
  middleware: (getDefaultMiddleware) => [...getDefaultMiddleware(), horosApi.middleware, rtkQueryErrorMiddleware],
});

type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export default store;
