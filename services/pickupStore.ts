import request from 'utils/request';

interface pickupStoreProps {
	provinceId: number;
	district: number;
	wardId: number;
	lat: number;
	lon: number;
}

export const getPickupStore = (params: pickupStoreProps): Promise<any> => {
	return request({
		url: `/pickupstore/byaddress/${params?.provinceId}/${params?.district}/${params?.wardId}`,
		method: 'GET',
		params,
	});
};

export const getPickupStoreNearByLatlng = (params: { lat: number; lon: number }): Promise<any> => {
	return request({
		url: `/pickupstore/nearby/${params?.lat}/${params?.lon}`,
		method: 'GET',
		params,
	});
};
