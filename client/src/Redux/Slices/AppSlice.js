import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isloading: "idle",


};

const AppSlice = createSlice({
  name: "appPage",
  initialState,
  reducers: {
    settingData: (state, action) => {
      const { field, value } = action.payload;
      state[field] = value;
    },
  },
});

export const { settingData } = AppSlice.actions;

export default AppSlice.reducer;
