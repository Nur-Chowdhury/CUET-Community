import {createSlice, current} from '@reduxjs/toolkit';

const initialState = {
    currentUser: null,
    error: null,
    loading: false,
    receiver: undefined,
}; 

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setReceiver: (state, action) => {
            state.receiver = action.payload;
        },
        unsetReceiver: (state) => {
            state.receiver = undefined;
        },
        updateCurrentUserContacts: (state, action) => {
            if (state.currentUser) {
                state.currentUser.contactList = action.payload;
            }
        },
        signInStart: (state) => {
            state.loading = true; 
            state.error = null;
        },
        signInSuccess: (state, action) => {
            state.currentUser = action.payload;
            state.loading = false;
            state.error = null;
        },
        signInFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        updateStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        updateSuccess: (state, action) => {
            state.currentUser = action.payload;
            state.loading = false;
            state.error = null;
        },
        updateFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        signoutSuccess: (state) => {
            state.currentUser = null;
            state.loading = false;
            state.error = null;
        },
    },
});

export const {
    signInFailure,
    signInStart,
    signInSuccess,
    signoutSuccess,
    updateStart,
    updateSuccess,
    updateFailure,
    setReceiver,
    unsetReceiver,
    updateCurrentUserContacts,
} = userSlice.actions;

export default userSlice.reducer;