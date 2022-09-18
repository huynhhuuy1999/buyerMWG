import { DeviceType } from 'enums';
import { useAppSelector } from 'hooks';
import { DefaultLayout } from 'layouts';
import { PaymentDesktop, PaymentMobile } from 'modules';
import { NextPage } from 'next';

import { deviceTypeSelector } from '@/store/reducers/appSlice';

const WrapperDeviceCart = ({
	children,
	deviceType,
}: {
	children: React.ReactNode;
	deviceType: DeviceType;
}) => {
	return deviceType === DeviceType.MOBILE ? (
		<>{children}</>
	) : (
		<DefaultLayout>{children}</DefaultLayout>
	);
};

const PaymentPage: NextPage = () => {
	const deviceType = useAppSelector(deviceTypeSelector);

	return (
		<WrapperDeviceCart deviceType={deviceType}>
			{deviceType === DeviceType.MOBILE ? <PaymentMobile /> : <PaymentDesktop />}
		</WrapperDeviceCart>
	);
};

export default PaymentPage;
