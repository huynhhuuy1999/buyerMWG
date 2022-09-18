import { Notification } from 'components';
import React from 'react';
import { buyLaterCartItem } from 'services';
import { ScopedMutator } from 'swr/dist/types';

import { cartActions, CartState } from '@/store/reducers/cartSlice';
import getErrorMessageInstance from '@/utils/getErrorMessageInstance';

export const handleBuyLater = async (
	productId: number,
	variationId: number,
	brandId: number,
	dispatch: React.Dispatch<any>,
	mutate: ScopedMutator<any>,
	cartState: CartState,
	cartId: string,
) => {
	Notification.Loading.custom();
	try {
		await buyLaterCartItem(productId, variationId, brandId);
		dispatch(cartActions.increment(cartState.total + 1));
		dispatch(cartActions.pushItems({ quantity: 1, variantId: variationId }));
		await mutate({
			method: 'GET',
			url: `/cart/${cartId}`,
		});
		await mutate({
			method: 'GET',
			url: `/cartbuylater`,
		});
		Notification.Loading.remove(300);
	} catch (error) {
		getErrorMessageInstance(error);
	}
};
