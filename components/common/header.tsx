import classNames from 'classnames';
import { useAppDispatch, useIsomorphicLayoutEffect } from 'hooks';
import { RightHeader } from 'modules/header';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { memo, useEffect, useMemo, useRef } from 'react';

import InComingCall from '@/modules/conversation/calling-video/incomingCall';
import { getHistorySearchRequest, getSearchTrendingRequest } from '@/store/reducers/trackingSlice';

const MiddleHeader = dynamic(() => import('@/modules/header/middle')) as React.FC;

const Header: React.FC = () => {
	const dispatch = useAppDispatch();

	const router = useRouter();

	const tempElement: any = useRef(null);

	useIsomorphicLayoutEffect(() => {
		tempElement.current = global?.window?.document?.getElementById('temp');
	}, []);

	useEffect(() => {
		dispatch(
			getSearchTrendingRequest({
				pageIndex: 0,
				pageSize: 5,
			}),
		);
		dispatch(
			getHistorySearchRequest({
				pageIndex: 0,
				pageSize: 5,
			}),
		);
	}, [router]);

	const rightHeader = useMemo(() => {
		return <RightHeader />;
	}, []);

	return (
		<div className='pb-[55px]'>
			<header className={classNames(['fixed top-0 z-10 bg-[#F05A94] max-h-14 w-full py-[2px]'])}>
				<div className='container relative flex h-auto items-center gap-5'>
					<div className='col-span-2'>
						<Link href='/'>
							<div className='relative h-9 lg:h-10'>
								<div className='float-right h-10 w-[180px] cursor-pointer bg-[url("/static/svg/vuivui-logo-ef5191.svg")] bg-cover lg:h-10' />
							</div>
						</Link>
					</div>
					<MiddleHeader />
					{rightHeader}
				</div>
				<InComingCall />
			</header>
		</div>
	);
};

export default memo(Header);
