import {createSlice, current} from '@reduxjs/toolkit';

const initialState = {
    allComments: null,
    error: null,
    loading: false,
    commentError: null,
    commentLoading: false,
    messg: false,
};

const commentSlice = createSlice({
    name: 'comment',
    initialState,
    reducers: {
        setMessg: (state) => {
            state.messg = !state.messg;
        },
        getCommentsStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        getCommentsSuccess: (state, action) => {
            state.allComments = action.payload;
            state.loading = false;
            state.error = null;
        },
        getCommentsFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        commentStart: (state) => {
            state.commentLoading = true;
            state.commentError = null;
        },
        commentsSuccess: (state, action) => {
            state.allComments = [...state.allComments, action.payload];
            state.commentLoading = false;
            state.commentError = null;
        },
        commentsFailure: (state, action) => {
            state.commentLoading = false;
            state.commentError = action.payload;
        },
        setCommentsNull: (state) =>{
            state.commentLoading = false;
            state.commentError = null;
            state.allComments = null;
        }
    },
});

export const {
    getCommentsFailure,
    getCommentsStart,
    getCommentsSuccess,
    commentStart,
    commentsFailure,
    commentsSuccess,
    setCommentsNull,
    setMessg,
} = commentSlice.actions;

export default commentSlice.reducer;