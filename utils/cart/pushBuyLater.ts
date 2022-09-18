import { Notification } from 'components';
import React from 'react';
import { pushCartBuyLater } from 'services';
import { ScopedMutator } from 'swr/dist/types';

import { cartActions } from '@/store/reducers/cartSlice';
import getErrorMessageInstance from '@/utils/getErrorMessageInstance';

export const handlePushBuyLater = async (
	productId: number,
	variationId: number,
	brandId: number,
	merchantId: number,
	warehouseId: string,
	cartId: string,
	dispatch: React.Dispatch<any>,
	reservationId?: string,
	onMutate?: ScopedMutator<any>,
) => {
	Notification.Loading.custom();
	try {
		const resPushBuyLater = await pushCartBuyLater(
			productId,
			variationId,
			brandId,
			merchantId,
			warehouseId,
			reservationId!,
		);
		dispatch(cartActions.decrement());
		await onMutate?.({
			method: 'GET',
			url: `/cart/${cartId}`,
		});
		await onMutate?.({
			method: 'GET',
			url: `/cartbuylater`,
		});

		!reservationId && Notification.Info.default(resPushBuyLater?.data, 'SUCCESS', 3000);

		!reservationId && dispatch(cartActions.pushItems({ quantity: 0, variantId: variationId }));

		reservationId && Notification.Loading.remove(300);
	} catch (error) {
		getErrorMessageInstance(error);
	}
};
