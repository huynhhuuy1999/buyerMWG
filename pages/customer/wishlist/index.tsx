import { DeviceType } from 'enums';
import { useAppSelector } from 'hooks';
import { DefaultLayoutMobile, WithAuthLayout } from 'layouts';
import { WishListPage, WishListPageMobile } from 'modules';
import { NextPage } from 'next';
import React from 'react';

import { deviceTypeSelector } from '@/store/reducers/appSlice';

const WrapperDevice = (props: any) => {
	const deviceTypeStore = useAppSelector(deviceTypeSelector);
	return props.deviceType === DeviceType.MOBILE || deviceTypeStore === DeviceType.MOBILE ? (
		<DefaultLayoutMobile>
			<WishListPageMobile />
		</DefaultLayoutMobile>
	) : (
		<WithAuthLayout>
			<WishListPage />
		</WithAuthLayout>
	);
};

const Wishlist: NextPage = (props: any) => {
	return <WrapperDevice {...props} />;
};

export default Wishlist;
