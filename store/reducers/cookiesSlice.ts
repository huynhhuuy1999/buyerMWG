import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DeviceType } from 'enums';
import { CategoryViewModel, ILocation, ShowCatalog } from 'models';
import { RootState } from 'store';

export interface CookiesState {
	cookies: any;
}

const initialState: CookiesState = {
	cookies: {},
};

const cookiesSlice = createSlice({
	name: 'cookies',
	initialState,
	reducers: {
		setCookie(state, action: PayloadAction<any>) {
			state.cookies = action.payload;
		},
	},
});

// Action
export const cookiesActions = cookiesSlice.actions;
export const cookiesSelector = (state: RootState) => state.cookies.cookies;
// Reducer
const cookiesReducer = cookiesSlice.reducer;

export default cookiesReducer;
