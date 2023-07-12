import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { InvestorAssetStructures } from "../../pages/productsCatalog/types/investorAssetStructure";

const initialState: { IASData: InvestorAssetStructures | null } = {
  IASData: null,
};

const IASSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setIAS: (state: { IASData: InvestorAssetStructures | null }, actions: PayloadAction<InvestorAssetStructures>) => {
      state.IASData = actions.payload;
    },
    getIAS: (state: { IASData: InvestorAssetStructures | null }) => {
      return state;
    },
  },
});

export const { setIAS, getIAS } = IASSlice.actions;
export default IASSlice.reducer;

// export const selectCurrentUser = (state) => state?.auth?.email;
// export const selectCurrentToken = (state) => state?.auth.jwtToken;
