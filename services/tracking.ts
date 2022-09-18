import { IncomingMessage } from 'http';
import request from 'utils/request';

export const setSearchKeyword = (data: any): Promise<any> => {
	return request({
		url: `/track/searchkeyword`,
		method: 'POST',
		data,
	});
};
export const setSearchSuggestion = (data: any): Promise<any> => {
	return request({
		url: `/track/searchsuggestion`,
		method: 'POST',
		data,
	});
};
export const setSearchResult = (data: any): Promise<any> => {
	return request({
		url: `/track/searchresult`,
		method: 'POST',
		data,
	});
};
export const getHistorySearch = (params: any): Promise<any> => {
	return request({
		url: `/track/keywords/history`,
		method: 'GET',
		params,
	});
};
export const deletedHistorySearch = (data: any): Promise<any> => {
	return request({
		url: `/track/keywords`,
		method: 'DELETE',
		data,
	});
};
export const getSearchTrending = (params: any): Promise<any> => {
	return request({
		url: `/track/keywords/trend`,
		method: 'GET',
		params,
	});
};

export const homeTracking = async (type: number, req?: IncomingMessage): Promise<any> => {
	const res = await request({
		url: `/track/homemodule?typeModule=${type}`,
		method: 'GET',
	});
	return res;
};

export const productTracking = async (id: number, req?: IncomingMessage): Promise<any> => {
	const res = await request({
		url: `/track/product?productID=${id}`,
		method: 'GET',
	});
	return res;
};
