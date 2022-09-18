import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getBrandAllApi } from 'services';

import { Brand } from '@/modules/brands';

import { RootState } from '..';

export interface BrandState {
	listAll?: Array<typeof Brand>;
	isLoading?: boolean;
}

const initialState: BrandState = {
	listAll: [],
	isLoading: false,
};

export const getAllBrandRequest = createAsyncThunk('/brand/all', async () => {
	const response = await getBrandAllApi();
	if (response?.error) {
		return Promise.reject(response.error);
	}
	return response.data;
});

const brandSlice = createSlice({
	name: 'brand',
	initialState,
	reducers: {
		setListAllBrand(state, action: PayloadAction<Array<typeof Brand>>) {
			state.listAll = action.payload;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(getAllBrandRequest.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(
				getAllBrandRequest.fulfilled,
				(state, action: PayloadAction<Array<typeof Brand>>) => {
					state.isLoading = false;
					state.listAll = action.payload;
				},
			)
			.addCase(getAllBrandRequest.rejected, (state) => {
				state.isLoading = false;
			});
	},
});

//Action
export const brandActions = brandSlice.actions;

// Reducer
const brandReducer = brandSlice.reducer;

// Selector
export const listAllBrandSelector = (state: RootState) => state.brand.listAll;
export const isLoadingBrandSelector = (state: RootState) => state.brand.isLoading;

export default brandReducer;
