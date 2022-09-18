import { CustomerInfo, DistrictParams, Province, ProvinceParams, WardParams } from 'models';
import request from 'utils/request';

interface GenerateOTPProps {
	email_or_phone_number: string;
	type: number;
}

interface ConfirmOTPProps {
	verification_token: string;
	email_or_phone_number: string;
	type: number;
	gender?: number;
	full_name?: string;
	verify_id: number;
}

export const getProvinceListApi = (params?: Province): Promise<any> => {
	return request({
		url: '/province',
		method: 'GET',
		params,
		headers: { 'Content-Type': 'application/json; charset=UTF-8' },
	});
};

export const generateOTP = (data?: GenerateOTPProps): Promise<any> => {
	return request({
		url: '/account/otp',
		method: 'POST',
		data,
		headers: { 'Content-Type': 'application/json; charset=UTF-8' },
	});
};

export const confirmOTP = (data?: ConfirmOTPProps): Promise<any> => {
	return request({
		url: '/account/otp/confirm',
		method: 'POST',
		data,
		headers: { 'Content-Type': 'application/json; charset=UTF-8' },
	});
};

export const confirmOTPAction = (data?: ConfirmOTPProps): Promise<any> => {
	return request({
		url: '/account/otp/confirm/action',
		method: 'POST',
		data,
		headers: { 'Content-Type': 'application/json; charset=UTF-8' },
	});
};

export const getProvincesApi = (params?: ProvinceParams): Promise<any> => {
	return request({
		url: '/province',
		method: 'GET',
		params,
		headers: { 'Content-Type': 'application/json; charset=UTF-8' },
	});
};

export const getDistrictApi = (params?: DistrictParams): Promise<any> => {
	return request({
		url: '/district',
		method: 'GET',
		params,
		headers: { 'Content-Type': 'application/json; charset=UTF-8' },
	});
};

export const getWardApi = (params?: WardParams): Promise<any> => {
	return request({
		url: '/ward',
		method: 'GET',
		params,
		headers: { 'Content-Type': 'application/json; charset=UTF-8' },
	});
};

export const createInfoCustomer = (data?: CustomerInfo): Promise<any> => {
	return request({
		url: '/customer',
		method: 'POST',
		data,
		headers: { 'Content-Type': 'application/json; charset=UTF-8' },
	});
};

export const updateInfoCustomer = (data?: CustomerInfo): Promise<any> => {
	return request({
		url: '/customer/self',
		method: 'PUT',
		data,
		headers: { 'Content-Type': 'application/json; charset=UTF-8' },
	});
};

export const getInfoCustomer = (): Promise<any> => {
	return request({
		url: '/customer/self',
		method: 'GET',
	});
};

export const uploadAvatarCustomer = (data: FormData): Promise<any> => {
	return request({
		url: '/customer/avatar',
		method: 'POST',
		data,
		headers: { 'Content-Type': 'multipart/form-data' },
	});
};

// export const getProvinceByCoordinates = (): any => {
// 	return axios
// 		.get(
// 			`https://maps.googleapis.com/maps/api/geocode/json?latlng=40.714224,-73.961452&key=${API_KEY}`,
// 		)
// 		.then((res) => {
// 			console.log(res);
// 		})
// 		.catch((err) => {
// 			console.log(err);
// 		});
// };
