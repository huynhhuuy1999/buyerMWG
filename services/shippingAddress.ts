import request from 'utils/request';

export const getShippingPackageWithMerchantId = (merchantId: number): Promise<any> => {
	return request({
		url: `/shipping/packageactive/${merchantId}`,
		method: 'GET',
	});
};
