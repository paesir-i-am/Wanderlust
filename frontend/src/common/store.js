import { configureStore } from "@reduxjs/toolkit";
import loginSlice from "../member/slice/loginSlice";
import tourListSlice from "../tour/slice/tourListSlice";

export default configureStore({
  reducer: {
    loginSlice: loginSlice,
    tourListSlice: tourListSlice,
  },
});
