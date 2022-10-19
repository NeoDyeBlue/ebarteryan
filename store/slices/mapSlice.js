import { createSlice } from "@reduxjs/toolkit";

export const mapSlice = createSlice({
  name: "map",
  initialState: {
    position: null,
    radius: 1000,
  },
  reducers: {
    setPosition: (state, action) => {
      state.position = action.payload;
    },
  },
});

export const { setPosition } = mapSlice.actions;

export const selectPosition = (state) => state.position.value;

export default mapSlice.reducer;
