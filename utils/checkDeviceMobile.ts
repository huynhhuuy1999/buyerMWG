import { DeviceType } from '../enums';

export const checkDeviceMobile = (req: any) => {
	const userAgent = req?.headers?.['user-agent'];

	const isMobile = Boolean(
		userAgent?.match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i),
	);

	return isMobile ? DeviceType.MOBILE : DeviceType.DESKTOP;
};
