import request from 'utils/request';

import { ItemUpdateQuantityProps } from '@/modules/cart/types';

let axiosConfig = {
	headers: {
		Accept: 'application/json-patch+json',
	},
};

export interface DataParamsProps {
	productId: number;
	variationId: number;
	merchantId: number;
	productQuantity: number;
	brandId: number;
	itemPromotionIds: string[];
}
export interface ParamsDeleteItemProps {
	variationId: number;
	merchantId: number;
	reservationId: string;
}
export interface UpdateVariantProps {
	productId: number;
	newVariationId: number;
	quantity: number;
	merchantId: number;
	oldReservationId: string;
	oldVariationId: number;
}

export const createNewCart = (isExisted: boolean): Promise<any> => {
	return request({
		url: `/cart`,
		method: 'POST',
		data: {},
		params: { createdNewCart: isExisted },
		...axiosConfig,
	});
};

export const getTokenCartId = (isExisted: boolean): Promise<any> => {
	return request({
		url: `/cart/GetCartByToken`,
		method: 'POST',
		...axiosConfig,
	});
};

export const addItemCart = (id: any, profileId: string, data: DataParamsProps): Promise<any> => {
	return request({
		url: `/cart/item/${id}/${profileId}`,
		method: 'POST',
		data,
		...axiosConfig,
	});
};

export const updateVariantCart = (id: string, params: UpdateVariantProps): Promise<any> => {
	return request({
		url: `/cart/variation/${id}`,
		method: 'PUT',
		data: params,
		...axiosConfig,
	});
};

export const getItemsCart = (cartId: string): Promise<any> => {
	return request({
		url: `/cart/${cartId}`,
		method: 'GET',
		...axiosConfig,
	});
};

export const pushCartBuyLater = (
	productId: number,
	variationId: number,
	brandId: number,
	merchantId: number,
	warehouseId: string,
	reservationId: string,
): Promise<any> => {
	return request({
		url: `/cartbuylater/item`,
		method: 'POST',
		data: {
			productId,
			merchantId,
			variationId,
			brandId,
			warehouseId,
			reservationId,
		},
		...axiosConfig,
	});
};

export const deleteCartBuyLaterItem = (productId: number, variantId: number): Promise<any> => {
	return request({
		url: `/cartbuylater/${productId}/${variantId}`,
		method: 'DELETE',
		...axiosConfig,
	});
};

export interface pushMultiItemsCartBuyLaterItemProps {
	productId: number;
	variationId: number;
	brandId: number;
	merchantId: number;
	warehouseId: string;
	reservationId: string;
}

export const pushMultiItemsCartBuyLater = (
	data: pushMultiItemsCartBuyLaterItemProps[],
): Promise<any> => {
	return request({
		url: `/cartbuylater/items`,
		method: 'POST',
		data: data,
		...axiosConfig,
	});
};

export const deleteCartItem = (cartId: string, data: ParamsDeleteItemProps): Promise<any> => {
	return request({
		url: `/cart/${cartId}`,
		method: 'DELETE',
		data,
		...axiosConfig,
	});
};

export const buyLaterCartItem = (
	productId: number,
	variantId: number,
	brandId: number,
): Promise<any> => {
	return request({
		url: `/cartbuylater/useitem`,
		method: 'POST',
		data: {
			productId: productId,
			variationId: variantId,
			brandId: brandId,
		},
		...axiosConfig,
	});
};

export const updateItemsCart = (body: ItemUpdateQuantityProps): Promise<any> => {
	return request({
		url: `/cart/quantity/${body.cartId}`,
		method: 'PUT',
		data: body,
		...axiosConfig,
	});
};

export const getPaymentMethod = (): Promise<any> => {
	return request({
		url: `/payment/method`,
		method: 'GET',
		...axiosConfig,
	});
};

export const updateShippingCart = (cartId: string | undefined, profileId: string): Promise<any> => {
	return request({
		url: `/cart/shipping/${cartId}`,
		method: 'PUT',
		data: {
			profileId: profileId,
		},
		...axiosConfig,
	});
};

interface ParamsUpdateInvoice {
	invoice: {
		companyName: string;
		taxCode: string;
		invoiceAddress: string;
	};
	isInvoice: boolean;
}

export const updateInvoiceCart = (cartId: string, params: ParamsUpdateInvoice): Promise<any> => {
	return request({
		url: `cart/invoice/${cartId}`,
		method: 'PUT',
		data: params,
		...axiosConfig,
	});
};

export const updatePaymentMethodSelected = (
	cartId: string | undefined,
	params: {
		paymentType: number;
		paymentName?: string;
		hasVatInvoice?: boolean;
		companyName?: string;
		taxCode?: string;
		invoiceAddress?: string;
		sameAsTheShippingAddress?: boolean;
	},
): Promise<any> => {
	return request({
		url: `/cart/payment/${cartId}`,
		method: 'PUT',
		data: {
			paymentType: params.paymentType,
			paymentName: params?.paymentName,
			hasVatInvoice: params?.hasVatInvoice,
			companyName: params?.companyName,
			taxCode: params?.taxCode,
			invoiceAddress: params?.invoiceAddress,
			sameAsTheShippingAddress: params?.sameAsTheShippingAddress,
		},
		...axiosConfig,
	});
};

interface ParamsUpdateShippingsType {
	partnerCode: string;
	deliveryTypeCode: string;
	merchantId: number;
	brandId: number;
	warehouseId: string;
	partnerName: string;
	deliveryTypeName: string;
	isSupport?: true;
	message?: string;
}

export const updateSelectShippngType = (
	cartId: string | undefined,
	params: ParamsUpdateShippingsType,
): Promise<any> => {
	return request({
		url: `/cart/shippingtype/${cartId}`,
		method: 'PUT',
		data: params,
		...axiosConfig,
	});
};
