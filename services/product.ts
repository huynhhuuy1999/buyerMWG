import { IncomingMessage } from 'http';
import { ParamLikeProduct, ParamSearchProduct, QueryParams } from 'models';
import request from 'utils/request';
import { fetchingDataServer } from 'utils/requestServer';

export const getProductUnique = (): Promise<any> => {
	return request({
		url: '/product/homeunique',
		method: 'GET',
	});
};

export const getProductNewestAPI = (params: QueryParams): Promise<any> => {
	return request({
		url: '/product/homenew',
		method: 'GET',
		params,
	});
};

export const getProductFeature = (params: QueryParams): Promise<any> => {
	return request({
		url: '/product/homefeature',
		method: 'GET',
		params,
	});
};

export const getProductBestSell = (params: QueryParams): Promise<any> => {
	return request({
		url: '/product/homebestsell',
		method: 'GET',
		params,
	});
};

export const getProductPromotion = (params: QueryParams): Promise<any> => {
	return request({
		url: '/product/homepromotion',
		method: 'GET',
		params,
	});
};

export const getProductDeal = (params: QueryParams): Promise<any> => {
	return request({
		url: '/product/homedeal',
		method: 'GET',
		params,
	});
};

export const getProductDetailsApi = (id: number): Promise<any> => {
	return request({
		url: `/product/${id}/detail`,
		method: 'GET',
	});
};

export const getProductSearchApi = async (params: ParamSearchProduct, req?: IncomingMessage) => {
	let ids = '';
	const newParams: any = Object.assign({}, params);

	Object.keys(newParams).map((key) => {
		if (Array.isArray(params[key])) {
			params[key].forEach((item: any) => {
				ids += `${key}=${encodeURIComponent(item)}&`;
			});

			delete newParams[key];
		}
	});

	const res = await fetchingDataServer({
		url: `/product/search?${ids}`,
		method: 'GET',
		configs: {
			req,
			params: params,
		},
	}).then((result) => result);
	return res;
};

export const getSearchAggregation = (params: ParamSearchProduct) => {
	let ids = '';
	const newParams: any = Object.assign({}, params);

	Object.keys(newParams).map((key) => {
		if (Array.isArray(params[key])) {
			params[key].forEach((item: any, index: number, array: any) => {
				ids += `${key}=${encodeURIComponent(item)}&`;
			});

			delete newParams[key];
		}
	});

	return request({
		url: `/product/searchaggregation?${ids}`,
		method: 'GET',
		params: newParams,
	});
};
export const getProductSimilar = (id: number): Promise<any> => {
	return request({
		url: `/product/similar/${id}`,
		method: 'GET',
	});
};
export const getProductAlsoView = (id: number): Promise<any> => {
	return request({
		url: `/product/alsoview/${id}`,
		method: 'GET',
	});
};

export const getVariationsProductDetail = (
	idProduct: number,
	idVariation: number,
): Promise<any> => {
	return request({
		url: `/product/variant/${idProduct}/${idVariation}`,
		method: 'GET',
	});
};

export const fetchFilterSearchProduct = (
	url: string,
	params: ParamSearchProduct | Record<any, any>,
): Promise<any> => {
	return request({
		url,
		method: 'GET',
		params,
	}).then((result) => result);
};

export const fetchSuggestMerchant = (
	url: string,
	params: ParamSearchProduct | Record<any, any>,
): Promise<any> => {
	return request({
		url,
		method: 'GET',
		params,
	}).then((result) => result);
};

export const postProductLike = (data: ParamLikeProduct): Promise<any> => {
	return request({
		url: `/product/like`,
		data,
		method: 'POST',
	});
};

export const getProductsLiked = ({ pageIndex, pageSize }: QueryParams): Promise<any> => {
	return request({
		method: 'GET',
		url: `/product/liked?pageIndex=${pageIndex}&pageSize=${pageSize}`,
	});
};

export const getProductList = async (params: ParamSearchProduct, req?: IncomingMessage) => {
	let ids = '';
	const newParams: any = Object.assign({}, params);

	Object.keys(newParams).map((key) => {
		if (Array.isArray(params[key])) {
			params[key].forEach((item: any) => {
				ids += `${key}=${encodeURIComponent(item)}&`;
			});

			delete newParams[key];
		}
	});

	return request({
		url: `/product?${ids}&pageIndex=0&pageSize=20`,
		method: 'GET',
		// configs: {
		// 	req,
		// 	// params: params,
		// },
	});
};

export const requestBlockProduct = async (url: string) => {
	return request({
		url: `${url}&pageIndex=0&pageSize=20`,
		method: 'GET',
	});
};

export const getProductVariation = async (productId: number) => {
	return request({
		url: `/product/${productId}/variations`,
		method: 'GET',
	});
};

export const getDetailProductVariation = async (data: {
	productId: number;
	variationId: number;
}): Promise<any> => {
	return request({
		url: `/product/${data.productId}/variations/${data.variationId}`,
		method: 'GET',
	});
};
