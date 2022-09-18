// import { IncomingMessage } from 'http';
import { IncomingMessage } from 'http';
// import { BaseResponse, PromotionStaticResponse } from 'models';
import request from 'utils/request';
import { fetchingDataServer } from 'utils/requestServer';
// import { QueryParams } from '../models';

export const getPromotionStatic = async (webId: string) => {
	const data = await request({
		url: `/static/web?webId=${webId}`,
		method: 'GET',
	});
	return data.data;
};

export const getPromotionServer = async (webId: string, req?: IncomingMessage): Promise<any> => {
	const res = await fetchingDataServer({
		url: `/static/web?webId=${webId}`,
		method: 'GET',
		configs: {
			req,
		},
	});
	return res;
};

export const getListProductByVariationIdsApi = (variationIds: string[]): Promise<any> => {
	const data = request({
		url: `/product/combovariations/detail?variationIds=${JSON.stringify(variationIds || '')}`,
		method: 'GET',
	});

	return data;
};
