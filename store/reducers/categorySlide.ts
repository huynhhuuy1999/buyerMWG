import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CategoryViewModel } from 'models';
import { Category } from 'modules';
import { getAllCategoryApi, getCatalog, getCategorySuggestion } from 'services';

import { RootState } from '..';

export interface BrandState {
	listAll?: Array<typeof Category>;
	catalog?: Array<typeof Category>;
	catalogList: CategoryViewModel[];
	catalogSearchSuggestion: CategoryViewModel[];
	catalogSuggestion?: CategoryViewModel | null;
	shortenAll?: Array<{ id: string | number; value: string; name: string }>;
	version: number;
}

const initialState: BrandState = {
	listAll: [],
	catalog: [],
	catalogList: [],
	shortenAll: [],
	catalogSearchSuggestion: [],
	version: 0,
	catalogSuggestion: null,
	//  isLoading: false,
};

export const getAllCategoryRequest = createAsyncThunk('/category/all', async () => {
	let responseListAllCategory = await getAllCategoryApi();

	if (responseListAllCategory?.error) {
		return Promise.reject(responseListAllCategory.error);
	} else {
		return responseListAllCategory.data;
	}
});

export const getCatalogRequest = createAsyncThunk('/category/hierachy', async () => {
	let responseCatalog = await getCatalog();
	if (responseCatalog?.error) {
		return Promise.reject(responseCatalog.error);
	} else {
		return responseCatalog.data;
	}
});

export const fetchCatalogSuggestionRequest = createAsyncThunk(
	'/category/homesuggestion',
	async () => {
		let res = await getCategorySuggestion();
		if (res?.isError) {
			return Promise.reject(res);
		} else {
			return res.data;
		}
	},
);

const categorySlice = createSlice({
	name: 'category',
	initialState,
	reducers: {
		setAllCategory(state, action: PayloadAction<any>) {
			state.listAll = action.payload?.data;
			state.shortenAll = action.payload?.data?.map((item: CategoryViewModel) => {
				return {
					id: item?.id,
					value: item?.urlSlug,
					name: item?.name,
				};
			});
		},
		setCatalog(state, action: PayloadAction<any>) {
			state.catalog = action.payload;
		},
		setCatalogMenu(state, action: PayloadAction<any>) {
			state.catalogList = action.payload;
		},
		setVersion(state, action: PayloadAction<any>) {
			state.version = action.payload;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(getCatalogRequest.fulfilled, (state, action: PayloadAction<Array<any>>) => {
				state.catalog = action.payload;
				state.catalogList = action.payload;
			})
			.addCase(
				getAllCategoryRequest.fulfilled,
				(state, action: PayloadAction<Array<typeof Category> | any>) => {
					state.listAll = action.payload;
					state.shortenAll = action.payload?.map((item: CategoryViewModel) => {
						return {
							id: item?.id,
							value: item?.urlSlug,
							name: item?.name,
						};
					});
				},
			)
			.addCase(
				fetchCatalogSuggestionRequest.fulfilled,
				(state, action: PayloadAction<Array<typeof Category> | any>) => {
					const { categorySuggestion } = action.payload;
					state.catalogSearchSuggestion = categorySuggestion?.children?.[0].children || [];
					state.catalogSuggestion = categorySuggestion || {};
				},
			);
	},
});

//Action
export const categoryActions = categorySlice.actions;

// Reducer
const categoryReducer = categorySlice.reducer;

// Selector
export const listAllCategorySelector = (state: RootState) => state.category.listAll;
export const listCatalogSelector = (state: RootState) => state.category.catalog;
export const shortenAllSelector = (state: RootState) => state.category.shortenAll;
export const versionCategorySelector = (state: RootState) => state.category.version;
export const catalogListSelector = (state: RootState) => state.category.catalogList;
export const catalogSuggestionSelector = (state: RootState) => state.category.catalogSuggestion;
export const categoriesSelector = (state: RootState) => state.category;
export const catalogSearchSuggestionSelector = (state: RootState) =>
	state.category.catalogSearchSuggestion;

export default categoryReducer;
