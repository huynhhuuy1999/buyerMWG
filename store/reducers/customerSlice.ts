import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
	cancelListOrderEvalution,
	getListCancelOrder,
	getListOrderEvalution,
	updateListOrderEvalution,
} from 'services';
import { RootState } from 'store';

import { CancelOrderReason, Customer, CustomerCancel, QueryParams } from '@/models/customer';
export interface CustomerState {
	isLoading: boolean;
	listOrderEvalution: any;
	listUpdateEvalution: Customer[];
	listCancelEvalution: Customer[];
	dataModal: any;
	listMediaSelected: any;
	totalObject?: any;
	cancelOrders?: CancelOrderReason[];
	isRetryPayment?: boolean;
}

const initialState: CustomerState = {
	isLoading: false,
	listOrderEvalution: {},
	listUpdateEvalution: [],
	listCancelEvalution: [],
	dataModal: {},
	listMediaSelected: {},
	totalObject: 0,
	cancelOrders: [],
	isRetryPayment: false,
};

export const getListOrderEvalutions = createAsyncThunk(
	'waitinglist',
	async (params: QueryParams) => {
		const { pageIndex = 0, pageSize = 0 } = params;
		const response = await getListOrderEvalution(pageIndex, pageSize);
		if (response?.isError) {
			return Promise.reject(response.error);
		} else {
			return response;
		}
	},
);

export const updateListOrderEvalutions = createAsyncThunk(
	'rating/waitinglist',
	async (data: Customer) => {
		const response = await updateListOrderEvalution(data);
		if (response?.isError) {
			return Promise.reject(response.error);
		} else {
			return response.data;
		}
	},
);

export const getCancelOrder = createAsyncThunk('orders/cancelOrders', async () => {
	const response = await getListCancelOrder();
	if (response?.isError) {
		return Promise.reject(response.error);
	} else {
		return response.data;
	}
});

export const cancelListOrderEvalutions = createAsyncThunk(
	'rating/waitinglist/cancel',
	async (data: CustomerCancel) => {
		const response = await cancelListOrderEvalution(data);
		if (response?.isError) {
			return Promise.reject(response.error);
		} else {
			return response;
		}
	},
);
export const customerSlice = createSlice({
	name: 'customer',
	initialState,
	reducers: {
		setListOrderEvalution(state, action: PayloadAction<any, any>) {
			state.isLoading = true;
			state.listOrderEvalution = action.payload;
		},
		setRetryPayment(state, action: PayloadAction<boolean>) {
			state.isRetryPayment = action.payload;
		},
		setDataModal(state, action: PayloadAction<QueryParams>) {
			state.dataModal = action.payload;
			state.isLoading = true;
		},
		setListMediaSelected(state, action: PayloadAction<QueryParams>) {
			state.listMediaSelected = action.payload;
			state.isLoading = true;
		},
	},
	extraReducers: (builder) => {
		builder
			//get list
			.addCase(getListOrderEvalutions.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(getListOrderEvalutions.fulfilled, (state, action: PayloadAction<any, any>) => {
				state.isLoading = false;
				state.listOrderEvalution = { ...action.payload };
			})
			.addCase(getListOrderEvalutions.rejected, (state) => {
				state.isLoading = false;
			})
			//get list cancel order reason
			.addCase(getCancelOrder.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(getCancelOrder.fulfilled, (state, action: PayloadAction<any, any>) => {
				state.isLoading = false;
				state.cancelOrders = action.payload;
			})
			.addCase(getCancelOrder.rejected, (state) => {
				state.isLoading = false;
			})
			// update
			.addCase(updateListOrderEvalutions.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(updateListOrderEvalutions.fulfilled, (state, action: PayloadAction<any>) => {
				state.isLoading = false;
				state.listUpdateEvalution = action.payload;
			})
			.addCase(updateListOrderEvalutions.rejected, (state) => {
				state.isLoading = false;
			})

			// cancel
			.addCase(cancelListOrderEvalutions.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(cancelListOrderEvalutions.fulfilled, (state, action: PayloadAction<any>) => {
				state.isLoading = false;
				state.listCancelEvalution = action.payload;
			})
			.addCase(cancelListOrderEvalutions.rejected, (state) => {
				state.isLoading = false;
			});
	},
});

export const customerAction = customerSlice.actions;

export const listMediaSelector = (state: RootState) => state.customer.listMediaSelected;

export const dataModalSelector = (state: RootState) => state.customer.dataModal;

export const retryPaymentCustomerSelector = (state: RootState) => state.customer.isRetryPayment;

export const listCancelOrderSelector = (state: RootState) => state.customer.cancelOrders;

export const listOrderEvalutionSelector = (state: RootState) => state.customer.listOrderEvalution;

export const updateListOrderEvalutionSelector = (state: RootState) =>
	state.customer.listUpdateEvalution;

export const cancelListOrderEvalutionSelector = (state: RootState) =>
	state.customer.listCancelEvalution;

const customerReducer = customerSlice.reducer;

export default customerReducer;
