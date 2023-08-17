import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { horosApi } from 'old-api/horosApi';
import { rtkQueryErrorMiddleware } from 'old-api/rtkQueryErrorMiddleware';

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
