import { useSubscription } from '@apollo/react-hooks';
import { PAYMENT_STATUS } from 'enums';
import { QUERY_ORDER_INFO, QUERY_ORDER_PAYMENT } from 'graphql/queries/cartPayment';
import { useAppSWR } from 'hooks';
import { OrderModel } from 'models';
import { useRouter } from 'next/router';
import { useState } from 'react';

export const usePayment = (orderId?: string) => {
	const router = useRouter();

	const [isShowBlock, setIsShowBlock] = useState<{ isActive: boolean; paramsPayment: any }>({
		isActive: false,
		paramsPayment: [],
	});

	const orderIdThisOrder =
		isShowBlock?.paramsPayment?.[0]?.orderId ??
		router?.query?.orderPayment ??
		router?.query?.orderId ??
		orderId;

	const orderPushResponse = useSubscription(QUERY_ORDER_INFO, {
		variables: {
			order_id: orderIdThisOrder,
		},
	});

	const orderPushResponseArr = orderPushResponse?.data?.orderpush_order_result;

	const newCartIdForCOD = orderPushResponseArr?.[orderPushResponseArr?.length - 1]?.new_cart_id;

	const orderStatus = orderPushResponseArr?.[orderPushResponseArr?.length - 1]?.status;

	const paymentResponse = useSubscription(QUERY_ORDER_PAYMENT, {
		variables: {
			order_id:
				orderStatus === PAYMENT_STATUS.SUCCESS &&
				orderPushResponseArr?.[orderPushResponseArr?.length - 1]?.order_id,
		},
	});

	const paymentResponseArr = paymentResponse?.data?.orderpush_order_payment_result;

	const paymentStatus = paymentResponseArr?.[paymentResponseArr?.length - 1]?.payment_status;

	const paymentStatusMess = paymentResponseArr?.[paymentResponseArr?.length - 1]?.exception_message;

	const newCartId = paymentResponseArr?.[paymentResponseArr?.length - 1]?.new_cart_id;

	const {
		data: orderResult,
		mutate,
		isValidating,
	} = useAppSWR<OrderModel['orders'][0]>(
		(newCartIdForCOD && orderIdThisOrder) || (newCartId && orderIdThisOrder)
			? {
					method: 'GET',
					url: `/order/${orderIdThisOrder}`,
			  }
			: null,
	);

	return {
		setIsShowBlock,
		isShowBlock,
		orderResult,
		paymentStatus,
		orderIdThisOrder,
		paymentStatusMess,
		isValidating,
		newCartIdForCOD,
		onMutate: mutate,
		newCartIdPaymentOnline: newCartId,
	};
};
