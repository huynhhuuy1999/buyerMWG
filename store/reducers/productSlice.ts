import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ProductViewES } from 'models';
import { RootState } from 'store';

interface SessionId {
	bestSeller_first: string;
	bestSeller_second: string;
	dealShock: string;
	recommend: string;
	trending: string;
	interest: string;
	unique: string;
}

interface ProductSlice {
	newProducts: ProductViewES[];
	pageIndex: number;
	sessionId: SessionId;
}

const initialState: ProductSlice = {
	newProducts: [],
	pageIndex: 0,
	sessionId: {
		bestSeller_first: '',
		bestSeller_second: '',
		dealShock: '',
		recommend: '',
		trending: '',
		interest: '',
		unique: '',
	},
};

const productSlice = createSlice({
	name: 'products',
	initialState: initialState,
	reducers: {
		setNewProducts: (state: ProductSlice, action: PayloadAction<any>) => {
			state.newProducts = [...state.newProducts, ...action.payload.products];
		},
		setPageIndex: (state: ProductSlice, action: PayloadAction<any>) => {
			state.pageIndex = action.payload;
		},
		setSessionId: (state: ProductSlice, action: PayloadAction<any>) => {
			state.sessionId = { ...state.sessionId, ...action.payload };
		},
	},
});

// Action
export const productActions = productSlice.actions;

// Selector
export const newProductsSelector = (state: RootState) => state.products.newProducts;
export const pageIndex = (state: RootState) => state.products.pageIndex;
export const sessionIdSelector = (state: RootState) => state.products.sessionId;

// Reducer
const products = productSlice.reducer;

export default products;
