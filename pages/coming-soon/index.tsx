import { DeviceType } from 'enums';
import { useAppSelector } from 'hooks/useAppSelector';
import { NextPage } from 'next';

import DefaultLayout from '@/layouts/defaultLayout';
import DefaultLayoutMobile from '@/layouts/defaultLayout.mobile';
import { ComingSoon, ComingSoonMobile } from '@/modules/coming-soon';
import { deviceTypeSelector } from '@/store/reducers/appSlice';

interface IComingSoonPage {
	deviceType?: DeviceType;
}

const ComingSoonPage: NextPage<IComingSoonPage> = () => {
	const deviceType = useAppSelector(deviceTypeSelector);
	return deviceType === DeviceType.MOBILE ? (
		<DefaultLayoutMobile>
			<ComingSoonMobile />
		</DefaultLayoutMobile>
	) : (
		<DefaultLayout>
			<ComingSoon />
		</DefaultLayout>
	);
};

export default ComingSoonPage;
