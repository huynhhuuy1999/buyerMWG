import { Notification } from 'components';
import { orderStatusType } from 'enums';
import { updateStatusOrderProfile } from 'services';

export const handleCancelOrderWithReason = async (
	orderId: string,
	orderSubId: string,
	isMutable?: any,
	callbackUrl?: () => void,
) => {
	Notification.Loading.custom();
	try {
		await updateStatusOrderProfile(orderId, orderSubId, orderStatusType.CANCEL);
		isMutable?.();
		callbackUrl?.();
		Notification.Loading.remove();
	} catch (error) {
		Notification.Info.default('Xin vui lòng thử lại !!', 'ERROR', 3000);
	}
};
