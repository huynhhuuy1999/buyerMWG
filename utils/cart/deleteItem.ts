import { Notification } from 'components';
import { deleteCartItem, ParamsDeleteItemProps } from 'services';

import { cartActions } from '@/store/reducers/cartSlice';
import getErrorMessageInstance from '@/utils/getErrorMessageInstance';

type ModeDeleteItem = 'cart' | 'details';

export const handleDeleteItemCart = async (
	params: ParamsDeleteItemProps,
	mutate: any,
	cartId: string,
	dispatch: React.Dispatch<any>,
	mode?: ModeDeleteItem,
) => {
	Notification.Loading.custom();
	try {
		const resDeleteItems = await deleteCartItem(cartId, params);
		await mutate({
			method: 'GET',
			url: `/cart/${cartId}`,
		});

		if (mode === 'details') {
			Notification.Info.default(resDeleteItems?.data, 'SUCCESS', 3000);

			dispatch(cartActions.pushItems({ quantity: 0, variantId: params?.variationId }));
		}

		!mode && Notification.Loading.remove(300);
	} catch (error) {
		getErrorMessageInstance(error);
	}
};
