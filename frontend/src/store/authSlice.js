import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    email: null,
  },
  reducers: {
    login(state, action) {
      // state gives access to initialState
      state.email = action.payload; // action like i need any id to remove then i would need action
    },
    logout(state) {
      state.email = null;
    },
  },
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;
