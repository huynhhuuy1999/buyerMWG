import request from 'utils/request';

import { Customer, CustomerCancel } from '@/models/customer';
export const getSelfInfoApi = (): Promise<any> => {
	return request({
		url: '/customer/self',
		method: 'GET',
	});
};

export const getListOrderEvalution = (pageIndex: number, pageSize: number): Promise<any> => {
	return request({
		url: `rating/waitinglist/${pageIndex}/${pageSize}`,
		method: 'GET',
	});
};

export const updateListOrderEvalution = (data: Customer): Promise<any> => {
	return request({
		url: 'rating/waitinglist',
		method: 'PUT',
		data,
	});
};

export const cancelListOrderEvalution = (data: CustomerCancel): Promise<any> => {
	return request({
		url: 'rating/waitinglist/cancel',
		method: 'PUT',
		data,
	});
};

export const deleteCustomerProfile = (profileid: string): Promise<any> => {
	return request({
		url: `/profile/${profileid}`,
		method: 'DELETE',
	});
};

export const updateMultiFile = (
	service_name: string,
	data: FormData,
	onUploadProgress: ({ total, loaded }: any) => void,
): Promise<any> => {
	return request({
		url: `upload/multi?service_name=${service_name}`,
		method: 'POST',
		headers: { 'Content-Type': 'multipart/form-data' },
		data,
		onUploadProgress,
	});
};

export const getListMerchantLikeFromUser = (params: Record<string, any>): Promise<any> => {
	let paramsIds = '';

	for (const [key] of Object.entries(params)) {
		if (Array.isArray(params[key])) {
			params[key].forEach((categoryId: number) => {
				paramsIds += `&${key}=${categoryId}`;
			});
		}
	}

	return request({
		method: 'GET',
		url: `/merchant/likedfromuser?page=${params.page}&pageSize=${params.pageSize}${paramsIds}`,
	});
};
