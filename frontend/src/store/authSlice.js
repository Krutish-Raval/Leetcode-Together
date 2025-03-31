import {createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        email: null,
    },
    reducers: {
        login(state, action) {
            state.email = action.payload;
        },
        logout(state) {
            state.email = null;
        },
    }
});

export const {login, logout} = authSlice.actions;

export default authSlice.reducer;