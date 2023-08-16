import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { rtkQueryErrorMiddleware } from "../api/rtkQueryErrorMiddleware";
import { horosApi } from "../api/horosApi";

export const appReducer = combineReducers({
  [horosApi.reducerPath]: horosApi.reducer,
});

const store = configureStore({
  reducer: appReducer,
  middleware: (getDefaultMiddleware) => [...getDefaultMiddleware(), horosApi.middleware, rtkQueryErrorMiddleware],
});

export default store;
