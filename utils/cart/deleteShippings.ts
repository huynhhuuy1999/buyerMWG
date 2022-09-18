import { Notification } from 'components';
import { deleteCustomerProfile } from 'services';
import { ScopedMutator } from 'swr/dist/types';

export const handleDeleteProfile = async (
	profileIdDelete: string,
	profileIdCurrent: string,
	onMutable: ScopedMutator<any>,
) => {
	Notification.Loading.custom();
	if (profileIdDelete && profileIdCurrent !== profileIdDelete) {
		try {
			const { data } = await deleteCustomerProfile(profileIdDelete);
			if (data) {
				await onMutable({
					url: '/profile',
					method: 'GET',
				});
				Notification.Loading.remove(300);
			} else {
				Notification.Loading.remove(300);
			}
		} catch (error) {
			Notification.Info.default('Lỗi Hệ thống, vui lòng thử lại !!', 'ERROR', 3000);
		}
	} else {
		Notification.Info.default('Lỗi Hệ thống, vui lòng thử lại !!', 'ERROR', 3000);
	}
};
