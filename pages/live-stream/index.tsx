import { DeviceType } from 'enums';
import { useAppSelector } from 'hooks';
import { NextPage } from 'next';
import { Fragment } from 'react';

import DefaultLayout from '@/layouts/defaultLayout';
import DefaultLayoutMobile from '@/layouts/defaultLayout.mobile';
import { ComingSoon, ComingSoonMobile } from '@/modules/coming-soon';
import { deviceTypeSelector } from '@/store/reducers/appSlice';

const LiveStreamPage: NextPage = () => {
	const deviceType = useAppSelector(deviceTypeSelector);
	return (
		<Fragment>
			{deviceType === DeviceType.MOBILE ? (
				<DefaultLayoutMobile>
					<ComingSoonMobile />
				</DefaultLayoutMobile>
			) : (
				<DefaultLayout>
					<ComingSoon />
				</DefaultLayout>
			)}
		</Fragment>
	);
};

export default LiveStreamPage;
