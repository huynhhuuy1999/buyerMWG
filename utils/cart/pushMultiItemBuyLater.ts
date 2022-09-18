import { Notification } from 'components';
import React from 'react';
import { pushMultiItemsCartBuyLater, pushMultiItemsCartBuyLaterItemProps } from 'services';
import { ScopedMutator } from 'swr/dist/types';

import { cartActions } from '@/store/reducers/cartSlice';
import getErrorMessageInstance from '@/utils/getErrorMessageInstance';

export const handleMultiItemsPushBuyLater = async (
	data: pushMultiItemsCartBuyLaterItemProps[],
	cartId: string,
	dispatch: React.Dispatch<any>,
	onMutate?: ScopedMutator<any>,
	onStatus?: (val: boolean) => void,
) => {
	Notification.Loading.custom();
	try {
		await pushMultiItemsCartBuyLater(data);

		await onMutate?.({
			method: 'GET',
			url: `/cart/${cartId}`,
		});
		await onMutate?.({
			method: 'GET',
			url: `/cartbuylater`,
		});
		data?.forEach((ele) => {
			dispatch(cartActions.pushItems({ quantity: 0, variantId: ele?.variationId }));
			dispatch(cartActions.decrement());
		});
		onStatus?.(true);
		Notification.Loading.remove(300);
	} catch (error) {
		onStatus?.(false);
		getErrorMessageInstance(error);
	}
};
