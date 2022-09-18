import request from 'utils/request';

export const addVouchersForMerchant = (cartId: string, voucherId: string): Promise<any> => {
	return request({
		url: `/cart/voucher/add/${cartId}/${voucherId}`,
		method: 'PUT',
	});
};

export const deleteVouchersForMerchant = (cartId: string, voucherId: string): Promise<any> => {
	return request({
		url: `/cart/voucher/delete/${cartId}/${voucherId}`,
		method: 'DELETE',
	});
};
