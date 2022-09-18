import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Province } from 'models';
import { getProvinceListApi } from 'services';

export interface CommonState {
	isLoading: boolean;
	provinceList: Province[];
	categoryList: any[];
}

const initialState: CommonState = {
	isLoading: false,
	provinceList: [],
	categoryList: [],
};

export const fetchProvinceList = createAsyncThunk('common/fetchProvinceList', async () => {
	const response = await getProvinceListApi();

	return response.data;
});

export const commonSlice = createSlice({
	name: 'common',
	initialState,
	reducers: {
		setCategoryList(state, action: PayloadAction<any>) {
			state.categoryList = action.payload;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchProvinceList.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(fetchProvinceList.fulfilled, (state, action) => {
				state.isLoading = false;
				state.provinceList = action.payload;
			})
			.addCase(fetchProvinceList.rejected, (state) => {
				state.isLoading = false;
			});
	},
});

export const commonActions = commonSlice.actions;

const reducers = commonSlice.reducer;

export default reducers;
