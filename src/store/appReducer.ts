import { combineReducers } from '@reduxjs/toolkit';
import { userInfo } from './userInfo';
import { horosApi } from '../api/horosApi';
import IASSlice from './slices/IAS';

export const appReducer = combineReducers({
  user: userInfo.reducer,
  [horosApi.reducerPath]: horosApi.reducer,
  IAS: IASSlice,
});

export const initialRootState = appReducer(undefined, { type: '$$unused' });

export type RootState = ReturnType<typeof appReducer>;
