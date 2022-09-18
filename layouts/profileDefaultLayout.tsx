import { Head, ImageCustom } from 'components';
import React from 'react';

import { DeviceType } from '../enums';
import DefaultLayout from './defaultLayout';
import DefaultLayoutMobile from './defaultLayout.mobile';

const WrapperDevice = ({
	children,
	deviceType,
}: {
	children: React.ReactNode;
	deviceType: DeviceType;
}) => {
	return deviceType === DeviceType.MOBILE ? (
		<DefaultLayoutMobile>{children}</DefaultLayoutMobile>
	) : (
		<DefaultLayout>{children}</DefaultLayout>
	);
};

const ProfileDefaultLayout = ({
	children,
	title = process.env.NEXT_PUBLIC_DOMAIN_TITLE,
}: {
	children: React.ReactNode;
	title?: string;
}) => {
	return (
		<>
			<Head title={title} />
			<div className='bg-E5E5E5'>
				<div className='container pt-4 pb-12'>
					{children}
					<div className='fixed bottom-4 right-[16px] h-[84px] w-[84px] -translate-x-4 -translate-y-4'>
						<ImageCustom src='/static/images/support.png' alt='vuivui Suport' layout='fill' />
					</div>
				</div>
			</div>
		</>
	);
};

export { WrapperDevice, ProfileDefaultLayout };
