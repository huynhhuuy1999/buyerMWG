import { Notification } from 'components';
import { ProductItemPromotion } from 'models';
import { NextRouter } from 'next/router';
import React from 'react';
import { addItemCart } from 'services';
import { ScopedMutator } from 'swr/dist/types';

import { PROMOTION_STATUS_SHOW } from '@/enums/index';
import { MODE_ADD_CART } from '@/modules/cart/types';
import { cartActions } from '@/store/reducers/cartSlice';
import getErrorMessageInstance from '@/utils/getErrorMessageInstance';

interface ParamsAddCartItems {
	merchantId: number;
	itemPromotionIds: ProductItemPromotion[];
	productId: number;
	productQuantity?: number;
	brandId: number;
	variationId: number;
	cartId: string;
	profileId?: string;
	mode?: { mode: MODE_ADD_CART.drawer; mutate: ScopedMutator<any> };
	isBuyNow: boolean;
}

export const handleAddItemCart = async (
	callBackUrl: NextRouter,
	dispatch: React.Dispatch<any>,
	params: ParamsAddCartItems,
	onSuccess?: (val: boolean) => void,
) => {
	const { cartId, isBuyNow, itemPromotionIds, merchantId, productId, variationId, mode, brandId } =
		params || {};

	Notification.Loading.custom();

	try {
		const res = await addItemCart(
			cartId,
			params?.profileId ?? '00000000-0000-0000-0000-000000000000',
			{
				merchantId: merchantId,
				itemPromotionIds:
					itemPromotionIds
						?.filter((ele) => ele?.status === PROMOTION_STATUS_SHOW.RUNNING)
						?.map((ele) => ele?.promotionId) ?? [],
				productId: productId,
				productQuantity: 1,
				brandId: brandId,
				variationId: variationId,
			},
		);

		if (!isBuyNow) {
			if (res.data) {
				dispatch(cartActions.increment(res.data?.itemTotal));
				dispatch(cartActions.pushItems({ quantity: 1, variantId: variationId }));

				mode?.mode === MODE_ADD_CART.drawer &&
					(await mode?.mutate({
						method: 'GET',
						url: `/cart/${cartId}`,
					}));

				Notification.Info.default('Sản phẩm đã được thêm vào Giỏ hàng', 'SUCCESS', 1500);
				onSuccess?.(true);
			}
		}

		// Notification.Loading.remove();
		if (isBuyNow) {
			if (res.data) {
				dispatch(cartActions.increment(res.data?.itemTotal));
				dispatch(cartActions.pushItems({ quantity: 1, variantId: variationId }));
				callBackUrl.push('/gio-hang');
			}
		}
	} catch (res) {
		getErrorMessageInstance(res);
		onSuccess?.(false);
	}
};
