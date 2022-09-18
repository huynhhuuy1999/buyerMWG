import request from 'utils/request';

export const createOrderPayment = ({
	cartId,
	appLink,
	urlCallBack,
}: {
	cartId: string | undefined;
	appLink: string;
	urlCallBack: string;
}): Promise<any> => {
	return request({
		url: '/order',
		method: 'POST',
		data: { cartId, appLink, urlCallBack },
	});
};

export const createRetryPayment = ({
	orderId,
	paymentType,
	appLink,
	urlCallBack,
}: {
	orderId: string;
	paymentType?: number;
	appLink: string;
	urlCallBack: string;
}): Promise<any> => {
	return request({
		url: '/order/repayment',
		method: 'POST',
		data: { orderId, paymentType, appLink, urlCallBack },
	});
};

export const updateStatusOrderProfile = (
	orderId: string,
	orderSubId: string,
	orderStatus: number,
) => {
	return request({
		url: `/order/${orderId}`,
		method: 'PUT',
		data: { order_status: orderStatus, order_sub_id: orderSubId },
	});
};

export const getOrderDetailWithId = (orderId: string) => {
	return request({
		url: `/order/${orderId}`,
		method: 'GET',
	});
};

export const getListCancelOrder = (): Promise<any> => {
	return request({
		url: '/order/cancelreason',
		method: 'GET',
	});
};
