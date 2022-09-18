import { TITLE } from 'constants/';
import { DeviceType } from 'enums';
import { useAppSelector } from 'hooks';
import { DefaultLayoutMobile, WithAuthLayout } from 'layouts';
import { NextPage } from 'next';
import React from 'react';

import { ReviewList, ReviewListMobile } from '@/modules/profile-order-review';
import { deviceTypeSelector } from '@/store/reducers/appSlice';
interface IReviewPage {
	deviceType?: DeviceType;
}

const ReviewPage: NextPage<IReviewPage> = ({ deviceType }) => {
	const title = `${TITLE.RATING_LIST} | ${process.env.NEXT_PUBLIC_DOMAIN_TITLE}`;
	const deviceTypeStore = useAppSelector(deviceTypeSelector);
	return deviceType === DeviceType.MOBILE || deviceTypeStore === DeviceType.MOBILE ? (
		<DefaultLayoutMobile title={title}>
			<ReviewListMobile />
		</DefaultLayoutMobile>
	) : (
		<WithAuthLayout title={title}>
			<ReviewList />
		</WithAuthLayout>
	);
};

export default ReviewPage;
