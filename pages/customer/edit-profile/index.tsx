import { Head } from 'components';
import { TITLE } from 'constants/';
import { DeviceType } from 'enums';
import { useAppSelector } from 'hooks';
import { WithAuthLayout } from 'layouts';
import { EditProfileMobilePage, EditProfilePage } from 'modules';
import React from 'react';

import { deviceTypeSelector } from '@/store/reducers/appSlice';

const EditProfile = () => {
	const deviceType = useAppSelector(deviceTypeSelector);
	const title = `${TITLE.EDIT_PROFILE} | ${process.env.NEXT_PUBLIC_DOMAIN_TITLE}`;

	return (
		<>
			{deviceType === DeviceType.MOBILE ? (
				<>
					<Head title={title}></Head>
					<EditProfileMobilePage />
				</>
			) : (
				<WithAuthLayout title={title}>
					<EditProfilePage />
				</WithAuthLayout>
			)}
		</>
	);
};

export default EditProfile;
