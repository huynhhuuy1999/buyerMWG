import { Notification } from 'components';
import { deleteCartBuyLaterItem } from 'services';
import { ScopedMutator } from 'swr/dist/types';

import { cartActions } from '@/store/reducers/cartSlice';
import getErrorMessageInstance from '@/utils/getErrorMessageInstance';

export const handleDeleteBuyLaterItemCart = async (
	productId: number,
	variationId: number,
	mutate: ScopedMutator<any>,
	cartId: string,
	dispatch: React.Dispatch<any>,
) => {
	Notification.Loading.custom();
	try {
		await deleteCartBuyLaterItem(productId, variationId);
		await mutate({
			method: 'GET',
			url: `/cartbuylater`,
		});
		await mutate({
			method: 'GET',
			url: `/cart/${cartId}`,
		});
		dispatch(cartActions.pushItems({ quantity: 0, variantId: variationId }));
		Notification.Loading.remove(300);
	} catch (error) {
		getErrorMessageInstance(error);
	}
};
