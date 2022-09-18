import { createSlice } from '@reduxjs/toolkit';

export interface FavoriteState {}

const initialState: FavoriteState = {};

const favoriteSlice = createSlice({
	name: 'favorites',
	initialState,
	reducers: {},
});

// Action
export const cartActions = favoriteSlice.actions;

// Reducer
const favoriteReducer = favoriteSlice.reducer;

export default favoriteReducer;
