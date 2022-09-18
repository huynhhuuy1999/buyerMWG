// import { IncomingMessage } from 'http';
import request from 'utils/request';
// import { fetchingDataServer } from 'utils/requestServer';

export const getProvinces = (): Promise<any> => {
	return request({
		url: '/province/tree',
		method: 'GET',
	});
};

export const getDistrict = (provinceId?: number, countryId?: number): Promise<any> => {
	return request({
		url: '/district',
		params: { province_id: provinceId, country_id: countryId },
		method: 'GET',
	});
};

export const getWard = (province_id?: number, districtId?: number): Promise<any> => {
	return request({
		url: '/ward',
		params: { district_id: districtId, province_id: province_id },
		method: 'GET',
	});
};

export const getVersion = (): Promise<any> => {
	return request({
		url: '/checkversion',
		method: 'GET',
	});
};
