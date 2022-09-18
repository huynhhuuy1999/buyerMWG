import { useAppDispatch, useAppSelector } from 'hooks';
import { Media, QueryParams, RulesComment } from 'models';

import {
	commentAction,
	getCommentDetailS,
	getCustomerHasBuyProduct,
	getTotalComment,
	likeSelector,
	listTotalCommentSelector,
	mediaSelector,
	postCommentBuyer,
	postLikeBuyer,
	postRatingProductBuyer,
	postReportBug,
} from '@/store/reducers/commentSlice';
export const useComment = () => {
	const dispatch = useAppDispatch();

	const totalComment = useAppSelector(listTotalCommentSelector);

	const mediaClone = useAppSelector(mediaSelector);

	const like = useAppSelector(likeSelector);

	const postComment = async (data: RulesComment) => {
		return dispatch(postCommentBuyer(data)).then((resp: any) => resp);
	};

	const postRatingProduct = async (data: any) => {
		return dispatch(postRatingProductBuyer(data)).then((resp: any) => resp);
	};

	const getTotalComments = async (params: QueryParams) => {
		return dispatch(getTotalComment(params)).then((resp: any) => resp);
	};

	const postLike = async (data: QueryParams) => {
		return dispatch(postLikeBuyer(data)).then((resp: any) => resp);
	};

	const getCommentDetail = async (params: QueryParams) => {
		return dispatch(getCommentDetailS(params)).then((resp: any) => resp);
	};

	const postMedia = async (data: Media) => {
		return dispatch(commentAction.setMedia(data));
	};
	const checkCustomerHasBuyProduct = async (data: any) => {
		return dispatch(getCustomerHasBuyProduct(data)).then((resp: any) => resp);
	};

	const postReportError = async (data: any) => {
		return dispatch(postReportBug(data)).then((resp: any) => resp);
	};

	return {
		postComment,
		getTotalComments,
		postLike,
		getCommentDetail,
		postMedia,
		totalComment,
		mediaClone,
		like,
		checkCustomerHasBuyProduct,
		postRatingProduct,
		postReportError,
	};
};
