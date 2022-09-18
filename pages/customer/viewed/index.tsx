import { Head } from 'components';
import { TITLE } from 'constants/';
import { DeviceType } from 'enums';
import { useAppSelector } from 'hooks';
import { WithAuthLayout } from 'layouts';
import { ViewedDesktop, ViewedMobile } from 'modules';

import { deviceTypeSelector } from '@/store/reducers/appSlice';

const ViewedPage = ({ deviceType }: any) => {
	const title = `${TITLE.VIEWED} | ${process.env.NEXT_PUBLIC_DOMAIN_TITLE}`;
	const deviceTypeStore = useAppSelector(deviceTypeSelector);
	return (
		<>
			<Head title={title}></Head>
			{deviceType === DeviceType.MOBILE || deviceTypeStore === DeviceType.MOBILE ? (
				<ViewedMobile />
			) : (
				<ViewedDesktop />
			)}
		</>
	);
};

export default ViewedPage;

ViewedPage.Layout = WithAuthLayout;
