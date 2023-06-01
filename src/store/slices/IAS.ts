import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { InvestorAssetStructureResponse } from "containers/catalog/types/investorAssetStructure";

const initialState: { IASData: InvestorAssetStructureResponse | null } = {
  IASData: null,
};

const IASSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setIAS: (
      state: { IASData: InvestorAssetStructureResponse | null },
      actions: PayloadAction<InvestorAssetStructureResponse>
    ) => {
      state.IASData = actions.payload;
    },
    getIAS: (state: { IASData: InvestorAssetStructureResponse | null }) => {
      return state;
    },
  },
});

export const { setIAS, getIAS } = IASSlice.actions;
export default IASSlice.reducer;

// export const selectCurrentUser = (state) => state?.auth?.email;
// export const selectCurrentToken = (state) => state?.auth.jwtToken;
