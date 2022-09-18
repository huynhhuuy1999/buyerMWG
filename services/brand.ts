import { QueryParams } from 'models';
import request from 'utils/request';

export const getBrandSuggestApi = (params: QueryParams): Promise<any> => {
	return request({
		url: '/brand/homepage',
		method: 'GET',
		params,
	});
};

export const getBrands = (params: QueryParams): Promise<any> => {
	return request({
		url: '/brand',
		method: 'GET',
		params,
	});
};

export const getBrandRange = (params: number): Promise<any> => {
	return request({
		url: '/brandrangevalue/bycategory/' + params,
		method: 'GET',
	});
};

export const getSuggestedmerchants = ({ ...cateId }: any): Promise<any> => {
	return request({
		url: `/product/suggestedmerchants?sessionId=${cateId}&pageIndex=0&pageSize=9`,

		method: 'GET',
	});
};

export const getBrandAllApi = (): Promise<any> => {
	return request({
		url: '/brand/all',
		method: 'GET',
	});
};
