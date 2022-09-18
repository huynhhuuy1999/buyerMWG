import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Breadcrumb } from 'models';
import { RootState } from 'store';

interface StateProductDetail {
	id: number;
	productBreadcrumb?: Breadcrumb | null;
}

const initialState: StateProductDetail = {
	id: 0,
	productBreadcrumb: null,
};

const productDetailSlice = createSlice({
	name: 'productDetail',
	initialState: initialState,
	reducers: {
		onHoverImage: (state: any, action: PayloadAction<number>) => {
			state.id = action.payload;
		},
		clearImage: (state: any, action: PayloadAction<number>) => {
			state.id = action?.payload > 0 ? action.payload : null;
		},
		setProductBreadcrumb: (state, action: PayloadAction<Breadcrumb>) => {
			state.productBreadcrumb = action.payload;
		},
	},
});

// Action
export const productDetailActions = productDetailSlice.actions;

// Selector
export const productDetailSelector = (state: RootState) => state.productDetail.id;

export const productBreadcrumbSelector = (state: RootState) =>
	state.productDetail.productBreadcrumb;

// Reducer
const productDetailReducer = productDetailSlice.reducer;

export default productDetailReducer;
