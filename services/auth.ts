import { LoginPayload } from 'models';
import request from 'utils/request';

export const loginApi = (data: LoginPayload): Promise<any> => {
	return request({
		url: '/account/login',
		method: 'POST',
		data,
	});
};

export const logoutApi = (): Promise<any> => {
	return request({
		url: '/account/logout',
		method: 'POST',
	});
};

export const putFirebaseTokenAPI = (data: any) => {
	return request({
		url: `/app/token`,
		method: 'PUT',
		data,
	});
};
