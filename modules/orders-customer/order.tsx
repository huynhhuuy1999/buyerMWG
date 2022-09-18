import classNames from 'classnames';
import { EmptyProduct, Skeleton } from 'components';
import timeConfig from 'configs/timeConfig';
import { orderStatusType } from 'enums';
import isArray from 'lodash/isArray';
import { useRouter } from 'next/router';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { formatTime } from 'utils/convertTime';

import OrderListItem from './order-list';
import { ordersPageProps } from './types';

const LoadingSkeleton = () => {
	return (
		<div className='shadow-shadow-profileCard mb-4 rounded-6px bg-white p-6 last-of-type:mb-0'>
			<div className='border-b border-dashed border-[#D8D8D8] pb-4'>
				<Skeleton.Skeleton type='text' />
			</div>
			<div className='flex justify-between py-4'>
				<div className='flex pr-4'>
					<Skeleton.Skeleton
						cardType={Skeleton.CardType.square}
						type='card'
						width={110}
						height={110}
					/>
				</div>
				<div className='flex-auto'>
					<span className='text-14 leading-5 text-[#666666]'>
						<Skeleton.Skeleton type='comment' lines={1} />
					</span>
				</div>
			</div>
		</div>
	);
};

const OrderDesktop: React.FC<ordersPageProps> = ({
	dataOrderItems,
	onMutate,
	dataPaymentMethods,
	isFetchingTab,
	listCancelOrder,
	tabStatusActive,
}) => {
	const refTabId = useRef<any>(null);
	const [isLoadingTabFirst, setIsLoadingTabFirst] = useState<boolean>(false);
	const [isLoadingTab, setIsLoadingTab] = useState<boolean>(true);

	useEffect(() => {
		setIsLoadingTab(true);
		if (refTabId.current !== tabStatusActive?.key && !isLoadingTabFirst) {
			refTabId.current = tabStatusActive?.key;
			setTimeout(() => {
				setIsLoadingTabFirst(true);
				setIsLoadingTab(false);
			}, 200);
		} else {
			setIsLoadingTabFirst(true);
			setIsLoadingTab(false);
		}
	}, [tabStatusActive]);

	const router = useRouter();
	const routesTab = [
		{
			key: '0',
			prefix: dataOrderItems?.orderStatusCount?.pendingOrder,
			statusTab: 'Chờ xác nhận',
			url: '/ca-nhan/don-hang/cho-xac-nhan',
			isActive: tabStatusActive?.key === 1,
		},
		{
			key: '1',
			statusTab: 'Chờ lấy hàng',
			url: '/ca-nhan/don-hang/cho-lay-hang',
			prefix:
				dataOrderItems?.orderStatusCount?.completePickUp! +
				dataOrderItems?.orderStatusCount?.printedNote! +
				dataOrderItems?.orderStatusCount?.readyToDeliver! +
				dataOrderItems?.orderStatusCount?.waitingForTheGoodsOrder! +
				dataOrderItems?.orderStatusCount?.startPickingUpGoods!,
			isActive: tabStatusActive?.key === 2,
		},
		{
			key: '6',
			statusTab: 'Đang giao hàng',
			url: '/ca-nhan/don-hang/dang-giao-hang',
			prefix: dataOrderItems?.orderStatusCount?.deliveryOrder,
			isActive: tabStatusActive?.key === 3,
		},
		{
			key: '7',
			statusTab: 'Đã giao hàng',
			url: '/ca-nhan/don-hang/da-giao-hang',
			prefix:
				dataOrderItems?.orderStatusCount?.completeOrder! +
				dataOrderItems?.orderStatusCount?.completePickUp!,
			isActive: tabStatusActive?.key === 4,
		},
		{
			key: '999',
			statusTab: 'Đổi/Trả',
			url: '/ca-nhan/don-hang/doi-tra',
			prefix:
				(dataOrderItems?.orders ?? [])?.filter(
					(t) => t.details?.[0]?.status === orderStatusType.RETURN_EXCHANGE,
				).length ?? 0,
			isActive: tabStatusActive?.key === 5,
		},
		{
			key: '8',
			statusTab: 'Đã Hủy',
			url: '/ca-nhan/don-hang/huy',
			prefix: dataOrderItems?.orderStatusCount?.cancelOrder,
			isActive: tabStatusActive?.key === 6,
		},
	];

	const handleChangStatusTab = (url: string) => {
		router.push(url);
	};

	const memoOrders = useMemo(
		() =>
			dataOrderItems?.orders
				?.sort(
					(a, b) =>
						Number(formatTime(b?.createdAt, timeConfig?.timestamp)) -
						Number(formatTime(a?.createdAt, timeConfig?.timestamp)),
				)
				?.filter((ele) =>
					isArray(tabStatusActive?.OrderStatuses)
						? ele?.details?.some((ele) =>
								(tabStatusActive?.OrderStatuses as Array<number>)?.includes(ele?.status),
						  )
						: ele?.details?.find((ele) => ele.status === tabStatusActive?.OrderStatuses),
				),
		[dataOrderItems?.orders, tabStatusActive?.OrderStatuses],
	);

	return (
		<div className='col-span-3'>
			<div className=''>
				<ul className='mb-4 flex items-center justify-between rounded-t-6px bg-white pb-2 shadow-profileCard'>
					{routesTab.map((route, i: number) => (
						<div
							key={i}
							onClick={() => handleChangStatusTab(route.url)}
							onKeyPress={() => handleChangStatusTab(route.url)}
							tabIndex={0}
							role='button'
							className={classNames([
								'inline mx-4 pt-4 pb-3 text-sm group relative hover:text-F05A94 transition-all duration-150 cursor-pointer',
								route.isActive ? 'text-F05A94' : '',
							])}
						>
							{route?.statusTab} {route.prefix ? `(${route.prefix})` : ''}
							{route.isActive ? (
								<span className='absolute bottom-1 left-0 w-full border-b-[3px] border-F05A94 text-F05A94 '></span>
							) : (
								<span className='absolute bottom-1 left-0 w-full transition-all duration-150 group-hover:border-b-[3px] group-hover:border-F05A94 group-hover:text-F05A94'></span>
							)}
						</div>
					))}
				</ul>
			</div>
			<>
				{isLoadingTab ? (
					<LoadingSkeleton />
				) : (
					<>
						{(dataOrderItems?.orders ?? [])?.length > 0 ? (
							<OrderListItem
								orderItems={memoOrders}
								onMutate={onMutate}
								dataPaymentMethods={dataPaymentMethods}
								listCancelOrder={listCancelOrder}
								tabStatusActive={tabStatusActive}
							/>
						) : (
							<EmptyProduct
								title='Bạn không có hóa đơn nào cả, mua sắm ngay nhé !'
								height={'!h-full'}
							/>
						)}
					</>
				)}
			</>
		</div>
	);
};

export default React.memo(OrderDesktop);
