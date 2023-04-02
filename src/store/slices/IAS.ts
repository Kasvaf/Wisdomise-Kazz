import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface IASInfo {
  IASData: object | null;
}

const initialState: IASInfo = {
  IASData: null,
};

const IASSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setIAS: (state: IASInfo, actions: PayloadAction<IASInfo>) => {
      const user = actions.payload;
      state.IASData = user;
    },
    getIAS: (state: IASInfo) => {
      return state;
    },
  },
});

export const { setIAS, getIAS } = IASSlice.actions;
export default IASSlice.reducer;

// export const selectCurrentUser = (state) => state?.auth?.email;
// export const selectCurrentToken = (state) => state?.auth.jwtToken;
