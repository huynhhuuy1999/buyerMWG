import { yupResolver } from '@hookform/resolvers/yup';
import { Notification } from 'components';
import { PAYMENT_STATUS } from 'enums';
import { useAppDispatch, useAppSWR } from 'hooks';
import { ICartPageProps, PaymentMethod } from 'models';
import router from 'next/router';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { createRetryPayment } from 'services';
import * as yup from 'yup';

import getErrorMessageInstance from '@/utils/getErrorMessageInstance';

interface PaymentRetryProps {
	paymentType?: number;
	paymentMethods?: PaymentMethod[] | null;
}

interface BlockingStateProps {
	isActive: boolean;
	paramsPayment: any;
}

interface UseRetryPaymentProps {
	paymentStatus: PAYMENT_STATUS;
	setBlocking: React.Dispatch<React.SetStateAction<BlockingStateProps>>;
	blockingState: BlockingStateProps;
	newCartId: string;
}

export const useRetryPayment = ({
	paymentStatus,
	setBlocking,
	blockingState,
	newCartId,
}: UseRetryPaymentProps) => {
	const [counter, setCounter] = useState(60);
	const [isShowPopupPayment, setIsShowPopupPayment] = useState<boolean>(false);
	const dispatch = useAppDispatch();
	const { data: paymentMethod } = useAppSWR<ICartPageProps['paymentMethod']>(
		{
			url: '/payment/method',
			method: 'GET',
		},
		{ isPaused: () => Boolean(paymentStatus === PAYMENT_STATUS.SUCCESS) },
	);

	useEffect(() => {
		paymentStatus === PAYMENT_STATUS.FAILURE &&
			methods.reset({
				paymentMethods: paymentMethod,
				paymentType: paymentMethod?.find((k) => blockingState.paramsPayment?.[0]?.id === k.id)?.id,
			});
	}, [paymentStatus]);

	const methods = useForm<PaymentRetryProps>({
		mode: 'onChange',
		resolver: yupResolver(
			yup.object().shape({
				paymentType: yup
					.number()
					.required('Vui lòng chọn hình thức thanh toán')
					.default(paymentMethod?.find((k) => blockingState.paramsPayment?.[0]?.id === k.id)?.id),
			}),
		),
	});

	//get value init
	useEffect(() => {
		(async () => {
			if (paymentStatus === PAYMENT_STATUS.FAILURE) {
				const arrayObjects: any[] = [];

				for (const [propertyKey, propertyValue] of Object.entries(router.query)) {
					if (!Number.isNaN(Number(propertyKey))) {
						continue;
					}
					arrayObjects.push({ value: propertyValue, keyName: propertyKey });
				}

				const checkTypePaymentMethod = [
					{
						regex: ['partnerCode', 'orderType', 'resultCode'],
						namePayment: 'MoMo',
						orderId: router.query?.orderPayment,
						id: 2,
						orderStatus: router.query?.resultCode,
						amount: router.query?.amount,
					},
					{
						regex: ['vpc_TxnResponseCode', 'vpc_Command', 'vpc_MerchTxnRef'],
						namePayment: 'Thẻ Ngân Hàng',
						id: 1,
						orderId: router.query?.orderPayment,
						orderStatus: router.query?.vpc_TxnResponseCode,
						amount: router.query?.vpc_Amount,
					},
					{
						regex: ['error_code', 'pg_order_reference', 'pg_merchant_id'],
						namePayment: 'MBPay',
						id: 7,
						orderId: router.query?.orderPayment,
						orderStatus: router.query?.error_code,
						amount: router.query?.pg_amount,
					},
					{
						regex: ['status', 'pmcid', 'checksum'],
						namePayment: 'ZaloPay',
						id: 4,
						orderId: router.query?.orderPayment,
						orderStatus: router.query?.status,
						amount: router.query?.amount,
					},
				];

				const targetTypePayment = Object.values(checkTypePaymentMethod).filter((e) =>
					Object.values(arrayObjects).some((t) => e.regex.includes(t.keyName)),
				);

				return setBlocking((prev) => ({
					...prev,
					isActive: true,
					paramsPayment: targetTypePayment,
				}));
			}
		})();
	}, [paymentStatus]);

	//countDown
	useEffect(() => {
		let timer = setInterval(() => {
			!isShowPopupPayment &&
				setCounter((counter) => {
					const updatedCounter = counter - 1;
					if (updatedCounter === 0) {
						clearInterval(timer);
					}
					return updatedCounter;
				});
		}, 1000);
		return () => clearInterval(timer);
	}, [isShowPopupPayment]);

	//timeout
	useEffect(() => {
		(async () => {
			if (counter === 0) {
				Notification.Loading.custom();
				try {
					await createRetryPayment({
						orderId: blockingState.paramsPayment?.[0]?.orderId,
						paymentType: Number(6),
						appLink: '',
						urlCallBack: `${process.env.NEXT_PUBLIC_DOMAIN_URL}/payment`,
					});
					Notification.Loading.remove(300);
					setIsShowPopupPayment(true);
				} catch (error) {
					getErrorMessageInstance(error);
				}
			}
		})();
	}, [counter, dispatch]);

	useEffect(() => {
		if (paymentStatus === PAYMENT_STATUS.SUCCESS && newCartId) {
			setIsShowPopupPayment(true);
		}
	}, [newCartId, paymentStatus]);

	const onSubmit = async (data: PaymentRetryProps) => {
		Notification.Loading.custom();
		try {
			const { data: OrderResult } = await createRetryPayment({
				orderId: blockingState.paramsPayment?.[0]?.orderId,
				paymentType: data?.paymentType,
				appLink: '',
				urlCallBack: `${process.env.NEXT_PUBLIC_DOMAIN_URL}/payment`,
			});
			if (OrderResult.orderId && !OrderResult.payUrl) {
				Notification.Loading.remove(300);
				data?.paymentType === 6 && setIsShowPopupPayment(true);
			}

			if (OrderResult.payUrl) {
				Notification.Loading.remove(300);
				router.push(OrderResult.payUrl);
			}
		} catch (error) {
			getErrorMessageInstance(error);
		}
	};
	return { onSubmit, methods, paymentMethod, counter, isShowPopupPayment };
};
