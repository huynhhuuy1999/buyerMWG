import { QueryParams, RulesComment } from 'models';
import request from 'utils/request';

export const postComment = (data: RulesComment): Promise<any> => {
	return request({
		url: '/comment',
		method: 'POST',
		data,
	});
};

export const postRatingProduct = (data: any): Promise<any> => {
	return request({
		url: '/rating',
		method: 'POST',
		data,
	});
};

export const postReportError = (data: any): Promise<any> => {
	return request({
		url: '/logging/reportbug',
		method: 'POST',
		data,
	});
};

export const getCommentById = (id: RulesComment): Promise<any> => {
	return request({
		url: `/comment/${id}`,
		method: 'GET',
	});
};

export const getComment = (
	productId: number,
	pageIndex: number = 0,
	pageSize: number = 0,
): Promise<any> => {
	return request({
		url: `/rating/${productId}/${pageIndex}/${pageSize}`,
		method: 'GET',
	});
};

export const getCommentDetail = (params: QueryParams): Promise<any> => {
	return request({
		url: '/comment',
		method: 'GET',
		params,
	});
};

export const checkCustomerHasBuyProduct = (data: any): Promise<any> => {
	return request({
		url: `/order/customer/product/isbought`,
		method: 'POST',
		data,
	});
};

export const postLike = (data: any): Promise<any> => {
	return request({
		url: '/comment/like',
		method: 'POST',
		data,
	});
};
