import { IncomingMessage } from 'http';
import { ParamLikeShop } from 'models';
import request from 'utils/request';

import { fetchingDataServer } from '@/utils/requestServer';

export const getShopInfo = async (id: number | string, req?: IncomingMessage): Promise<any> => {
	const { data, message }: any = await fetchingDataServer({
		method: 'GET',
		url: `/merchant/info/${id}`,
		configs: {
			req,
		},
	});
	return { data, loading: !message };
};

export const getShopTemplate = async (id: number | string): Promise<any> => {
	const { data, message }: any = await request({
		method: 'GET',
		url: `/merchant/${id}/shopview`,
	});

	return { data, loading: !message };
};

export const postMerchantLike = (data: ParamLikeShop): Promise<any> => {
	return request({
		url: `/merchant/like`,
		data,
		method: 'POST',
	});
};
