import { createAction, createReducer } from '@reduxjs/toolkit';
import { initialRootState, RootState } from '../appReducer';

export const signoutAction = createAction('session/signout');

export const signoutReducer = createReducer<RootState>(
  initialRootState,
  (builder) => {
    builder.addCase(signoutAction, () => {
      return initialRootState;
    });
  },
);
