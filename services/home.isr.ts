import { fetchingDataStatic } from 'utils/request-staticprops';
// import { IncomingMessage } from 'http';
// import request from 'utils/request';
import { QueryParams } from 'models';
// import request from 'utils/request';
// import { request } from 'utils/requestServer';
// import httpProxy from 'http-proxy';

// const proxy = httpProxy.createProxyServer();

export const getHomeCategory = async (headers: any): Promise<any> => {
	const res = await fetchingDataStatic({
		url: '/category/homesuggestion',
		method: 'GET',
		configs: {
			headers,
		},
	});
	return res;
};

export const getCategorySuggestion = async (headers: any): Promise<any> => {
	const res = await fetchingDataStatic({
		url: '/category/homesuggestion',
		method: 'GET',
		configs: {
			headers,
		},
	});
	return res;
};

export const getHomeProductSuggest = async (params: QueryParams, headers: any): Promise<any> => {
	// console.log('headers', headers);

	const res = await fetchingDataStatic({
		method: 'GET',
		url: `/product/homesuggestion?pageIndex=${params.pageIndex}&pageSize=${params.pageSize}`,

		configs: {
			headers,
		},
	});
	return res.data;
};

export const getHomeProductNewestAPI = async (params: QueryParams, headers: any): Promise<any> => {
	const res = await fetchingDataStatic({
		method: 'GET',
		url: `/product/homenew?pageIndex=${params.pageIndex}&pageSize=${params.pageSize}`,

		configs: {
			headers,
		},
	});
	return res.data;
};

export const getSuggestProductFeature = async (params: QueryParams, headers: any): Promise<any> => {
	const res = await fetchingDataStatic({
		method: 'GET',
		url: `/product/homefeature?pageIndex=${params.pageIndex}&pageSize=${params.pageSize}`,
		configs: {
			headers,
		},
	});

	return {
		loading: !res.data,
		data: res,
	};
};

export const getHomeProductFeature = async (params: QueryParams, headers: any): Promise<any> => {
	const res = await fetchingDataStatic({
		url: `/product/homefeature?pageIndex=${params.pageIndex}&pageSize=${params.pageSize}`,
		method: 'GET',

		configs: {
			headers,
		},
	});
	return res.data;
};

export const getHomeProductBestSell = async (params: QueryParams, headers: any): Promise<any> => {
	const res = await fetchingDataStatic({
		url: `/product/homebestsell?pageIndex=${params.pageIndex}&pageSize=${params.pageSize}`,
		method: 'GET',

		configs: {
			headers,
		},
	});
	return res.data;
};

export const getHomeProductPromotion = async (params: QueryParams, headers: any): Promise<any> => {
	const res = await fetchingDataStatic({
		url: `/product/homepromotion?pageIndex=${params.pageIndex}&pageSize=${params.pageSize}`,
		method: 'GET',

		configs: {
			headers,
		},
	});
	return res.data;
};

export const getHomeProductDeal = async (params: QueryParams, headers: any): Promise<any> => {
	const res = await fetchingDataStatic({
		url: `/product/homedeal?pageIndex=${params.pageIndex}&pageSize=${params.pageSize}`,
		method: 'GET',

		configs: {
			headers,
		},
	});
	return res.data;
};

export const getHomeProductUnique = async (params: QueryParams, headers: any): Promise<any> => {
	const res = await fetchingDataStatic({
		url: `/product/homeunique?pageIndex=${params.pageIndex}&pageSize=${params.pageSize}`,
		method: 'GET',

		configs: {
			headers,
		},
	});
	return res.data;
};

export const getHomeBrand = async (headers: any): Promise<any> => {
	const res = await fetchingDataStatic({
		url: '/brand/homepage',
		method: 'GET',
		configs: {
			headers,
		},
	});
	return res;
};

export const getHomeService = async (headers: any): Promise<any> => {
	const res = await fetchingDataStatic({
		url: 'category/service',
		method: 'GET',
		configs: {
			headers,
		},
	});
	return res;
};

export const getHomeBanner = async (headers: any): Promise<any> => {
	const res = await fetchingDataStatic({
		url: 'banner/all',
		method: 'GET',
		configs: {
			headers,
		},
	});
	return res;
};

///csr
export const getHomeProductNew = async (params: QueryParams, headers: any): Promise<any> => {
	const res = await fetchingDataStatic({
		method: 'GET',
		url: `/product/homenew?pageIndex=${params.pageIndex}&pageSize=${params.pageSize}`,
		configs: {
			headers,
		},
	});

	return {
		loading: !res.data,
		data: res,
	};
};
