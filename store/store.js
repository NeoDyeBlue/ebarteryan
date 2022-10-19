import { configureStore } from "@reduxjs/toolkit";
import mapReducer from "../slices/mapSlice";

export const store = configureStore({
  reducer: {
    map: mapReducer,
  },
});
