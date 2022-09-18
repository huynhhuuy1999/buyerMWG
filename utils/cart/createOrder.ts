import { Notification } from 'components';
import { DeviceType } from 'enums';
import { OrderResultResponse } from 'models/cart';
import router from 'next/router';
import { createOrderPayment } from 'services';

import { IframeProps } from '@/modules/cart/types';
import getErrorMessageInstance from '@/utils/getErrorMessageInstance';

//handle submit create new order
export const handleSubmitCreateOrder = async (
	cartId?: string,
	forDevice?: DeviceType,
	onIframe?: (value: IframeProps) => void,
) => {
	try {
		const { data: OrderResult }: { data: OrderResultResponse } = await createOrderPayment({
			cartId: cartId,
			appLink: '',
			urlCallBack: `${process.env.NEXT_PUBLIC_DOMAIN_URL}/payment`,
		});

		if (OrderResult.orderId && !OrderResult.payUrl) {
			Notification.Loading.remove(300);
			router.push({ pathname: '/payment', query: { orderId: OrderResult.orderId } });
		}

		if (OrderResult.payUrl) {
			if (forDevice === DeviceType.MOBILE) {
				onIframe?.({
					callbackUrl: OrderResult.payUrl,
					isActive: true,
					title: '',
					orderId: OrderResult.orderId,
				});
				Notification.Loading.remove(300);
			} else {
				Notification.Loading.remove(300);
				router.push(OrderResult.payUrl);
			}
		}
	} catch (error) {
		getErrorMessageInstance(error);
	}
};
