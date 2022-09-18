import { useAppDispatch } from 'hooks';
import { CartModel, PaymentMethod } from 'models';
import React, { useState } from 'react';
import { setPaymentMethodHelpers } from 'utils/setPaymentMethodHelpers';

import { cartActions } from '@/store/reducers/cartSlice';

import { ChoosePayment } from '../components';

interface CartPayments {
	paymentMethod?: PaymentMethod[] | null;
	dataCart?: CartModel | null;
	onMutable?: any;
}

const CartPayment: React.FC<CartPayments> = ({ paymentMethod, dataCart, onMutable }) => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const dispatch = useAppDispatch();
	return (
		<div className='mb-6 space-y-[10px]'>
			<h3 className='mt-6 mb-[10px] font-sfpro_bold text-16 font-semibold leading-6'>
				Chọn hình thức thanh toán
			</h3>
			<ChoosePayment
				showTooltip={false}
				disabled={
					dataCart?.cartPayment &&
					paymentMethod?.find((t: any) => t?.maxAmount <= dataCart?.cartPayment?.paymentTotal)?.id
				}
				loading={isLoading}
				defaultValue={
					Number(dataCart?.cartPayment?.paymentType) > 0
						? dataCart?.cartPayment?.paymentType
						: paymentMethod?.find((k) => k.payDefault)?.id
				}
				onClick={(typePaymentMethod, onFailed) => {
					typePaymentMethod &&
						dataCart?.cartPayment?.paymentType !== typePaymentMethod &&
						setPaymentMethodHelpers(
							dataCart?.cartId ?? '',
							{ paymentType: typePaymentMethod },
							(loading) => {
								setIsLoading(loading);
								dispatch(cartActions.isLoading(loading));
							},
							onMutable,
							() =>
								onFailed?.(
									Number(dataCart?.cartPayment?.paymentType) > 0
										? dataCart?.cartPayment?.paymentType
										: paymentMethod?.find((k) => k.payDefault)?.id,
								),
						);
				}}
			/>
		</div>
	);
};

export default React.memo(CartPayment);
