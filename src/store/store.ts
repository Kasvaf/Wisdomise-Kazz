import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { rtkQueryErrorMiddleware } from 'old-api/rtkQueryErrorMiddleware';
import { horosApi } from 'old-api/horosApi';

const appReducer = combineReducers({
  [horosApi.reducerPath]: horosApi.reducer,
});

const store = configureStore({
  reducer: appReducer,
  middleware: getDefaultMiddleware => [
    ...getDefaultMiddleware(),
    horosApi.middleware,
    rtkQueryErrorMiddleware,
  ],
});

export default store;
