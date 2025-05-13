import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isloading: "idle",
  logs: []
};

const AppSlice = createSlice({
  name: "appPage",
  initialState,
  reducers: {
    settingData: (state, action) => {
      const { field, value } = action.payload;

      if (field === "logs") {
        state.logs = [...value, ...state.logs];
      } else {
        state[field] = value;
      }
    },
  },
});

export const { settingData } = AppSlice.actions;

export default AppSlice.reducer;
