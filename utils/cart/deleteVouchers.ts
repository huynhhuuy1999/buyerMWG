import { Notification } from 'components';
import { deleteVouchersForMerchant } from 'services';
import { ScopedMutator } from 'swr/dist/types';

import getErrorMessageInstance from '@/utils/getErrorMessageInstance';

export const handleDeleteVouchers = async (
	cartId: string,
	voucherId: string,
	mutate: ScopedMutator<any>,
) => {
	Notification.Loading.custom();
	try {
		await deleteVouchersForMerchant(cartId, voucherId);
		await mutate({
			method: 'GET',
			url: `/cart/${cartId}`,
		});
		Notification.Loading.remove(300);
	} catch (error) {
		getErrorMessageInstance(error);
	}
};
