import { createSlice } from "@reduxjs/toolkit";

interface UserState {
  user: any | null;
  loading: boolean;
  error: string | null;
  isAuthenticated:boolean;
}
const initialState:UserState = {
  user: null,
  loading: false,
  error: null,
  isAuthenticated: false
};
const userslice = createSlice({
  name: "user",
  initialState: initialState,
  reducers:  {
    signInStart: (state) => {
      state.loading = true;
    },
    signinSuccess: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;  // Set to true on success
      state.loading = false;
      state.error = null;
    },
    signinFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    LoggedOut: (state) => {
      state.user = null;
      state.isAuthenticated = false;  // Set to false on logout
      state.loading = false;
      state.error = null;
    },
  },
});
export default userslice.reducer;
export const{signInStart,signinFailure,signinSuccess,LoggedOut}=userslice.actions
