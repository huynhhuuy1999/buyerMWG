import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CART_ID } from 'constants/';
import cookies from 'js-cookie';
import { getItemsCart } from 'services';
import { RootState } from 'store';
export interface CartState {
	total: number;
	isLoading: boolean;
	hasInitial: boolean;
	variationsActice: {
		variantId: number;
		quantity: number;
	}[];
}

const initialState: CartState = {
	total: 0,
	variationsActice: [],
	isLoading: false,
	hasInitial: false,
};

export const reCheckStatusCart = createAsyncThunk(
	'cart/reCheckStatusCart',
	async (cartId?: string) => {
		const response = await getItemsCart(cartId ?? '');
		const checkCustomerHasEnableWithcart = response?.data?.isCheckNewCart; // revalidate if variables true (set cart id new for users)
		checkCustomerHasEnableWithcart ? cookies.set(CART_ID, response?.data?.cartId) : null;
		return response.data;
	},
);

const cartSlice = createSlice({
	name: 'cart',
	initialState,
	reducers: {
		callbackItems: (state: CartState, action: PayloadAction<number>) => {
			state.total = action.payload;
			state.hasInitial = true;
		},
		isLoading: (state: CartState, action: PayloadAction<boolean>) => {
			state.isLoading = action.payload;
		},
		reset: (state: CartState) => {
			state.total = 0;
			state.hasInitial = false;
			state.variationsActice = [];
		},
		increment: (state: CartState, action: PayloadAction<number>) => {
			state.total = action.payload;
		},
		decrement: (state: CartState) => {
			state.total = state.total - 1;
		},
		pushItems: (
			state: CartState,
			action: PayloadAction<{
				variantId: number;
				quantity: number;
			}>,
		) => {
			if (action.payload.quantity) {
				state.variationsActice = state.variationsActice?.find(
					(ele) => ele?.variantId === action.payload.variantId,
				)
					? state?.variationsActice?.map((ele) => {
							return ele?.variantId === action.payload.variantId
								? {
										quantity: action.payload.quantity,
										variantId: action.payload.variantId,
								  }
								: ele;
					  })
					: [...state.variationsActice, action.payload];
			} else {
				state.variationsActice = state.variationsActice?.filter(
					(ele) => ele?.variantId !== action.payload.variantId,
				);
			}
		},
	},
	extraReducers: (builder) => {
		builder.addCase(reCheckStatusCart.fulfilled, (state, action: PayloadAction<any>) => {
			state.total = action.payload?.cartItems?.reduce((prev: any, curr: any) => {
				return (prev = [...prev, ...curr.items?.filter((k: any) => !k.isDelete)]);
			}, [])?.length;
		});
	},
});

// Action
export const cartActions = cartSlice.actions;

//selector
export const cartSelector = (state: RootState) => state.cart;

// Reducer
const cartReducer = cartSlice.reducer;

export default cartReducer;
