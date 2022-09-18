import { IncomingMessage } from 'http';
// import request from 'utils/request';
import { QueryParams } from 'models';
import request from 'utils/request';
import { fetchingDataServer } from 'utils/requestServer';
// import httpProxy from 'http-proxy';

// const proxy = httpProxy.createProxyServer();

export const getHomeCategory = async (req?: IncomingMessage): Promise<any> => {
	const res = await fetchingDataServer({
		url: '/category/homesuggestion',
		method: 'GET',
		configs: {
			req,
		},
	});
	return res;
};

export const getCategorySuggestion = async (req?: IncomingMessage): Promise<any> => {
	const res = await request({
		url: '/category/homesuggestion',
		method: 'GET',
	});
	return res;
};

export const getHomeProductSuggest = async (
	params: QueryParams,
	req?: IncomingMessage,
): Promise<any> => {
	const res = await fetchingDataServer({
		method: 'GET',
		url: `/product/homesuggestion?pageIndex=${params.pageIndex}&pageSize=${params.pageSize}`,
		configs: {
			req,
			params: params,
		},
	});
	return res.data;
};

export const getProductSuggest = async (
	params: QueryParams,
	req?: IncomingMessage,
): Promise<any> => {
	const res = await fetchingDataServer({
		method: 'GET',
		url: `/product/homesuggestion?pageIndex=${params.pageIndex}&pageSize=${params.pageSize}`,
		configs: {
			req,
			params: params,
		},
	});
	return res;
};

export const getHomeProductNewestAPI = async (
	params: QueryParams,
	req?: IncomingMessage,
): Promise<any> => {
	const res = await fetchingDataServer({
		method: 'GET',
		url: `/product/homenew?pageIndex=${params.pageIndex}&pageSize=${params.pageSize}`,
		configs: {
			req,
			params: params,
		},
	});
	return res.data;
};

export const getSuggestProductFeature = async (params: QueryParams): Promise<any> => {
	const res = await request({
		method: 'GET',
		url: `/product/homefeature?pageIndex=${params.pageIndex}&pageSize=${params.pageSize}`,
	});

	return {
		loading: !res.data,
		data: res,
	};
};

export const getHomeProductFeature = async (
	params: QueryParams,
	req?: IncomingMessage,
): Promise<any> => {
	const res = await fetchingDataServer({
		url: `/product/homefeature?pageIndex=${params.pageIndex}&pageSize=${params.pageSize}`,
		method: 'GET',
		configs: {
			req,
			params: params,
		},
	});
	return res.data;
};

export const getHomeProductBestSell = async (
	params: QueryParams,
	req?: IncomingMessage,
): Promise<any> => {
	const res = await fetchingDataServer({
		url: `/product/homebestsell?pageIndex=${params.pageIndex}&pageSize=${params.pageSize}`,
		method: 'GET',
		configs: {
			req,
			params: params,
		},
	});
	return res.data;
};

export const getHomeProductPromotion = async (
	params: QueryParams,
	req?: IncomingMessage,
): Promise<any> => {
	const res = await fetchingDataServer({
		url: `/product/homepromotion?pageIndex=${params.pageIndex}&pageSize=${params.pageSize}`,
		method: 'GET',
		configs: {
			req,
			params: params,
		},
	});
	return res.data;
};

export const getHomeProductDeal = async (
	params: QueryParams,
	req?: IncomingMessage,
): Promise<any> => {
	const res = await fetchingDataServer({
		url: `/product/homedeal?pageIndex=${params.pageIndex}&pageSize=${params.pageSize}`,
		method: 'GET',
		configs: {
			req,
			params: params,
		},
	});
	return res.data;
};

export const getHomeProductUnique = async (
	params: QueryParams,
	req?: IncomingMessage,
): Promise<any> => {
	const res = await fetchingDataServer({
		url: `/product/homeunique?pageIndex=${params.pageIndex}&pageSize=${params.pageSize}`,
		method: 'GET',
		configs: {
			req,
			params: params,
		},
	});
	return res.data;
};

export const getHomeBrand = async (req?: IncomingMessage): Promise<any> => {
	const res = await fetchingDataServer({
		url: '/brand/homepage',
		method: 'GET',
		configs: {
			req,
		},
	});
	return res;
};

export const getHomeService = async (req?: IncomingMessage): Promise<any> => {
	const res = await fetchingDataServer({
		url: 'category/service',
		method: 'GET',
		configs: {
			req,
		},
	});
	return res;
};

export const getHomeBanner = async (req?: IncomingMessage): Promise<any> => {
	const res = await fetchingDataServer({
		url: 'banner/all',
		method: 'GET',
		configs: {
			req,
		},
	});
	return res;
};

///csr
export const getHomeProductNew = async (params: QueryParams): Promise<any> => {
	const res = await request({
		method: 'GET',
		url: `/product/homenew?pageIndex=${params.pageIndex}&pageSize=${params.pageSize}`,
	});

	return {
		loading: !res.data,
		data: res,
	};
};
