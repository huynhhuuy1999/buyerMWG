import { Notification } from 'components';
import { orderStatusType } from 'enums';

import { updateStatusOrderProfile } from '@/services/order';

//handle cancel order
export const handleCancelOrder = (
	orderId: string,
	orderSubId: string,
	isMutable: any,
	callbackUrl?: () => void,
) => {
	Notification.Confirm.show(
		'Hủy đơn hàng',
		'Bạn có chắc muốn hủy đơn hàng này ?',
		'Đồng ý',
		'Không',
		async () => {
			Notification.Loading.custom();
			try {
				await updateStatusOrderProfile(orderId, orderSubId, orderStatusType.CANCEL);
				isMutable && isMutable();
				callbackUrl?.();
				Notification.Loading.remove();
			} catch (error) {
				Notification.Info.default('Xin vui lòng thử lại !!', 'ERROR', 3000);
			}
		},
		async () => {},
	);
};
