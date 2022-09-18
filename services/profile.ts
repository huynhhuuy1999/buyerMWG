import request from 'utils/request';

export const getCustomerProfile = (): Promise<any> => {
	return request({
		url: '/profile',
		method: 'GET',
	});
};
export const addCustomerProfile = (data: object): Promise<any> => {
	return request({
		url: '/profile',
		method: 'POST',
		data,
	});
};

export const editCustomerProfile = (data: object, profileId: string): Promise<any> => {
	return request({
		url: `/profile/${profileId}`,
		method: 'PUT',
		data,
	});
};
