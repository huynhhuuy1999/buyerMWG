import { HeaderCustomer } from 'components';
import { TITLE } from 'constants/';
import { DeviceType, orderStatusType } from 'enums';
import { useAppSelector, useAppSWR } from 'hooks';
import { WithAuthLayout } from 'layouts';
import {
	ArrRoutesProps,
	OrderDetailsModel,
	OrderModel,
	PaymentMethod,
	Product,
	TimelineOrderDetail,
} from 'models';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import { deviceTypeSelector } from '@/store/reducers/appSlice';
import {
	listCancelOrderSelector,
	retryPaymentCustomerSelector,
} from '@/store/reducers/customerSlice';

const WrapperDeviceOrder = ({
	children,
	deviceType,
	title,
}: {
	children: React.ReactNode;
	deviceType: DeviceType;
	title: string;
}) => {
	return deviceType === DeviceType.MOBILE ? (
		<>{children}</>
	) : (
		<WithAuthLayout title={title}>{children}</WithAuthLayout>
	);
};

interface OrderDetailProps {
	detail?: OrderDetailsModel;
	loading?: boolean;
}

const DynamicOrderDesktop = dynamic(() => import('@/modules/orders-customer/order'), {
	ssr: false,
});

const DynamicOrderMobile = dynamic(() => import('@/modules/orders-customer/order.mobile'), {
	ssr: false,
});

const DynamicOrderDetail = dynamic(() => import('@/modules/orders-customer/order-detail'), {
	ssr: false,
});

const DynamicOrderDetailMobile = dynamic(
	() => import('@/modules/orders-customer/order-detail.mobile'),
	{
		ssr: false,
	},
) as React.FC<OrderDetailProps>;

const OrdersCustomerPage = () => {
	const deviceType: DeviceType = useAppSelector(deviceTypeSelector);

	const stateRetryPayment = useAppSelector(retryPaymentCustomerSelector);
	const listCancelOrder = useAppSelector(listCancelOrderSelector);

	const router = useRouter();
	const [isRouteOrderDetail, setIsRouteOrderDetail] = useState<boolean>(false);

	const isRouteCurrent = router?.query?.status_orders as string;

	const arrRoutes: ArrRoutesProps[] = [
		{
			key: 1,
			route: 'cho-xac-nhan',
			OrderStatuses: orderStatusType.PENDING,
		},
		{
			key: 2,
			route: 'cho-lay-hang',
			OrderStatuses: [
				orderStatusType.WAITING_FOR_THE_GOODS,
				orderStatusType.START_PICKING_UP_GOODS,
				orderStatusType.COMPLETE_PICK_UP,
				orderStatusType.PRINTED_NOTE,
				orderStatusType.READY_TO_DELIVER,
			],
		},
		{
			key: 3,
			route: 'dang-giao-hang',
			OrderStatuses: orderStatusType.DELIVERY,
		},
		{
			key: 4,
			route: 'da-giao-hang',
			OrderStatuses: [orderStatusType.DELIVERED, orderStatusType.COMPLETE_PICK_UP],
		},
		{
			key: 5,
			route: 'doi-tra',
			OrderStatuses: orderStatusType.RETURN_EXCHANGE,
		},
		{
			key: 6,
			route: 'huy',
			OrderStatuses: orderStatusType.CANCEL,
		},
	];
	const checkRouteHasBeenActive = isRouteCurrent
		? arrRoutes?.find((t) => t.route?.includes(isRouteCurrent))
		: null;

	useEffect(() => {
		setIsRouteOrderDetail(!Boolean(checkRouteHasBeenActive));
	}, [checkRouteHasBeenActive]);

	const {
		data: OrderItems,
		mutate,
		isValidating: isLoadingOrders,
	} = useAppSWR<OrderModel>(
		{
			url: `/order/filter`,
			method: 'POST',
		},
		{ isPaused: () => !isRouteCurrent || isRouteOrderDetail },
		null,
		{ orderStatuses: [0, 1, 2, 3, 4, 5, 6, 7, 8] },
	);

	const { data: productViewed } = useAppSWR<Product[]>(
		{ url: '/product/viewed', method: 'GET' },
		{ isPaused: () => !isRouteCurrent || isRouteOrderDetail },
	);
	const { data: dataPaymentMethods } = useAppSWR<PaymentMethod[]>(
		stateRetryPayment
			? {
					url: `/payment/method`,
					method: 'GET',
			  }
			: null,
	);
	const { data: productLiked } = useAppSWR<Product[]>(
		{ url: '/product/liked', method: 'GET' },
		{ isPaused: () => !isRouteCurrent || isRouteOrderDetail },
	);
	const { data: BrandFavorite, isValidating } = useAppSWR<Product[]>(
		{
			url: '/product/likedmerchants?pageIndex=0&pageSize=10',
			method: 'GET',
		},
		{ isPaused: () => !isRouteCurrent || isRouteOrderDetail },
	);

	//detail order
	const { data: orderDetail } = useAppSWR<OrderDetailsModel>(
		isRouteOrderDetail && !checkRouteHasBeenActive
			? {
					url: `/order/${isRouteOrderDetail && isRouteCurrent?.split('-')[0]}`,
					method: 'GET',
			  }
			: null,
		{ isPaused: () => !isRouteOrderDetail },
	);
	//timeline order detail
	const { data: timelineOrderDetail } = useAppSWR<TimelineOrderDetail[]>(
		orderDetail?.orderId
			? {
					url: `/order/customer/timeline?subOrderId=${
						orderDetail?.details?.find((e) => e.subOrderId === isRouteCurrent)?.subOrderId
					}`,
					method: 'GET',
			  }
			: null,
		{ isPaused: () => !orderDetail },
	);

	const title = `${TITLE.HISTORY} | ${process.env.NEXT_PUBLIC_DOMAIN_TITLE}`;

	return (
		<WrapperDeviceOrder deviceType={deviceType} title={title}>
			{deviceType === DeviceType.MOBILE ? (
				<>
					{isRouteOrderDetail ? (
						<>
							<HeaderCustomer />
							<DynamicOrderDetailMobile detail={orderDetail} />
						</>
					) : (
						// <DynamicOrderDetail />
						<>
							<HeaderCustomer />
							<DynamicOrderMobile
								dataOrderItems={OrderItems}
								dataProductViewed={productViewed}
								dataLiked={productLiked}
								dataBrandFavorite={{ data: BrandFavorite, isValid: isValidating }}
								onMutate={mutate}
							/>
						</>
					)}
				</>
			) : (
				<>
					{isRouteOrderDetail ? (
						<DynamicOrderDetail detail={orderDetail} timeline={timelineOrderDetail} />
					) : (
						<DynamicOrderDesktop
							dataOrderItems={OrderItems}
							onMutate={mutate}
							dataPaymentMethods={dataPaymentMethods}
							tabStatusActive={checkRouteHasBeenActive}
							isFetchingTab={isLoadingOrders}
							listCancelOrder={listCancelOrder}
						/>
					)}
				</>
			)}
		</WrapperDeviceOrder>
	);
};

export default OrdersCustomerPage;
