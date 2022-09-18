import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { QueryParams } from 'models';
import {
	deletedHistorySearch,
	getHistorySearch,
	getSearchTrending,
	setSearchKeyword,
	setSearchResult,
	setSearchSuggestion,
} from 'services';
import { RootState } from 'store';

interface TrackingState {
	isLoading: boolean;
	listHistory: string[];
	listTrend: string[];
}

const initialState: TrackingState = {
	isLoading: false,
	listHistory: [],
	listTrend: [],
};

export const trackingSearchKeywordRequest = createAsyncThunk(
	'track/searchkeyword',
	async (data: QueryParams) => {
		const payload = {
			keyword: data.keyword,
		};
		const response = await setSearchKeyword(payload);
		return response;
	},
);
export const trackingSearchSuggestionRequest = createAsyncThunk(
	'track/searchsuggestion',
	async (data: QueryParams) => {
		const payload = {
			keyword: data.keyword,
		};
		const response = await setSearchSuggestion(payload);
		return response;
	},
);
export const trackingSearchResultRequest = createAsyncThunk(
	'track/searchresult',
	async (data: QueryParams) => {
		const payload = {
			keyword: data.keyword,
		};
		const response = await setSearchResult(payload);
		return response;
	},
);
export const getHistorySearchRequest = createAsyncThunk(
	'/track/keywords/history',
	async (data: QueryParams) => {
		const response = await getHistorySearch(data);
		if (response?.isError) {
			return Promise.reject(response.isError);
		} else {
			return response.data;
		}
	},
);
export const deletedHistorySearchRequest = createAsyncThunk(
	'/track/keywords',
	async (data: QueryParams) => {
		const response = await deletedHistorySearch(data);
		return response;
	},
);
export const getSearchTrendingRequest = createAsyncThunk(
	'/track/keywords/trend',
	async (data: QueryParams) => {
		const response = await getSearchTrending(data);
		if (response?.isError) {
			return Promise.reject(response.isError);
		} else {
			return response.data;
		}
	},
);
const trackingSlice = createSlice({
	name: 'track',
	initialState,
	reducers: {
		fetchListHistorySearch(state, action: PayloadAction<string[]>) {
			state.listHistory = action.payload;
		},
		fetchListTrendingSearch(state, action: PayloadAction<string[]>) {
			state.listTrend = action.payload;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(trackingSearchKeywordRequest.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(trackingSearchKeywordRequest.fulfilled, (state, action: PayloadAction) => {
				state.isLoading = false;
			})
			.addCase(trackingSearchSuggestionRequest.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(trackingSearchSuggestionRequest.fulfilled, (state, action: PayloadAction) => {
				state.isLoading = false;
			})
			.addCase(trackingSearchResultRequest.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(trackingSearchResultRequest.fulfilled, (state, action: PayloadAction) => {
				state.isLoading = false;
			})
			.addCase(getHistorySearchRequest.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(getHistorySearchRequest.fulfilled, (state, action: PayloadAction<string[]>) => {
				state.isLoading = false;
				state.listHistory = action.payload;
			})
			.addCase(deletedHistorySearchRequest.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(deletedHistorySearchRequest.fulfilled, (state, action: PayloadAction) => {
				state.isLoading = false;
			})
			.addCase(getSearchTrendingRequest.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(getSearchTrendingRequest.fulfilled, (state, action: PayloadAction<string[]>) => {
				state.isLoading = false;
				state.listTrend = action.payload;
			});
	},
});

// Action

export const trackAction = trackingSlice.actions;
export const isTrackingSector = (state: RootState) => state.track.isLoading;
export const listHistorySelector = (state: RootState) => state.track.listHistory;
export const listTrendSelector = (state: RootState) => state.track.listTrend;
// Reducer
const trackingReducer = trackingSlice.reducer;
export default trackingReducer;
