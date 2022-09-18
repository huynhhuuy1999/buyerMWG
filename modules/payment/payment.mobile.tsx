import { useSubscription } from '@apollo/react-hooks';
import { CART_ID } from 'constants/';
import { QUERY_ORDER_PAYMENT } from 'graphql/queries/cartPayment';
import { useAppDispatch, useAppSWR } from 'hooks';
import cookies from 'js-cookie';
import { OrderDetailsModel } from 'models';
import { OrderStatusMobile } from 'modules';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import { cartActions } from '@/store/reducers/cartSlice';

import { Drawer } from '../cart/components';
import { handleCancelOrder } from '../orders-customer/utils';

const PaymentMobile: React.FC = () => {
	const { query } = useRouter();
	const dispatch = useAppDispatch();
	const [isBlocking, setIsBlocking] = useState<boolean>(true);
	const {
		data: OrderResult,
		error: OrderError,
		mutate,
	} = useAppSWR<OrderDetailsModel>({
		method: 'GET',
		url: `/order/${query?.orderId ?? query?.orderPayment}`,
	});
	const paymentResponse = useSubscription(QUERY_ORDER_PAYMENT, {
		variables: {
			order_id: query?.orderId ?? query?.orderPayment,
		},
	});
	const paymentResponseArr = paymentResponse?.data?.orderpush_order_payment_result;

	const paymentStatus = paymentResponseArr?.[paymentResponseArr?.length - 1]?.payment_status;
	const newCartId = paymentResponseArr?.[paymentResponseArr?.length - 1]?.new_cart_id;

	const paymentType = paymentResponseArr?.[paymentResponseArr?.length - 1]?.payment_type;

	useEffect(() => {
		if (paymentStatus && newCartId && OrderResult?.orderId) {
			setIsBlocking(false);
			cookies.set(CART_ID, newCartId, {
				domain: process.env.NEXT_PUBLIC_ENDPOINT_NAME,
				sameSite: 'lax',
				expires: 31536000,
				httpOnly: false,
			});
			dispatch(cartActions.reset());
		}
	}, [OrderError, OrderResult?.orderId, newCartId, paymentStatus]);

	return (
		<>
			{isBlocking ? (
				<div className='h-[100vh] overflow-y-scroll'>
					<div className='flex h-full w-full items-center justify-center'>
						Xin vui lòng chờ trong giây lát ...
					</div>
				</div>
			) : (
				<Drawer
					isOpen={Boolean(paymentStatus)}
					direction='BOTTOM'
					height={'h-[100vh] hide-scrollbar overflow-auto'}
					setIsOpen={() => {}}
				>
					<div className='h-[100vh] overflow-y-scroll'>
						<OrderStatusMobile
							paymentStatus={paymentStatus}
							dataOrderDetail={OrderResult}
							paymentType={paymentType}
							onCancel={() =>
								handleCancelOrder(
									OrderResult?.orderId ?? '',
									OrderResult?.details?.[0]?.subOrderId ?? '',
									mutate,
								)
							}
						/>
					</div>
				</Drawer>
			)}
		</>
	);
};
export default PaymentMobile;
