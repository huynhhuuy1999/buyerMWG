import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Media, QueryParams, RulesComment, RulesDataComment } from 'models';
import { RootState } from 'store';

import {
	checkCustomerHasBuyProduct,
	getComment,
	getCommentById,
	getCommentDetail,
	postComment,
	postLike,
	postRatingProduct,
	postReportError,
} from '@/services/comment';

export interface CommentState {
	isLoading: boolean;
	postComment: RulesComment;
	commentDetailById: RulesComment;
	commentDetail: RulesComment[];
	listTotalComment: RulesComment;
	data: RulesDataComment[];
	listMedia: Media;
	dataLike: RulesComment;
	statusProductId: any;
	postRating: any;
	reportBug: any;
}

const initialState: CommentState = {
	isLoading: false,
	postComment: {},
	postRating: {},
	commentDetailById: {},
	commentDetail: [],
	listTotalComment: {},
	data: [],
	listMedia: { key: '', media: [] },
	dataLike: {},
	statusProductId: null,
	reportBug: null,
};
export const postLikeBuyer = createAsyncThunk('commentlike', async (data: any) => {
	const resp: any = await postLike(data);
	if (resp?.isError) {
		return Promise.reject(resp.error);
	} else {
		return resp.data;
	}
});

export const postCommentBuyer = createAsyncThunk('postcomment', async (data: RulesComment) => {
	const response: any = await postComment(data);
	if (response?.isError) {
		return Promise.reject(response.error);
	} else {
		return response.data;
	}
});

export const postReportBug = createAsyncThunk('postReportBug', async (data: any) => {
	const response: any = await postReportError(data);
	if (response?.isError) {
		return Promise.reject(response.error);
	} else {
		return response;
	}
});

export const postRatingProductBuyer = createAsyncThunk('postRating', async (data: any) => {
	const response: any = await postRatingProduct(data);
	if (response?.isError) {
		return Promise.reject(response.error);
	} else {
		return response.data;
	}
});

export const getCommentByIdDetail = createAsyncThunk('getcommentbyid', async (id: RulesComment) => {
	const response: any = await getCommentById(id);
	if (response?.isError) {
		return Promise.reject(response.error);
	} else {
		return response.data;
	}
});

export const getCommentDetailS = createAsyncThunk(
	'getcommentdetail',
	async (params: QueryParams) => {
		const response: any = await getCommentDetail(params);
		if (response?.isError) {
			return Promise.reject(response.error);
		} else {
			return response.data;
		}
	},
);
export const getTotalComment = createAsyncThunk('gettotalcomment', async (params: QueryParams) => {
	const { productId = 0, pageIndex = 0, pageSize = 0 } = params;
	const response: any = await getComment(productId, pageIndex, pageSize);
	if (response?.isError) {
		return Promise.reject(response.error);
	} else {
		return response.data;
	}
});

export const getCustomerHasBuyProduct = createAsyncThunk(
	'checkCustomerHasBuyProduct',
	async (data: any) => {
		const response: any = await checkCustomerHasBuyProduct(data);
		if (response?.isError) {
			return Promise.reject(response.error);
		} else {
			return response.data;
		}
	},
);
export const commentSlice = createSlice({
	name: 'comment',
	initialState,
	reducers: {
		setDataRender(state, action: PayloadAction<any>) {
			state.data = [...action.payload, ...state.data];
			state.isLoading = true;
		},
		setMedia(state, action: PayloadAction<any>) {
			state.listMedia = action.payload;
			state.isLoading = true;
		},
	},

	extraReducers: (builder) => {
		builder
			.addCase(postCommentBuyer.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(postCommentBuyer.fulfilled, (state, action: PayloadAction<any>) => {
				state.isLoading = false;
				state.postComment = action.payload;
			})
			.addCase(postCommentBuyer.rejected, (state) => {
				state.isLoading = false;
			})
			//rating
			.addCase(postRatingProductBuyer.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(postRatingProductBuyer.fulfilled, (state, action: PayloadAction<any>) => {
				state.isLoading = false;
				state.postRating = action.payload;
			})
			.addCase(postRatingProductBuyer.rejected, (state) => {
				state.isLoading = false;
			})
			//reportbug
			.addCase(postReportBug.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(postReportBug.fulfilled, (state, action: PayloadAction<any>) => {
				state.isLoading = false;
				state.reportBug = action.payload;
			})
			.addCase(postReportBug.rejected, (state) => {
				state.isLoading = false;
			})
			//
			.addCase(getCommentByIdDetail.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(getCommentByIdDetail.fulfilled, (state, action: PayloadAction<any>) => {
				state.isLoading = false;
				state.commentDetail = action.payload;
			})
			.addCase(getCommentByIdDetail.rejected, (state) => {
				state.isLoading = false;
			})

			.addCase(getTotalComment.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(getTotalComment.fulfilled, (state, action: PayloadAction<any, any, any>) => {
				state.isLoading = false;
				state.listTotalComment = action.payload;
			})
			.addCase(getTotalComment.rejected, (state) => {
				state.isLoading = false;
			})

			.addCase(getCommentDetailS.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(getCommentDetailS.fulfilled, (state, action: PayloadAction<any>) => {
				state.isLoading = false;
				state.commentDetail = action.payload;
			})
			.addCase(getCommentDetailS.rejected, (state) => {
				state.isLoading = false;
			})

			.addCase(postLikeBuyer.pending, (state) => {
				state.isLoading = false;
			})
			.addCase(postLikeBuyer.fulfilled, (state, action: PayloadAction<any>) => {
				state.isLoading = false;
				state.dataLike = action.payload;
			})
			.addCase(postLikeBuyer.rejected, (state) => {
				state.isLoading = false;
			})

			.addCase(getCustomerHasBuyProduct.pending, (state) => {
				state.isLoading = false;
			})
			.addCase(getCustomerHasBuyProduct.fulfilled, (state, action: PayloadAction<any>) => {
				state.isLoading = false;
				state.statusProductId = action.payload;
			})
			.addCase(getCustomerHasBuyProduct.rejected, (state) => {
				state.isLoading = false;
			});
	},
});

export const commentAction = commentSlice.actions;

export const likeSelector = (state: RootState) => state.comment.dataLike;

export const mediaSelector = (state: RootState) => state.comment.listMedia;

export const commentDetailSelector = (state: RootState) => state.comment.commentDetail;

export const listCommentByIdSelector = (state: RootState) => state.comment.commentDetailById;

export const listTotalCommentSelector = (state: RootState) => state.comment.listTotalComment;

export const dataRenderSelector = (state: RootState) => state.comment.data;

const commentReducer = commentSlice.reducer;

export default commentReducer;
