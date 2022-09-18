import { Notification } from 'components';
import React from 'react';
import { updateItemsCart } from 'services';

import { ItemUpdateQuantityProps } from '@/modules/cart/types';
import { cartActions } from '@/store/reducers/cartSlice';
import getErrorMessageInstance from '@/utils/getErrorMessageInstance';

export const handleUpdateQuantityProduct = async (
	item: ItemUpdateQuantityProps,
	mutate: any,
	dispatch: React.Dispatch<any>,
	onDeleteItem: () => void,
	onLoading: (value: boolean) => void,
	onFailed?: any,
): Promise<any> => {
	// Notification.Loading.custom();
	onLoading(true);
	if (item.quantity) {
		try {
			const resUpdateItemsCart = await updateItemsCart(item);
			await mutate({
				method: 'GET',
				url: `/cart/${item?.cartId}`,
			});
			dispatch(cartActions.pushItems({ quantity: item?.quantity, variantId: item?.variationId }));
			onLoading(false);
			!item?.reservationId &&
				Notification.Info.default(
					!resUpdateItemsCart?.isError
						? 'Cập nhật số lượng thành công !!'
						: 'Cập nhật số lượng thất bại !!',
					'SUCCESS',
					3000,
				);
		} catch (error) {
			onLoading(false);
			onFailed?.();
			getErrorMessageInstance(error);
		}
	} else {
		dispatch(cartActions.decrement());
		onDeleteItem();
		onLoading(false);
	}
};
