import request from 'utils/request';

export const pingPayment = (namePayment?: string, params?: object): Promise<any> => {
	return request({
		url: `/payment/${namePayment}/result`,
		params: params,
		method: 'GET',
	});
};
