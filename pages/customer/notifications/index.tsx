import { TITLE } from 'constants/';
import { DeviceType } from 'enums';
import { DefaultLayoutMobile, WithAuthLayout } from 'layouts';
import { Notification, NotificationMobile } from 'modules';
import { NextPage } from 'next';

interface INotificationPage {
	deviceType?: DeviceType;
}

const NotificationPage: NextPage<INotificationPage> = ({ deviceType }) => {
	const title = `${TITLE.NOTIFICATION} | ${process.env.NEXT_PUBLIC_DOMAIN_TITLE}`;

	return deviceType === DeviceType.MOBILE ? (
		<DefaultLayoutMobile title={title}>
			<NotificationMobile />
		</DefaultLayoutMobile>
	) : (
		<WithAuthLayout title={title}>
			<Notification />
		</WithAuthLayout>
	);
};

export default NotificationPage;
