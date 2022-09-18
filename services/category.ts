import { IncomingMessage } from 'http';
import request from 'utils/request';
import { fetchingDataServer } from 'utils/requestServer';

export const getAllCategoryApi = async (req?: IncomingMessage): Promise<any> => {
	const res = req
		? await fetchingDataServer({
				url: '/category/all',
				method: 'GET',
				configs: {
					req,
				},
		  })
		: request({
				url: '/category/all',
				method: 'GET',
		  });

	return res;
};

export const getCatalog = async (req?: IncomingMessage): Promise<any> => {
	const res = req
		? await fetchingDataServer({
				url: '/category/hierachy',
				method: 'GET',
				configs: {
					req,
				},
		  })
		: request({
				url: '/category/hierachy',
				method: 'GET',
		  });

	return res;
};

export const fetchConfigLayoutCateGory = async (id: number): Promise<any> => {
	return request({
		url: `category/${id}/detail`,
		method: 'GET',
	});
};
