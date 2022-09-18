import { Notification } from 'components';

const getErrorMessageInstance = (error: unknown) => {
	const { response }: any = error;
	if (response?.data?.message) {
		return Notification.Info.default(response?.data?.message, 'ERROR', 3000);
	} else {
		return Notification.Info.default('Xin vui lòng thử lại', 'ERROR', 3000);
	}
};

export default getErrorMessageInstance;
