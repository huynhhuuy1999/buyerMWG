import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from 'store';

export interface CounterState {
	value: number;
}

const initialState: CounterState = {
	value: 1,
};

const counterSlice = createSlice({
	name: 'counter',
	initialState,
	reducers: {
		increment(state) {
			state.value = state.value + 1;
		},
		decrement: (state) => {
			state.value = state.value - 1;
		},
		incrementByAmount: (state, action: PayloadAction<number>) => {
			state.value += action.payload;
		},
	},
});

// Action
export const counterActions = counterSlice.actions;

// Selector
export const valueSelector = (state: RootState) => state.counter.value;

// Reducer
const counterReducer = counterSlice.reducer;

export default counterReducer;
